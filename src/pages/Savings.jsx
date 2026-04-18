import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TrendingUp, CheckCircle2, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";
import ReceiptDialog from "@/components/banking/ReceiptDialog";

export default function Savings() {
  const { savingsGoals: goals, setSavingsGoals: setGoals, balance, formatAmount, addTransaction, addNotification } = useBankingData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", emoji: "Goal", deadline: "" });
  const [topupGoal, setTopupGoal] = useState(null);
  const [topupAmount, setTopupAmount] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const addGoal = () => {
    if (!form.name || !form.target) return;
    setGoals(g => [...g, {
      id: Date.now(), name: form.name, target: parseFloat(form.target), saved: 0,
      color: "from-blue-500/30 to-blue-500/5", emoji: form.emoji, deadline: form.deadline
    }]);
    setForm({ name: "", target: "", emoji: "Goal", deadline: "" });
    setShowForm(false);
  };

  const topUp = () => {
    const amt = parseFloat(topupAmount);
    if (!amt || !topupGoal) return;
    if (amt > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setPinOpen(true);
  };

  const completeTopUp = () => {
    const amt = parseFloat(topupAmount);
    const goal = goals.find(g => g.id === topupGoal);
    setGoals(g => g.map(goal => goal.id === topupGoal
      ? { ...goal, saved: Math.min(goal.target, goal.saved + amt) } : goal));
    const transaction = addTransaction({
      name: `Savings top-up: ${goal?.name || "Goal"}`,
      category: "bank",
      type: "debit",
      amount: amt,
      referencePrefix: "SVG",
      details: { goal: goal?.name },
    });
    addNotification({
      title: "Savings Goal Updated",
      message: `GH₵ ${formatAmount(amt)} added to ${goal?.name || "your goal"}.`,
      type: "success",
    });
    setReceipt({
      reference: transaction.reference,
      type: "Savings Top-up",
      recipient: goal?.name || "Savings Goal",
      amount: `GH₵ ${formatAmount(amt)}`,
      fee: "GH₵ 0.00",
      date: `${transaction.date}, ${transaction.time}`,
      status: "Completed",
    });
    setTopupGoal(null);
    setTopupAmount("");
    setPinOpen(false);
    setReceiptOpen(true);
    toast.success("Savings goal updated");
  };

  const totalSaved = goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = goals.reduce((a, g) => a + g.target, 0);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Savings Goals</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track your financial targets</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-primary text-primary-foreground gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Goal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="text-center">
          <PiggyBank className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Saved</p>
          <p className="text-lg font-heading font-bold text-foreground">GH₵ {formatAmount(totalSaved)}</p>
        </GlassCard>
        <GlassCard className="text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Overall Progress</p>
          <p className="text-lg font-heading font-bold text-foreground">{Math.round((totalSaved / totalTarget) * 100)}%</p>
        </GlassCard>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <GlassCard glow className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Create New Goal</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Goal Name</label>
                  <Input placeholder="e.g. New Car" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary/50 border-border/60 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Target (GH₵)</label>
                  <Input placeholder="e.g. 10000" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="bg-secondary/50 border-border/60 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Emoji</label>
                  <Input placeholder="Goal" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className="bg-secondary/50 border-border/60 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Deadline</label>
                  <Input placeholder="Dec 2026" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="bg-secondary/50 border-border/60 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-border/60 text-xs">Cancel</Button>
                <Button onClick={addGoal} className="flex-1 bg-primary text-primary-foreground text-xs">Create Goal</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals */}
      <div className="space-y-3">
        {goals.map((goal, i) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          const done = goal.saved >= goal.target;
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard className={`bg-gradient-to-r ${goal.color} space-y-3`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{goal.name}</p>
                      <p className="text-[10px] text-muted-foreground">Target by {goal.deadline}</p>
                    </div>
                  </div>
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                    : <button onClick={() => setTopupGoal(goal.id)} className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium hover:bg-primary/20 transition-colors">+ Add</button>
                  }
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground font-semibold">GH₵ {formatAmount(goal.saved)}</span>
                    <span className="text-muted-foreground">of GH₵ {formatAmount(goal.target)}</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className={`h-full rounded-full ${done ? "bg-green-400" : "bg-primary"}`} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{pct}% achieved</p>
                </div>

                <AnimatePresence>
                  {topupGoal === goal.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="flex gap-2 pt-1 border-t border-border/30">
                      <Input placeholder="Amount (GH₵)" value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                        className="bg-secondary/50 border-border/60 text-sm h-8" />
                      <Button onClick={topUp} size="sm" className="bg-primary text-primary-foreground h-8 text-xs">Add</Button>
                      <Button onClick={() => setTopupGoal(null)} variant="outline" size="sm" className="border-border/60 h-8 text-xs">Cancel</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      <PinConfirmDialog
        open={pinOpen}
        title="Confirm Savings Top-up"
        description="Enter your transaction PIN to move money into this savings goal."
        onCancel={() => setPinOpen(false)}
        onConfirm={completeTopUp}
      />
      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </div>
  );
}
