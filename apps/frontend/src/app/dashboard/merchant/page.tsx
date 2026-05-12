"use client";

import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, DollarSign, Users, QrCode,
  ArrowUpRight, AlertTriangle, CheckCircle, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useState } from "react";

const revenueData = [
  { day: "Mon", revenue: 1240, transactions: 48 },
  { day: "Tue", revenue: 2180, transactions: 72 },
  { day: "Wed", revenue: 1890, transactions: 61 },
  { day: "Thu", revenue: 3200, transactions: 94 },
  { day: "Fri", revenue: 4100, transactions: 118 },
  { day: "Sat", revenue: 2900, transactions: 87 },
  { day: "Sun", revenue: 1600, transactions: 52 },
];

const recentPayments = [
  { id: "1", customer: "John D.", amount: 24.99, status: "completed", time: "2 min ago", method: "Face ID" },
  { id: "2", customer: "Sarah M.", amount: 89.50, status: "completed", time: "8 min ago", method: "Touch ID" },
  { id: "3", customer: "Alex K.", amount: 12.00, status: "pending", time: "15 min ago", method: "Fingerprint" },
  { id: "4", customer: "Emma R.", amount: 156.75, status: "completed", time: "22 min ago", method: "Windows Hello" },
  { id: "5", customer: "Mike T.", amount: 45.00, status: "failed", time: "35 min ago", method: "Face ID" },
];

const stats = [
  { label: "Today's Revenue", value: "$4,100", change: "+18%", icon: DollarSign, color: "#16C784" },
  { label: "Transactions", value: "118", change: "+24%", icon: BarChart3, color: "#4DA3FF" },
  { label: "Avg. Order", value: "$34.75", change: "+5%", icon: TrendingUp, color: "#8B5CF6" },
  { label: "Active Customers", value: "892", change: "+12%", icon: Users, color: "#F59E0B" },
];

export default function MerchantDashboard() {
  const [qrAmount, setQrAmount] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Merchant Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">Veyra Coffee Co. · Monday, May 11, 2026</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary text-white text-sm flex items-center gap-2">
              <RefreshCw size={14} />
              Refresh
            </button>
            <button className="btn-primary text-white text-sm flex items-center gap-2">
              <QrCode size={14} />
              Generate QR
            </button>
          </div>
        </div>
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
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-semibold text-neon-green">{stat.change}</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts + QR */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Revenue</h3>
              <p className="text-xs text-white/40">Biometric payment volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16C784" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16C784" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#16C784" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#16C784" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* QR Generator */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">QR Payment</h3>
          {!qrGenerated ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Amount (USD)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="input-field text-lg font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-2 block">Description (optional)</label>
                <input type="text" placeholder="Coffee & pastry" className="input-field" />
              </div>
              <button
                onClick={() => setQrGenerated(true)}
                className="w-full btn-primary text-white text-sm"
                disabled={!qrAmount}
              >
                Generate QR Code
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-2">${qrAmount}</div>
              <div className="w-40 h-40 mx-auto mb-4 rounded-2xl bg-white p-3">
                <div className="w-full h-full grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} className="rounded-sm" style={{ background: Math.random() > 0.5 ? "#050508" : "transparent" }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-neon-green text-xs font-semibold mb-4">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Waiting for payment...
              </div>
              <button
                onClick={() => { setQrGenerated(false); setQrAmount(""); }}
                className="btn-secondary text-white text-xs w-full"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent payments */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white">Recent Payments</h3>
          <span className="text-xs text-neon-blue cursor-pointer">View all →</span>
        </div>
        <div className="space-y-1">
          {recentPayments.map((payment) => (
            <div key={payment.id} className="transaction-row">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-sm font-bold text-neon-blue">
                  {payment.customer[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{payment.customer}</div>
                  <div className="text-xs text-white/40">{payment.method} · {payment.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">${payment.amount.toFixed(2)}</span>
                <span className={
                  payment.status === "completed" ? "badge-success" :
                  payment.status === "pending" ? "badge-pending" : "badge-failed"
                }>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
