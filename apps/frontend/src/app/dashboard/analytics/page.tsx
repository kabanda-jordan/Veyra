"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react";

const weeklyData = [
  { day: "Mon", income: 820, spending: 340 },
  { day: "Tue", income: 1200, spending: 580 },
  { day: "Wed", income: 650, spending: 290 },
  { day: "Thu", income: 1800, spending: 720 },
  { day: "Fri", income: 2100, spending: 1100 },
  { day: "Sat", income: 900, spending: 650 },
  { day: "Sun", income: 400, spending: 180 },
];

const categorySpend = [
  { name: "Food & Drink", value: 680, color: "#4DA3FF" },
  { name: "Shopping", value: 890, color: "#8B5CF6" },
  { name: "Transport", value: 320, color: "#16C784" },
  { name: "Bills", value: 450, color: "#F59E0B" },
  { name: "Health", value: 210, color: "#06B6D4" },
  { name: "Other", value: 150, color: "#EC4899" },
];

const stats = [
  { label: "Total Income", value: "$7,870", change: "+12.4%", up: true, icon: TrendingUp, color: "#16C784" },
  { label: "Total Spending", value: "$3,860", change: "-3.2%", up: false, icon: TrendingDown, color: "#4DA3FF" },
  { label: "Net Savings", value: "$4,010", change: "+28.1%", up: true, icon: DollarSign, color: "#8B5CF6" },
  { label: "Transactions", value: "142", change: "+8", up: true, icon: ArrowUpRight, color: "#F59E0B" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-veyra-border">
        <div className="font-semibold text-white mb-2">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-white/60 capitalize">{p.name}:</span>
            <span className="text-white font-medium">${p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-sm text-white/40 mt-1">Your financial insights for May 2026</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className={`text-xs font-semibold ${stat.up ? "text-neon-green" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Activity</h3>
              <p className="text-xs text-white/40">Income vs Spending</p>
            </div>
            <BarChart3 size={16} className="text-white/30" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#4DA3FF" radius={[4, 4, 0, 0]} opacity={0.9} />
              <Bar dataKey="spending" fill="#16C784" radius={[4, 4, 0, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded bg-neon-blue" />
              <span className="text-xs text-white/50">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-2 rounded bg-neon-green" />
              <span className="text-xs text-white/50">Spending</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-6">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categorySpend}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categorySpend.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value}`, ""]}
                contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "rgba(255,255,255,0.7)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categorySpend.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                <span className="text-xs text-white/50 flex-1">{cat.name}</span>
                <span className="text-xs font-medium text-white">${cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">6-Month Trend</h3>
            <p className="text-xs text-white/40">Cumulative savings growth</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={[
            { month: "Dec", savings: 1200 },
            { month: "Jan", savings: 2100 },
            { month: "Feb", savings: 3400 },
            { month: "Mar", savings: 2900 },
            { month: "Apr", savings: 4800 },
            { month: "May", savings: 6200 },
          ]}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="savings" stroke="#8B5CF6" strokeWidth={2} fill="url(#savingsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
