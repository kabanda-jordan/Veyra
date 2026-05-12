"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, TrendingUp, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";

const currencies = [
  { code: "USD", symbol: "$", balance: 12847.50, change: +3.2 },
  { code: "EUR", symbol: "€", balance: 4230.00, change: -0.8 },
  { code: "GBP", symbol: "£", balance: 2100.75, change: +1.4 },
];

export function WalletBalanceCard() {
  const [hidden, setHidden] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(0);

  const current = currencies[activeCurrency];

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">
              Total Balance
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                key={hidden ? "hidden" : current.balance}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white"
              >
                {hidden ? "••••••" : `${current.symbol}${current.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              </motion.div>
              <button
                onClick={() => setHidden(!hidden)}
                className="text-white/30 hover:text-white/70 transition-colors"
              >
                {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp size={13} className="text-neon-green" />
              <span className="text-sm text-neon-green font-medium">
                +{current.change}% this month
              </span>
            </div>
          </div>

          {/* Currency selector */}
          <div className="flex gap-2">
            {currencies.map((c, i) => (
              <button
                key={c.code}
                onClick={() => setActiveCurrency(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCurrency === i
                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Mini balances */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {currencies.map((c, i) => (
            <div
              key={c.code}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                activeCurrency === i
                  ? "bg-neon-blue/10 border border-neon-blue/20"
                  : "bg-white/3 border border-white/5 hover:bg-white/5"
              }`}
              onClick={() => setActiveCurrency(i)}
            >
              <div className="text-xs text-white/40 mb-1">{c.code}</div>
              <div className="text-sm font-bold text-white">
                {hidden ? "••••" : `${c.symbol}${c.balance.toLocaleString()}`}
              </div>
              <div className={`text-xs font-medium ${c.change >= 0 ? "text-neon-green" : "text-red-400"}`}>
                {c.change >= 0 ? "+" : ""}{c.change}%
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-blue/15 border border-neon-blue/30 text-neon-blue text-sm font-semibold hover:bg-neon-blue/25 transition-all">
            <Plus size={16} />
            Add Money
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/8 transition-all">
            <ArrowUpRight size={16} />
            Send
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/8 transition-all">
            <ArrowDownLeft size={16} />
            Receive
          </button>
        </div>
      </div>
    </div>
  );
}
