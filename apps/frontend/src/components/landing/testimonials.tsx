"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, NovaPay",
    avatar: "SC",
    content: "Veyra's WebAuthn integration is the cleanest I've seen. We went from 12% payment abandonment to under 2% after switching. The biometric UX is just magical.",
    rating: 5,
    color: "#4DA3FF",
  },
  {
    name: "Marcus Williams",
    role: "Head of Payments, Retail Corp",
    avatar: "MW",
    content: "Our checkout conversion jumped 34% in the first month. Customers love not having to remember passwords or carry cards. The QR payment system is brilliant.",
    rating: 5,
    color: "#16C784",
  },
  {
    name: "Priya Sharma",
    role: "Security Engineer, FinBank",
    avatar: "PS",
    content: "The zero-knowledge architecture is exactly what we needed for compliance. Biometric data never leaving the device is a game-changer for our security posture.",
    rating: 5,
    color: "#8B5CF6",
  },
  {
    name: "James O'Brien",
    role: "Founder, QuickMerchant",
    avatar: "JO",
    content: "Setup took 20 minutes. The developer API is incredibly well-documented. We had biometric payments live in our app the same day we signed up.",
    rating: 5,
    color: "#F59E0B",
  },
  {
    name: "Aiko Tanaka",
    role: "Product Lead, TechPay",
    avatar: "AT",
    content: "The fraud detection caught 3 suspicious transactions in our first week that our old system missed. The AI-powered risk scoring is genuinely impressive.",
    rating: 5,
    color: "#06B6D4",
  },
  {
    name: "David Okonkwo",
    role: "VP Engineering, GlobalWallet",
    avatar: "DO",
    content: "We evaluated 8 biometric payment providers. Veyra was the only one with true FIDO2 compliance, a clean API, and a design system that didn't look like 2015.",
    rating: 5,
    color: "#EC4899",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Loved by <span className="gradient-text">builders</span>
          </h2>
          <p className="text-white/50">Trusted by 4,200+ companies worldwide</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
