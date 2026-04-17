import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Lock, Unlock, Snowflake, Settings, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BankCard from "@/components/banking/BankCard";
import GlassCard from "@/components/banking/GlassCard";
import { sampleCards } from "@/lib/sampleData";
import { toast } from "sonner";

export default function Cards() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [showCvv, setShowCvv] = useState(false);
  const [cardSettings, setCardSettings] = useState({
    onlinePurchases: true,
    intlTransactions: false,
    contactless: true,
    atmWithdrawal: true,
  });

  const card = sampleCards[selectedCard];

  const toggleSetting = (key) => {
    setCardSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Card setting updated");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">My Cards</h1>
            <p className="text-sm text-muted-foreground">Manage your debit and credit cards</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Add Card
          </Button>
        </div>
      </motion.div>

      {/* Card carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory mb-6">
        {sampleCards.map((c, i) => (
          <div key={c.id} className="snap-center flex-shrink-0" onClick={() => setSelectedCard(i)}>
            <BankCard card={c} index={i} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card Details */}
        <GlassCard>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Card Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="text-xs text-muted-foreground">Card Number</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{card.number}</p>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(card.number); toast.success("Copied!"); }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">Expiry Date</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{card.expiry}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">CVV</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm font-medium text-foreground">{showCvv ? "847" : "•••"}</p>
                  <button onClick={() => setShowCvv(!showCvv)}>
                    {showCvv ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-lg font-heading font-bold text-foreground mt-0.5">{card.balance}</p>
            </div>
          </div>
        </GlassCard>

        {/* Card Settings */}
        <GlassCard>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Card Controls</h3>
          <div className="space-y-3">
            {[
              { key: "onlinePurchases", label: "Online Purchases", desc: "Enable card for online payments", icon: Settings },
              { key: "intlTransactions", label: "International", desc: "Allow foreign transactions", icon: Lock },
              { key: "contactless", label: "Contactless Pay", desc: "Tap to pay enabled", icon: Unlock },
              { key: "atmWithdrawal", label: "ATM Withdrawal", desc: "Enable ATM cash withdrawal", icon: Snowflake },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <setting.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{setting.label}</p>
                    <p className="text-[11px] text-muted-foreground">{setting.desc}</p>
                  </div>
                </div>
                <Switch checked={cardSettings[setting.key]} onCheckedChange={() => toggleSetting(setting.key)} />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
              <Snowflake className="w-4 h-4" /> Freeze Card
            </Button>
            <Button variant="outline" className="gap-2">
              <Lock className="w-4 h-4" /> Change PIN
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}