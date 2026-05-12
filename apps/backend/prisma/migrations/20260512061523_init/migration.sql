-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SEND', 'RECEIVE', 'PAYMENT', 'REFUND', 'DEPOSIT', 'WITHDRAWAL', 'EXCHANGE', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "locale" TEXT NOT NULL DEFAULT 'en-US',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isMerchant" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "balance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "lockedBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "walletAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(18,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "fee" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "exchangeRate" DECIMAL(18,8),
    "description" TEXT,
    "reference" TEXT NOT NULL,
    "metadata" JSONB,
    "senderId" TEXT,
    "receiverId" TEXT,
    "senderWalletId" TEXT,
    "receiverWalletId" TEXT,
    "merchantId" TEXT,
    "authMethod" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "riskScore" DOUBLE PRECISION,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settlementDelay" INTEGER NOT NULL DEFAULT 1,
    "feeRate" DECIMAL(5,4) NOT NULL DEFAULT 0.029,
    "apiKey" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "webhookSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_team_members" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3),

    CONSTRAINT "merchant_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webauthn_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "counter" BIGINT NOT NULL DEFAULT 0,
    "deviceType" TEXT,
    "backedUp" BOOLEAN NOT NULL DEFAULT false,
    "transports" TEXT[],
    "name" TEXT,
    "aaguid" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webauthn_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "os" TEXT,
    "browser" TEXT,
    "fingerprint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "location" TEXT,
    "isTrusted" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_records" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "level" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "documentType" TEXT,
    "documentNumber" TEXT,
    "documentExpiry" TIMESTAMP(3),
    "documentFrontUrl" TEXT,
    "documentBackUrl" TEXT,
    "selfieUrl" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "transactionId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "amount" DECIMAL(18,8),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "reference" TEXT NOT NULL,
    "isOneTime" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webauthn_challenges" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "challenge" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webauthn_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_walletAddress_key" ON "wallets"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_currency_key" ON "wallets"("userId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_accounts_userId_key" ON "merchant_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "merchant_accounts_apiKey_key" ON "merchant_accounts"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "webauthn_credentials_credentialId_key" ON "webauthn_credentials"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "devices_fingerprint_key" ON "devices"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_records_userId_key" ON "kyc_records"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_reference_key" ON "qr_codes"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_transactionId_key" ON "refunds"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "webauthn_challenges_challenge_key" ON "webauthn_challenges"("challenge");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_senderWalletId_fkey" FOREIGN KEY ("senderWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiverWalletId_fkey" FOREIGN KEY ("receiverWalletId") REFERENCES "wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchant_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_accounts" ADD CONSTRAINT "merchant_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_team_members" ADD CONSTRAINT "merchant_team_members_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchant_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webauthn_credentials" ADD CONSTRAINT "webauthn_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_records" ADD CONSTRAINT "kyc_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fraud_events" ADD CONSTRAINT "fraud_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchant_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
