import React from "react";
import { CheckCircle2, FileCheck2, HeadphonesIcon, Landmark, ShieldAlert } from "lucide-react";
import GlassCard from "@/components/banking/GlassCard";
import { useAuth } from "@/lib/AuthContext";
import { useBankingData } from "@/lib/BankingDataContext";

export default function AdminPanel() {
  const { user } = useAuth();
  const { notifications, transactions, formatAmount } = useBankingData();
  const disputes = notifications.filter((item) => item.title?.toLowerCase().includes("dispute"));
  const pendingLoans = transactions.filter((tx) => tx.category === "loan");

  const cards = [
    { label: "KYC Applications", value: user?.kycStatus === "submitted" ? 1 : 0, icon: FileCheck2 },
    { label: "Loan Applications", value: pendingLoans.length || 1, icon: Landmark },
    { label: "Support Tickets", value: notifications.filter((n) => !n.read).length, icon: HeadphonesIcon },
    { label: "Disputes", value: disputes.length, icon: ShieldAlert },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Staff Admin</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Demo back-office view for applications, support, and disputes.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <GlassCard key={card.label} className="!p-4">
            <card.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-heading font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard>
          <h2 className="text-sm font-heading font-semibold text-foreground mb-3">Latest Account Application</h2>
          <div className="space-y-2 text-sm">
            <Row label="Customer" value={user?.full_name || "No customer"} />
            <Row label="Account" value={user?.accountNumber || "-"} />
            <Row label="Type" value={user?.accountType || "-"} />
            <Row label="Branch" value={user?.kyc?.branch || "-"} />
            <Row label="KYC Status" value={user?.kycStatus || "demo"} />
          </div>
          <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-300">Ready for staff review in demo mode.</p>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-heading font-semibold text-foreground mb-3">Recent Transaction Volume</h2>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex justify-between gap-3 border-b border-border/30 pb-2 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{tx.name}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.date} - {tx.status}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">GH₵ {formatAmount(tx.amount)}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
