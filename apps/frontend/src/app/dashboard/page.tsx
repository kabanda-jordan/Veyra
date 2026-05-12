"use client";

import { motion } from "framer-motion";
import { WalletBalanceCard } from "@/components/dashboard/wallet-balance-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SecurityScore } from "@/components/dashboard/security-score";
import { TrustedDevices } from "@/components/dashboard/trusted-devices";
import { CashbackCard } from "@/components/dashboard/cashback-card";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white">Good morning, John 👋</h1>
          <p className="text-sm text-white/40 mt-1">Monday, May 11, 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-medium text-neon-green">All systems normal</span>
        </div>
      </motion.div>

      {/* Top row: Balance + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WalletBalanceCard />
        </div>
        <QuickActions />
      </div>

      {/* Middle row: Chart + Security */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>
        <div className="space-y-6">
          <SecurityScore />
          <CashbackCard />
        </div>
      </div>

      {/* Bottom row: Transactions + Devices */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <TrustedDevices />
      </div>
    </div>
  );
}
