import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, CheckCircle2, User, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import { sampleBeneficiaries } from "@/lib/sampleData";
import { toast } from "sonner";

export default function Transfer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ recipient: "", amount: "", note: "", bank: "" });
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBeneficiaries = sampleBeneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBeneficiary = (b) => {
    setSelectedBeneficiary(b);
    setFormData({ ...formData, recipient: b.name, bank: b.bank });
    setStep(2);
  };

  const handleSubmit = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setStep(3);
    setTimeout(() => {
      toast.success("Transfer completed successfully!");
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ recipient: "", amount: "", note: "", bank: "" });
    setSelectedBeneficiary(null);
    setSearchTerm("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-1">Send Money</h1>
        <p className="text-sm text-muted-foreground mb-6">Transfer funds to any bank account</p>
      </motion.div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: step >= s ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Recipient */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <GlassCard className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Recent Beneficiaries</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {sampleBeneficiaries.slice(0, 4).map((b) => (
                  <button key={b.id} onClick={() => handleSelectBeneficiary(b)} className="flex flex-col items-center gap-1.5 min-w-[64px] group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-xs font-semibold text-primary">{b.avatar}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center truncate w-16">{b.name.split(" ")[0]}</span>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-secondary/40 border-border/40"
                />
              </div>
              <div className="space-y-1">
                {filteredBeneficiaries.map((b) => (
                  <button key={b.id} onClick={() => handleSelectBeneficiary(b)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-semibold text-muted-foreground">{b.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.bank} • {b.account}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              {/* New beneficiary */}
              <div className="mt-4 pt-4 border-t border-border/40">
                <h3 className="text-sm font-semibold text-foreground mb-3">New Recipient</h3>
                <div className="space-y-3">
                  <Select value={formData.bank} onValueChange={(v) => setFormData({ ...formData, bank: v })}>
                    <SelectTrigger className="bg-secondary/40 border-border/40">
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gcb">GCB Bank</SelectItem>
                      <SelectItem value="ecobank">Ecobank</SelectItem>
                      <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                      <SelectItem value="bawjiase">Bawjiase CB</SelectItem>
                      <SelectItem value="stanbic">Stanbic Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Account Number" className="bg-secondary/40 border-border/40" value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })} />
                  <Button onClick={() => formData.recipient && formData.bank && setStep(2)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <GlassCard>
              {selectedBeneficiary && (
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-secondary/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedBeneficiary.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedBeneficiary.bank} • {selectedBeneficiary.account}</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-xs text-muted-foreground mb-2">Enter Amount (GH₵)</p>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full text-center text-4xl md:text-5xl font-heading font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30"
                />
                <p className="text-xs text-muted-foreground mt-2">Available: GH₵ 24,850.00</p>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {["50", "100", "500", "1000"].map((amt) => (
                  <button key={amt} onClick={() => setFormData({ ...formData, amount: amt })}
                    className="py-2 rounded-lg bg-secondary/50 border border-border/40 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                    {amt}
                  </button>
                ))}
              </div>

              <Input placeholder="Add a note (optional)" className="bg-secondary/40 border-border/40 mb-4" value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })} />

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={handleSubmit} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Send Money <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 3: Success */}
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
                GH₵ {parseFloat(formData.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} sent to {selectedBeneficiary?.name || formData.recipient}
              </p>
              <p className="text-xs text-muted-foreground mb-6">Reference: TXN{Date.now().toString().slice(-8)}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetForm}>New Transfer</Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetForm}>Done</Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}