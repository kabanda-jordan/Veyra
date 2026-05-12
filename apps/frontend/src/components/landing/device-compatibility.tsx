"use client";

import { motion } from "framer-motion";

const devices = [
  { name: "iPhone", method: "Face ID / Touch ID", icon: "🍎", supported: true },
  { name: "Android", method: "Fingerprint / Face", icon: "🤖", supported: true },
  { name: "Windows", method: "Windows Hello", icon: "🪟", supported: true },
  { name: "Mac", method: "Touch ID", icon: "💻", supported: true },
  { name: "YubiKey", method: "Hardware Key", icon: "🔑", supported: true },
  { name: "Web Browser", method: "Platform Auth", icon: "🌐", supported: true },
];

export function DeviceCompatibility() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-white mb-4">
            Works on <span className="gradient-text">every device</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Native biometric support across all major platforms and devices.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {devices.map((device, i) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center hover:scale-105 transition-transform duration-200"
            >
              <div className="text-4xl mb-3">{device.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{device.name}</div>
              <div className="text-xs text-white/40">{device.method}</div>
              <div className="mt-3 flex justify-center">
                <span className="badge-success text-xs">Supported</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
