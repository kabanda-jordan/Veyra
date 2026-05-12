"use client";

import { motion } from "framer-motion";
import {
  Users, DollarSign, AlertTriangle, Shield, Activity,
  TrendingUp, CheckCircle, XCircle, Clock, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const stats = [
  { label: "Total Users", value: "4,218,492", change: "+2.4%", icon: Users, color: "#4DA3FF" },
  { label: "Total Volume", value: "$2.4B", change: "+18.2%", icon: DollarSign, color: "#16C784" },
  { label: "Open Fraud Alerts", value: "23", change: "-12%", icon: AlertTriangle, color: "#F59E0B" },
  { label: "Pending KYC", value: "847", change: "+5%", icon: Shield, color: "#8B5CF6" },
];

const volumeData = [
  { month: "Nov", volume: 180 },
  { month: "Dec", volume: 220 },
  { month: "Jan", volume: 195 },
  { month: "Feb", volume: 280 },
  { month: "Mar", volume: 310 },
  { month: "Apr", volume: 390 },
  { month: "May", volume: 420 },
];

const fraudEvents = [
  { id: "1", user: "user_abc123", type: "velocity", severity: "high", amount: "$4,200", time: "5 min ago" },
  { id: "2", user: "user_def456", type: "geo_risk", severity: "medium", amount: "$890", time: "12 min ago" },
  { id: "3", user: "user_ghi789", type: "device_risk", severity: "critical", amount: "$12,000", time: "28 min ago" },
  { id: "4", user: "user_jkl012", type: "pattern", severity: "low", amount: "$150", time: "1h ago" },
];

const kycQueue = [
  { id: "1", name: "James Wilson", email: "j.wilson@email.com", level: 2, submitted: "2h ago" },
  { id: "2", name: "Priya Patel", email: "p.patel@email.com", level: 1, submitted: "4h ago" },
  { id: "3", name: "Carlos Mendez", email: "c.mendez@email.com", level: 3, submitted: "6h ago" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-veyra-darker p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
              <p className="text-sm text-white/40 mt-1">Veyra Operations Center · May 11, 2026</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-medium text-neon-green">All systems operational</span>
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
                <span className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-neon-green" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Volume chart + Fraud alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-base font-bold text-white mb-6">Transaction Volume (Millions USD)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DA3FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4DA3FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: "12px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(v: number) => [`$${v}M`, "Volume"]}
                />
                <Area type="monotone" dataKey="volume" stroke="#4DA3FF" strokeWidth={2} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fraud alerts */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Fraud Alerts</h3>
              <span className="badge-pending">23 open</span>
            </div>
            <div className="space-y-3">
              {fraudEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-white/60">{event.user}</span>
                    <span className={`text-xs font-semibold ${
                      event.severity === "critical" ? "text-red-400" :
                      event.severity === "high" ? "text-orange-400" :
                      event.severity === "medium" ? "text-yellow-400" : "text-white/40"
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">{event.type}</span>
                    <span className="text-xs font-bold text-white">{event.amount}</span>
                  </div>
                  <div className="text-xs text-white/30 mt-1">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KYC Queue + Infrastructure */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* KYC Queue */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">KYC Review Queue</h3>
              <span className="badge-blue">847 pending</span>
            </div>
            <div className="space-y-3">
              {kycQueue.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                  <div className="w-9 h-9 rounded-full bg-neon-blue/15 border border-neon-blue/25 flex items-center justify-center text-sm font-bold text-neon-blue">
                    {item.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-white/40">{item.email} · Level {item.level} · {item.submitted}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-lg bg-neon-green/15 border border-neon-green/25 flex items-center justify-center">
                      <CheckCircle size={13} className="text-neon-green" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                      <XCircle size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure health */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-5">Infrastructure Health</h3>
            <div className="space-y-4">
              {[
                { service: "API Gateway", uptime: "99.99%", latency: "12ms", status: "healthy" },
                { service: "Database (Primary)", uptime: "99.98%", latency: "3ms", status: "healthy" },
                { service: "Redis Cache", uptime: "100%", latency: "0.8ms", status: "healthy" },
                { service: "WebAuthn Service", uptime: "99.97%", latency: "45ms", status: "healthy" },
                { service: "Fraud Engine", uptime: "99.95%", latency: "28ms", status: "degraded" },
              ].map((svc) => (
                <div key={svc.service} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    svc.status === "healthy" ? "bg-neon-green" : "bg-yellow-400"
                  }`} />
                  <span className="text-sm text-white flex-1">{svc.service}</span>
                  <span className="text-xs text-white/40">{svc.latency}</span>
                  <span className="text-xs font-medium text-neon-green">{svc.uptime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
