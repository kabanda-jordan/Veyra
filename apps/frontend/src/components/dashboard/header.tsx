"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-veyra-border bg-veyra-surface/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      {/* Search */}
      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search transactions, contacts..."
          className="input-field pl-9 py-2 text-xs"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl border border-veyra-border flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-blue" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-veyra-border hover:border-white/20 transition-all">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white">John Doe</div>
            <div className="text-xs text-white/40">Personal</div>
          </div>
          <ChevronDown size={14} className="text-white/30" />
        </button>
      </div>
    </header>
  );
}
