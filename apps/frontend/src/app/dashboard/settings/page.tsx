"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  User, Bell, Globe, Palette, Shield, CreditCard,
  ChevronRight, Camera, Save
} from "lucide-react";

const settingsSections = [
  { icon: User, label: "Profile", id: "profile" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: Globe, label: "Language & Region", id: "locale" },
  { icon: Palette, label: "Appearance", id: "appearance" },
  { icon: Shield, label: "Privacy", id: "privacy" },
  { icon: CreditCard, label: "Billing", id: "billing" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    payments: true,
    security: true,
    marketing: false,
    weekly: true,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account preferences</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === section.id
                  ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/25"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <section.icon size={15} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-5">
              <h3 className="text-base font-bold text-white">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center text-xl font-bold text-white">
                    JD
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neon-blue flex items-center justify-center">
                    <Camera size={11} className="text-white" />
                  </button>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">John Doe</div>
                  <div className="text-xs text-white/40">john@example.com</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "First Name", value: "John" },
                  { label: "Last Name", value: "Doe" },
                  { label: "Email", value: "john@example.com" },
                  { label: "Phone", value: "+1 (555) 000-0000" },
                  { label: "Country", value: "United States" },
                  { label: "Timezone", value: "America/New_York" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs text-white/40 mb-1.5 block">{field.label}</label>
                    <input type="text" defaultValue={field.value} className="input-field" />
                  </div>
                ))}
              </div>

              <button className="btn-primary text-white text-sm flex items-center gap-2">
                <Save size={14} />
                Save Changes
              </button>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Notification Preferences</h3>
              {[
                { key: "payments" as const, label: "Payment notifications", desc: "Get notified for every transaction" },
                { key: "security" as const, label: "Security alerts", desc: "Login attempts and suspicious activity" },
                { key: "weekly" as const, label: "Weekly summary", desc: "Weekly spending and savings report" },
                { key: "marketing" as const, label: "Product updates", desc: "New features and announcements" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/3">
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-white/40">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${
                      notifications[item.key] ? "bg-neon-blue" : "bg-white/20"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${
                      notifications[item.key] ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection !== "profile" && activeSection !== "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h3 className="text-base font-bold text-white mb-4 capitalize">{activeSection} Settings</h3>
              <p className="text-sm text-white/40">This section is coming soon.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
