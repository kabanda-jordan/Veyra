"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is my biometric data stored on Veyra's servers?",
    a: "No. Your biometric data (fingerprint, face scan) never leaves your device. We use WebAuthn/FIDO2 which means only a cryptographic public key is stored on our servers. Your private key and biometric data stay in your device's Secure Enclave or Trusted Execution Environment.",
  },
  {
    q: "What happens if I lose my phone?",
    a: "Your wallet is protected by your account credentials and can be recovered via email verification. You can remotely deactivate lost devices from any other trusted device or via our web portal. New devices require re-enrollment of biometrics.",
  },
  {
    q: "Which devices and browsers are supported?",
    a: "Veyra supports all modern devices with biometric capabilities: iPhone (Face ID/Touch ID), Android (fingerprint/face), Windows (Windows Hello), and Mac (Touch ID). Browser support includes Chrome, Safari, Firefox, and Edge.",
  },
  {
    q: "How fast are payments processed?",
    a: "Biometric authentication takes under 200ms. Payment settlement is near-instant for Veyra-to-Veyra transfers. Bank transfers typically settle within 1-2 business days depending on your region.",
  },
  {
    q: "Is Veyra regulated and compliant?",
    a: "Yes. Veyra is PCI DSS Level 1 compliant, SOC 2 Type II certified, and operates under appropriate financial regulations in each jurisdiction. We partner with licensed payment processors and banking institutions.",
  },
  {
    q: "Can I use Veyra for my business?",
    a: "Absolutely. Our Business and Enterprise plans include merchant dashboards, QR code generation, settlement reports, team management, and full API access. Many businesses use Veyra as their primary payment infrastructure.",
  },
  {
    q: "What currencies are supported?",
    a: "Veyra supports 50+ currencies with real-time FX rates. Multi-currency wallets let you hold and transact in different currencies. International transfers are available to 190+ countries.",
  },
  {
    q: "How does fraud detection work?",
    a: "Our AI-powered fraud engine analyzes transaction patterns, device fingerprints, geolocation, and velocity in real-time. Suspicious transactions are flagged and may require additional verification. You receive instant alerts for any unusual activity.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-white/40 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-sm text-white/60 leading-relaxed border-t border-veyra-border pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
