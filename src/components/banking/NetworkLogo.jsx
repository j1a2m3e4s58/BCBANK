import React from "react";
import { cn } from "@/lib/utils";

export default function NetworkLogo({ id, className }) {
  if (id === "mtn") {
    return (
      <div className={cn("relative flex items-center justify-center rounded-lg bg-[#ffcc00] border border-black/10", className)}>
        <div className="rounded-[50%] border-2 border-black px-2 py-0.5">
          <span className="text-[10px] font-black tracking-tight text-black">MTN</span>
        </div>
      </div>
    );
  }

  if (id === "telecel") {
    return (
      <div className={cn("flex items-center justify-center rounded-lg bg-[#e30613] border border-white/10", className)}>
        <span className="text-[9px] font-black tracking-tight text-white">telecel</span>
      </div>
    );
  }

  if (id === "airteltigo") {
    return (
      <div className={cn("flex items-center justify-center rounded-lg overflow-hidden border border-white/10", className)}>
        <div className="h-full flex-1 bg-[#e30613]" />
        <div className="h-full flex-[1.2] bg-[#0057b8] flex items-center justify-center">
          <span className="text-[8px] font-black tracking-tight text-white">AT</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-secondary border border-border/60", className)}>
      <span className="text-[9px] font-bold text-muted-foreground">PAY</span>
    </div>
  );
}
