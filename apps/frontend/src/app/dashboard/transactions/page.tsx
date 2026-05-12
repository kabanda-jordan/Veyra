"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search, Filter, Download, ArrowUpRight, ArrowDownLeft,
  ShoppingBag, Coffee, Zap, Car, Home, MoreHorizontal
} from "lucide-react";

const allTransactions = [
  { id: "1", name: "Apple Store", category: "Shopping", amount: -299.00, date: "May 11, 2026", time: "2:34 PM", status: "completed", type: "payment", icon: ShoppingBag, iconColor: "#8B5CF6", method: "Touch ID" },
  { id: "2", name: "Sarah Johnson", category: "Transfer received", amount: +500.00, date: "May 11, 2026", time: "11:20 AM", status: "completed", type: "receive", icon: ArrowDownLeft, iconColor: "#16C784", method: "—" },
  { id: "3", name: "Starbucks", category: "Food & Drink", amount: -6.50, date: "May 10, 2026", time: "8:15 AM", status: "completed", type: "payment", icon: Coffee, iconColor: "#F59E0B", method: "Face ID" },
  { id: "4", name: "Electric Bill", category: "Utilities", amount: -124.00, date: "May 9, 2026", time: "6:00 PM", status: "completed", type: "payment", icon: Zap, iconColor: "#4DA3FF", method: "Windows Hello" },
  { id: "5", name: "Uber", category: "Transport", amount: -18.75, date: "May 8, 2026", time: "9:45 PM", status: "completed", type: "payment", icon: Car, iconColor: "#06B6D4", method: "Fingerprint" },
  { id: "6", name: "Rent Payment", category: "Housing", amount: -1800.00, date: "May 1, 2026", time: "12:00 PM", status: "completed", type: "payment", icon: Home, iconColor: "#EC4899", method: "Touch ID" },
  { id: "7", name: "Mike Chen", category: "Transfer sent", amount: -50.00, date: "Apr 30, 2026", time: "3:22 PM", status: "completed", type: "send", icon: ArrowUpRight, iconColor: "#4DA3FF", method: "Face ID" },
  { id: "8", name: "Netflix", category: "Entertainment", amount: -15.99, date: "Apr 28, 2026", time: "12:00 AM", status: "completed", type: "payment", icon: Zap, iconColor: "#8B5CF6", method: "Auto-pay" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = allTransactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tx.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Transactions</h1>
            <p className="text-sm text-white/40 mt-1">All your payment history</p>
          </div>
          <button className="btn-secondary text-white text-sm flex items-center gap-2">
            <Download size={14} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 w-full"
          />
        </div>
        <div className="flex gap-2">
          {["all", "payment", "send", "receive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "border border-veyra-border text-white/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-veyra-border">
          <div className="grid grid-cols-4 text-xs font-semibold text-white/30 uppercase tracking-wider">
            <span>Transaction</span>
            <span className="hidden md:block">Method</span>
            <span className="hidden md:block">Date</span>
            <span className="text-right">Amount</span>
          </div>
        </div>

        <div className="divide-y divide-veyra-border">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-4 items-center p-4 hover:bg-white/2 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tx.iconColor}15`, border: `1px solid ${tx.iconColor}25` }}
                >
                  <tx.icon size={15} style={{ color: tx.iconColor }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{tx.name}</div>
                  <div className="text-xs text-white/40">{tx.category}</div>
                </div>
              </div>
              <div className="hidden md:block text-xs text-white/40">{tx.method}</div>
              <div className="hidden md:block">
                <div className="text-xs text-white/60">{tx.date}</div>
                <div className="text-xs text-white/30">{tx.time}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${tx.amount > 0 ? "text-neon-green" : "text-white"}`}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </div>
                <span className="badge-success text-xs">Done</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-white/30 text-sm">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
