"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

const checks = [
  { label: "Biometrics enabled", ok: true },
  { label: "2FA active", ok: true },
  { label: "Device trusted", ok: true },
  { label: "Recovery email set", ok: false },
];

export function SecurityScore() {
  const score = 87;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Security Score</h3>
        <Shield size={16} className="text-neon-blue" />
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
            <motion.circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="#4DA3FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${score} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${score} 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black text-white">{score}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">Good</div>
          <div className="text-xs text-white/40">1 issue to fix</div>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2">
            {check.ok ? (
              <CheckCircle size={13} className="text-neon-green flex-shrink-0" />
            ) : (
              <AlertCircle size={13} className="text-yellow-400 flex-shrink-0" />
            )}
            <span className={`text-xs ${check.ok ? "text-white/60" : "text-yellow-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
