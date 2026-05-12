"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Send, Fingerprint, CheckCircle, Search, ArrowRight, X } from "lucide-react";

type SendStep = "recipient" | "amount" | "confirm" | "biometric" | "success";

const recentContacts = [
  { name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ", color: "#4DA3FF" },
  { name: "Mike Chen", email: "mike@example.com", avatar: "MC", color: "#16C784" },
  { name: "Emma Davis", email: "emma@example.com", avatar: "ED", color: "#8B5CF6" },
  { name: "Alex Kim", email: "alex@example.com", avatar: "AK", color: "#F59E0B" },
];

export default function SendMoneyPage() {
  const [step, setStep] = useState<SendStep>("recipient");
  const [recipient, setRecipient] = useState<typeof recentContacts[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [authenticating, setAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    setAuthenticating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAuthenticating(false);
    setStep("success");
  };

  return (
    <div className="max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-6">Send Money</h1>
      </motion.div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {(["recipient", "amount", "confirm", "biometric"] as SendStep[]).map((s, i) => {
          const steps: SendStep[] = ["recipient", "amount", "confirm", "biometric", "success"];
          const currentIdx = steps.indexOf(step);
          const stepIdx = steps.indexOf(s);
          const isDone = currentIdx > stepIdx;
          const isCurrent = step === s;

          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone ? "bg-neon-green text-white" :
                isCurrent ? "bg-neon-blue text-white" :
                "bg-white/10 text-white/30"
              }`}>
                {isDone ? "✓" : i + 1}
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 rounded ${isDone ? "bg-neon-green" : "bg-white/10"}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "recipient" && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6 space-y-5"
          >
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Who are you sending to?</h2>
              <p className="text-sm text-white/40">Search by email or wallet address</p>
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" placeholder="Email or wallet address" className="input-field pl-9" />
            </div>

            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent</div>
              <div className="space-y-2">
                {recentContacts.map((contact) => (
                  <button
                    key={contact.email}
                    onClick={() => { setRecipient(contact); setStep("amount"); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `${contact.color}30`, border: `1px solid ${contact.color}40` }}
                    >
                      {contact.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{contact.name}</div>
                      <div className="text-xs text-white/40">{contact.email}</div>
                    </div>
                    <ArrowRight size={14} className="text-white/20 ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "amount" && recipient && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white"
                style={{ background: `${recipient.color}30`, border: `1px solid ${recipient.color}40` }}
              >
                {recipient.avatar}
              </div>
              <div>
                <div className="text-base font-bold text-white">{recipient.name}</div>
                <div className="text-sm text-white/40">{recipient.email}</div>
              </div>
              <button onClick={() => setStep("recipient")} className="ml-auto text-white/30 hover:text-white/60">
                <X size={16} />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="text-xs text-white/40 mb-2">Amount (USD)</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-black text-white/30">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-5xl font-black text-white bg-transparent outline-none w-40 text-center"
                  placeholder="0"
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="text-xs text-white/30 mt-2">Available: $12,847.50</div>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 justify-center">
              {["10", "25", "50", "100"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-veyra-border text-white/50 hover:text-white hover:border-neon-blue/30 transition-all"
                >
                  ${v}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field"
                placeholder="What's this for?"
              />
            </div>

            <button
              onClick={() => setStep("confirm")}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full btn-primary text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === "confirm" && recipient && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6 space-y-5"
          >
            <h2 className="text-lg font-bold text-white">Confirm payment</h2>

            <div className="space-y-3">
              {[
                { label: "To", value: `${recipient.name} (${recipient.email})` },
                { label: "Amount", value: `$${parseFloat(amount).toFixed(2)} USD` },
                { label: "Fee", value: `$${(parseFloat(amount) * 0.005).toFixed(2)} (0.5%)` },
                { label: "Total", value: `$${(parseFloat(amount) * 1.005).toFixed(2)} USD` },
                { label: "Note", value: note || "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-veyra-border last:border-0">
                  <span className="text-sm text-white/50">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.label === "Total" ? "text-white" : "text-white/80"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-neon-blue/8 border border-neon-blue/20 text-xs text-neon-blue">
              You'll authenticate this payment with your biometrics
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("amount")} className="flex-1 btn-secondary text-white text-sm">
                Back
              </button>
              <button onClick={() => setStep("biometric")} className="flex-1 btn-primary text-white text-sm flex items-center justify-center gap-2">
                <Fingerprint size={14} />
                Authenticate & Send
              </button>
            </div>
          </motion.div>
        )}

        {step === "biometric" && (
          <motion.div
            key="biometric"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-8 text-center neon-border"
          >
            <div className="relative w-28 h-28 mx-auto mb-6">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-neon-blue/30"
                  animate={authenticating ? { scale: [1, 1 + i * 0.15], opacity: [0.8, 0] } : {}}
                  transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
              <div className="absolute inset-4 rounded-full bg-neon-blue/15 border-2 border-neon-blue/50 flex items-center justify-center">
                <Fingerprint size={36} className={authenticating ? "text-neon-blue animate-pulse" : "text-neon-blue"} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Authorize Payment</h3>
            <p className="text-sm text-white/50 mb-2">
              Sending <span className="text-white font-semibold">${parseFloat(amount).toFixed(2)}</span> to {recipient?.name}
            </p>
            <p className="text-xs text-white/30 mb-8">Touch your fingerprint sensor or use Face ID</p>

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
                  Authenticate to Send
                </>
              )}
            </button>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-neon-green/15 border-2 border-neon-green/40 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-neon-green" />
            </motion.div>
            <h3 className="text-2xl font-black text-white mb-2">Payment Sent!</h3>
            <p className="text-sm text-white/50 mb-1">
              ${parseFloat(amount).toFixed(2)} sent to {recipient?.name}
            </p>
            <p className="text-xs text-white/30 mb-8">Authenticated with biometrics · 0.18s</p>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("recipient"); setAmount(""); setRecipient(null); setNote(""); }}
                className="flex-1 btn-secondary text-white text-sm"
              >
                Send Another
              </button>
              <button className="flex-1 btn-primary text-white text-sm">
                View Receipt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
