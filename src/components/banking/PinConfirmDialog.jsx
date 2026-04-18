import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";

export default function PinConfirmDialog({
  open,
  title = "Confirm with PIN",
  description = "Enter your 4-digit PIN to continue.",
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
}) {
  const { verifyTransactionPin } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPin("");
      setError("");
    }
  }, [open]);

  const submit = () => {
    if (!verifyTransactionPin(pin)) {
      setError("Incorrect transaction PIN.");
      return;
    }
    onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel?.()}>
      <DialogContent className="max-w-sm rounded-xl border-border/60">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 border border-primary/25">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            placeholder="PIN"
            type="password"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
              setError("");
            }}
            onKeyDown={(event) => event.key === "Enter" && submit()}
            className="h-12 text-center text-xl tracking-[0.4em] bg-secondary/50 border-border/60"
          />
          {error && <p className="text-xs text-destructive text-center">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={submit} disabled={pin.length !== 4}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
