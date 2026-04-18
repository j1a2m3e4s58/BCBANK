import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassCard from "@/components/banking/GlassCard";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const logoSrc = "/bcb-logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ accountNumber: "", phone: "", otp: "", password: "" });

  const next = () => {
    if (step === 1 && (!form.accountNumber || form.phone.length < 9)) {
      toast.error("Enter account number and phone number");
      return;
    }
    if (step === 2 && form.otp.length !== 6) {
      toast.error("Enter any 6-digit OTP");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    const ok = resetPassword(form);
    if (!ok) {
      toast.error("Complete all reset details");
      return;
    }
    toast.success("Password reset complete");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white border border-primary/25 mx-auto overflow-hidden">
            <img src={logoSrc} alt="Bawjiase Community Bank PLC" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-heading font-bold text-foreground">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Demo reset accepts any matching-looking details.</p>
        </div>

        <GlassCard className="space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <StepTitle icon={Phone} title="Verify Account" />
              <Input inputMode="numeric" placeholder="Account number" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })} className="bg-secondary/50 border-border/60 h-11" />
              <Input inputMode="numeric" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="bg-secondary/50 border-border/60 h-11" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <StepTitle icon={ShieldCheck} title="OTP Verification" />
              <p className="text-xs text-muted-foreground">Enter any 6 digits for demo verification.</p>
              <Input inputMode="numeric" placeholder="000000" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })} className="bg-secondary/50 border-border/60 h-12 text-center text-xl tracking-[0.35em]" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <StepTitle icon={KeyRound} title="New Password" />
              <Input type="password" placeholder="New password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-secondary/50 border-border/60 h-11" />
            </div>
          )}
          <div className="flex gap-2">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>}
            <Button onClick={next} className="flex-1 bg-primary text-primary-foreground">{step === 3 ? "Reset Password" : "Continue"}</Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Remembered it? <Link to="/login" className="text-primary font-semibold">Login</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function StepTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="text-base font-heading font-semibold text-foreground">{title}</h2>
    </div>
  );
}
