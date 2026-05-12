"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Smartphone, Monitor, Laptop, CheckCircle, AlertTriangle,
  Trash2, Shield, MapPin, Clock, Wifi, Plus
} from "lucide-react";

const devices = [
  {
    id: "1",
    name: "iPhone 16 Pro",
    type: "mobile",
    os: "iOS 18.4",
    browser: "Safari",
    location: "New York, US",
    lastSeen: "Now",
    trusted: true,
    trustScore: 98,
    current: true,
    icon: Smartphone,
  },
  {
    id: "2",
    name: "MacBook Pro M4",
    type: "laptop",
    os: "macOS 15.3",
    browser: "Chrome 124",
    location: "New York, US",
    lastSeen: "2 hours ago",
    trusted: true,
    trustScore: 95,
    current: false,
    icon: Laptop,
  },
  {
    id: "3",
    name: "Windows Desktop",
    type: "desktop",
    os: "Windows 11",
    browser: "Edge 124",
    location: "Chicago, US",
    lastSeen: "3 days ago",
    trusted: true,
    trustScore: 82,
    current: false,
    icon: Monitor,
  },
  {
    id: "4",
    name: "Unknown Android",
    type: "mobile",
    os: "Android 14",
    browser: "Chrome Mobile",
    location: "Unknown",
    lastSeen: "5 days ago",
    trusted: false,
    trustScore: 12,
    current: false,
    icon: Smartphone,
  },
];

export default function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Trusted Devices</h1>
            <p className="text-sm text-white/40 mt-1">Manage devices that can access your wallet</p>
          </div>
          <button className="btn-primary text-white text-sm flex items-center gap-2">
            <Plus size={14} />
            Add Device
          </button>
        </div>
      </motion.div>

      {/* Alert for untrusted device */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 border border-yellow-400/20 bg-yellow-400/5"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-semibold text-yellow-400">Unrecognized device detected</span>
            <p className="text-xs text-white/50 mt-0.5">An unknown Android device accessed your account 5 days ago. Review and remove if not yours.</p>
          </div>
          <button className="text-xs text-yellow-400 hover:underline flex-shrink-0">Review</button>
        </div>
      </motion.div>

      {/* Devices list */}
      <div className="space-y-4">
        {devices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card p-5 cursor-pointer transition-all ${
              selectedDevice === device.id ? "neon-border" : ""
            } ${!device.trusted ? "border-yellow-400/20" : ""}`}
            onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                device.trusted
                  ? "bg-neon-blue/10 border border-neon-blue/20"
                  : "bg-yellow-400/10 border border-yellow-400/20"
              }`}>
                <device.icon size={20} className={device.trusted ? "text-neon-blue" : "text-yellow-400"} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{device.name}</span>
                  {device.current && <span className="badge-success text-xs">Current</span>}
                  {!device.trusted && <span className="badge-pending text-xs">Unrecognized</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/40">
                  <span>{device.os}</span>
                  <span>{device.browser}</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} />
                    {device.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {device.lastSeen}
                  </div>
                </div>
              </div>

              {/* Trust score */}
              <div className="text-right flex-shrink-0">
                <div className={`text-lg font-black ${
                  device.trustScore >= 80 ? "text-neon-green" :
                  device.trustScore >= 50 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {device.trustScore}
                </div>
                <div className="text-xs text-white/30">Trust score</div>
              </div>

              {!device.current && (
                <button
                  className="w-9 h-9 rounded-xl border border-veyra-border flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Expanded details */}
            {selectedDevice === device.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-veyra-border"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Trust Score", value: `${device.trustScore}/100` },
                    { label: "Status", value: device.trusted ? "Trusted" : "Unrecognized" },
                    { label: "Last Active", value: device.lastSeen },
                    { label: "Location", value: device.location },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs text-white/30 mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                {!device.trusted && (
                  <div className="flex gap-3 mt-4">
                    <button className="btn-secondary text-white text-xs flex items-center gap-1.5">
                      <Shield size={12} />
                      Trust Device
                    </button>
                    <button className="px-3 py-2 rounded-xl text-xs font-medium bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 transition-all">
                      Remove Device
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
