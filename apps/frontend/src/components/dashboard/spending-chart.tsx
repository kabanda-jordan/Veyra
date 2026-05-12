"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { useState } from "react";

const monthlyData = [
  { month: "Nov", income: 4200, spending: 2800 },
  { month: "Dec", income: 5100, spending: 3900 },
  { month: "Jan", income: 4800, spending: 3200 },
  { month: "Feb", income: 5600, spending: 2900 },
  { month: "Mar", income: 4900, spending: 3400 },
  { month: "Apr", income: 6200, spending: 3100 },
  { month: "May", income: 5800, spending: 2700 },
];

const categoryData = [
  { name: "Food", amount: 680, color: "#4DA3FF" },
  { name: "Transport", amount: 320, color: "#16C784" },
  { name: "Shopping", amount: 890, color: "#8B5CF6" },
  { name: "Bills", amount: 450, color: "#F59E0B" },
  { name: "Health", amount: 210, color: "#06B6D4" },
  { name: "Other", amount: 150, color: "#EC4899" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <div className="font-semibold text-white mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-white/60 capitalize">{p.name}:</span>
            <span className="text-white font-medium">${p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  const [view, setView] = useState<"overview" | "categories">("overview");

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Financial Overview</h3>
          <p className="text-xs text-white/40 mt-0.5">Income vs Spending</p>
        </div>
        <div className="flex gap-2">
          {(["overview", "categories"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                view === v
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "overview" ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4DA3FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4DA3FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16C784" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16C784" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#4DA3FF" strokeWidth={2} fill="url(#incomeGrad)" />
            <Area type="monotone" dataKey="spending" stroke="#16C784" strokeWidth={2} fill="url(#spendingGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              {categoryData.map((cat) => (
                <Bar key={cat.name} dataKey="amount" fill={cat.color} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="text-xs text-white/50 truncate">{cat.name}</span>
                <span className="text-xs font-medium text-white ml-auto">${cat.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      {view === "overview" && (
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-neon-blue rounded" />
            <span className="text-xs text-white/50">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-neon-green rounded" />
            <span className="text-xs text-white/50">Spending</span>
          </div>
        </div>
      )}
    </div>
  );
}
