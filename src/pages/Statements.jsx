import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Download, FileText } from "lucide-react";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBankingData } from "@/lib/BankingDataContext";
import { toast } from "sonner";

export default function Statements() {
  const { transactions, userProfile, formatAmount } = useBankingData();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const totals = useMemo(() => {
    const inflow = transactions.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + Number(String(tx.amount).replace(/,/g, "")), 0);
    const outflow = transactions.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + Number(String(tx.amount).replace(/,/g, "")), 0);
    return { inflow, outflow };
  }, [transactions]);

  const downloadStatement = () => {
    const lines = [
      "Bawjiase Community Bank PLC",
      "Customer Account Statement",
      `Customer: ${userProfile.name}`,
      `Account Number: ${userProfile.accountNumber}`,
      `Branch: ${userProfile.branch}`,
      `Period: ${fromDate || "Start"} to ${toDate || "Today"}`,
      "",
      "Reference | Date | Time | Name | Type | Amount | Status",
      ...transactions.map((tx) => `${tx.reference || tx.id} | ${tx.date} | ${tx.time} | ${tx.name} | ${tx.type} | GHS ${tx.amount} | ${tx.status}`),
      "",
      `Total Inflow: GHS ${formatAmount(totals.inflow)}`,
      `Total Outflow: GHS ${formatAmount(totals.outflow)}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bcb-statement.txt";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Statement downloaded");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Statements</h1>
        <p className="text-sm text-muted-foreground">Download a shareable statement summary for your account</p>
      </motion.div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground">{userProfile.accountNumber} - {userProfile.branch}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">From Date</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-secondary/40 border-border/40" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">To Date</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-secondary/40 border-border/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30">
            <p className="text-xs text-muted-foreground">Total Inflow</p>
            <p className="text-lg font-heading font-bold text-green-400 mt-0.5">GHS {formatAmount(totals.inflow)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/30">
            <p className="text-xs text-muted-foreground">Total Outflow</p>
            <p className="text-lg font-heading font-bold text-foreground mt-0.5">GHS {formatAmount(totals.outflow)}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">Statement includes all demo transactions currently stored on this device.</p>
          </div>
          <Button onClick={downloadStatement} className="bg-primary text-primary-foreground gap-1.5">
            <Download className="w-4 h-4" /> Download Statement
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
