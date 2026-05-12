"use client";

import { motion } from "framer-motion";
import { Send, QrCode, CreditCard, RefreshCw, Fingerprint, Plus } from "lucide-react";
import Link from "next/link";

const actions = [
  { icon: Send, label: "Send", href: "/dashboard/send", color: "#4DA3FF" },
  { icon: QrCode, label: "QR Pay", href: "/dashboard/qr", color: "#16C784" },
  { icon: CreditCard, label: "Cards", href: "/dashboard/cards", color: "#8B5CF6" },
  { icon: RefreshCw, label: "Exchange", href: "/dashboard/exchange", color: "#F59E0B" },
  { icon: Fingerprint, label: "Biometric", href: "/dashboard/biometrics", color: "#06B6D4" },
  { icon: Plus, label: "More", href: "/dashboard/more", color: "#EC4899" },
];

export function QuickActions() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={action.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105 group"
              style={{
                background: `${action.color}10`,
                border: `1px solid ${action.color}20`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${action.color}20` }}
              >
                <action.icon size={18} style={{ color: action.color }} />
              </div>
              <span className="text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
