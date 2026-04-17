import React from "react";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";

export default function BankCard({ card, index = 0 }) {
  const gradients = [
    "from-primary/30 via-card to-blue-900/30",
    "from-purple-600/30 via-card to-pink-900/20",
    "from-blue-600/30 via-card to-cyan-900/20",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br ${gradients[index % 3]} border border-border/40 min-w-[280px] md:min-w-[320px]`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-blue-500/5 blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Bawjiase CB</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.type}</p>
          </div>
          <Wifi className="w-5 h-5 text-primary/60 rotate-90" />
        </div>

        <p className="text-base md:text-lg font-heading font-medium text-foreground tracking-[0.2em] mb-6">
          {card.number}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Card Holder</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.holder}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Expires</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{card.expiry}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}