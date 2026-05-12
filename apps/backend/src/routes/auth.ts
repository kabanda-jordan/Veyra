import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateTokens, authenticate, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  country: z.string().optional(),
});

// ============================================================
// POST /auth/register
// Create a new user account
// ============================================================
router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, "Email already registered");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          country: data.country,
        },
      });

      // Create default USD wallet
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          currency: "USD",
          isDefault: true,
        },
      });

      // Create KYC record
      await tx.kycRecord.create({
        data: { userId: newUser.id },
      });

      return newUser;
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      ...tokens,
      message: "Account created. Please register a passkey to enable biometric payments.",
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /auth/refresh
// Refresh access token
// ============================================================
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);

    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    const tokens = generateTokens({
      id: session.user.id,
      email: session.user.email,
      isAdmin: session.user.isAdmin,
      isMerchant: session.user.isMerchant,
    });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        lastActiveAt: new Date(),
      },
    });

    res.json(tokens);
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /auth/logout
// Invalidate session
// ============================================================
router.post("/logout", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const authHeader = req.headers.authorization!;
    const token = authHeader.substring(7);

    await prisma.session.deleteMany({
      where: { token, userId: req.user!.id },
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /auth/me
// Get current user profile
// ============================================================
router.get("/me", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        country: true,
        isVerified: true,
        isMerchant: true,
        createdAt: true,
        wallets: {
          select: {
            id: true,
            currency: true,
            balance: true,
            isDefault: true,
            isFrozen: true,
          },
        },
        kycRecord: {
          select: { status: true, level: true },
        },
        _count: {
          select: {
            webauthnCredentials: { where: { isActive: true } },
            devices: { where: { isTrusted: true } },
          },
        },
      },
    });

    if (!user) throw new AppError(404, "User not found");

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
