import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";
import ReceiptDialog from "@/components/banking/ReceiptDialog";
import NetworkLogo from "@/components/banking/NetworkLogo";

const networks = [
  { id: "mtn", name: "MTN MoMo", color: "from-yellow-500/20 to-yellow-500/5", border: "border-yellow-500/30" },
  { id: "telecel", name: "Telecel Cash", color: "from-red-500/20 to-red-500/5", border: "border-red-500/30" },
  { id: "airteltigo", name: "AirtelTigo Money", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
];

const quickAmounts = [10, 20, 50, 100, 200, 500];

const recentMoMo = [
  { id: 1, name: "Kofi Mensah", number: "0241234567", network: "MTN MoMo", time: "Today, 2:30 PM" },
  { id: 2, name: "Ama Owusu", number: "0201234567", network: "Telecel Cash", time: "Yesterday" },
  { id: 3, name: "Nana Agyei", number: "0271234567", network: "AirtelTigo Money", time: "Apr 14" },
];

export default function MoMo() {
  const { balance, formatAmount, addTransaction, addNotification } = useBankingData();
  const [network, setNetwork] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ phone: "", amount: "", note: "" });
  const [success, setSuccess] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const handleSend = () => {
    const amount = parseFloat(form.amount);
    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!network) {
      toast.error("Select a mobile money network");
      return;
    }
    if (cleanPhone.length !== 9) {
      toast.error("Enter a valid Ghana phone number without the first zero");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount + 1 > balance) {
      toast.error("Insufficient balance for amount and fee");
      return;
    }
    if (step < 2) { setStep(2); return; }
    setPinOpen(true);
  };

  const completeSend = () => {
    const amount = parseFloat(form.amount);
    const transaction = addTransaction({
      name: `${network?.name} to ${form.phone}`,
      category: "airtime",
      type: "debit",
      amount: amount + 1,
      referencePrefix: "MOM",
      details: {
        recipient: `+233 ${form.phone}`,
        network: network?.name,
        note: form.note,
        fee: "1.00",
      },
    });
    addNotification({
      title: "Mobile Money Sent",
      message: `GH₵ ${formatAmount(amount)} sent to +233 ${form.phone}. Fee: GH₵ 1.00.`,
      type: "success",
    });
    setReceipt({
      reference: transaction.reference,
      type: "Mobile Money",
      recipient: `+233 ${form.phone} (${network?.name})`,
      amount: `GH₵ ${formatAmount(amount)}`,
      fee: "GH₵ 1.00",
      date: `${transaction.date}, ${transaction.time}`,
      status: "Completed",
    });
    setPinOpen(false);
    setReceiptOpen(true);
    setSuccess(true);
  };

  const reset = () => { setSuccess(false); setStep(1); setForm({ phone: "", amount: "", note: "" }); setNetwork(null); };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Mobile Money</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Send money to any mobile wallet</p>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard glow className="text-center py-10 space-y-3">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-foreground">GH₵ {formatAmount(form.amount)} Sent!</p>
                <p className="text-sm text-muted-foreground mt-1">To {form.phone} via {network?.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 mx-4">
                <p className="text-xs text-muted-foreground">Transaction ref: BCB{Date.now().toString().slice(-8)}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setReceiptOpen(true)}>Receipt</Button>
                <Button onClick={reset} className="bg-primary text-primary-foreground">Send Again</Button>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Network selector */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Select Network</p>
              <div className="grid grid-cols-3 gap-2">
                {networks.map(n => (
                  <button key={n.id} onClick={() => setNetwork(n)}
                    className={`p-3 rounded-xl border text-center transition-all bg-gradient-to-b ${n.color} ${network?.id === n.id ? `${n.border} ring-1 ring-primary/30` : "border-border/40"}`}>
                    <NetworkLogo id={n.id} className="w-12 h-8 mx-auto mb-2" />
                    <p className="text-[10px] font-medium text-foreground leading-tight">{n.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <GlassCard className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 rounded-lg bg-secondary/60 border border-border/60 text-xs text-muted-foreground">+233</div>
                      <Input placeholder="24 123 4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 9) }))}
                        className="bg-secondary/50 border-border/60 flex-1" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Amount (GH₵)</label>
                    <Input placeholder="0.00" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      className="bg-secondary/50 border-border/60 text-xl font-heading h-12" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map(a => (
                      <button key={a} onClick={() => setForm(f => ({ ...f, amount: String(a) }))}
                        className="py-1.5 rounded-lg bg-secondary/60 border border-border/40 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                        GH₵ {a}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Note (Optional)</label>
                    <Input placeholder="e.g. For rent" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      className="bg-secondary/50 border-border/60" />
                  </div>
                </GlassCard>

                <Button onClick={handleSend} disabled={!network || !form.phone || !form.amount}
                  className="w-full bg-primary text-primary-foreground h-11 text-sm font-semibold">
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <GlassCard glow className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">Confirm Transfer</p>
                  {[["Network", network?.name], ["To", `+233 ${form.phone}`], ["Amount", `GH₵ ${form.amount}`], ["Fee", "GH₵ 1.00"], ["Note", form.note || "-"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-border/30 last:border-0 text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 text-sm font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">GH₵ {(parseFloat(form.amount) + 1).toFixed(2)}</span>
                  </div>
                </GlassCard>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border/60">Edit</Button>
                  <Button onClick={handleSend} className="flex-1 bg-primary text-primary-foreground font-semibold">Confirm & Send</Button>
                </div>
              </motion.div>
            )}

            {/* Recent */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent</p>
              {recentMoMo.map((r, i) => (
                <motion.button key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setForm(f => ({ ...f, phone: r.number }))}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/50 hover:border-primary/30 transition-all text-left">
                  <div className="w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.number} - {r.network}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{r.time}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PinConfirmDialog
        open={pinOpen}
        title="Confirm Mobile Money"
        description="Enter your transaction PIN to send this wallet transfer."
        onCancel={() => setPinOpen(false)}
        onConfirm={completeSend}
      />
      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </div>
  );
}
