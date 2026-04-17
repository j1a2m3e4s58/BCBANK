import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, CreditCard, Smartphone, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Home", path: "/" },
  { icon: ArrowLeftRight, label: "Transfer", path: "/transfer" },
  { icon: Smartphone, label: "MoMo", path: "/momo" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: Grid3X3, label: "More", path: "/settings" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/40">
      <div className="flex items-center justify-around py-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <div className="flex flex-col items-center gap-0.5 py-1.5">
                <div className={cn(
                  "w-10 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive && "bg-primary/15"
                )}>
                  <item.icon className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}