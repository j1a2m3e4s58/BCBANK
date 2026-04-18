import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Wifi, Smartphone, Droplets, Tv, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";
import ReceiptDialog from "@/components/banking/ReceiptDialog";

const billCategories = [
  { icon: Zap, label: "Electricity", color: "bg-yellow-500/15 text-yellow-400", providers: ["ECG", "NEDCo"] },
  { icon: Wifi, label: "Internet", color: "bg-blue-500/15 text-blue-400", providers: ["Vodafone", "MTN", "AirtelTigo"] },
  { icon: Smartphone, label: "Airtime", color: "bg-pink-500/15 text-pink-400", providers: ["MTN", "Vodafone", "AirtelTigo"] },
  { icon: Droplets, label: "Water", color: "bg-cyan-500/15 text-cyan-400", providers: ["Ghana Water"] },
  { icon: Tv, label: "TV/Cable", color: "bg-purple-500/15 text-purple-400", providers: ["DSTV", "GOtv"] },
  { icon: GraduationCap, label: "School Fees", color: "bg-green-500/15 text-green-400", providers: ["University of Ghana", "KNUST"] },
];

export default function Payments() {
  const { balance, formatAmount, addTransaction, addNotification } = useBankingData();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [formData, setFormData] = useState({ provider: "", accountId: "", amount: "" });
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const handlePay = () => {
    if (!formData.provider || !formData.accountId || !formData.amount) {
      toast.error("Please fill in all fields");
      return;
    }
    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (formData.accountId.trim().length < 4) {
      toast.error("Enter a valid account or meter number");
      return;
    }
    setPinOpen(true);
  };

  const completePayment = () => {
    const amount = parseFloat(formData.amount);
    const categoryMap = {
      Electricity: "electricity",
      Internet: "internet",
      Airtime: "airtime",
      Water: "bank",
      "TV/Cable": "bank",
      "School Fees": "bank",
    };
    const transaction = addTransaction({
      name: `${formData.provider} ${selectedCategory.label}`,
      category: categoryMap[selectedCategory.label] || "bank",
      type: "debit",
      amount,
      referencePrefix: "PAY",
      details: {
        provider: formData.provider,
        category: selectedCategory.label,
        accountId: formData.accountId,
      },
    });
    addNotification({
      title: "Bill Payment Confirmed",
      message: `GH₵ ${formatAmount(amount)} paid to ${formData.provider}.`,
      type: "info",
    });
    setReceipt({
      reference: transaction.reference,
      type: selectedCategory.label,
      recipient: `${formData.provider} (${formData.accountId})`,
      amount: `GH₵ ${formatAmount(amount)}`,
      fee: "GH₵ 0.00",
      date: `${transaction.date}, ${transaction.time}`,
      status: "Completed",
    });
    setPinOpen(false);
    setReceiptOpen(true);
    setPaymentDone(true);
    toast.success("Payment successful!");
  };

  const reset = () => {
    setSelectedCategory(null);
    setPaymentDone(false);
    setFormData({ provider: "", accountId: "", amount: "" });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Pay Bills</h1>
        <p className="text-sm text-muted-foreground mb-6">Pay for utilities, airtime, and more</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {paymentDone ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="text-center py-10 glow-border">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto mb-5 glow-teal">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-1">Payment Successful!</h2>
              <p className="text-sm text-muted-foreground mb-1">
                GH₵ {formatAmount(formData.amount)} paid to {formData.provider}
              </p>
              <p className="text-xs text-muted-foreground mb-6">Ref: PAY{Date.now().toString().slice(-8)}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setReceiptOpen(true)}>Receipt</Button>
                <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">Make Another Payment</Button>
              </div>
            </GlassCard>
          </motion.div>
        ) : !selectedCategory ? (
          <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {billCategories.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex flex-col items-center gap-3 p-5 md:p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{cat.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Recent payments */}
            <GlassCard className="mt-6">
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Recent Payments</h3>
              {[
                { name: "ECG Electricity", amount: "320.00", date: "Apr 15" },
                { name: "Vodafone Internet", amount: "99.00", date: "Apr 13" },
                { name: "MTN Airtime", amount: "50.00", date: "Apr 10" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">GH₵ {p.amount}</p>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${selectedCategory.color} flex items-center justify-center`}>
                  <selectedCategory.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selectedCategory.label}</h3>
                  <p className="text-xs text-muted-foreground">Enter payment details</p>
                </div>
              </div>

              <div className="space-y-4">
                <Select value={formData.provider} onValueChange={(v) => setFormData({ ...formData, provider: v })}>
                  <SelectTrigger className="bg-secondary/40 border-border/40">
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.providers.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input placeholder={selectedCategory.label === "Airtime" ? "Phone Number" : "Account / Meter Number"}
                  className="bg-secondary/40 border-border/40" value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} />

                <Input placeholder="Amount (GH₵)" type="number" className="bg-secondary/40 border-border/40" value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedCategory(null)} className="flex-1">Back</Button>
                  <Button onClick={handlePay} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    Pay Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
      <PinConfirmDialog
        open={pinOpen}
        title="Confirm Payment"
        description="Enter your transaction PIN to complete this payment."
        onCancel={() => setPinOpen(false)}
        onConfirm={completePayment}
      />
      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </div>
  );
}
