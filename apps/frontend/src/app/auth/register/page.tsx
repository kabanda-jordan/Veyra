"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Fingerprint, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";

type Step = "account" | "biometric" | "success";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("account");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("biometric");
  };

  const handleBiometricEnroll = async () => {
    setEnrolling(true);
    // Simulate WebAuthn registration
    await new Promise((r) => setTimeout(r, 2500));
    setEnrolled(true);
    setEnrolling(false);
    setTimeout(() => setStep("success"), 800);
  };

  return (
    <div className="min-h-screen bg-veyra-darker flex items-center justify-center p-6">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-hero-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center shadow-neon-blue">
            <Fingerprint size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Veyra</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {(["account", "biometric", "success"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s ? "bg-neon-blue text-white" :
                (["account", "biometric", "success"].indexOf(step) > i) ? "bg-neon-green text-white" :
                "bg-white/10 text-white/30"
              }`}>
                {(["account", "biometric", "success"].indexOf(step) > i) ? "✓" : i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 rounded ${
                (["account", "biometric", "success"].indexOf(step) > i) ? "bg-neon-green" : "bg-white/10"
              }`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {step === "account" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-white mb-2">Create your wallet</h2>
              <p className="text-sm text-white/50 mb-6">No passwords needed — you'll use biometrics.</p>

              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">First name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-field"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1.5 block">Last name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <button type="submit" className="w-full btn-primary text-white flex items-center justify-center gap-2 mt-2">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="text-xs text-white/30 text-center mt-4">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-neon-blue hover:underline">Sign in</Link>
              </p>
            </motion.div>
          )}

          {step === "biometric" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="text-2xl font-black text-white mb-2">Register your biometrics</h2>
              <p className="text-sm text-white/50 mb-8">
                Your fingerprint or face will be used to authenticate payments.
                This data never leaves your device.
              </p>

              {/* Fingerprint visual */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-neon-blue/30"
                    animate={enrolling ? { scale: [1, 1 + i * 0.15], opacity: [0.8, 0] } : {}}
                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
                <div className={`absolute inset-4 rounded-full flex items-center justify-center transition-all ${
                  enrolled
                    ? "bg-neon-green/15 border-2 border-neon-green/50"
                    : "bg-neon-blue/15 border-2 border-neon-blue/50"
                }`}>
                  {enrolled
                    ? <CheckCircle size={32} className="text-neon-green" />
                    : <Fingerprint size={32} className={enrolling ? "text-neon-blue animate-pulse" : "text-neon-blue"} />
                  }
                </div>
              </div>

              {!enrolled && (
                <button
                  onClick={handleBiometricEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary text-white flex items-center justify-center gap-2"
                >
                  {enrolling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enrolling biometrics...
                    </>
                  ) : (
                    <>
                      <Fingerprint size={16} />
                      Enroll Biometrics
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-white/30 mt-4">
                Uses your device's Secure Enclave · FIDO2 certified
              </p>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-neon-green/15 border-2 border-neon-green/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-neon-green" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Welcome to Veyra!</h2>
              <p className="text-sm text-white/50 mb-8">
                Your wallet is ready. You can now pay with your fingerprint.
              </p>
              <Link href="/dashboard" className="w-full btn-primary text-white flex items-center justify-center gap-2">
                Open Dashboard
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
