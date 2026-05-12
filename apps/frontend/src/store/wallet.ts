import { create } from "zustand";

interface Wallet {
  id: string;
  currency: string;
  balance: number;
  isDefault: boolean;
  isFrozen: boolean;
  walletAddress: string;
}

interface WalletState {
  wallets: Wallet[];
  activeWalletId: string | null;

  setWallets: (wallets: Wallet[]) => void;
  setActiveWallet: (id: string) => void;
  updateWalletBalance: (id: string, balance: number) => void;
  freezeWallet: (id: string) => void;
  unfreezeWallet: (id: string) => void;

  getActiveWallet: () => Wallet | undefined;
  getTotalBalance: (currency?: string) => number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  activeWalletId: null,

  setWallets: (wallets) =>
    set({
      wallets,
      activeWalletId: wallets.find((w) => w.isDefault)?.id || wallets[0]?.id || null,
    }),

  setActiveWallet: (id) => set({ activeWalletId: id }),

  updateWalletBalance: (id, balance) =>
    set((state) => ({
      wallets: state.wallets.map((w) => (w.id === id ? { ...w, balance } : w)),
    })),

  freezeWallet: (id) =>
    set((state) => ({
      wallets: state.wallets.map((w) => (w.id === id ? { ...w, isFrozen: true } : w)),
    })),

  unfreezeWallet: (id) =>
    set((state) => ({
      wallets: state.wallets.map((w) => (w.id === id ? { ...w, isFrozen: false } : w)),
    })),

  getActiveWallet: () => {
    const { wallets, activeWalletId } = get();
    return wallets.find((w) => w.id === activeWalletId);
  },

  getTotalBalance: (currency = "USD") => {
    const { wallets } = get();
    return wallets
      .filter((w) => w.currency === currency)
      .reduce((sum, w) => sum + w.balance, 0);
  },
}));
