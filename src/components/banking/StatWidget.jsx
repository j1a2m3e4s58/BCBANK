import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StatWidget({ icon: Icon, label, value, trend, trendUp, color = "primary", index = 0 }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 hover:border-primary/20 transition-all duration-300"
    >
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3 border", colorClasses[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg md:text-xl font-heading font-bold text-foreground">{value}</p>
      {trend && (
        <p className={cn("text-[11px] font-medium mt-1", trendUp ? "text-green-400" : "text-red-400")}>
          {trendUp ? "Up" : "Down"} {trend}
        </p>
      )}
    </motion.div>
  );
}
