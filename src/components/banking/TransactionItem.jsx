import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Wifi, Zap, Coffee, Building2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  shopping: ShoppingBag,
  internet: Wifi,
  electricity: Zap,
  food: Coffee,
  bank: Building2,
  airtime: Smartphone,
  transfer: ArrowUpRight,
  receive: ArrowDownLeft,
};

const colorMap = {
  shopping: "bg-purple-500/15 text-purple-400",
  internet: "bg-blue-500/15 text-blue-400",
  electricity: "bg-yellow-500/15 text-yellow-400",
  food: "bg-orange-500/15 text-orange-400",
  bank: "bg-primary/15 text-primary",
  airtime: "bg-pink-500/15 text-pink-400",
  transfer: "bg-red-500/15 text-red-400",
  receive: "bg-green-500/15 text-green-400",
};

export default function TransactionItem({ transaction, index = 0 }) {
  const Icon = iconMap[transaction.category] || ArrowUpRight;
  const isCredit = transaction.type === "credit";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-secondary/40 transition-all duration-200 cursor-pointer group"
    >
      <div className={cn(
        "w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0",
        colorMap[transaction.category] || "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{transaction.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{transaction.date} • {transaction.time}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={cn(
          "text-sm font-semibold",
          isCredit ? "text-green-400" : "text-foreground"
        )}>
          {isCredit ? "+" : "-"} GH₵ {transaction.amount}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{transaction.status}</p>
      </div>
    </motion.div>
  );
}