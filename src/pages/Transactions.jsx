import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import TransactionItem from "@/components/banking/TransactionItem";
import { useBankingData } from "@/lib/BankingDataContext";
import ReceiptDialog from "@/components/banking/ReceiptDialog";
import { toast } from "sonner";

const statusOptions = ["all", "completed", "pending", "failed"];
const categoryOptions = ["all", "transfer", "receive", "airtime", "internet", "electricity", "shopping", "food", "bank"];

export default function Transactions() {
  const { transactions, formatAmount, addNotification, addDispute } = useBankingData();
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const filtered = useMemo(() => transactions.filter((tx) => {
    const amount = Number(String(tx.amount).replace(/,/g, ""));
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesCategory = category === "all" || tx.category === category;
    const matchesStatus = status === "all" || tx.status === status;
    const matchesSearch = [tx.name, tx.reference, tx.details?.recipient, tx.details?.provider]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMin = !minAmount || amount >= Number(minAmount);
    const matchesMax = !maxAmount || amount <= Number(maxAmount);
    return matchesFilter && matchesCategory && matchesStatus && matchesSearch && matchesMin && matchesMax;
  }), [transactions, filter, category, status, searchTerm, minAmount, maxAmount]);

  const totalIn = filtered.filter((t) => t.type === "credit").reduce((sum, t) => sum + Number(String(t.amount).replace(/,/g, "")), 0);
  const totalOut = filtered.filter((t) => t.type === "debit").reduce((sum, t) => sum + Number(String(t.amount).replace(/,/g, "")), 0);

  const receipt = selectedTransaction ? {
    reference: selectedTransaction.reference || `BCB${String(selectedTransaction.id).slice(-8)}`,
    type: selectedTransaction.name,
    recipient: selectedTransaction.details?.recipient || selectedTransaction.details?.provider || selectedTransaction.details?.goal || selectedTransaction.category,
    amount: `${selectedTransaction.type === "credit" ? "+" : "-"} GHS ${selectedTransaction.amount}`,
    fee: selectedTransaction.details?.fee ? `GHS ${selectedTransaction.details.fee}` : "GHS 0.00",
    date: `${selectedTransaction.date}, ${selectedTransaction.time}`,
    status: selectedTransaction.status,
  } : null;

  const exportCsv = () => {
    const headers = ["Reference", "Date", "Time", "Name", "Type", "Category", "Amount", "Status"];
    const rows = filtered.map((tx) => [
      tx.reference || `BCB${String(tx.id).slice(-8)}`,
      tx.date,
      tx.time,
      tx.name,
      tx.type,
      tx.category,
      tx.amount,
      tx.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bcb-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportIssue = (reportReceipt) => {
    addDispute({
      reference: reportReceipt.reference,
      title: `Issue on ${reportReceipt.type}`,
      channel: "Transactions",
      summary: `Customer reported an issue on transaction ${reportReceipt.reference}.`,
    });
    addNotification({
      title: "Dispute Submitted",
      message: `Issue reported for transaction ${reportReceipt.reference}. Support will review it.`,
      type: "warning",
    });
    toast.success("Issue reported to support");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground">Search, filter, export, and review your account activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to="/statements">Statements</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <GlassCard animate={false} className="!p-3">
          <p className="text-xs text-muted-foreground">Filtered Inflow</p>
          <p className="text-lg font-heading font-bold text-green-400 mt-0.5">+ GHS {formatAmount(totalIn)}</p>
        </GlassCard>
        <GlassCard animate={false} className="!p-3">
          <p className="text-xs text-muted-foreground">Filtered Outflow</p>
          <p className="text-lg font-heading font-bold text-foreground mt-0.5">- GHS {formatAmount(totalOut)}</p>
        </GlassCard>
      </div>

      <GlassCard className="mb-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, reference, provider, recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-secondary/40 border-border/40"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-secondary/60">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="credit" className="text-xs">Income</TabsTrigger>
              <TabsTrigger value="debit" className="text-xs">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-secondary/40 border-border/40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categoryOptions.map((item) => <SelectItem key={item} value={item}>{item === "all" ? "All Categories" : item}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-secondary/40 border-border/40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>{statusOptions.map((item) => <SelectItem key={item} value={item}>{item === "all" ? "All Statuses" : item}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Min amount" type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="bg-secondary/40 border-border/40" />
          <Input placeholder="Max amount" type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="bg-secondary/40 border-border/40" />
        </div>
      </GlassCard>

      <GlassCard>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No transactions matched your current filters</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((tx, i) => (
              <button key={tx.id} onClick={() => setSelectedTransaction(tx)} className="w-full text-left">
                <TransactionItem transaction={tx} index={i} />
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      <ReceiptDialog
        open={Boolean(selectedTransaction)}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
        receipt={receipt}
        onReportIssue={reportIssue}
      />
    </div>
  );
}
