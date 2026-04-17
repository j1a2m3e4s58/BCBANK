import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ShoppingBag, Zap, Coffee, Wifi, Plus, AlertTriangle } from "lucide-react";

const categoryConfig = {
  food: { icon: Coffee, color: "text-orange-400", bg: "bg-orange-500/10", label: "Food & Dining" },
  shopping: { icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-500/10", label: "Shopping" },
  utilities: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Utilities" },
  internet: { icon: Wifi, color: "text-blue-400", bg: "bg-blue-500/10", label: "Internet & Phone" },
};

const initialBudgets = [
  { id: 1, category: "food", limit: 800, spent: 650 },
  { id: 2, category: "shopping", limit: 500, spent: 890 },
  { id: 3, category: "utilities", limit: 400, spent: 320 },
  { id: 4, category: "internet", limit: 200, spent: 99 },
];

export default function Budget() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showAdd, setShowAdd] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "food", limit: "" });

  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);

  const addBudget = () => {
    if (!newBudget.limit) return;
    setBudgets(b => [...b, { id: Date.now(), category: newBudget.category, limit: parseFloat(newBudget.limit), spent: 0 }]);
    setShowAdd(false);
    setNewBudget({ category: "food", limit: "" });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Budget Tracker</h1>
          <p className="text-xs text-muted-foreground mt-0.5">April 2026 spending overview</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="bg-primary text-primary-foreground gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add
        </Button>
      </div>

      {/* Overview */}
      <GlassCard glow className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Spent This Month</p>
            <p className="text-2xl font-heading font-bold text-foreground">GH₵ {totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of GH₵ {totalLimit.toLocaleString()} budgeted</p>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4"
            style={{ borderColor: totalSpent > totalLimit ? "hsl(0 72% 55%)" : "hsl(174 72% 50%)" }}>
            <span className="text-xs font-bold" style={{ color: totalSpent > totalLimit ? "hsl(0 72% 55%)" : "hsl(174 72% 50%)" }}>
              {Math.round((totalSpent / totalLimit) * 100)}%
            </span>
          </div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (totalSpent / totalLimit) * 100)}%` }}
            transition={{ duration: 1.2 }}
            className={`h-full rounded-full ${totalSpent > totalLimit ? "bg-red-400" : "bg-primary"}`} />
        </div>
        {totalSpent > totalLimit && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <p className="text-xs text-red-400">You've exceeded your monthly budget by GH₵ {(totalSpent - totalLimit).toFixed(2)}</p>
          </div>
        )}
      </GlassCard>

      {/* Add form */}
      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <GlassCard className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Add Budget Category</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Category</label>
                <select value={newBudget.category} onChange={e => setNewBudget(b => ({ ...b, category: e.target.value }))}
                  className="w-full h-9 rounded-md border border-border/60 bg-secondary/50 px-3 text-sm text-foreground">
                  {Object.entries(categoryConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Monthly Limit (GH₵)</label>
                <Input placeholder="500" value={newBudget.limit} onChange={e => setNewBudget(b => ({ ...b, limit: e.target.value }))} className="bg-secondary/50 border-border/60 text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1 border-border/60 text-xs">Cancel</Button>
              <Button onClick={addBudget} className="flex-1 bg-primary text-primary-foreground text-xs">Add Budget</Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {budgets.map((b, i) => {
          const cfg = categoryConfig[b.category];
          const Icon = cfg.icon;
          const pct = Math.min(100, (b.spent / b.limit) * 100);
          const over = b.spent > b.limit;
          return (
            <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{cfg.label}</p>
                      <p className="text-[10px] text-muted-foreground">Limit: GH₵ {b.limit.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${over ? "text-red-400" : "text-foreground"}`}>GH₵ {b.spent.toLocaleString()}</p>
                    {over && <p className="text-[10px] text-red-400">Over by GH₵ {(b.spent - b.limit).toFixed(0)}</p>}
                  </div>
                </div>
                <div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                      className={`h-full rounded-full ${over ? "bg-red-400" : pct > 80 ? "bg-yellow-400" : "bg-primary"}`} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(0)}% used</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insight */}
      <GlassCard className="border-primary/20 bg-primary/5 space-y-1.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-xs font-semibold text-primary">AI Spending Insight</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your shopping spend is <span className="text-red-400 font-medium">78% over budget</span> this month. Consider reducing discretionary purchases. You're doing great on utilities — 20% under budget!
        </p>
      </GlassCard>
    </div>
  );
}