"use client";

import { motion } from "framer-motion";
import { Gift, TrendingUp, Star, Zap, ArrowRight } from "lucide-react";

const rewards = [
  { id: "1", type: "cashback", desc: "Apple Store purchase", amount: 8.97, date: "May 11", color: "#8B5CF6" },
  { id: "2", type: "cashback", desc: "Starbucks", amount: 0.20, date: "May 10", color: "#F59E0B" },
  { id: "3", type: "bonus", desc: "First biometric payment", amount: 5.00, date: "Jan 15", color: "#16C784" },
  { id: "4", type: "cashback", desc: "Uber", amount: 0.56, date: "May 8", color: "#06B6D4" },
];

export default function RewardsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Rewards</h1>
        <p className="text-sm text-white/40 mt-1">Earn cashback on every biometric payment</p>
      </motion.div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 relative overflow-hidden"
        style={{ borderColor: "rgba(22,199,132,0.3)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-white/40 mb-1">Total Cashback Earned</div>
              <div className="text-4xl font-black text-neon-green">$48.20</div>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={13} className="text-neon-green" />
                <span className="text-sm text-neon-green">+$12.40 this month</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
              <Gift size={28} className="text-neon-green" />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-primary text-white text-sm flex items-center gap-2">
              <Zap size={14} />
              Redeem $48.20
            </button>
            <button className="btn-secondary text-white text-sm">
              View History
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cashback tiers */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { tier: "Standard", rate: "0.5%", desc: "All purchases", color: "#4DA3FF", active: true },
          { tier: "Premium", rate: "1.5%", desc: "Business plan", color: "#8B5CF6", active: false },
          { tier: "Elite", rate: "3%", desc: "Enterprise plan", color: "#F59E0B", active: false },
        ].map((tier) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${tier.active ? "" : "opacity-60"}`}
            style={tier.active ? { borderColor: `${tier.color}40` } : {}}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">{tier.tier}</span>
              {tier.active && <span className="badge-success text-xs">Current</span>}
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: tier.color }}>{tier.rate}</div>
            <div className="text-xs text-white/40">{tier.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent rewards */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-5">Recent Rewards</h3>
        <div className="space-y-3">
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/3"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${reward.color}15`, border: `1px solid ${reward.color}25` }}
              >
                {reward.type === "bonus" ? <Star size={15} style={{ color: reward.color }} /> : <Gift size={15} style={{ color: reward.color }} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{reward.desc}</div>
                <div className="text-xs text-white/40">{reward.type} · {reward.date}</div>
              </div>
              <div className="text-sm font-bold text-neon-green">+${reward.amount.toFixed(2)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
