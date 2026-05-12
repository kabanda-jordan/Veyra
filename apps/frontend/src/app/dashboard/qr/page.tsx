"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QrCode, Camera, Fingerprint, CheckCircle, RefreshCw } from "lucide-react";

export default function QRPayPage() {
  const [mode, setMode] = useState<"scan" | "receive">("scan");
  const [scanning, setScanning] = useState(false);
  const [paymentFound, setPaymentFound] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [paid, setPaid] = useState(false);

  const simulateScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setScanning(false);
    setPaymentFound(true);
  };

  const handlePay = async () => {
    setAuthenticating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setAuthenticating(false);
    setPaid(true);
  };

  const reset = () => {
    setScanning(false);
    setPaymentFound(false);
    setAuthenticating(false);
    setPaid(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">QR Payment</h1>
        <p className="text-sm text-white/40 mt-1">Scan to pay or show your QR to receive</p>
      </motion.div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 rounded-xl bg-veyra-surface border border-veyra-border">
        {(["scan", "receive"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              mode === m ? "bg-neon-blue/20 text-neon-blue" : "text-white/50 hover:text-white"
            }`}
          >
            {m === "scan" ? "Scan to Pay" : "Receive Payment"}
          </button>
        ))}
      </div>

      {mode === "scan" && (
        <div className="glass-card p-6">
          {!paymentFound && !paid && (
            <div className="text-center">
              {/* Camera viewfinder */}
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden bg-black/40 border border-veyra-border">
                {scanning ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-neon-blue/50 rounded-xl" />
                    </div>
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-8 right-8 h-0.5 bg-neon-blue"
                      style={{ boxShadow: "0 0 10px #4DA3FF" }}
                      animate={{ top: ["10%", "90%"] }}
                      transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={32} className="text-white/20" />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Camera size={40} className="text-white/20" />
                    <span className="text-xs text-white/30">Camera preview</span>
                  </div>
                )}

                {/* Corner markers */}
                {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-6 h-6 border-neon-blue`}
                    style={{
                      borderTopWidth: pos.includes("top") ? "2px" : "0",
                      borderBottomWidth: pos.includes("bottom") ? "2px" : "0",
                      borderLeftWidth: pos.includes("left") ? "2px" : "0",
                      borderRightWidth: pos.includes("right") ? "2px" : "0",
                    }}
                  />
                ))}
              </div>

              <button
                onClick={simulateScan}
                disabled={scanning}
                className="w-full btn-primary text-white flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    Start Camera
                  </>
                )}
              </button>
            </div>
          )}

          {paymentFound && !paid && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4">
                <QrCode size={24} className="text-neon-blue" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Payment Request Found</h3>
              <div className="glass-card p-4 my-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Merchant</span>
                  <span className="text-white font-semibold">Veyra Coffee Co.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Amount</span>
                  <span className="text-white font-bold text-lg">$24.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Description</span>
                  <span className="text-white/70">Table 7 order</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 btn-secondary text-white text-sm">Cancel</button>
                <button
                  onClick={handlePay}
                  disabled={authenticating}
                  className="flex-1 btn-primary text-white text-sm flex items-center justify-center gap-2"
                >
                  {authenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint size={14} />
                      Pay $24.99
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {paid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 rounded-full bg-neon-green/15 border-2 border-neon-green/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-neon-green" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">Payment Complete!</h3>
              <p className="text-sm text-white/50 mb-1">$24.99 paid to Veyra Coffee Co.</p>
              <p className="text-xs text-white/30 mb-6">Authenticated with biometrics · 0.21s</p>
              <button onClick={reset} className="btn-secondary text-white text-sm flex items-center gap-2 mx-auto">
                <RefreshCw size={14} />
                Scan Another
              </button>
            </motion.div>
          )}
        </div>
      )}

      {mode === "receive" && (
        <div className="glass-card p-6 text-center">
          <h3 className="text-base font-bold text-white mb-2">Your Payment QR</h3>
          <p className="text-sm text-white/40 mb-6">Show this to receive payments</p>

          <div className="w-52 h-52 mx-auto mb-4 rounded-2xl bg-white p-4">
            <div className="w-full h-full grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="rounded-sm" style={{ background: Math.random() > 0.5 ? "#050508" : "transparent" }} />
              ))}
            </div>
          </div>

          <div className="text-sm font-mono text-white/50 mb-4">veyra://pay/john.doe@example.com</div>

          <div className="flex gap-3 justify-center">
            <button className="btn-secondary text-white text-sm">Share</button>
            <button className="btn-primary text-white text-sm">Request Amount</button>
          </div>
        </div>
      )}
    </div>
  );
}
