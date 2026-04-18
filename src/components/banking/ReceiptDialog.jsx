import React from "react";
import { AlertTriangle, Download, ReceiptText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";

const logoSrc = "/bcb-logo.png";

export default function ReceiptDialog({ open, onOpenChange, receipt, onReportIssue }) {
  const { user } = useAuth();
  if (!receipt) return null;

  const rows = [
    ["Reference", receipt.reference],
    ["Customer", user?.full_name],
    ["Account", user?.accountNumber ? `****${String(user.accountNumber).slice(-4)}` : null],
    ["Type", receipt.type],
    ["Recipient", receipt.recipient],
    ["Amount", receipt.amount],
    ["Fee", receipt.fee || "GH₵ 0.00"],
    ["Date", receipt.date],
    ["Status", receipt.status || "Completed"],
  ].filter(([, value]) => value);

  const downloadReceipt = () => {
    const text = [
      "Bawjiase Community Bank PLC",
      "Transaction Receipt",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${receipt.reference || "bcb-receipt"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareReceipt = async () => {
    const text = [
      "Bawjiase Community Bank PLC",
      `Receipt: ${receipt.reference}`,
      `${receipt.type} - ${receipt.amount}`,
      `Date: ${receipt.date}`,
    ].join("\n");

    if (navigator.share) {
      await navigator.share({ title: "BCB Transaction Receipt", text });
      return;
    }

    await navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-border/60">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-primary/25 overflow-hidden">
            <img src={logoSrc} alt="Bawjiase Community Bank PLC" className="h-full w-full object-contain" />
          </div>
          <DialogTitle className="text-center">Transaction Receipt</DialogTitle>
          <DialogDescription className="text-center">
            Bawjiase Community Bank PLC
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
          <ReceiptText className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Reference</p>
          <p className="text-base font-heading font-bold text-foreground">{receipt.reference}</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-secondary/30 p-3 space-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-right font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={downloadReceipt}>
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="outline" onClick={shareReceipt}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
        {onReportIssue && (
          <Button variant="outline" onClick={() => onReportIssue(receipt)} className="w-full text-destructive border-destructive/20 hover:bg-destructive/10">
            <AlertTriangle className="h-4 w-4" /> Report Issue
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
