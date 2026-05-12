"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Plus, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Eye, EyeOff, TrendingUp, TrendingDown, CreditCard, Snowflake
} from "lucide-react";

const wallets = [
  { currency: "USD", symbol: "$", balance: 12847.50, change: +3.2, color: "#4DA3FF", flag: "🇺🇸" },
  { currency: "EUR", symbol: "€", balance: 4230.00, change: -0.8, color: "#16C784", flag: "🇪🇺" },
  { currency: "GBP", symbol: "£", balance: 2100.75, change: +1.4, color: "#8B5CF6", flag: "🇬🇧" },
  { currency: "BTC", symbol: "₿", balance: 0.0842, change: +5.7, color: "#F59E0B", flag: "₿" },
];

export default function WalletPage() {
  const [hidden, setHidden] = useState(false);
  const [activeWallet, setActiveWallet] = useState(0);

  const wallet = wallets[activeWallet];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">My Wallets</h1>
          <button className="btn-primary text-white text-sm flex items-center gap-2">
            <Plus size={14} />
            Add Currency
          </button>
        </div>
      </motion.div>

      {/* Wallet cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wallets.map((w, i) => (
          <motion.div
            key={w.currency}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setActiveWallet(i)}
            className={`glass-card p-5 cursor-pointer transition-all hover:scale-[1.02] ${
              activeWallet === i ? "neon-border" : ""
            }`}
            style={activeWallet === i ? { borderColor: `${w.color}40` } : {}}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{w.flag}</span>
              <span className={`text-xs font-semibold ${w.change >= 0 ? "text-neon-green" : "text-red-400"}`}>
                {w.change >= 0 ? "+" : ""}{w.change}%
              </span>
            </div>
            <div className="text-xs text-white/40 mb-1">{w.currency}</div>
            <div className="text-xl font-black text-white">
              {hidden ? "••••" : `${w.symbol}${w.balance.toLocaleString()}`}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active wallet detail */}
      <motion.div
        key={activeWallet}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{ borderColor: `${wallet.color}30` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse at top right, ${wallet.color}08, transparent 60%)`
        }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-sm text-white/40 mb-1">{wallet.currency} Wallet</div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-white">
                  {hidden ? "••••••" : `${wallet.symbol}${wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                </div>
                <button onClick={() => setHidden(!hidden)} className="text-white/30 hover:text-white/70">
                  {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {wallet.change >= 0
                  ? <TrendingUp size={13} className="text-neon-green" />
                  : <TrendingDown size={13} className="text-red-400" />
                }
                <span className={`text-sm font-medium ${wallet.change >= 0 ? "text-neon-green" : "text-red-400"}`}>
                  {wallet.change >= 0 ? "+" : ""}{wallet.change}% this month
                </span>
              </div>
            </div>
            <div className="text-4xl">{wallet.flag}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Plus, label: "Add Money", color: wallet.color },
              { icon: ArrowUpRight, label: "Send", color: "#ffffff" },
              { icon: ArrowDownLeft, label: "Receive", color: "#ffffff" },
              { icon: RefreshCw, label: "Exchange", color: "#ffffff" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={action.color === wallet.color
                  ? { background: `${wallet.color}20`, border: `1px solid ${wallet.color}30`, color: wallet.color }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }
                }
              >
                <action.icon size={15} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Virtual cards */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Virtual Cards</h3>
          <button className="text-xs text-neon-blue hover:underline flex items-center gap-1">
            <Plus size={12} />
            New Card
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: "Online Shopping", last4: "4242", limit: 500, spent: 234, color: "#4DA3FF" },
            { name: "Subscriptions", last4: "8888", limit: 200, spent: 89, color: "#8B5CF6" },
          ].map((card) => (
            <div
              key={card.last4}
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)`, border: `1px solid ${card.color}25` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">{card.name}</span>
                <CreditCard size={16} style={{ color: card.color }} />
              </div>
              <div className="text-lg font-mono text-white/70 mb-3">•••• •••• •••• {card.last4}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Spent: ${card.spent} / ${card.limit}</span>
                <button className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
                  <Snowflake size={11} />
                  Freeze
                </button>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(card.spent / card.limit) * 100}%`, background: card.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
