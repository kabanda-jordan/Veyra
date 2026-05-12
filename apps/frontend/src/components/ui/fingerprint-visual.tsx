"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Shield, Zap } from "lucide-react";

export function FingerprintVisual() {
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setVerified(false);
      setScanning(false);
      setTimeout(() => setScanning(true), 500);
      setTimeout(() => {
        setScanning(false);
        setVerified(true);
      }, 2500);
      setTimeout(() => {
        setVerified(false);
      }, 5000);
    };

    cycle();
    const interval = setInterval(cycle, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-80 h-80 lg:w-96 lg:h-96">
      {/* Outer glow rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: verified
              ? `rgba(22, 199, 132, ${0.3 / i})`
              : `rgba(77, 163, 255, ${0.3 / i})`,
          }}
          animate={{
            scale: [1, 1 + i * 0.08],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Main circle */}
      <motion.div
        className="absolute inset-8 rounded-full flex items-center justify-center"
        style={{
          background: verified
            ? "radial-gradient(circle, rgba(22,199,132,0.15), rgba(22,199,132,0.05))"
            : "radial-gradient(circle, rgba(77,163,255,0.15), rgba(77,163,255,0.05))",
          border: `2px solid ${verified ? "rgba(22,199,132,0.4)" : "rgba(77,163,255,0.4)"}`,
          boxShadow: verified
            ? "0 0 40px rgba(22,199,132,0.3), inset 0 0 40px rgba(22,199,132,0.1)"
            : "0 0 40px rgba(77,163,255,0.3), inset 0 0 40px rgba(77,163,255,0.1)",
        }}
        animate={{
          boxShadow: scanning
            ? [
                "0 0 20px rgba(77,163,255,0.2)",
                "0 0 60px rgba(77,163,255,0.5)",
                "0 0 20px rgba(77,163,255,0.2)",
              ]
            : undefined,
        }}
        transition={{ duration: 1, repeat: scanning ? Infinity : 0 }}
      >
        {/* Fingerprint SVG */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Fingerprint lines */}
            {[
              "M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C70 85, 85 70, 85 50 C85 30, 70 15, 50 15",
              "M50 22 C34 22, 22 34, 22 50 C22 66, 34 78, 50 78 C66 78, 78 66, 78 50 C78 34, 66 22, 50 22",
              "M50 29 C38 29, 29 38, 29 50 C29 62, 38 71, 50 71 C62 71, 71 62, 71 50 C71 38, 62 29, 50 29",
              "M50 36 C42 36, 36 42, 36 50 C36 58, 42 64, 50 64 C58 64, 64 58, 64 50 C64 42, 58 36, 50 36",
              "M50 43 C46 43, 43 46, 43 50 C43 54, 46 57, 50 57 C54 57, 57 54, 57 50 C57 46, 54 43, 50 43",
              // Arch lines
              "M25 35 C30 25, 40 20, 50 20",
              "M75 35 C70 25, 60 20, 50 20",
              "M20 55 C20 45, 22 38, 25 35",
              "M80 55 C80 45, 78 38, 75 35",
              // Inner details
              "M35 65 C32 60, 30 55, 30 50",
              "M65 65 C68 60, 70 55, 70 50",
              "M40 72 C36 68, 34 63, 34 57",
              "M60 72 C64 68, 66 63, 66 57",
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke={verified ? "#16C784" : "#4DA3FF"}
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, delay: i * 0.05, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Scan line */}
          {scanning && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-full"
              style={{ clipPath: "circle(50%)" }}
            >
              <motion.div
                className="absolute left-0 right-0 h-0.5 opacity-80"
                style={{
                  background: "linear-gradient(90deg, transparent, #4DA3FF, transparent)",
                  boxShadow: "0 0 10px #4DA3FF",
                }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              />
            </motion.div>
          )}

          {/* Verified checkmark */}
          {verified && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center justify-center">
                <CheckCircle size={24} className="text-neon-green" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Status label */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-semibold"
        style={{
          background: verified ? "rgba(22,199,132,0.15)" : "rgba(77,163,255,0.15)",
          border: `1px solid ${verified ? "rgba(22,199,132,0.3)" : "rgba(77,163,255,0.3)"}`,
          color: verified ? "#16C784" : "#4DA3FF",
        }}
      >
        {scanning ? "Scanning..." : verified ? "✓ Identity Verified" : "Touch to Pay"}
      </motion.div>

      {/* Floating info cards */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-8 top-1/3 glass-card px-3 py-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <Shield size={12} className="text-neon-green" />
          <span className="text-white/70">FIDO2 Secured</span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -right-8 top-1/2 glass-card px-3 py-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-neon-blue" />
          <span className="text-white/70">0.18s auth</span>
        </div>
      </motion.div>
    </div>
  );
}
