import { Router } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
import { authenticate, requireMerchant, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

const router = Router();
router.use(authenticate);

// GET /merchant/profile
router.get("/profile", requireMerchant, async (req: AuthRequest, res, next) => {
  try {
    const merchant = await prisma.merchantAccount.findUnique({
      where: { userId: req.user!.id },
      include: {
        teamMembers: true,
        _count: { select: { transactions: true, qrCodes: true } },
      },
    });

    if (!merchant) throw new AppError(404, "Merchant account not found");

    res.json({ merchant });
  } catch (err) {
    next(err);
  }
});

// POST /merchant/register
router.post("/register", async (req: AuthRequest, res, next) => {
  try {
    const data = z.object({
      businessName: z.string().min(2).max(100),
      businessType: z.string().optional(),
      website: z.string().url().optional(),
      country: z.string().length(2),
      currency: z.string().length(3).default("USD"),
    }).parse(req.body);

    const existing = await prisma.merchantAccount.findUnique({
      where: { userId: req.user!.id },
    });

    if (existing) throw new AppError(409, "Merchant account already exists");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merchant = await prisma.$transaction(async (tx: any) => {
      const m = await tx.merchantAccount.create({
        data: {
          userId: req.user!.id,
          ...data,
          apiKey: uuidv4(),
          webhookSecret: uuidv4(),
        },
      });

      await tx.user.update({
        where: { id: req.user!.id },
        data: { isMerchant: true },
      });

      return m;
    });

    res.status(201).json({ merchant });
  } catch (err) {
    next(err);
  }
});

// POST /merchant/qr — generate QR code
router.post("/qr", requireMerchant, async (req: AuthRequest, res, next) => {
  try {
    const data = z.object({
      amount: z.number().positive().optional(),
      currency: z.string().length(3).default("USD"),
      description: z.string().max(200).optional(),
      isOneTime: z.boolean().default(true),
      expiresInMinutes: z.number().min(1).max(1440).default(30),
    }).parse(req.body);

    const merchant = await prisma.merchantAccount.findUnique({
      where: { userId: req.user!.id },
    });

    if (!merchant) throw new AppError(404, "Merchant account not found");

    const qrCode = await prisma.qRCode.create({
      data: {
        merchantId: merchant.id,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        isOneTime: data.isOneTime,
        expiresAt: new Date(Date.now() + data.expiresInMinutes * 60 * 1000),
      },
    });

    const qrData = {
      type: "veyra_payment",
      merchantId: merchant.id,
      businessName: merchant.businessName,
      reference: qrCode.reference,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
    };

    res.status(201).json({
      qrCode: {
        id: qrCode.id,
        reference: qrCode.reference,
        data: JSON.stringify(qrData),
        expiresAt: qrCode.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /merchant/analytics
router.get("/analytics", requireMerchant, async (req: AuthRequest, res, next) => {
  try {
    const merchant = await prisma.merchantAccount.findUnique({
      where: { userId: req.user!.id },
    });

    if (!merchant) throw new AppError(404, "Merchant account not found");

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalVolume, transactionCount, recentTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          merchantId: merchant.id,
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
        _avg: { amount: true },
      }),
      prisma.transaction.count({
        where: { merchantId: merchant.id, createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.transaction.findMany({
        where: { merchantId: merchant.id },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    res.json({
      analytics: {
        totalVolume: totalVolume._sum.amount || 0,
        avgTransaction: totalVolume._avg.amount || 0,
        transactionCount,
        recentTransactions,
      },
    });
  } catch (err) {
    next(err);
  }
});

export { router as merchantRouter };
