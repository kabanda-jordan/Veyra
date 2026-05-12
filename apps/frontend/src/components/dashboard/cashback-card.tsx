"use client";

import { Gift, TrendingUp } from "lucide-react";

export function CashbackCard() {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Cashback</h3>
          <Gift size={16} className="text-neon-green" />
        </div>
        <div className="text-2xl font-black text-neon-green mb-1">$48.20</div>
        <div className="text-xs text-white/40 mb-3">Earned this month</div>
        <div className="flex items-center gap-1.5 text-xs text-neon-green">
          <TrendingUp size={12} />
          <span>+12% vs last month</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-neon-green to-neon-blue" />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>$48.20 earned</span>
          <span>$64 goal</span>
        </div>
      </div>
    </div>
  );
}
