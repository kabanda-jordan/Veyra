"use client";

import { Smartphone, Monitor, Laptop, CheckCircle, AlertTriangle } from "lucide-react";

const devices = [
  { name: "iPhone 16 Pro", type: "mobile", lastSeen: "Now", trusted: true, icon: Smartphone },
  { name: "MacBook Pro", type: "laptop", lastSeen: "2h ago", trusted: true, icon: Laptop },
  { name: "Windows PC", type: "desktop", lastSeen: "3d ago", trusted: true, icon: Monitor },
  { name: "Unknown Device", type: "mobile", lastSeen: "5d ago", trusted: false, icon: Smartphone },
];

export function TrustedDevices() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Trusted Devices</h3>
        <span className="text-xs text-neon-blue cursor-pointer hover:underline">Manage</span>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.name} className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              device.trusted
                ? "bg-neon-blue/10 border border-neon-blue/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              <device.icon size={15} className={device.trusted ? "text-neon-blue" : "text-red-400"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{device.name}</div>
              <div className="text-xs text-white/40">{device.lastSeen}</div>
            </div>
            {device.trusted ? (
              <CheckCircle size={13} className="text-neon-green flex-shrink-0" />
            ) : (
              <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
