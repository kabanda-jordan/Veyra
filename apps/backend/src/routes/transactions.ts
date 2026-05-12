import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";
import { FraudDetectionService } from "../services/fraud-detection";

const router = Router();
router.use(authenticate);

const sendSchema = z.object({
  recipientEmail: z.string().email().optional(),
  recipientWalletAddress: z.string().optional(),
  amount: z.number().positive().max(50000),
  currency: z.string().length(3).default("USD"),
  description: z.string().max(200).optional(),
  authMethod: z.enum(["webauthn", "passkey"]).default("webauthn"),
  deviceId: z.string().optional(),
});

// ============================================================
// GET /transactions
// List user transactions with pagination
// ============================================================
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const { page = "1", limit = "20", type, status, startDate, endDate } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      OR: [
        { senderId: req.user!.id },
        { receiverId: req.user!.id },
      ],
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, email: true } },
          receiver: { select: { id: true, firstName: true, lastName: true, email: true } },
          merchant: { select: { id: true, businessName: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /transactions/:id
// Get single transaction
// ============================================================
router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { senderId: req.user!.id },
          { receiverId: req.user!.id },
        ],
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, email: true } },
        merchant: { select: { id: true, businessName: true } },
        refund: true,
      },
    });

    if (!transaction) throw new AppError(404, "Transaction not found");

    res.json({ transaction });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /transactions/send
// Send money to another user
// ============================================================
router.post("/send", async (req: AuthRequest, res, next) => {
  try {
    const data = sendSchema.parse(req.body);
    const senderId = req.user!.id;

    if (!data.recipientEmail && !data.recipientWalletAddress) {
      throw new AppError(400, "Recipient email or wallet address required");
    }

    // Find sender wallet
    const senderWallet = await prisma.wallet.findFirst({
      where: { userId: senderId, currency: data.currency, isActive: true },
    });

    if (!senderWallet) throw new AppError(404, "Sender wallet not found");
    if (senderWallet.isFrozen) throw new AppError(403, "Wallet is frozen");
    if (Number(senderWallet.balance) < data.amount) {
      throw new AppError(400, "Insufficient balance");
    }

    // Find recipient
    let recipient;
    if (data.recipientEmail) {
      recipient = await prisma.user.findUnique({ where: { email: data.recipientEmail } });
    } else {
      const wallet = await prisma.wallet.findUnique({
        where: { walletAddress: data.recipientWalletAddress },
        include: { user: true },
      });
      recipient = wallet?.user;
    }

    if (!recipient) throw new AppError(404, "Recipient not found");
    if (recipient.id === senderId) throw new AppError(400, "Cannot send to yourself");

    // Fraud check
    const fraudService = new FraudDetectionService();
    const riskScore = await fraudService.assessTransaction({
      userId: senderId,
      amount: data.amount,
      currency: data.currency,
      recipientId: recipient.id,
      ipAddress: req.ip || "",
      deviceId: data.deviceId,
    });

    if (riskScore > 0.9) {
      throw new AppError(403, "Transaction blocked due to high fraud risk");
    }

    // Find or create recipient wallet
    let recipientWallet = await prisma.wallet.findFirst({
      where: { userId: recipient.id, currency: data.currency },
    });

    if (!recipientWallet) {
      recipientWallet = await prisma.wallet.create({
        data: { userId: recipient.id, currency: data.currency },
      });
    }

    // Calculate fee (0.5% for cross-user transfers)
    const fee = data.amount * 0.005;
    const netAmount = data.amount - fee;

    // Execute transaction atomically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await prisma.$transaction(async (tx: any) => {
      // Debit sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: data.amount } },
      });

      // Credit recipient
      await tx.wallet.update({
        where: { id: recipientWallet!.id },
        data: { balance: { increment: netAmount } },
      });

      // Create transaction record
      const txRecord = await tx.transaction.create({
        data: {
          type: "SEND",
          status: "COMPLETED",
          amount: data.amount,
          currency: data.currency,
          fee,
          description: data.description,
          senderId,
          receiverId: recipient!.id,
          senderWalletId: senderWallet.id,
          receiverWalletId: recipientWallet!.id,
          authMethod: data.authMethod,
          deviceId: data.deviceId,
          ipAddress: req.ip,
          riskScore,
          completedAt: new Date(),
        },
      });

      // Notify recipient
      await tx.notification.create({
        data: {
          userId: recipient!.id,
          type: "PAYMENT_RECEIVED",
          title: "Payment received",
          body: `You received ${data.currency} ${netAmount.toFixed(2)} from ${req.user!.email}`,
          data: { transactionId: txRecord.id },
        },
      });

      return txRecord;
    });

    res.status(201).json({
      transaction: {
        id: transaction.id,
        reference: transaction.reference,
        amount: data.amount,
        fee,
        netAmount,
        currency: data.currency,
        status: "COMPLETED",
        completedAt: transaction.completedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

export { router as transactionRouter };
