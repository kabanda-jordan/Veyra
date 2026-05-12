"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-[var(--surface-border)] bg-[var(--surface-card)]/80 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      {/* Search */}
      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          placeholder="Search transactions, contacts..."
          className="input-field pl-9 py-2 text-xs"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl border border-[var(--surface-border)] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-blue" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[var(--surface-border)] hover:border-[hsl(var(--muted-foreground))]/40 transition-all">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[hsl(var(--foreground))]">John Doe</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))]">Personal</div>
          </div>
          <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />
        </button>
      </div>
    </header>
  );
}
