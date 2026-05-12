"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Wallet, Send, ArrowLeftRight, Building2,
  Smartphone, Fingerprint, Shield, BarChart3, Gift, Settings,
  ChevronLeft, ChevronRight, Fingerprint as FingerprintIcon,
  QrCode, Bell, LogOut, HelpCircle
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  { icon: Send, label: "Send Money", href: "/dashboard/send" },
  { icon: ArrowLeftRight, label: "Transactions", href: "/dashboard/transactions" },
  { icon: QrCode, label: "QR Pay", href: "/dashboard/qr" },
  { icon: Building2, label: "Linked Banks", href: "/dashboard/banks" },
  { icon: Smartphone, label: "Devices", href: "/dashboard/devices" },
  { icon: Fingerprint, label: "Biometrics", href: "/dashboard/biometrics" },
  { icon: Shield, label: "Security", href: "/dashboard/security" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Gift, label: "Rewards", href: "/dashboard/rewards" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col border-r border-veyra-border bg-veyra-surface overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-veyra-border flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center flex-shrink-0 shadow-neon-blue">
            <FingerprintIcon size={16} className="text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base font-bold text-white truncate"
            >
              Veyra
            </motion.span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-veyra-border p-3 space-y-1">
        <Link
          href="/dashboard/help"
          className={`sidebar-item ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Help" : undefined}
        >
          <HelpCircle size={18} className="flex-shrink-0" />
          {!collapsed && <span>Help</span>}
        </Link>
        <button
          className={`sidebar-item w-full ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-veyra-card border border-veyra-border flex items-center justify-center text-white/40 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
