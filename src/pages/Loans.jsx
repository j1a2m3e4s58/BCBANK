import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, TrendingDown, Banknote, ChevronRight, AlertCircle } from "lucide-react";

const loanProducts = [
  { id: 1, name: "Personal Loan", rate: "18%", max: "GH₵ 50,000", term: "Up to 36 months", icon: "💼" },
  { id: 2, name: "Business Loan", rate: "15%", max: "GH₵ 200,000", term: "Up to 60 months", icon: "🏢" },
  { id: 3, name: "Salary Advance", rate: "10%", max: "GH₵ 10,000", term: "Up to 12 months", icon: "💰" },
];

const activeLoans = [
  { id: 1, name: "Personal Loan", amount: "GH₵ 15,000", paid: "GH₵ 6,250", remaining: "GH₵ 8,750", progress: 42, nextDue: "May 1, 2026", status: "active" },
];

const schedule = [
  { month: "May 2026", amount: "GH₵ 520.00", principal: "GH₵ 395.00", interest: "GH₵ 125.00", status: "upcoming" },
  { month: "Jun 2026", amount: "GH₵ 520.00", principal: "GH₵ 398.00", interest: "GH₵ 122.00", status: "upcoming" },
  { month: "Apr 2026", amount: "GH₵ 520.00", principal: "GH₵ 392.00", interest: "GH₵ 128.00", status: "paid" },
  { month: "Mar 2026", amount: "GH₵ 520.00", principal: "GH₵ 389.00", interest: "GH₵ 131.00", status: "paid" },
];

export default function Loans() {
  const [tab, setTab] = useState("overview");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ product: "", amount: "", term: "", purpose: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleApply = () => {
    if (step < 3) { setStep(step + 1); return; }
    setSubmitted(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Loans & Credit</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your loans and applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl w-fit">
        {["overview", "apply", "schedule"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {activeLoans.map(loan => (
              <GlassCard key={loan.id} glow className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{loan.name}</p>
                    <p className="text-2xl font-heading font-bold text-foreground mt-1">{loan.amount}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-medium uppercase">Active</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Repaid: {loan.paid}</span>
                    <span>Remaining: {loan.remaining}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${loan.progress}%` }} transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{loan.progress}% repaid</p>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border/50">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">Next payment due: <span className="text-foreground font-medium">{loan.nextDue} — GH₵ 520.00</span></span>
                </div>
              </GlassCard>
            ))}

            <h3 className="text-sm font-semibold text-foreground pt-2">Available Products</h3>
            {loanProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <GlassCard onClick={() => { setTab("apply"); setForm(f => ({ ...f, product: p.name })); }}
                  className="flex items-center gap-4 hover:border-primary/30 cursor-pointer">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.term} • Up to {p.max}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{p.rate}</p>
                    <p className="text-[10px] text-muted-foreground">per annum</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === "apply" && (
          <motion.div key="apply" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {submitted ? (
              <GlassCard glow className="text-center py-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg font-heading font-bold text-foreground">Application Submitted!</p>
                <p className="text-sm text-muted-foreground">We'll review and respond within 24 hours.</p>
                <Button onClick={() => { setSubmitted(false); setStep(1); setTab("overview"); }} className="mt-4 bg-primary text-primary-foreground">Done</Button>
              </GlassCard>
            ) : (
              <GlassCard className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{s}</div>
                      {s < 3 && <div className={`flex-1 h-0.5 transition-all ${step > s ? "bg-primary" : "bg-border"}`} />}
                    </React.Fragment>
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Choose Loan Type</h3>
                    <Select value={form.product} onValueChange={v => setForm(f => ({ ...f, product: v }))}>
                      <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>{loanProducts.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Loan Amount (GH₵)</label>
                      <Input placeholder="e.g. 5000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="bg-secondary/50 border-border/60" />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Repayment Terms</h3>
                    <Select value={form.term} onValueChange={v => setForm(f => ({ ...f, term: v }))}>
                      <SelectTrigger className="bg-secondary/50 border-border/60"><SelectValue placeholder="Select tenure" /></SelectTrigger>
                      <SelectContent>
                        {["6 months","12 months","18 months","24 months","36 months"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Purpose of Loan</label>
                      <Input placeholder="e.g. Home renovation" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} className="bg-secondary/50 border-border/60" />
                    </div>
                    {form.amount && form.term && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground">Estimated monthly payment</p>
                        <p className="text-xl font-heading font-bold text-primary mt-1">GH₵ {Math.round((parseFloat(form.amount || 0) / parseInt(form.term || 12)) * 1.15)}</p>
                      </div>
                    )}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Confirm Application</h3>
                    {[["Product", form.product], ["Amount", `GH₵ ${form.amount}`], ["Term", form.term], ["Purpose", form.purpose]].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="text-foreground font-medium">{v}</span>
                      </div>
                    ))}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 mt-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">By submitting, you agree to our loan terms and conditions. A credit check will be performed.</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-border/60">Back</Button>}
                  <Button onClick={handleApply} className="flex-1 bg-primary text-primary-foreground">
                    {step === 3 ? "Submit Application" : "Continue"}
                  </Button>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}

        {tab === "schedule" && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <GlassCard className="space-y-1">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === "paid" ? "bg-green-400" : "bg-primary"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.month}</p>
                      <p className="text-[10px] text-muted-foreground">Principal: {s.principal} · Interest: {s.interest}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{s.amount}</p>
                    <p className={`text-[10px] capitalize font-medium ${s.status === "paid" ? "text-green-400" : "text-primary"}`}>{s.status}</p>
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}