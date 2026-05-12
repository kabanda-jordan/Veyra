"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Coffee, Zap, Car, Home, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const transactions = [
  {
    id: "1",
    name: "Apple Store",
    category: "Shopping",
    amount: -299.00,
    date: "Today, 2:34 PM",
    status: "completed",
    icon: ShoppingBag,
    iconColor: "#8B5CF6",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    category: "Transfer received",
    amount: +500.00,
    date: "Today, 11:20 AM",
    status: "completed",
    icon: ArrowDownLeft,
    iconColor: "#16C784",
  },
  {
    id: "3",
    name: "Starbucks",
    category: "Food & Drink",
    amount: -6.50,
    date: "Yesterday, 8:15 AM",
    status: "completed",
    icon: Coffee,
    iconColor: "#F59E0B",
  },
  {
    id: "4",
    name: "Electric Bill",
    category: "Utilities",
    amount: -124.00,
    date: "May 9, 6:00 PM",
    status: "completed",
    icon: Zap,
    iconColor: "#4DA3FF",
  },
  {
    id: "5",
    name: "Uber",
    category: "Transport",
    amount: -18.75,
    date: "May 8, 9:45 PM",
    status: "completed",
    icon: Car,
    iconColor: "#06B6D4",
  },
  {
    id: "6",
    name: "Rent Payment",
    category: "Housing",
    amount: -1800.00,
    date: "May 1, 12:00 PM",
    status: "completed",
    icon: Home,
    iconColor: "#EC4899",
  },
];

export function RecentTransactions() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Recent Transactions</h3>
          <p className="text-xs text-white/40 mt-0.5">Last 30 days</p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-xs text-neon-blue hover:text-neon-blue/80 font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-1">
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="transaction-row"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${tx.iconColor}15`, border: `1px solid ${tx.iconColor}25` }}
              >
                <tx.icon size={16} style={{ color: tx.iconColor }} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{tx.name}</div>
                <div className="text-xs text-white/40">{tx.category} · {tx.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-sm font-bold ${tx.amount > 0 ? "text-neon-green" : "text-white"}`}>
                {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </div>
              <span className="badge-success">Done</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
