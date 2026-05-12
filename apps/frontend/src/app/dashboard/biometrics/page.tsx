"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Fingerprint, Plus, Trash2, CheckCircle, Shield,
  Smartphone, Monitor, Key, AlertTriangle, RefreshCw
} from "lucide-react";

const credentials = [
  {
    id: "cred_1",
    name: "iPhone 16 Pro — Face ID",
    device: "iPhone 16 Pro",
    type: "platform",
    created: "Jan 15, 2026",
    lastUsed: "Today",
    icon: Smartphone,
    active: true,
  },
  {
    id: "cred_2",
    name: "MacBook Pro — Touch ID",
    device: "MacBook Pro M4",
    type: "platform",
    created: "Feb 3, 2026",
    lastUsed: "2 hours ago",
    icon: Monitor,
    active: true,
  },
  {
    id: "cred_3",
    name: "YubiKey 5C",
    device: "Hardware Key",
    type: "cross-platform",
    created: "Mar 20, 2026",
    lastUsed: "1 week ago",
    icon: Key,
    active: true,
  },
];

export default function BiometricsPage() {
  const [registering, setRegistering] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success">("idle");

  const handleRegister = async () => {
    setRegistering(true);
    setScanState("scanning");
    // Simulate WebAuthn registration
    await new Promise((r) => setTimeout(r, 2500));
    setScanState("success");
    await new Promise((r) => setTimeout(r, 1500));
    setRegistering(false);
    setScanState("idle");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Biometrics & Passkeys</h1>
        <p className="text-sm text-white/40 mt-1">Manage your WebAuthn credentials and biometric enrollments</p>
      </motion.div>

      {/* Security info banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 neon-border-green"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-green/15 border border-neon-green/30 flex items-center justify-center flex-shrink-0">
            <Shield size={18} className="text-neon-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Your biometrics are safe</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Biometric data is processed entirely on your device using the Secure Enclave or TEE.
              Veyra only stores your public key — we can never access your fingerprint or face data.
              This is enforced by the WebAuthn/FIDO2 protocol.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Registered credentials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Registered Credentials</h3>
            <p className="text-xs text-white/40 mt-0.5">{credentials.length} passkeys enrolled</p>
          </div>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="btn-primary text-white text-xs flex items-center gap-2"
          >
            <Plus size={14} />
            Add Passkey
          </button>
        </div>

        <div className="space-y-3">
          {credentials.map((cred, i) => (
            <motion.div
              key={cred.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-neon-blue/20 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center flex-shrink-0">
                <cred.icon size={18} className="text-neon-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{cred.name}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {cred.type === "platform" ? "Platform authenticator" : "Cross-platform key"} ·
                  Added {cred.created} · Last used {cred.lastUsed}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge-success">Active</span>
                <button className="w-8 h-8 rounded-lg border border-veyra-border flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Registration modal */}
      {registering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 w-80 text-center neon-border"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Rings */}
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: scanState === "success" ? "rgba(22,199,132,0.4)" : "rgba(77,163,255,0.4)" }}
                  animate={{ scale: [1, 1 + i * 0.15], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
              <div
                className="absolute inset-4 rounded-full flex items-center justify-center"
                style={{
                  background: scanState === "success" ? "rgba(22,199,132,0.15)" : "rgba(77,163,255,0.15)",
                  border: `2px solid ${scanState === "success" ? "rgba(22,199,132,0.5)" : "rgba(77,163,255,0.5)"}`,
                }}
              >
                {scanState === "success" ? (
                  <CheckCircle size={28} className="text-neon-green" />
                ) : (
                  <Fingerprint size={28} className="text-neon-blue" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {scanState === "scanning" ? "Touch your fingerprint sensor" : "Passkey registered!"}
            </h3>
            <p className="text-sm text-white/50">
              {scanState === "scanning"
                ? "Follow your device's biometric prompt to register your passkey."
                : "Your new passkey has been securely enrolled."}
            </p>

            {scanState === "scanning" && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
                <RefreshCw size={12} className="animate-spin" />
                Waiting for biometric...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* WebAuthn info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-base font-bold text-white mb-4">How WebAuthn Works</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Registration",
              desc: "Your device generates a public/private key pair. The private key stays in your Secure Enclave.",
              color: "#4DA3FF",
            },
            {
              step: "2",
              title: "Challenge",
              desc: "When you pay, Veyra sends a cryptographic challenge that only your private key can sign.",
              color: "#16C784",
            },
            {
              step: "3",
              title: "Verification",
              desc: "We verify the signature using your stored public key. No biometric data is ever transmitted.",
              color: "#8B5CF6",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl"
              style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white mb-3"
                style={{ background: `${item.color}25` }}
              >
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
