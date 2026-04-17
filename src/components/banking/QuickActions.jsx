import React from "react";
import { motion } from "framer-motion";
import { Send, Download, CreditCard, Smartphone, Zap, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  { icon: Send, label: "Send", color: "from-primary/20 to-primary/5", path: "/transfer" },
  { icon: Download, label: "Receive", color: "from-blue-500/20 to-blue-500/5", path: "/transfer" },
  { icon: CreditCard, label: "Cards", color: "from-purple-500/20 to-purple-500/5", path: "/cards" },
  { icon: Smartphone, label: "Airtime", color: "from-orange-500/20 to-orange-500/5", path: "/payments" },
  { icon: Zap, label: "Pay Bills", color: "from-yellow-500/20 to-yellow-500/5", path: "/payments" },
  { icon: QrCode, label: "QR Pay", color: "from-pink-500/20 to-pink-500/5", path: "/payments" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {actions.map((action, i) => (
        <Link to={action.path} key={action.label}>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="w-full flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${action.color} border border-border/30 flex items-center justify-center group-hover:scale-105 transition-transform`}>
              <action.icon className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </motion.button>
        </Link>
      ))}
    </div>
  );
}