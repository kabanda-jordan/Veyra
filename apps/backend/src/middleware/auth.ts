import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isAdmin: boolean;
    isMerchant: boolean;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "veyra-dev-secret-change-in-production";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      isAdmin: boolean;
      isMerchant: boolean;
    };

    req.user = {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
      isMerchant: payload.isMerchant,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export function requireMerchant(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user?.isMerchant && !req.user?.isAdmin) {
    res.status(403).json({ error: "Merchant access required" });
    return;
  }
  next();
}

export function generateTokens(user: {
  id: string;
  email: string;
  isAdmin: boolean;
  isMerchant: boolean;
}) {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, type: "refresh" },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
}
