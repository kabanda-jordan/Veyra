import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";
import { walletRouter } from "./routes/wallet";
import { transactionRouter } from "./routes/transactions";
import { webauthnRouter } from "./routes/webauthn";
import { merchantRouter } from "./routes/merchant";
import { analyticsRouter } from "./routes/analytics";
import { adminRouter } from "./routes/admin";
import { notificationRouter } from "./routes/notifications";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// Security middleware
// ============================================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Device-ID", "X-Request-ID"],
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many authentication attempts." },
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Too many payment requests." },
});

app.use(globalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ============================================================
// Health check
// ============================================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    service: "veyra-api",
  });
});

// ============================================================
// API Routes
// ============================================================
app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/webauthn", authLimiter, webauthnRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/transactions", paymentLimiter, transactionRouter);
app.use("/api/v1/merchant", merchantRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/notifications", notificationRouter);

// ============================================================
// Error handling
// ============================================================
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Veyra API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
