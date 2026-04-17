import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, TrendingUp } from "lucide-react";

export default function BalanceCard() {
  const [visible, setVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-5 md:p-7 glow-teal"
      style={{
        background: "linear-gradient(135deg, hsl(174 72% 50% / 0.15) 0%, hsl(220 18% 10% / 0.9) 50%, hsl(200 70% 50% / 0.1) 100%)",
        border: "1px solid hsl(174 72% 50% / 0.25)"
      }}
    >
      {/* Decorative orb */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-wide uppercase">Total Balance</p>
            <p className="text-xs text-muted-foreground mt-0.5">Savings Account • ****4821</p>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary transition-colors"
          >
            {visible ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        <div className="mb-4">
          <span className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">
            {visible ? "GH₵ 24,850.00" : "GH₵ ••••••"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">+12.5%</span>
          </div>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </div>
    </motion.div>
  );
}