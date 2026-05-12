import Link from "next/link";
import { Fingerprint, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  Product: ["Wallet", "Payments", "Security", "Analytics", "Mobile App"],
  Developers: ["API Docs", "SDK", "Webhooks", "Sandbox", "Status"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-veyra-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center">
                <Fingerprint size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">Veyra</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              The future of payments is your fingerprint. Secure, instant, and
              passwordless biometric payments for everyone.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-veyra-border flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">
                {category}
              </div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-veyra-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/30">
            © 2026 Veyra Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span>PCI DSS Level 1</span>
            <span>SOC 2 Type II</span>
            <span>FIDO2 Certified</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
