"use client";

import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Personal",
    price: "Free",
    period: "",
    description: "For individuals who want to experience biometric payments.",
    features: [
      "1 wallet",
      "Up to $10,000/month",
      "Biometric authentication",
      "QR payments",
      "Transaction history",
      "Basic analytics",
      "Email support",
    ],
    cta: "Open Free Wallet",
    href: "/auth/register",
    highlighted: false,
    color: "#4DA3FF",
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For growing businesses that need merchant capabilities.",
    features: [
      "Unlimited wallets",
      "Up to $500,000/month",
      "Merchant dashboard",
      "QR code generator",
      "Advanced analytics",
      "Webhook integrations",
      "API access",
      "Team management (5 seats)",
      "Priority support",
      "Fraud detection",
    ],
    cta: "Start Free Trial",
    href: "/auth/register?plan=business",
    highlighted: true,
    color: "#16C784",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom compliance needs.",
    features: [
      "Everything in Business",
      "Unlimited volume",
      "Custom integrations",
      "Dedicated infrastructure",
      "SLA guarantees",
      "SOC 2 reports",
      "Custom fraud rules",
      "Unlimited team seats",
      "24/7 dedicated support",
      "On-premise option",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
    color: "#8B5CF6",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Simple <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            No hidden fees. No per-transaction charges on the Personal plan.
            Scale as you grow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card p-8 ${plan.highlighted ? "scale-105" : ""}`}
              style={{
                borderColor: plan.highlighted ? `${plan.color}40` : undefined,
                boxShadow: plan.highlighted ? `0 0 40px ${plan.color}20` : undefined,
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}99)` }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="text-sm font-semibold text-white/50 mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${plan.color}20` }}
                    >
                      <Check size={11} style={{ color: plan.color }} />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.href}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? "text-white"
                    : "border border-veyra-border text-white/70 hover:text-white hover:border-white/20"
                }`}
                style={
                  plan.highlighted
                    ? {
                        background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                        boxShadow: `0 0 20px ${plan.color}40`,
                      }
                    : undefined
                }
              >
                {plan.highlighted && <Zap size={14} />}
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
