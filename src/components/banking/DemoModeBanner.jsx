import React from "react";
import { AlertTriangle } from "lucide-react";

export default function DemoModeBanner() {
  return (
    <div className="lg:ml-64 sticky top-0 z-30 border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-center">
      <p className="inline-flex items-center gap-2 text-[11px] font-medium text-yellow-300">
        <AlertTriangle className="w-3.5 h-3.5" />
        Demo mode: login accepts any account number and password. Transactions are test data only.
      </p>
    </div>
  );
}
