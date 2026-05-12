"use client";

import { motion } from "framer-motion";
import { QrCode, Smartphone, CheckCircle, Zap } from "lucide-react";

export function QRPaymentSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-sm font-medium mb-6">
                <QrCode size={14} />
                QR Payments
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Scan. Touch.{" "}
                <span className="gradient-text">Paid.</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-8">
                Merchants display a QR code. You scan it with Veyra, authenticate
                with your fingerprint, and the payment is done in under a second.
                No card, no PIN, no NFC required.
              </p>

              <div className="space-y-4">
                {[
                  { icon: QrCode, text: "Merchant generates dynamic QR code" },
                  { icon: Smartphone, text: "Customer scans with Veyra app" },
                  { icon: CheckCircle, text: "Biometric authentication confirms payment" },
                  { icon: Zap, text: "Settlement in under 200ms" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-neon-blue" />
                    </div>
                    <span className="text-sm text-white/70">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* QR Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="glass-card p-8 w-80 text-center neon-border">
              <div className="text-sm text-white/50 mb-4">Merchant Payment Request</div>
              <div className="text-2xl font-black text-white mb-6">$24.99</div>

              {/* QR Code placeholder */}
              <div className="w-48 h-48 mx-auto mb-6 rounded-2xl bg-white p-3 relative overflow-hidden">
                <div className="w-full h-full grid grid-cols-7 gap-0.5">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-sm"
                      style={{
                        background: Math.random() > 0.5 ? "#050508" : "transparent",
                      }}
                    />
                  ))}
                </div>
                {/* Corner markers */}
                {[
                  "top-2 left-2",
                  "top-2 right-2",
                  "bottom-2 left-2",
                ].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute ${pos} w-10 h-10 border-4 border-veyra-dark rounded-sm`}
                  >
                    <div className="w-4 h-4 bg-veyra-dark rounded-sm m-auto mt-1" />
                  </div>
                ))}
              </div>

              <div className="text-xs text-white/40 mb-4">Scan with Veyra to pay</div>

              <div className="flex items-center justify-center gap-2 text-neon-green text-xs font-semibold">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Waiting for payment...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
