"use client";

import { motion } from "framer-motion";
import { UserPlus, Fingerprint, Send, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Wallet",
    description: "Sign up in 60 seconds. No credit checks, no paperwork. Just your email and biometrics.",
    step: "01",
  },
  {
    icon: Fingerprint,
    title: "Register Biometrics",
    description: "Enroll your fingerprint or face using your device's native biometric system. Data stays on-device.",
    step: "02",
  },
  {
    icon: Send,
    title: "Start Paying",
    description: "Tap to pay at merchants, send money to friends, or scan QR codes. Authenticate with your fingerprint.",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Track Everything",
    description: "Real-time transaction history, spending analytics, and security insights in your dashboard.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Get started in minutes. No complex setup, no learning curve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-neon-blue/30 to-transparent" />
              )}

              <div className="glass-card p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center text-xs font-bold text-neon-blue">
                  {step.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.icon size={28} className="text-neon-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
