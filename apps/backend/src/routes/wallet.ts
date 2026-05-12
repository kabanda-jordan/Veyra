import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

const router = Router();
router.use(authenticate);

// GET /wallet — list all wallets
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.user!.id, isActive: true },
      orderBy: [{ isDefault: "desc" }, { currency: "asc" }],
    });
    res.json({ wallets });
  } catch (err) {
    next(err);
  }
});

// POST /wallet — create a new currency wallet
router.post("/", async (req: AuthRequest, res, next) => {
  try {
    const { currency } = z.object({ currency: z.string().length(3) }).parse(req.body);

    const existing = await prisma.wallet.findFirst({
      where: { userId: req.user!.id, currency: currency.toUpperCase() },
    });

    if (existing) throw new AppError(409, `${currency} wallet already exists`);

    const wallet = await prisma.wallet.create({
      data: {
        userId: req.user!.id,
        currency: currency.toUpperCase(),
      },
    });

    res.status(201).json({ wallet });
  } catch (err) {
    next(err);
  }
});

// POST /wallet/:id/freeze — freeze a wallet
router.post("/:id/freeze", async (req: AuthRequest, res, next) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!wallet) throw new AppError(404, "Wallet not found");

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { isFrozen: true },
    });

    res.json({ message: "Wallet frozen" });
  } catch (err) {
    next(err);
  }
});

// POST /wallet/:id/unfreeze — unfreeze a wallet
router.post("/:id/unfreeze", async (req: AuthRequest, res, next) => {
  try {
    const wallet = await prisma.wallet.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!wallet) throw new AppError(404, "Wallet not found");

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { isFrozen: false },
    });

    res.json({ message: "Wallet unfrozen" });
  } catch (err) {
    next(err);
  }
});

export { router as walletRouter };
