import { prisma } from "../lib/prisma";

interface TransactionContext {
  userId: string;
  amount: number;
  currency: string;
  recipientId?: string;
  ipAddress: string;
  deviceId?: string;
}

interface FraudSignal {
  name: string;
  score: number;
  weight: number;
  triggered: boolean;
}

export class FraudDetectionService {
  /**
   * Assess fraud risk for a transaction.
   * Returns a risk score between 0 (safe) and 1 (high risk).
   */
  async assessTransaction(ctx: TransactionContext): Promise<number> {
    const signals = await Promise.all([
      this.checkVelocity(ctx),
      this.checkAmountAnomaly(ctx),
      this.checkDeviceRisk(ctx),
      this.checkGeoRisk(ctx),
      this.checkRecipientRisk(ctx),
    ]);

    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const weightedScore = signals.reduce(
      (sum, s) => sum + (s.triggered ? s.score * s.weight : 0),
      0
    );

    const riskScore = weightedScore / totalWeight;

    // Log high-risk events
    if (riskScore > 0.5) {
      await this.logFraudEvent(ctx, signals, riskScore);
    }

    return riskScore;
  }

  /**
   * Check transaction velocity (too many transactions in short time)
   */
  private async checkVelocity(ctx: TransactionContext): Promise<FraudSignal> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentCount = await prisma.transaction.count({
      where: {
        senderId: ctx.userId,
        createdAt: { gte: oneHourAgo },
        status: { in: ["COMPLETED", "PROCESSING"] },
      },
    });

    const triggered = recentCount > 10;
    return {
      name: "velocity",
      score: Math.min(recentCount / 20, 1),
      weight: 0.3,
      triggered,
    };
  }

  /**
   * Check if amount is anomalous compared to user's history
   */
  private async checkAmountAnomaly(ctx: TransactionContext): Promise<FraudSignal> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const history = await prisma.transaction.aggregate({
      where: {
        senderId: ctx.userId,
        createdAt: { gte: thirtyDaysAgo },
        status: "COMPLETED",
      },
      _avg: { amount: true },
      _max: { amount: true },
    });

    const avgAmount = Number(history._avg.amount) || 100;
    const maxAmount = Number(history._max.amount) || 500;

    // Flag if amount is 5x the average or 2x the historical max
    const triggered = ctx.amount > avgAmount * 5 || ctx.amount > maxAmount * 2;
    const score = Math.min(ctx.amount / (avgAmount * 10), 1);

    return { name: "amount_anomaly", score, weight: 0.25, triggered };
  }

  /**
   * Check device trust score
   */
  private async checkDeviceRisk(ctx: TransactionContext): Promise<FraudSignal> {
    if (!ctx.deviceId) {
      return { name: "device_risk", score: 0.3, weight: 0.2, triggered: true };
    }

    const device = await prisma.device.findFirst({
      where: { fingerprint: ctx.deviceId, userId: ctx.userId },
    });

    if (!device) {
      return { name: "device_risk", score: 0.7, weight: 0.2, triggered: true };
    }

    const triggered = !device.isTrusted || device.trustScore < 0.5;
    return {
      name: "device_risk",
      score: 1 - device.trustScore,
      weight: 0.2,
      triggered,
    };
  }

  /**
   * Check geo-risk based on IP address
   */
  private async checkGeoRisk(ctx: TransactionContext): Promise<FraudSignal> {
    // In production, use a geo-IP service to check:
    // - High-risk countries
    // - VPN/proxy detection
    // - Impossible travel (location changed too fast)
    const isHighRiskIp = ctx.ipAddress === "::1" ? false : false; // placeholder

    return {
      name: "geo_risk",
      score: isHighRiskIp ? 0.8 : 0.1,
      weight: 0.15,
      triggered: isHighRiskIp,
    };
  }

  /**
   * Check if recipient has fraud history
   */
  private async checkRecipientRisk(ctx: TransactionContext): Promise<FraudSignal> {
    if (!ctx.recipientId) {
      return { name: "recipient_risk", score: 0, weight: 0.1, triggered: false };
    }

    const fraudCount = await prisma.fraudEvent.count({
      where: {
        userId: ctx.recipientId,
        severity: { in: ["high", "critical"] },
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    const triggered = fraudCount > 0;
    return {
      name: "recipient_risk",
      score: Math.min(fraudCount * 0.3, 1),
      weight: 0.1,
      triggered,
    };
  }

  private async logFraudEvent(
    ctx: TransactionContext,
    signals: FraudSignal[],
    riskScore: number
  ): Promise<void> {
    const triggeredSignals = signals.filter((s) => s.triggered);
    const severity =
      riskScore > 0.8 ? "critical" :
      riskScore > 0.6 ? "high" :
      riskScore > 0.4 ? "medium" : "low";

    await prisma.fraudEvent.create({
      data: {
        userId: ctx.userId,
        type: triggeredSignals.map((s) => s.name).join(","),
        severity,
        description: `Risk score ${(riskScore * 100).toFixed(0)}% — Signals: ${triggeredSignals.map((s) => s.name).join(", ")}`,
        metadata: {
          signals: triggeredSignals as unknown as Record<string, unknown>[],
          riskScore,
          amount: ctx.amount,
          currency: ctx.currency,
          ipAddress: ctx.ipAddress,
        } as object,
      },
    });
  }
}
