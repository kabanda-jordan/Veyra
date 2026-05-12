"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Shield, Lock, AlertTriangle, CheckCircle, Smartphone,
  Eye, EyeOff, RefreshCw, Trash2, MapPin, Clock, Zap
} from "lucide-react";

const sessions = [
  { id: "1", device: "iPhone 16 Pro", location: "New York, US", lastActive: "Now", current: true },
  { id: "2", device: "MacBook Pro", location: "New York, US", lastActive: "2h ago", current: false },
  { id: "3", device: "Chrome on Windows", location: "Chicago, US", lastActive: "3d ago", current: false },
];

const alerts = [
  { id: "1", type: "info", message: "New device login from MacBook Pro", time: "2h ago" },
  { id: "2", type: "warning", message: "Login attempt from unknown location", time: "5d ago" },
  { id: "3", type: "success", message: "Passkey successfully registered", time: "1w ago" },
];

export default function SecurityPage() {
  const [walletFrozen, setWalletFrozen] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Security Center</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account security and active sessions</p>
      </motion.div>

      {/* Security score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
              <motion.circle
                cx="18" cy="18" r="15.9"
                fill="none" stroke="#4DA3FF" strokeWidth="2.5" strokeLinecap="round"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray: "87 100" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-white">87</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Security Score: Good</h3>
            <p className="text-sm text-white/50 mb-3">Add a recovery email to reach 100</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Biometrics", ok: true },
                { label: "2FA", ok: true },
                { label: "Trusted device", ok: true },
                { label: "Recovery email", ok: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.ok
                    ? <CheckCircle size={13} className="text-neon-green" />
                    : <AlertTriangle size={13} className="text-yellow-400" />
                  }
                  <span className={`text-xs ${item.ok ? "text-white/60" : "text-yellow-400"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-primary text-white text-sm">
            Improve Score
          </button>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Freeze wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`glass-card p-5 cursor-pointer transition-all ${walletFrozen ? "neon-border" : ""}`}
          onClick={() => setWalletFrozen(!walletFrozen)}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
            walletFrozen ? "bg-red-500/15 border border-red-500/30" : "bg-neon-blue/10 border border-neon-blue/20"
          }`}>
            <Lock size={18} className={walletFrozen ? "text-red-400" : "text-neon-blue"} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {walletFrozen ? "Wallet Frozen" : "Freeze Wallet"}
          </h4>
          <p className="text-xs text-white/40">
            {walletFrozen ? "All transactions blocked" : "Instantly block all transactions"}
          </p>
        </motion.div>

        {/* MFA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
              <Shield size={18} className="text-neon-green" />
            </div>
            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className={`w-10 h-5 rounded-full transition-all relative ${mfaEnabled ? "bg-neon-green" : "bg-white/20"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${mfaEnabled ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Multi-Factor Auth</h4>
          <p className="text-xs text-white/40">{mfaEnabled ? "Active" : "Disabled"}</p>
        </motion.div>

        {/* Recovery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5 cursor-pointer hover:border-neon-blue/30 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-3">
            <RefreshCw size={18} className="text-yellow-400" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Recovery Setup</h4>
          <p className="text-xs text-yellow-400">Action required</p>
        </motion.div>
      </div>

      {/* Active sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Active Sessions</h3>
          <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Sign out all other sessions
          </button>
        </div>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                <Smartphone size={16} className="text-neon-blue" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{session.device}</span>
                  {session.current && <span className="badge-success text-xs">Current</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <MapPin size={10} />
                    {session.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock size={10} />
                    {session.lastActive}
                  </div>
                </div>
              </div>
              {!session.current && (
                <button className="w-8 h-8 rounded-lg border border-veyra-border flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6"
      >
        <h3 className="text-base font-bold text-white mb-5">Security Activity</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                alert.type === "warning" ? "bg-yellow-400" :
                alert.type === "success" ? "bg-neon-green" : "bg-neon-blue"
              }`} />
              <div className="flex-1">
                <div className="text-sm text-white/80">{alert.message}</div>
                <div className="text-xs text-white/30 mt-0.5">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
