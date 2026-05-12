"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Fingerprint, ArrowRight, CheckCircle } from "lucide-react";

type LoginStep = "email" | "biometric" | "success";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("biometric");
  };

  const handleBiometricAuth = async () => {
    setAuthenticating(true);
    // Simulate WebAuthn authentication
    await new Promise((r) => setTimeout(r, 2000));
    setAuthenticated(true);
    setAuthenticating(false);
    setTimeout(() => setStep("success"), 600);
  };

  return (
    <div className="min-h-screen bg-veyra-darker flex items-center justify-center p-6">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-hero-gradient" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center shadow-neon-blue">
            <Fingerprint size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Veyra</span>
        </div>

        <div className="glass-card p-8">
          {step === "email" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-white mb-2">Welcome back</h2>
              <p className="text-sm text-white/50 mb-6">Sign in with your biometrics — no password needed.</p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <button type="submit" className="w-full btn-primary text-white flex items-center justify-center gap-2">
                  Continue with Biometrics
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="text-xs text-white/30 text-center mt-4">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-neon-blue hover:underline">Create wallet</Link>
              </p>
            </motion.div>
          )}

          {step === "biometric" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="text-xl font-black text-white mb-2">Authenticate</h2>
              <p className="text-sm text-white/50 mb-2">{email}</p>
              <p className="text-xs text-white/30 mb-8">Use your fingerprint or face to sign in</p>

              <div className="relative w-28 h-28 mx-auto mb-8">
                {[1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: authenticated ? "rgba(22,199,132,0.3)" : "rgba(77,163,255,0.3)" }}
                    animate={authenticating ? { scale: [1, 1 + i * 0.15], opacity: [0.8, 0] } : {}}
                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
                <div
                  className="absolute inset-4 rounded-full flex items-center justify-center"
                  style={{
                    background: authenticated ? "rgba(22,199,132,0.15)" : "rgba(77,163,255,0.15)",
                    border: `2px solid ${authenticated ? "rgba(22,199,132,0.5)" : "rgba(77,163,255,0.5)"}`,
                  }}
                >
                  {authenticated
                    ? <CheckCircle size={32} className="text-neon-green" />
                    : <Fingerprint size={32} className={authenticating ? "text-neon-blue animate-pulse" : "text-neon-blue"} />
                  }
                </div>
              </div>

              {!authenticated && (
                <button
                  onClick={handleBiometricAuth}
                  disabled={authenticating}
                  className="w-full btn-primary text-white flex items-center justify-center gap-2"
                >
                  {authenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Fingerprint size={16} />
                      Touch to Authenticate
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setStep("email")}
                className="text-xs text-white/30 hover:text-white/60 mt-4 block mx-auto transition-colors"
              >
                ← Use different account
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-neon-green/15 border-2 border-neon-green/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-neon-green" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Authenticated!</h2>
              <p className="text-sm text-white/50 mb-6">Redirecting to your dashboard...</p>
              <Link href="/dashboard" className="w-full btn-primary text-white flex items-center justify-center gap-2">
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
