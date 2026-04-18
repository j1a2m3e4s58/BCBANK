import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Shield, Bell, HelpCircle, LogOut, ChevronRight, FileText,
  Fingerprint, Lock, Eye, Globe, Phone, Mail, MapPin, Building2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/banking/GlassCard";
import InstallAppCard from "@/components/banking/InstallAppCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";
import { useAuth } from "@/lib/AuthContext";

export default function Settings() {
  const { userProfile, resetDemoData } = useBankingData();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    transactionAlerts: true,
    biometric: false,
    twoFactor: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Setting updated");
  };

  const menuItems = [
    { icon: User, label: "Personal Info", section: "profile" },
    { icon: Shield, label: "Security", section: "security" },
    { icon: Bell, label: "Notifications", section: "notif_settings" },
    { icon: FileText, label: "Legal & Disclosures", section: "legal" },
    { icon: HelpCircle, label: "Help & Support", section: "help" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your account preferences</p>
      </motion.div>

      {/* Profile header */}
      <GlassCard className="mb-5 glow-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-teal-sm">
            <span className="text-lg font-heading font-bold text-primary">KA</span>
          </div>
          <div className="flex-1">
            <h2 className="text-base font-heading font-bold text-foreground">{user?.full_name || userProfile.name}</h2>
            <p className="text-xs text-muted-foreground">{user?.email || userProfile.email}</p>
            <p className="text-xs text-primary mt-0.5">{user?.accountType || "Premium Account"}</p>
          </div>
        </div>
      </GlassCard>

      <InstallAppCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.section}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSection(activeSection === item.section ? null : item.section)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200",
                activeSection === item.section
                  ? "bg-primary/10 border-primary/20 glow-teal-sm"
                  : "border-border/40 bg-card/50 hover:bg-card/80 hover:border-border/60"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                activeSection === item.section ? "bg-primary/20" : "bg-secondary"
              )}>
                <item.icon className={cn("w-4 h-4", activeSection === item.section ? "text-primary" : "text-muted-foreground")} />
              </div>
              <span className={cn("text-sm font-medium flex-1 text-left", activeSection === item.section ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
              <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", activeSection === item.section && "rotate-90")} />
            </motion.button>
          ))}

          <Button
            variant="outline"
            onClick={() => {
              logout();
              toast.success("Signed out");
              navigate("/login");
            }}
            className="w-full mt-4 gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetDemoData();
              toast.success("Demo banking data reset");
            }}
            className="w-full gap-2"
          >
            Reset Demo Data
          </Button>
        </div>

        {/* Detail panel */}
        <div>
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="space-y-3">
                  {[
                    { icon: User, label: "Full Name", value: user?.full_name || userProfile.name },
                    { icon: Mail, label: "Email", value: user?.email || userProfile.email },
                    { icon: Phone, label: "Phone", value: user?.phone || userProfile.phone },
                    { icon: Building2, label: "Account No.", value: user?.accountNumber || userProfile.accountNumber },
                    { icon: MapPin, label: "Branch", value: user?.kyc?.branch || userProfile.branch },
                    { icon: Globe, label: "Member Since", value: userProfile.memberSince },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <item.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{item.label}</p>
                        <p className="text-sm text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeSection === "security" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">Biometric Login</p>
                        <p className="text-[10px] text-muted-foreground">Use fingerprint or face</p>
                      </div>
                    </div>
                    <Switch checked={settings.biometric} onCheckedChange={() => toggleSetting("biometric")} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">Two-Factor Auth</p>
                        <p className="text-[10px] text-muted-foreground">Extra security layer</p>
                      </div>
                    </div>
                    <Switch checked={settings.twoFactor} onCheckedChange={() => toggleSetting("twoFactor")} />
                  </div>
                  <Button variant="outline" className="w-full gap-2 mt-2">
                    <Lock className="w-4 h-4" /> Change Password
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="w-4 h-4" /> Change PIN
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeSection === "notif_settings" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { key: "pushNotifications", label: "Push Notifications", desc: "Receive push alerts" },
                    { key: "emailAlerts", label: "Email Alerts", desc: "Transaction emails" },
                    { key: "transactionAlerts", label: "Transaction Alerts", desc: "Real-time transaction alerts" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="text-sm text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={settings[item.key]} onCheckedChange={() => toggleSetting(item.key)} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeSection === "help" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Help & Support</h3>
                <div className="space-y-3">
                  {[
                    { label: "FAQs", desc: "Frequently asked questions" },
                    { label: "Chat with Us", desc: "Live support 24/7" },
                    { label: "Call Center", desc: "+233 30 220 1234" },
                    { label: "Visit Branch", desc: "Bawjiase Main Branch" },
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
                      <div>
                        <p className="text-sm text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeSection === "legal" && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <GlassCard>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Legal & Disclosures</h3>
                <div className="space-y-3">
                  {[
                    { label: "Privacy Policy", desc: "How customer data is handled", path: "/legal/privacy" },
                    { label: "Terms of Use", desc: "Rules for using mobile banking", path: "/legal/terms" },
                    { label: "Fees & Limits", desc: "Transfer, wallet, and bill payment disclosures", path: "/legal/fees" },
                    { label: "Security Center", desc: "PIN, fraud, and device safety guidance", path: "/legal/security" },
                  ].map((item) => (
                    <Link key={item.path} to={item.path} className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left">
                      <div>
                        <p className="text-sm text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {!activeSection && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="text-center py-12">
                <User className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a section to view details</p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
