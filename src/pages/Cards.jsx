import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Eye, EyeOff, Lock, Plus, Settings, Snowflake, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import BankCard from "@/components/banking/BankCard";
import GlassCard from "@/components/banking/GlassCard";
import { toast } from "sonner";
import { useBankingData } from "@/lib/BankingDataContext";
import PinConfirmDialog from "@/components/banking/PinConfirmDialog";

export default function Cards() {
  const { cards, cardSettings, setCardSettings, addNotification, cardProfiles, updateCardProfile, formatAmount } = useBankingData();
  const [selectedCard, setSelectedCard] = useState(0);
  const [showCvv, setShowCvv] = useState(false);
  const [pendingSetting, setPendingSetting] = useState(null);
  const [limitDraft, setLimitDraft] = useState({ dailyLimit: "", onlineLimit: "" });

  const card = cards[selectedCard];
  const profile = cardProfiles[card.id] || { frozen: false, dailyLimit: 3000, onlineLimit: 1500, replacementRequested: false, pinRequested: false };

  const confirmCardAction = () => {
    if (pendingSetting === "freeze") {
      updateCardProfile(card.id, { frozen: !profile.frozen });
      addNotification({
        title: "Card Status Updated",
        message: `${card.type} ending ${card.number.slice(-4)} ${profile.frozen ? "unfrozen" : "frozen"}.`,
        type: "warning",
      });
      toast.success(profile.frozen ? "Card unfrozen" : "Card frozen");
    } else if (pendingSetting === "replace") {
      updateCardProfile(card.id, { replacementRequested: true });
      addNotification({
        title: "Card Replacement Requested",
        message: `Replacement request logged for ${card.type}.`,
        type: "info",
      });
      toast.success("Replacement request submitted");
    } else if (pendingSetting === "pin") {
      updateCardProfile(card.id, { pinRequested: true });
      addNotification({
        title: "PIN Reset Requested",
        message: `PIN reset request logged for ${card.type}.`,
        type: "info",
      });
      toast.success("PIN reset request submitted");
    } else if (pendingSetting === "limits") {
      updateCardProfile(card.id, {
        dailyLimit: Number(limitDraft.dailyLimit || profile.dailyLimit),
        onlineLimit: Number(limitDraft.onlineLimit || profile.onlineLimit),
      });
      addNotification({
        title: "Card Limits Updated",
        message: `Daily and online limits updated for ${card.type}.`,
        type: "info",
      });
      toast.success("Card limits updated");
    } else {
      setCardSettings((prev) => ({ ...prev, [pendingSetting]: !prev[pendingSetting] }));
      addNotification({
        title: "Card Setting Updated",
        message: `${pendingSetting.replace(/([A-Z])/g, " $1")} changed for ${card.type}.`,
        type: "info",
      });
      toast.success("Card setting updated");
    }
    setPendingSetting(null);
  };

  const requestLimitSave = () => {
    setPendingSetting("limits");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">My Cards</h1>
            <p className="text-sm text-muted-foreground">Manage card controls, limits, PIN, and replacement requests</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Add Card
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory mb-6">
        {cards.map((c, i) => (
          <div key={c.id} className="snap-center flex-shrink-0" onClick={() => {
            setSelectedCard(i);
            setLimitDraft({ dailyLimit: String((cardProfiles[c.id] || {}).dailyLimit || 3000), onlineLimit: String((cardProfiles[c.id] || {}).onlineLimit || 1500) });
          }}>
            <BankCard card={c} index={i} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Card Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
              <div>
                <p className="text-xs text-muted-foreground">Card Number</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{card.number}</p>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(card.number); toast.success("Copied"); }} className="p-2 rounded-lg hover:bg-secondary transition-colors">
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
                  <p className="text-sm font-medium text-foreground">{showCvv ? "847" : "***"}</p>
                  <button onClick={() => setShowCvv(!showCvv)}>
                    {showCvv ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">Daily Limit</p>
                <p className="text-sm font-medium text-foreground mt-0.5">GHS {formatAmount(profile.dailyLimit)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">Online Limit</p>
                <p className="text-sm font-medium text-foreground mt-0.5">GHS {formatAmount(profile.onlineLimit)}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Card Status</p>
              <p className={`text-sm font-medium mt-0.5 ${profile.frozen ? "text-yellow-400" : "text-green-400"}`}>
                {profile.frozen ? "Frozen" : "Active"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-heading font-semibold text-foreground mb-4">Card Controls</h3>
          <div className="space-y-3">
            {[
              { key: "onlinePurchases", label: "Online Purchases", desc: "Enable card for online payments" },
              { key: "intlTransactions", label: "International", desc: "Allow foreign transactions" },
              { key: "contactless", label: "Contactless Pay", desc: "Tap to pay enabled" },
              { key: "atmWithdrawal", label: "ATM Withdrawal", desc: "Enable ATM cash withdrawal" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{setting.label}</p>
                  <p className="text-[11px] text-muted-foreground">{setting.desc}</p>
                </div>
                <Switch checked={cardSettings[setting.key]} onCheckedChange={() => setPendingSetting(setting.key)} />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border/30 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Daily limit" type="number" value={limitDraft.dailyLimit || profile.dailyLimit} onChange={(e) => setLimitDraft((prev) => ({ ...prev, dailyLimit: e.target.value }))} className="bg-secondary/40 border-border/40" />
              <Input placeholder="Online limit" type="number" value={limitDraft.onlineLimit || profile.onlineLimit} onChange={(e) => setLimitDraft((prev) => ({ ...prev, onlineLimit: e.target.value }))} className="bg-secondary/40 border-border/40" />
            </div>
            <Button variant="outline" onClick={requestLimitSave} className="w-full gap-2">
              <Settings className="w-4 h-4" /> Save Limits
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button variant="outline" onClick={() => setPendingSetting("freeze")} className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
                <Snowflake className="w-4 h-4" /> {profile.frozen ? "Unfreeze" : "Freeze"}
              </Button>
              <Button variant="outline" onClick={() => setPendingSetting("pin")} className="gap-2">
                <Lock className="w-4 h-4" /> Reset PIN
              </Button>
              <Button variant="outline" onClick={() => setPendingSetting("replace")} className="gap-2">
                <Undo2 className="w-4 h-4" /> Replace Card
              </Button>
            </div>

            {(profile.replacementRequested || profile.pinRequested) && (
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">Service Requests</p>
                <p className="text-sm text-foreground mt-1">
                  {profile.pinRequested ? "PIN reset pending. " : ""}
                  {profile.replacementRequested ? "Replacement request logged." : ""}
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      <PinConfirmDialog
        open={Boolean(pendingSetting)}
        title="Confirm Card Action"
        description="Enter your transaction PIN to update this card."
        onCancel={() => setPendingSetting(null)}
        onConfirm={confirmCardAction}
      />
    </div>
  );
}
