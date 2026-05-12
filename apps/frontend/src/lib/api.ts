import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("veyra_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("veyra_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

        localStorage.setItem("veyra_access_token", data.accessToken);
        localStorage.setItem("veyra_refresh_token", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem("veyra_access_token");
        localStorage.removeItem("veyra_refresh_token");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  register: (data: { email: string; firstName: string; lastName: string; phone?: string }) =>
    api.post("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

// ============================================================
// WebAuthn API
// ============================================================
export const webauthnApi = {
  getRegistrationOptions: () =>
    api.post("/webauthn/register/options"),

  verifyRegistration: (response: object, name?: string) =>
    api.post("/webauthn/register/verify", { response, name }),

  getAuthenticationOptions: (email: string) =>
    api.post("/webauthn/authenticate/options", { email }),

  verifyAuthentication: (userId: string, response: object) =>
    api.post("/webauthn/authenticate/verify", { userId, response }),

  getCredentials: () =>
    api.get("/webauthn/credentials"),

  deleteCredential: (id: string) =>
    api.delete(`/webauthn/credentials/${id}`),
};

// ============================================================
// Wallet API
// ============================================================
export const walletApi = {
  getWallets: () => api.get("/wallet"),

  createWallet: (currency: string) =>
    api.post("/wallet", { currency }),

  freezeWallet: (id: string) =>
    api.post(`/wallet/${id}/freeze`),

  unfreezeWallet: (id: string) =>
    api.post(`/wallet/${id}/unfreeze`),
};

// ============================================================
// Transactions API
// ============================================================
export const transactionApi = {
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get("/transactions", { params }),

  getTransaction: (id: string) =>
    api.get(`/transactions/${id}`),

  sendMoney: (data: {
    recipientEmail?: string;
    recipientWalletAddress?: string;
    amount: number;
    currency?: string;
    description?: string;
    authMethod?: string;
  }) => api.post("/transactions/send", data),
};

// ============================================================
// Merchant API
// ============================================================
export const merchantApi = {
  getProfile: () => api.get("/merchant/profile"),

  register: (data: {
    businessName: string;
    businessType?: string;
    website?: string;
    country: string;
    currency?: string;
  }) => api.post("/merchant/register", data),

  generateQR: (data: {
    amount?: number;
    currency?: string;
    description?: string;
    isOneTime?: boolean;
    expiresInMinutes?: number;
  }) => api.post("/merchant/qr", data),

  getAnalytics: () => api.get("/merchant/analytics"),
};

// ============================================================
// Analytics API
// ============================================================
export const analyticsApi = {
  getOverview: () => api.get("/analytics/overview"),
  getSpendingByCategory: () => api.get("/analytics/spending-by-category"),
};

// ============================================================
// Notifications API
// ============================================================
export const notificationApi = {
  getNotifications: () => api.get("/notifications"),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};
