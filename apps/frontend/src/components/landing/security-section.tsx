"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Key, Eye, Server, Cpu } from "lucide-react";

const securityFeatures = [
  {
    icon: Cpu,
    title: "Secure Enclave",
    description: "Biometric data is processed and stored in your device's hardware-isolated Secure Enclave or TEE. It never leaves your device.",
    color: "#4DA3FF",
  },
  {
    icon: Key,
    title: "Public Key Cryptography",
    description: "We store only your public key. Your private key lives in your device. Even if our servers are breached, your biometrics are safe.",
    color: "#16C784",
  },
  {
    icon: Shield,
    title: "FIDO2 / WebAuthn",
    description: "Industry-standard authentication protocol used by Google, Apple, and Microsoft. Phishing-resistant by design.",
    color: "#8B5CF6",
  },
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description: "All data at rest and in transit is encrypted with AES-256. TLS 1.3 for all API communications.",
    color: "#F59E0B",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Architecture",
    description: "We can't see your biometrics, private keys, or payment PINs. Our architecture is designed so we never have access.",
    color: "#06B6D4",
  },
  {
    icon: Server,
    title: "SOC 2 Type II",
    description: "Independently audited security controls. PCI DSS Level 1 compliant. Regular penetration testing.",
    color: "#EC4899",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, rgba(77,163,255,0.05) 0%, transparent 70%)"
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Security visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card p-8 neon-border">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4">
                  <Shield size={40} className="text-neon-blue" />
                </div>
                <h3 className="text-xl font-bold text-white">Security Architecture</h3>
              </div>

              {/* Flow diagram */}
              <div className="space-y-3">
                {[
                  { label: "Your Device", sublabel: "Biometric + Private Key", color: "#4DA3FF", icon: "📱" },
                  { label: "Secure Enclave", sublabel: "Hardware-isolated TEE", color: "#16C784", icon: "🔒" },
                  { label: "WebAuthn Challenge", sublabel: "Cryptographic signature", color: "#8B5CF6", icon: "🔑" },
                  { label: "Veyra Backend", sublabel: "Public key only", color: "#F59E0B", icon: "☁️" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-white/50">{item.sublabel}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-neon-green/10 border border-neon-green/20">
                <div className="flex items-center gap-2 text-neon-green text-sm font-semibold">
                  <Shield size={14} />
                  Biometric data NEVER leaves your device
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-medium mb-6">
                <Shield size={14} />
                Enterprise Security
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Security that{" "}
                <span className="gradient-text">never compromises</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed">
                Built on the same cryptographic foundations used by the world's
                most secure systems. Your biometrics are yours alone.
              </p>
            </motion.div>

            <div className="grid gap-4">
              {securityFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/3 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                  >
                    <feature.icon size={18} style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
