"use client";

import { motion } from "framer-motion";
import {
  Fingerprint, Shield, Zap, Globe, QrCode, BarChart3,
  Smartphone, Lock, CreditCard, RefreshCw, Bell, Users
} from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Biometric Authentication",
    description: "Touch ID, Face ID, Windows Hello, and Android Fingerprint. Your biometrics never leave your device.",
    color: "#4DA3FF",
    badge: "WebAuthn",
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Security",
    description: "We store only public keys. Private keys and biometric data stay in your device's Secure Enclave.",
    color: "#16C784",
    badge: "FIDO2",
  },
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Sub-200ms payment confirmation. Tap, authenticate, done. No OTPs, no passwords, no friction.",
    color: "#8B5CF6",
    badge: "< 200ms",
  },
  {
    icon: QrCode,
    title: "QR Payments",
    description: "Generate or scan QR codes for instant merchant payments. Works offline with cryptographic verification.",
    color: "#F59E0B",
    badge: "Offline Ready",
  },
  {
    icon: Globe,
    title: "Global Transfers",
    description: "Send money to 190+ countries with real-time FX rates. Multi-currency wallets included.",
    color: "#06B6D4",
    badge: "190+ Countries",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "AI-powered spending insights, fraud detection, and financial health scores in real-time.",
    color: "#EC4899",
    badge: "AI-Powered",
  },
  {
    icon: Smartphone,
    title: "Device Trust System",
    description: "Register trusted devices with risk scoring. Suspicious devices trigger additional verification.",
    color: "#4DA3FF",
    badge: "Risk Scoring",
  },
  {
    icon: Lock,
    title: "Fraud Detection",
    description: "Real-time transaction monitoring with geo-risk analysis and velocity checks.",
    color: "#16C784",
    badge: "Real-time",
  },
  {
    icon: CreditCard,
    title: "Virtual Cards",
    description: "Generate disposable virtual cards for online purchases. Freeze, unfreeze, or delete instantly.",
    color: "#8B5CF6",
    badge: "Instant",
  },
  {
    icon: RefreshCw,
    title: "Auto Settlements",
    description: "Merchants receive automatic daily settlements with detailed reconciliation reports.",
    color: "#F59E0B",
    badge: "T+0",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Real-time alerts for every transaction, suspicious activity, and account changes.",
    color: "#06B6D4",
    badge: "Real-time",
  },
  {
    icon: Users,
    title: "Team Accounts",
    description: "Business accounts with role-based access, spending limits, and approval workflows.",
    color: "#EC4899",
    badge: "Enterprise",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-medium mb-6">
            Everything you need
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
            Built for the{" "}
            <span className="gradient-text">future of money</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Every feature designed with security-first principles and a seamless
            user experience that makes biometric payments feel magical.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 cursor-default"
              style={{
                borderColor: `${feature.color}20`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon size={22} style={{ color: feature.color }} />
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${feature.color}15`,
                    color: feature.color,
                    border: `1px solid ${feature.color}25`,
                  }}
                >
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
