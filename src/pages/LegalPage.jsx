import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, LockKeyhole, ShieldAlert, WalletCards } from "lucide-react";
import GlassCard from "@/components/banking/GlassCard";

const pages = {
  privacy: {
    title: "Privacy Policy",
    icon: LockKeyhole,
    intro: "How Bawjiase Community Bank PLC handles customer information in this mobile banking app.",
    sections: [
      ["Information We Collect", "Account profile details, device information, transaction activity, support messages, app diagnostics, and security events."],
      ["How We Use Information", "To provide banking services, protect accounts, prevent fraud, improve support, meet legal requirements, and notify customers about important activity."],
      ["Sharing", "Customer information is shared only with authorised banking partners, payment processors, regulators, fraud-prevention services, and support providers when required."],
      ["Your Choices", "Customers may request updates to profile information, manage notification preferences, and contact support for privacy requests."],
    ],
  },
  terms: {
    title: "Terms of Use",
    icon: FileText,
    intro: "Rules for using the BCB mobile banking experience.",
    sections: [
      ["Customer Responsibility", "Keep your PIN, password, OTP, and device secure. Report suspicious activity immediately."],
      ["Transactions", "Transfers and payments are processed based on submitted details. Review recipient, amount, and reference information before confirming."],
      ["Availability", "Services may be unavailable during maintenance, network issues, third-party outages, or security incidents."],
      ["Demo Notice", "This build currently runs in test mode. Live banking requires production authentication and bank-core approval before public release."],
    ],
  },
  fees: {
    title: "Fees & Limits",
    icon: WalletCards,
    intro: "Current demo limits and fee disclosures for testing the app flows.",
    sections: [
      ["Transfers", "Demo daily transfer limit: GH₵ 10,000. Bank-approved public limits must be added before launch."],
      ["Mobile Money", "Demo wallet fee: GH₵ 1.00 per transaction. Live fees must match official BCB and network pricing."],
      ["Bill Payments", "Demo bill payments show GH₵ 0.00 fees. Live provider fees must be displayed before confirmation."],
      ["Cards", "Card controls are demo-only until connected to the card processor or core banking system."],
    ],
  },
  security: {
    title: "Security Center",
    icon: ShieldAlert,
    intro: "Security guidance for customers using BCB mobile banking.",
    sections: [
      ["Protect Your PIN", "Never share your PIN, password, OTP, or card details with anyone, including people claiming to be bank staff."],
      ["Device Safety", "Use a secure screen lock, keep your phone updated, and avoid installing apps from unknown sources."],
      ["Fraud Alerts", "Report unexpected login alerts, unknown transactions, or suspicious calls immediately through Support."],
      ["Before Public Launch", "Production release must include authentication, fraud monitoring, audit logs, encryption review, and secure backend integration."],
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams();
  const page = pages[slug] || pages.terms;
  const Icon = page.icon;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-5">
      <Link to="/settings" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
      </Link>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">{page.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Last updated: April 17, 2026</p>
        </div>
      </div>

      <GlassCard className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{page.intro}</p>
        {page.sections.map(([title, body]) => (
          <div key={title} className="pt-3 border-t border-border/30 first:border-t-0 first:pt-0">
            <h2 className="text-sm font-heading font-semibold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{body}</p>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
