import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";
import ReceiptDialog from "@/components/banking/ReceiptDialog";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";

const banks = ["Bawjiase CB", "GCB Bank", "Ecobank", "Fidelity Bank", "Stanbic Bank"];

export default function Transfer() {
  const {
    beneficiaries,
    balance,
    formatAmount,
    addTransaction,
    addNotification,
    addBeneficiary,
    deleteBeneficiary,
  } = useBankingData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ recipient: "", account: "", amount: "", note: "", bank: "" });
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData({
      ...formData,
      recipient: beneficiary.name,
      account: beneficiary.account,
      bank: beneficiary.bank,
    });
    setStep(2);
  };

  const validateTransfer = () => {
    const amount = Number(formData.amount);
    if (!formData.recipient.trim()) return "Enter recipient name";
    if (!formData.bank) return "Select recipient bank";
    if (!selectedBeneficiary && formData.account.replace(/\D/g, "").length < 8) return "Enter a valid account number";
    if (!amount || amount <= 0) return "Please enter a valid amount";
    if (amount > balance) return "Insufficient balance";
    return "";
  };

  const requestPin = () => {
    const error = validateTransfer();
    if (error) {
      toast.error(error);
      return;
    }
    setPinOpen(true);
  };

  const completeTransfer = () => {
    const amount = Number(formData.amount);
    const recipient = selectedBeneficiary?.name || formData.recipient.trim();
    const maskedAccount = selectedBeneficiary?.account || `****${formData.account.slice(-4)}`;
    const transaction = addTransaction({
      name: `Transfer to ${recipient}`,
      category: "transfer",
      type: "debit",
      amount,
      referencePrefix: "TXN",
      details: {
        recipient,
        bank: formData.bank,
        account: maskedAccount,
        note: formData.note,
      },
    });

    addNotification({
      title: "Transfer Successful",
      message: `GH₵ ${formatAmount(amount)} sent to ${recipient}.`,
      type: "success",
    });

    if (!selectedBeneficiary) {
      addBeneficiary({ name: recipient, bank: formData.bank, account: formData.account });
    }

    setReceipt({
      reference: transaction.reference,
      type: "Bank Transfer",
      recipient: `${recipient} (${formData.bank} ${maskedAccount})`,
      amount: `GH₵ ${formatAmount(amount)}`,
      fee: "GH₵ 0.00",
      date: `${transaction.date}, ${transaction.time}`,
      status: "Completed",
    });
    setPinOpen(false);
    setReceiptOpen(true);
    setStep(3);
    toast.success("Transfer completed successfully");
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ recipient: "", account: "", amount: "", note: "", bank: "" });
    setSelectedBeneficiary(null);
    setSearchTerm("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Send Money</h1>
        <p className="text-sm text-muted-foreground mb-6">Transfer funds to any bank account</p>
      </motion.div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((progressStep) => (
          <div key={progressStep} className="flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: step >= progressStep ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <GlassCard className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Beneficiaries</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {beneficiaries.slice(0, 4).map((beneficiary) => (
                  <button key={beneficiary.id} onClick={() => handleSelectBeneficiary(beneficiary)} className="flex flex-col items-center gap-1.5 min-w-[64px] group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-semibold text-primary">{beneficiary.avatar}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center truncate w-16">{beneficiary.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-foreground mb-3">All Beneficiaries</h3>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-9 bg-secondary/40 border-border/40"
                />
              </div>
              <div className="space-y-1">
                {filteredBeneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <button onClick={() => handleSelectBeneficiary(beneficiary)} className="flex flex-1 items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground">{beneficiary.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{beneficiary.name}</p>
                        <p className="text-xs text-muted-foreground">{beneficiary.bank} - {beneficiary.account}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        deleteBeneficiary(beneficiary.id);
                        toast.success("Beneficiary removed");
                      }}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border/40">
                <h3 className="text-sm font-semibold text-foreground mb-3">New Recipient</h3>
                <div className="space-y-3">
                  <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
                    <SelectTrigger className="bg-secondary/40 border-border/40">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Recipient Name"
                    className="bg-secondary/40 border-border/40"
                    value={formData.recipient}
                    onChange={(event) => setFormData({ ...formData, recipient: event.target.value })}
                  />
                  <Input
                    placeholder="Account Number"
                    inputMode="numeric"
                    className="bg-secondary/40 border-border/40"
                    value={formData.account}
                    onChange={(event) => setFormData({ ...formData, account: event.target.value.replace(/\D/g, "").slice(0, 16) })}
                  />
                  <Button onClick={() => {
                    const error = validateTransfer();
                    if (error && error !== "Please enter a valid amount") {
                      toast.error(error);
                      return;
                    }
                    setStep(2);
                  }} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{formData.recipient}</p>
                  <p className="text-xs text-muted-foreground">{formData.bank} - {selectedBeneficiary?.account || `****${formData.account.slice(-4)}`}</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xs text-muted-foreground mb-2">Enter Amount (GH₵)</p>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(event) => setFormData({ ...formData, amount: event.target.value })}
                  className="w-full text-center text-4xl md:text-5xl font-heading font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30"
                />
                <p className="text-xs text-muted-foreground mt-2">Available: GH₵ {formatAmount(balance)}</p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {["50", "100", "500", "1000"].map((amount) => (
                  <button key={amount} onClick={() => setFormData({ ...formData, amount })}
                    className="py-2 rounded-lg bg-secondary/50 border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                    {amount}
                  </button>
                ))}
              </div>

              <Input
                placeholder="Add a note (optional)"
                className="bg-secondary/40 border-border/40 mb-4"
                value={formData.note}
                onChange={(event) => setFormData({ ...formData, note: event.target.value })}
              />

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={requestPin} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Money <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="text-center py-10 glow-border">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto mb-5 glow-teal">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-1">Transfer Successful!</h2>
              <p className="text-sm text-muted-foreground mb-2">
                GH₵ {formatAmount(formData.amount || 0)} sent to {formData.recipient}
              </p>
              <p className="text-xs text-muted-foreground mb-6">Reference: {receipt?.reference}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setReceiptOpen(true)}>Receipt</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>Done</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <PinConfirmDialog
        open={pinOpen}
        title="Confirm Transfer"
        description="Enter your transaction PIN to send this transfer."
        onCancel={() => setPinOpen(false)}
        onConfirm={completeTransfer}
      />
      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </div>
  );
}
