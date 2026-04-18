import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Search, Smartphone, Trash2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";
import ReceiptDialog from "@/components/banking/ReceiptDialog";
import NetworkLogo from "@/components/banking/NetworkLogo";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";

const banks = ["Bawjiase CB", "GCB Bank", "Ecobank", "Fidelity Bank", "Stanbic Bank"];
const walletNetworks = [
  { id: "mtn", name: "MTN MoMo" },
  { id: "telecel", name: "Telecel Cash" },
  { id: "airteltigo", name: "AirtelTigo Money" },
];
const transferTypes = [
  { id: "bank", label: "Account to Account", description: "Send from your BCB account to any bank account" },
  { id: "accountToWallet", label: "Account to Wallet", description: "Send directly to any mobile money wallet" },
  { id: "walletToAccount", label: "Wallet to Account", description: "Move money from wallet into your bank account" },
];

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
  const [formData, setFormData] = useState({
    transferType: "bank",
    recipient: "",
    account: "",
    amount: "",
    note: "",
    bank: "",
    network: "",
    walletNumber: "",
    sourceWalletNumber: "",
  });
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) =>
    beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateField = (key, value) => setFormData((current) => ({ ...current, [key]: value }));

  const resetForType = (transferType) => {
    setSelectedBeneficiary(null);
    setSearchTerm("");
    setFormData({
      transferType,
      recipient: "",
      account: "",
      amount: "",
      note: "",
      bank: "",
      network: "",
      walletNumber: "",
      sourceWalletNumber: "",
    });
  };

  const handleSelectBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData((current) => ({
      ...current,
      transferType: "bank",
      recipient: beneficiary.name,
      account: beneficiary.account,
      bank: beneficiary.bank,
    }));
    setStep(2);
  };

  const validateTransfer = (requireAmount = true) => {
    const amount = Number(formData.amount);

    if (formData.transferType === "bank") {
      if (!formData.recipient.trim()) return "Enter recipient name";
      if (!formData.bank) return "Select recipient bank";
      if (!selectedBeneficiary && formData.account.replace(/\D/g, "").length < 8) return "Enter a valid account number";
    }

    if (formData.transferType === "accountToWallet") {
      if (!formData.network) return "Select wallet network";
      if (!formData.recipient.trim()) return "Enter wallet holder name";
      if (formData.walletNumber.replace(/\D/g, "").length !== 9) return "Enter a valid wallet number";
    }

    if (formData.transferType === "walletToAccount") {
      if (!formData.network) return "Select source wallet network";
      if (formData.sourceWalletNumber.replace(/\D/g, "").length !== 9) return "Enter a valid source wallet number";
      if (!formData.recipient.trim()) return "Enter account holder name";
      if (!formData.bank) return "Select destination bank";
      if (formData.account.replace(/\D/g, "").length < 8) return "Enter a valid destination account number";
    }

    if (!requireAmount) return "";
    if (!amount || amount <= 0) return "Please enter a valid amount";
    if (formData.transferType !== "walletToAccount" && amount > balance) return "Insufficient balance";
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
    const recipient = formData.recipient.trim();
    const maskedAccount = `****${formData.account.slice(-4)}`;
    const maskedWallet = `+233 ${formData.walletNumber || formData.sourceWalletNumber}`;
    const networkName = walletNetworks.find((item) => item.id === formData.network)?.name;

    let transaction;
    let receiptData;
    let notification;

    if (formData.transferType === "bank") {
      const beneficiaryAccount = selectedBeneficiary?.account || maskedAccount;
      transaction = addTransaction({
        name: `Transfer to ${recipient}`,
        category: "transfer",
        type: "debit",
        amount,
        referencePrefix: "TXN",
        details: {
          recipient,
          bank: formData.bank,
          account: beneficiaryAccount,
          note: formData.note,
        },
      });

      notification = {
        title: "Transfer Successful",
        message: `GHS ${formatAmount(amount)} sent to ${recipient}.`,
        type: "success",
      };

      receiptData = {
        reference: transaction.reference,
        type: "Bank Transfer",
        recipient: `${recipient} (${formData.bank} ${beneficiaryAccount})`,
        amount: `GHS ${formatAmount(amount)}`,
        fee: "GHS 0.00",
        date: `${transaction.date}, ${transaction.time}`,
        status: "Completed",
      };

      if (!selectedBeneficiary) {
        addBeneficiary({ name: recipient, bank: formData.bank, account: formData.account });
      }
    }

    if (formData.transferType === "accountToWallet") {
      transaction = addTransaction({
        name: `Wallet transfer to ${recipient}`,
        category: "transfer",
        type: "debit",
        amount,
        referencePrefix: "WAL",
        details: {
          recipient,
          network: networkName,
          walletNumber: maskedWallet,
          note: formData.note,
        },
      });

      notification = {
        title: "Wallet Transfer Successful",
        message: `GHS ${formatAmount(amount)} sent to ${maskedWallet}.`,
        type: "success",
      };

      receiptData = {
        reference: transaction.reference,
        type: "Account to Wallet",
        recipient: `${recipient} (${networkName} ${maskedWallet})`,
        amount: `GHS ${formatAmount(amount)}`,
        fee: "GHS 0.00",
        date: `${transaction.date}, ${transaction.time}`,
        status: "Completed",
      };
    }

    if (formData.transferType === "walletToAccount") {
      transaction = addTransaction({
        name: `Wallet to account from ${networkName}`,
        category: "transfer",
        type: "credit",
        amount,
        referencePrefix: "W2A",
        details: {
          recipient,
          bank: formData.bank,
          account: maskedAccount,
          network: networkName,
          walletNumber: maskedWallet,
          note: formData.note,
        },
      });

      notification = {
        title: "Wallet Funding Successful",
        message: `GHS ${formatAmount(amount)} moved from ${networkName} to your account.`,
        type: "success",
      };

      receiptData = {
        reference: transaction.reference,
        type: "Wallet to Account",
        recipient: `${recipient} (${formData.bank} ${maskedAccount})`,
        amount: `GHS ${formatAmount(amount)}`,
        fee: "GHS 0.00",
        date: `${transaction.date}, ${transaction.time}`,
        status: "Completed",
      };
    }

    addNotification(notification);
    setReceipt(receiptData);
    setPinOpen(false);
    setReceiptOpen(true);
    setStep(3);
    toast.success("Transfer completed successfully");
  };

  const resetForm = () => {
    setStep(1);
    resetForType(formData.transferType);
  };

  const selectionSubtitle = (() => {
    if (formData.transferType === "accountToWallet") return "Send funds from your account to any wallet";
    if (formData.transferType === "walletToAccount") return "Move money from a wallet into your bank account";
    return "Transfer funds to any bank account";
  })();

  const summaryRecipient = (() => {
    if (formData.transferType === "accountToWallet") {
      return `${formData.recipient || "Wallet Holder"} - ${walletNetworks.find((item) => item.id === formData.network)?.name || "Wallet"} - +233 ${formData.walletNumber}`;
    }
    if (formData.transferType === "walletToAccount") {
      return `${formData.recipient || "Account Holder"} - ${formData.bank || "Bank"} - ${formData.account ? `****${formData.account.slice(-4)}` : ""}`;
    }
    return `${formData.bank} - ${selectedBeneficiary?.account || `****${formData.account.slice(-4)}`}`;
  })();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Transfers</h1>
        <p className="text-sm text-muted-foreground mb-6">{selectionSubtitle}</p>
      </motion.div>

      <GlassCard className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Transfer Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {transferTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                resetForType(type.id);
                setStep(1);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                formData.transferType === type.id ? "border-primary/40 bg-primary/10" : "border-border/50 bg-secondary/30"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{type.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </GlassCard>

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
          <motion.div key={`step1-${formData.transferType}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {formData.transferType === "bank" && (
              <>
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
                  <h3 className="text-sm font-semibold text-foreground mb-3">Account Recipient</h3>
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
                      <Select value={formData.bank} onValueChange={(value) => updateField("bank", value)}>
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
                        onChange={(event) => updateField("recipient", event.target.value)}
                      />
                      <Input
                        placeholder="Account Number"
                        inputMode="numeric"
                        className="bg-secondary/40 border-border/40"
                        value={formData.account}
                        onChange={(event) => updateField("account", event.target.value.replace(/\D/g, "").slice(0, 16))}
                      />
                      <Button
                        onClick={() => {
                          const error = validateTransfer(false);
                          if (error) {
                            toast.error(error);
                            return;
                          }
                          setStep(2);
                        }}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </>
            )}

            {formData.transferType === "accountToWallet" && (
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Wallet Recipient</h3>
                <div className="grid grid-cols-3 gap-2">
                  {walletNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => updateField("network", network.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${formData.network === network.id ? "border-primary/40 bg-primary/10" : "border-border/50 bg-secondary/30"}`}
                    >
                      <NetworkLogo id={network.id} className="w-12 h-8 mx-auto mb-2" />
                      <p className="text-[10px] font-medium text-foreground leading-tight">{network.name}</p>
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Wallet Holder Name"
                  className="bg-secondary/40 border-border/40"
                  value={formData.recipient}
                  onChange={(event) => updateField("recipient", event.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg bg-secondary/60 border border-border/60 text-xs text-muted-foreground">+233</div>
                  <Input
                    placeholder="24 123 4567"
                    inputMode="numeric"
                    className="bg-secondary/40 border-border/40"
                    value={formData.walletNumber}
                    onChange={(event) => updateField("walletNumber", event.target.value.replace(/\D/g, "").slice(0, 9))}
                  />
                </div>
                <Button
                  onClick={() => {
                    const error = validateTransfer(false);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
              </GlassCard>
            )}

            {formData.transferType === "walletToAccount" && (
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Wallet Funding Source</h3>
                <div className="grid grid-cols-3 gap-2">
                  {walletNetworks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => updateField("network", network.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${formData.network === network.id ? "border-primary/40 bg-primary/10" : "border-border/50 bg-secondary/30"}`}
                    >
                      <NetworkLogo id={network.id} className="w-12 h-8 mx-auto mb-2" />
                      <p className="text-[10px] font-medium text-foreground leading-tight">{network.name}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-lg bg-secondary/60 border border-border/60 text-xs text-muted-foreground">+233</div>
                  <Input
                    placeholder="Wallet Number"
                    inputMode="numeric"
                    className="bg-secondary/40 border-border/40"
                    value={formData.sourceWalletNumber}
                    onChange={(event) => updateField("sourceWalletNumber", event.target.value.replace(/\D/g, "").slice(0, 9))}
                  />
                </div>
                <Select value={formData.bank} onValueChange={(value) => updateField("bank", value)}>
                  <SelectTrigger className="bg-secondary/40 border-border/40">
                    <SelectValue placeholder="Destination Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Account Holder Name"
                  className="bg-secondary/40 border-border/40"
                  value={formData.recipient}
                  onChange={(event) => updateField("recipient", event.target.value)}
                />
                <Input
                  placeholder="Destination Account Number"
                  inputMode="numeric"
                  className="bg-secondary/40 border-border/40"
                  value={formData.account}
                  onChange={(event) => updateField("account", event.target.value.replace(/\D/g, "").slice(0, 16))}
                />
                <Button
                  onClick={() => {
                    const error = validateTransfer(false);
                    if (error) {
                      toast.error(error);
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
              </GlassCard>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key={`step2-${formData.transferType}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard>
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {formData.transferType === "bank" ? <User className="w-4 h-4 text-primary" /> : <Smartphone className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{formData.recipient}</p>
                  <p className="text-xs text-muted-foreground">{summaryRecipient}</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xs text-muted-foreground mb-2">Enter Amount (GHS)</p>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(event) => updateField("amount", event.target.value)}
                  className="w-full text-center text-4xl md:text-5xl font-heading font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30"
                />
                <p className="text-xs text-muted-foreground mt-2">Available: GHS {formatAmount(balance)}</p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {["50", "100", "500", "1000"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateField("amount", amount)}
                    className="py-2 rounded-lg bg-secondary/50 border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <Input
                placeholder="Add a note (optional)"
                className="bg-secondary/40 border-border/40 mb-4"
                value={formData.note}
                onChange={(event) => updateField("note", event.target.value)}
              />

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={requestPin} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {formData.transferType === "walletToAccount" ? "Fund Account" : "Send Money"} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key={`step3-${formData.transferType}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="text-center py-10 glow-border">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto mb-5 glow-teal">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-1">Transfer Successful!</h2>
              <p className="text-sm text-muted-foreground mb-2">
                GHS {formatAmount(formData.amount || 0)} {formData.transferType === "walletToAccount" ? "credited to" : "sent to"} {formData.recipient}
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
        title={formData.transferType === "walletToAccount" ? "Confirm Wallet Funding" : "Confirm Transfer"}
        description={
          formData.transferType === "walletToAccount"
            ? "Enter your transaction PIN to move money from wallet to account."
            : "Enter your transaction PIN to complete this transfer."
        }
        onCancel={() => setPinOpen(false)}
        onConfirm={completeTransfer}
      />
      <ReceiptDialog open={receiptOpen} onOpenChange={setReceiptOpen} receipt={receipt} />
    </div>
  );
}
