"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Code2, Terminal, BookOpen, Webhook, Key, Copy,
  CheckCircle, Play, ChevronRight, ExternalLink, Zap
} from "lucide-react";

const endpoints = [
  { method: "POST", path: "/api/v1/webauthn/register/options", desc: "Generate registration options" },
  { method: "POST", path: "/api/v1/webauthn/register/verify", desc: "Verify and save credential" },
  { method: "POST", path: "/api/v1/webauthn/authenticate/options", desc: "Generate auth challenge" },
  { method: "POST", path: "/api/v1/webauthn/authenticate/verify", desc: "Verify and issue JWT" },
  { method: "POST", path: "/api/v1/transactions/send", desc: "Send payment" },
  { method: "GET", path: "/api/v1/transactions", desc: "List transactions" },
  { method: "GET", path: "/api/v1/wallet", desc: "Get wallet balances" },
  { method: "POST", path: "/api/v1/merchant/qr", desc: "Generate QR payment code" },
];

const codeExamples: Record<string, string> = {
  register: `// 1. Get registration options from your server
const optionsRes = await fetch('/api/v1/webauthn/register/options', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${token}\` },
});
const options = await optionsRes.json();

// 2. Create credential using browser WebAuthn API
import { startRegistration } from '@simplewebauthn/browser';
const credential = await startRegistration({ optionsJSON: options });

// 3. Verify on your server
const verifyRes = await fetch('/api/v1/webauthn/register/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${token}\`,
  },
  body: JSON.stringify({ response: credential, name: 'My iPhone' }),
});

const { verified } = await verifyRes.json();
console.log('Passkey registered:', verified); // true`,

  authenticate: `// 1. Get authentication options
const optionsRes = await fetch('/api/v1/webauthn/authenticate/options', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' }),
});
const { userId, ...options } = await optionsRes.json();

// 2. Authenticate with biometrics (triggers Touch ID / Face ID)
import { startAuthentication } from '@simplewebauthn/browser';
const assertion = await startAuthentication({ optionsJSON: options });

// 3. Verify and get JWT
const verifyRes = await fetch('/api/v1/webauthn/authenticate/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, response: assertion }),
});

const { accessToken, refreshToken, user } = await verifyRes.json();
// User is now authenticated with biometrics!`,

  payment: `// Send a payment (requires biometric auth first)
const paymentRes = await fetch('/api/v1/transactions/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${accessToken}\`,
  },
  body: JSON.stringify({
    recipientEmail: 'recipient@example.com',
    amount: 49.99,
    currency: 'USD',
    description: 'Coffee payment',
    authMethod: 'webauthn',
  }),
});

const { transaction } = await paymentRes.json();
console.log('Payment sent:', transaction.reference);
// { reference: 'txn_abc123', status: 'COMPLETED', ... }`,

  qr: `// Generate a QR payment code (merchant)
const qrRes = await fetch('/api/v1/merchant/qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${merchantToken}\`,
  },
  body: JSON.stringify({
    amount: 24.99,
    currency: 'USD',
    description: 'Table 7 order',
    isOneTime: true,
    expiresInMinutes: 10,
  }),
});

const { qrCode } = await qrRes.json();
// Render qrCode.data as a QR code image
// Customer scans → authenticates with biometrics → payment done`,
};

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState<"register" | "authenticate" | "payment" | "qr">("register");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-veyra-darker">
      {/* Header */}
      <div className="border-b border-veyra-border bg-veyra-surface/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Veyra Developer Portal</span>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary text-white text-sm">API Keys</button>
            <button className="btn-primary text-white text-sm">Sandbox</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-medium mb-4">
            <Zap size={12} />
            v1.0 · REST API · TypeScript SDK
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Build with <span className="gradient-text">biometric payments</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            Add WebAuthn-powered biometric payments to your app in under an hour.
            Full TypeScript support, comprehensive docs, and a sandbox environment.
          </p>
        </motion.div>

        {/* Quick start cards */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { icon: Terminal, label: "Quick Start", desc: "Up in 5 minutes", color: "#4DA3FF" },
            { icon: BookOpen, label: "API Reference", desc: "Full endpoint docs", color: "#16C784" },
            { icon: Code2, label: "TypeScript SDK", desc: "npm install veyra-sdk", color: "#8B5CF6" },
            { icon: Webhook, label: "Webhooks", desc: "Real-time events", color: "#F59E0B" },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 cursor-pointer hover:scale-[1.02] transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}15` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="text-sm font-bold text-white mb-1">{item.label}</div>
              <div className="text-xs text-white/40">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Code examples */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Examples</div>
            {(["register", "authenticate", "payment", "qr"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/25"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab === "register" ? "Register Passkey" :
                 tab === "authenticate" ? "Biometric Login" :
                 tab === "payment" ? "Send Payment" : "QR Payment"}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="lg:col-span-4 glass-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-veyra-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-white/30 font-mono">example.ts</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                {copied ? <CheckCircle size={13} className="text-neon-green" /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="p-6 text-xs font-mono text-neon-blue/90 overflow-x-auto leading-relaxed max-h-96 overflow-y-auto">
              <code>{codeExamples[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-5">API Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-all cursor-pointer group">
                <span className={`text-xs font-bold px-2 py-1 rounded font-mono flex-shrink-0 ${
                  ep.method === "GET" ? "bg-neon-green/15 text-neon-green" :
                  ep.method === "POST" ? "bg-neon-blue/15 text-neon-blue" :
                  "bg-yellow-400/15 text-yellow-400"
                }`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-white/80 flex-1">{ep.path}</code>
                <span className="text-xs text-white/40 hidden md:block">{ep.desc}</span>
                <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* API Key section */}
        <div className="glass-card p-6 neon-border">
          <div className="flex items-center gap-3 mb-4">
            <Key size={18} className="text-neon-blue" />
            <h3 className="text-base font-bold text-white">Your API Keys</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Test Secret Key", key: "sk_test_veyra_••••••••••••••••••••••••••••••••" },
              { label: "Live Secret Key", key: "sk_live_veyra_••••••••••••••••••••••••••••••••" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="flex-1">
                  <div className="text-xs text-white/40 mb-1">{item.label}</div>
                  <code className="text-sm font-mono text-white/70">{item.key}</code>
                </div>
                <button className="text-white/30 hover:text-white transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-3">
            Keep your secret keys secure. Never expose them in client-side code.
          </p>
        </div>
      </div>
    </div>
  );
}
