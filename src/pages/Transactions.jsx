import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlassCard from "@/components/banking/GlassCard";
import TransactionItem from "@/components/banking/TransactionItem";
import { sampleTransactions } from "@/lib/sampleData";

export default function Transactions() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = sampleTransactions.filter(tx => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIn = sampleTransactions.filter(t => t.type === "credit").reduce((s, t) => s + parseFloat(t.amount.replace(",", "")), 0);
  const totalOut = sampleTransactions.filter(t => t.type === "debit").reduce((s, t) => s + parseFloat(t.amount.replace(",", "")), 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground">Your complete transaction history</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <GlassCard animate={false} className="!p-3">
          <p className="text-xs text-muted-foreground">Total In</p>
          <p className="text-lg font-heading font-bold text-green-400 mt-0.5">+ GH₵ {totalIn.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </GlassCard>
        <GlassCard animate={false} className="!p-3">
          <p className="text-xs text-muted-foreground">Total Out</p>
          <p className="text-lg font-heading font-bold text-foreground mt-0.5">- GH₵ {totalOut.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-secondary/40 border-border/40" />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-secondary/60">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="credit" className="text-xs">Income</TabsTrigger>
            <TabsTrigger value="debit" className="text-xs">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Transaction list */}
      <GlassCard>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((tx, i) => (
              <TransactionItem key={tx.id} transaction={tx} index={i} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}