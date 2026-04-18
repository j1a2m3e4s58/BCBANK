import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Droplets, GraduationCap, Smartphone, Star, Tv, Wifi, Zap } from "lucide-react";
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
  { icon: Wifi, label: "Internet", color: "bg-blue-500/15 text-blue-400", providers: ["Telecel", "MTN", "AirtelTigo"] },
  { icon: Smartphone, label: "Airtime", color: "bg-pink-500/15 text-pink-400", providers: ["MTN", "Telecel", "AirtelTigo"] },
  { icon: Smartphone, label: "Data Bundle", color: "bg-indigo-500/15 text-indigo-400", providers: ["MTN", "Telecel", "AirtelTigo"] },
  { icon: Droplets, label: "Water", color: "bg-cyan-500/15 text-cyan-400", providers: ["Ghana Water"] },
  { icon: Tv, label: "TV/Cable", color: "bg-purple-500/15 text-purple-400", providers: ["DSTV", "GOtv"] },
  { icon: GraduationCap, label: "School Fees", color: "bg-green-500/15 text-green-400", providers: ["University of Ghana", "KNUST"] },
];

export default function Payments() {
  const { balance, formatAmount, addTransaction, addNotification, billers, saveBiller, toggleBillerFavorite } = useBankingData();
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [saveAsBiller, setSaveAsBiller] = useState(false);
  const [formData, setFormData] = useState({ provider: "", accountId: "", amount: "", nickname: "" });
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const favorites = useMemo(() => billers.filter((item) => item.favorite), [billers]);

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
      toast.error("Enter a valid account, meter, or phone number");
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
      "Data Bundle": "internet",
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
      title: "Payment Confirmed",
      message: `GHS ${formatAmount(amount)} paid to ${formData.provider}.`,
      type: "info",
    });
    if (saveAsBiller) {
      saveBiller({
        label: formData.nickname || `${formData.provider} ${selectedCategory.label}`,
        provider: formData.provider,
        category: selectedCategory.label,
        accountId: formData.accountId,
      });
    }
    setReceipt({
      reference: transaction.reference,
      type: selectedCategory.label,
      recipient: `${formData.provider} (${formData.accountId})`,
      amount: `GHS ${formatAmount(amount)}`,
      fee: "GHS 0.00",
      date: `${transaction.date}, ${transaction.time}`,
      status: "Completed",
    });
    setPinOpen(false);
    setReceiptOpen(true);
    setPaymentDone(true);
    toast.success("Payment successful");
  };

  const reset = () => {
    setSelectedCategory(null);
    setPaymentDone(false);
    setSaveAsBiller(false);
    setFormData({ provider: "", accountId: "", amount: "", nickname: "" });
  };

  const chooseFavorite = (biller) => {
    setSelectedCategory(billCategories.find((item) => item.label === biller.category) || null);
    setFormData({
      provider: biller.provider,
      accountId: biller.accountId,
      amount: "",
      nickname: biller.label,
    });
    setView("categories");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Payments</h1>
        <p className="text-sm text-muted-foreground mb-6">Bills, airtime, data bundles, and saved billers</p>
      </motion.div>

      <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl w-fit mb-5">
        {[
          { id: "categories", label: "Pay" },
          { id: "favorites", label: "Saved Billers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${view === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "favorites" ? (
        <div className="space-y-3">
          <GlassCard>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Favorite Billers</h3>
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">Mark a biller as favorite after your next payment.</p>
            ) : (
              <div className="space-y-2">
                {favorites.map((biller) => (
                  <div key={biller.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{biller.label}</p>
                      <p className="text-xs text-muted-foreground">{biller.provider} - {biller.accountId}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => chooseFavorite(biller)}>Use</Button>
                    <button onClick={() => toggleBillerFavorite(biller.id)} className="p-2 rounded-lg hover:bg-secondary">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-3">All Saved Billers</h3>
            <div className="space-y-2">
              {billers.map((biller) => (
                <div key={biller.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{biller.label}</p>
                    <p className="text-xs text-muted-foreground">{biller.category} - {biller.provider} - {biller.accountId}</p>
                  </div>
                  <button onClick={() => toggleBillerFavorite(biller.id)} className="p-2 rounded-lg hover:bg-secondary">
                    <Star className={`w-4 h-4 ${biller.favorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {paymentDone ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <GlassCard className="text-center py-10 glow-border">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                  <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto mb-5 glow-teal">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                </motion.div>
                <h2 className="text-xl font-heading font-bold text-foreground mb-1">Payment Successful</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  GHS {formatAmount(formData.amount)} paid to {formData.provider}
                </p>
                <div className="flex gap-2 justify-center mt-6">
                  <Button variant="outline" onClick={() => setReceiptOpen(true)}>Receipt</Button>
                  <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">Make Another Payment</Button>
                </div>
              </GlassCard>
            </motion.div>
          ) : !selectedCategory ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {billCategories.map((cat, i) => (
                  <motion.button
                    key={cat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedCategory(cat)}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{cat.label}</span>
                  </motion.button>
                ))}
              </div>
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

                  <Input
                    placeholder={selectedCategory.label === "Airtime" || selectedCategory.label === "Data Bundle" ? "Phone Number" : "Account / Meter Number"}
                    className="bg-secondary/40 border-border/40"
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  />

                  <Input
                    placeholder="Amount (GHS)"
                    type="number"
                    className="bg-secondary/40 border-border/40"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    {["10", "20", "50"].map((amount) => (
                      <button key={amount} onClick={() => setFormData({ ...formData, amount })} className="py-2 rounded-lg bg-secondary/50 border border-border/40 text-xs font-medium text-muted-foreground">
                        GHS {amount}
                      </button>
                    ))}
                  </div>

                  <Input
                    placeholder="Save as e.g. Home ECG Meter"
                    className="bg-secondary/40 border-border/40"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  />

                  <button
                    onClick={() => setSaveAsBiller((value) => !value)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${saveAsBiller ? "border-primary/30 bg-primary/10 text-foreground" : "border-border/40 bg-secondary/20 text-muted-foreground"}`}
                  >
                    Save as biller for one-tap reuse
                  </button>

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
      )}

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
