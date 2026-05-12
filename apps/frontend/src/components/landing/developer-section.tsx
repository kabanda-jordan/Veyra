"use client";

import { motion } from "framer-motion";
import { Code2, Terminal, BookOpen, Webhook } from "lucide-react";
import Link from "next/link";

const codeExample = `// Register biometric credential
const credential = await startRegistration({
  optionsJSON: await fetch('/api/auth/register/options')
    .then(r => r.json()),
});

// Verify on server
const verification = await verifyRegistrationResponse({
  response: credential,
  expectedChallenge,
  expectedOrigin: 'https://yourapp.com',
  expectedRPID: 'yourapp.com',
});

// Payment with biometrics
const assertion = await startAuthentication({
  optionsJSON: await fetch('/api/auth/login/options')
    .then(r => r.json()),
});

// Process payment
await fetch('/api/payments/send', {
  method: 'POST',
  body: JSON.stringify({
    assertion,
    amount: 2499,
    currency: 'USD',
    recipient: 'user_abc123',
  }),
});`;

export function DeveloperSection() {
  return (
    <section id="developers" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Code block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-veyra-border">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-white/30 font-mono">veyra-payment.ts</span>
              </div>
              <pre className="p-6 text-xs font-mono text-neon-blue/90 overflow-x-auto leading-relaxed">
                <code>{codeExample}</code>
              </pre>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm font-medium mb-6">
              <Code2 size={14} />
              Developer API
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Built for{" "}
              <span className="gradient-text-blue">developers</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Clean REST APIs, TypeScript SDKs, and comprehensive documentation.
              Add biometric payments to your app in under an hour.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Terminal, label: "REST API", desc: "OpenAPI 3.0 spec" },
                { icon: Code2, label: "TypeScript SDK", desc: "Full type safety" },
                { icon: BookOpen, label: "Docs", desc: "Guides & references" },
                { icon: Webhook, label: "Webhooks", desc: "Real-time events" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4">
                  <item.icon size={18} className="text-neon-blue mb-2" />
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-white/40">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Link href="/developers" className="btn-primary text-white text-sm">
                View Docs
              </Link>
              <Link href="/developers/sandbox" className="btn-secondary text-white text-sm">
                Try Sandbox
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
