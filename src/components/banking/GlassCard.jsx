import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GlassCard({ children, className, glow = false, onClick, animate = true }) {
  const Wrapper = animate ? motion.div : "div";
  const animProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  } : {};

  return (
    <Wrapper
      {...animProps}
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 md:p-5 shadow-[0_1px_3px_hsl(220_20%_3%/0.5),0_4px_12px_hsl(220_20%_3%/0.25)]",
        glow && "glow-border glow-teal-sm",
        onClick && "cursor-pointer hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      {children}
    </Wrapper>
  );
}