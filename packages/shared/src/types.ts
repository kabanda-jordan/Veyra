// Veyra Shared Types
// Used by both frontend and backend

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  isVerified: boolean;
  isMerchant: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  lockedBalance: number;
  isDefault: boolean;
  isActive: boolean;
  isFrozen: boolean;
  walletAddress: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  fee: number;
  description?: string;
  reference: string;
  senderId?: string;
  receiverId?: string;
  merchantId?: string;
  authMethod?: string;
  riskScore?: number;
  isFlagged: boolean;
  createdAt: string;
  completedAt?: string;
  sender?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  receiver?: Pick<User, "id" | "firstName" | "lastName" | "email">;
}

export type TransactionType =
  | "SEND"
  | "RECEIVE"
  | "PAYMENT"
  | "REFUND"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "EXCHANGE"
  | "FEE";

export type TransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "FLAGGED";

export interface WebAuthnCredential {
  id: string;
  name?: string;
  deviceType?: string;
  backedUp: boolean;
  transports: string[];
  lastUsedAt?: string;
  createdAt: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  os?: string;
  browser?: string;
  location?: string;
  isTrusted: boolean;
  trustScore: number;
  lastSeenAt: string;
}

export interface MerchantAccount {
  id: string;
  userId: string;
  businessName: string;
  businessType?: string;
  website?: string;
  country: string;
  currency: string;
  isVerified: boolean;
  feeRate: number;
  apiKey: string;
}

export interface KycRecord {
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
  level: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface FraudEvent {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  isResolved: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser extends User {
  wallets: Wallet[];
  kycRecord?: KycRecord;
}
