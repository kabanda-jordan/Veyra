import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate, requireAdmin);

// GET /admin/users
router.get("/users", async (req: AuthRequest, res, next) => {
  try {
    const { page = "1", limit = "50", search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: "insensitive" } },
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isVerified: true,
          isActive: true,
          isMerchant: true,
          createdAt: true,
          kycRecord: { select: { status: true } },
          _count: { select: { wallets: true, webauthnCredentials: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: pageNum, limit: limitNum });
  } catch (err) {
    next(err);
  }
});

// GET /admin/stats
router.get("/stats", async (req: AuthRequest, res, next) => {
  try {
    const [userCount, txCount, txVolume, fraudCount, kycPending] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.transaction.count({ where: { status: "COMPLETED" } }),
      prisma.transaction.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.fraudEvent.count({ where: { isResolved: false } }),
      prisma.kycRecord.count({ where: { status: "UNDER_REVIEW" } }),
    ]);

    res.json({
      stats: {
        totalUsers: userCount,
        totalTransactions: txCount,
        totalVolume: txVolume._sum.amount || 0,
        openFraudAlerts: fraudCount,
        pendingKyc: kycPending,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /admin/fraud-events
router.get("/fraud-events", async (req: AuthRequest, res, next) => {
  try {
    const events = await prisma.fraudEvent.findMany({
      where: { isResolved: false },
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// PATCH /admin/users/:id/suspend
router.patch("/users/:id/suspend", async (req: AuthRequest, res, next) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    res.json({ message: "User suspended" });
  } catch (err) {
    next(err);
  }
});

export { router as adminRouter };
