import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, CreditCard, Receipt, Bell, Settings, PiggyBank, Smartphone, Banknote, Wallet, MapPin, HeadphonesIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const logoSrc = "/bcb-logo.png";

const navGroups = [
  {
    label: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: ArrowLeftRight, label: "Transfer", path: "/transfer" },
      { icon: Smartphone, label: "Mobile Money", path: "/momo" },
      { icon: CreditCard, label: "Cards", path: "/cards" },
      { icon: Receipt, label: "Payments", path: "/payments" },
    ]
  },
  {
    label: "Finance",
    items: [
      { icon: Banknote, label: "Loans", path: "/loans" },
      { icon: PiggyBank, label: "Savings Goals", path: "/savings" },
      { icon: Wallet, label: "Budget", path: "/budget" },
    ]
  },
  {
    label: "More",
    items: [
      { icon: Bell, label: "Notifications", path: "/notifications" },
      { icon: MapPin, label: "ATM Locator", path: "/atm" },
      { icon: HeadphonesIcon, label: "Support", path: "/support" },
      { icon: ShieldCheck, label: "Staff Admin", path: "/admin" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ]
  }
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const initials = (user?.full_name || "Demo Customer").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-card/50 backdrop-blur-xl border-r border-border/40 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white border border-primary/25 flex items-center justify-center overflow-hidden glow-teal-sm">
            <img
              src={logoSrc}
              alt="Bawjiase Community Bank PLC"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-heading font-bold text-foreground tracking-tight">Bawjiase CB</h1>
            <p className="text-[10px] text-muted-foreground">Community Bank PLC</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-widest px-3 mb-1">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 glow-teal-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.full_name || "Demo Customer"}</p>
            <p className="text-[10px] text-muted-foreground">****{String(user?.accountNumber || "4821").slice(-4)}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
