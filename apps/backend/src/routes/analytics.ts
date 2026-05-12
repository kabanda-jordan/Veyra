import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

// GET /analytics/overview
router.get("/overview", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [sent, received, wallets, rewardTotal] = await Promise.all([
      prisma.transaction.aggregate({
        where: { senderId: userId, status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: { receiverId: userId, status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.wallet.findMany({
        where: { userId, isActive: true },
        select: { currency: true, balance: true },
      }),
      prisma.reward.aggregate({
        where: { userId, redeemedAt: null },
        _sum: { amount: true },
      }),
    ]);

    res.json({
      overview: {
        totalSent: sent._sum.amount || 0,
        totalReceived: received._sum.amount || 0,
        sentCount: sent._count,
        receivedCount: received._count,
        wallets,
        pendingRewards: rewardTotal._sum.amount || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /analytics/spending-by-category
router.get("/spending-by-category", async (req: AuthRequest, res, next) => {
  try {
    // In production, transactions would have category tags
    // This returns a mock breakdown for now
    res.json({
      categories: [
        { name: "Food & Drink", amount: 680, percentage: 25 },
        { name: "Shopping", amount: 890, percentage: 33 },
        { name: "Transport", amount: 320, percentage: 12 },
        { name: "Bills", amount: 450, percentage: 17 },
        { name: "Health", amount: 210, percentage: 8 },
        { name: "Other", amount: 150, percentage: 5 },
      ],
    });
  } catch (err) {
    next(err);
  }
});

export { router as analyticsRouter };
