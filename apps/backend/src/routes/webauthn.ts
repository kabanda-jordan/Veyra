import { Router } from "express";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/types";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { storeChallenge, getChallenge, deleteChallenge } from "../lib/redis";
import { authenticate, AuthRequest, generateTokens } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

const router = Router();

const RP_NAME = "Veyra";
const RP_ID = process.env.RP_ID || "localhost";
const ORIGIN = process.env.FRONTEND_URL || "http://localhost:3000";

// ============================================================
// POST /webauthn/register/options
// Generate registration options for a new passkey
// ============================================================
router.post("/register/options", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { webauthnCredentials: true },
    });

    if (!user) throw new AppError(404, "User not found");

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userName: user.email,
      userDisplayName: `${user.firstName} ${user.lastName}`,
      attestationType: "none",
      excludeCredentials: user.webauthnCredentials.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cred: any) => ({
          id: cred.credentialId,
          transports: cred.transports,
        })
      ),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
    });

    // Store challenge in Redis (5 min TTL)
    await storeChallenge(`reg:${userId}`, options.challenge, 300);

    res.json(options);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /webauthn/register/verify
// Verify and save the new credential
// ============================================================
router.post("/register/verify", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { response, name } = req.body as {
      response: RegistrationResponseJSON;
      name?: string;
    };

    const expectedChallenge = await getChallenge(`reg:${userId}`);
    if (!expectedChallenge) {
      throw new AppError(400, "Registration challenge expired or not found");
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new AppError(400, "Registration verification failed");
    }

    // @simplewebauthn/server v10 registrationInfo shape
    const info = verification.registrationInfo;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const regInfo = info as any;

    const credentialId: string = regInfo.credential?.id ?? regInfo.credentialID ?? "";
    const publicKey: Uint8Array =
      regInfo.credential?.publicKey ?? regInfo.credentialPublicKey ?? new Uint8Array();
    const counter: number =
      regInfo.credential?.counter ?? regInfo.counter ?? 0;
    const deviceType: string =
      regInfo.credentialDeviceType ?? regInfo.credential?.deviceType ?? "platform";
    const backedUp: boolean =
      regInfo.credentialBackedUp ?? regInfo.credential?.backedUp ?? false;

    // Save credential to database
    await prisma.webAuthnCredential.create({
      data: {
        userId,
        credentialId,
        publicKey: Buffer.from(publicKey),
        counter: BigInt(counter),
        deviceType,
        backedUp,
        transports: response.response.transports || [],
        name: name || `Passkey ${new Date().toLocaleDateString()}`,
      },
    });

    await deleteChallenge(`reg:${userId}`);

    res.json({ verified: true, message: "Passkey registered successfully" });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /webauthn/authenticate/options
// Generate authentication options
// ============================================================
router.post("/authenticate/options", async (req, res, next) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { webauthnCredentials: { where: { isActive: true } } },
    });

    if (!user) {
      // Return generic options to prevent user enumeration
      const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        userVerification: "required",
      });
      res.json(options);
      return;
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allowCredentials: user.webauthnCredentials.map((cred: any) => ({
        id: cred.credentialId,
        transports: cred.transports,
      })),
      userVerification: "required",
    });

    await storeChallenge(`auth:${user.id}`, options.challenge, 300);

    res.json({ ...options, userId: user.id });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /webauthn/authenticate/verify
// Verify authentication and issue JWT
// ============================================================
router.post("/authenticate/verify", async (req, res, next) => {
  try {
    const { userId, response } = req.body as {
      userId: string;
      response: AuthenticationResponseJSON;
    };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { webauthnCredentials: { where: { isActive: true } } },
    });

    if (!user) throw new AppError(404, "User not found");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const credential = user.webauthnCredentials.find((c: any) => c.credentialId === response.id);

    if (!credential) throw new AppError(400, "Credential not found");

    const expectedChallenge = await getChallenge(`auth:${userId}`);
    if (!expectedChallenge) {
      throw new AppError(400, "Authentication challenge expired");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cred = credential as any;

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      // AuthenticatorDevice shape from @simplewebauthn/types
      authenticator: {
        credentialID: cred.credentialId,
        credentialPublicKey: new Uint8Array(cred.publicKey),
        counter: Number(cred.counter),
        transports: cred.transports,
      },
      requireUserVerification: true,
    });

    if (!verification.verified) {
      throw new AppError(401, "Authentication verification failed");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authInfo = verification.authenticationInfo as any;
    const newCounter: number = authInfo.newCounter ?? authInfo.counter ?? 0;

    // Update counter
    await prisma.webAuthnCredential.update({
      where: { id: cred.id },
      data: {
        counter: BigInt(newCounter),
        lastUsedAt: new Date(),
      },
    });

    await deleteChallenge(`auth:${userId}`);

    // Generate JWT tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
    });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({
      verified: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /webauthn/credentials
// List user's credentials
// ============================================================
router.get("/credentials", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const credentials = await prisma.webAuthnCredential.findMany({
      where: { userId: req.user!.id, isActive: true },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        transports: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ credentials });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE /webauthn/credentials/:id
// Remove a credential
// ============================================================
router.delete("/credentials/:id", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const credential = await prisma.webAuthnCredential.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!credential) throw new AppError(404, "Credential not found");

    // Check at least one credential remains
    const count = await prisma.webAuthnCredential.count({
      where: { userId: req.user!.id, isActive: true },
    });

    if (count <= 1) {
      throw new AppError(400, "Cannot remove your last passkey");
    }

    await prisma.webAuthnCredential.update({
      where: { id: credential.id },
      data: { isActive: false },
    });

    res.json({ message: "Credential removed" });
  } catch (err) {
    next(err);
  }
});

export { router as webauthnRouter };
