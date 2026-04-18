import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, Camera, CreditCard, FileCheck2, LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/banking/GlassCard";
import { useAuth } from "@/lib/AuthContext";
import { useBankingData } from "@/lib/BankingDataContext";
import { toast } from "sonner";

const logoSrc = "/bcb-logo.png";
const accountTypes = ["Savings Account", "Current Account", "Student Account", "Business Account", "Susu / Group Savings"];
const branches = ["Bawjiase Main Branch", "Bawjiase Market Branch", "Kasoa Branch", "Ofaakor Service Point"];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addNotification } = useBankingData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    accountNumber: "",
    password: "",
    phone: "",
    ghanaCard: "",
    dateOfBirth: "",
    address: "",
    occupation: "",
    nextOfKin: "",
    branch: "",
    accountType: "",
    otp: "",
    transactionPin: "",
    confirmPin: "",
    ghanaCardFront: false,
    ghanaCardBack: false,
    selfie: false,
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validateStep = () => {
    if (step === 1 && (!form.fullName || !form.accountNumber || !form.password || form.phone.length < 9)) return "Enter name, account number, phone, and password";
    if (step === 2 && (!form.ghanaCard || !form.dateOfBirth || !form.address || !form.occupation || !form.nextOfKin || !form.branch)) return "Complete all KYC details";
    if (step === 3 && !form.accountType) return "Choose account type";
    if (step === 4 && (!form.ghanaCardFront || !form.ghanaCardBack || !form.selfie)) return "Mark all verification documents as captured";
    if (step === 5 && form.otp.length !== 6) return "Enter any 6-digit OTP";
    if (step === 6 && (form.transactionPin.length !== 4 || form.transactionPin !== form.confirmPin)) return "Create matching 4-digit PINs";
    return "";
  };

  const next = () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    if (step < 6) {
      setStep(step + 1);
      return;
    }

    const ok = register({
      fullName: form.fullName,
      accountNumber: form.accountNumber,
      password: form.password,
      phone: form.phone,
      accountType: form.accountType,
      transactionPin: form.transactionPin,
      kyc: {
        ghanaCard: form.ghanaCard,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        occupation: form.occupation,
        nextOfKin: form.nextOfKin,
        branch: form.branch,
        documents: {
          ghanaCardFront: form.ghanaCardFront,
          ghanaCardBack: form.ghanaCardBack,
          selfie: form.selfie,
        },
      },
    });

    if (!ok) {
      toast.error("Complete registration details");
      return;
    }
    addNotification({
      title: "Account Opening Submitted",
      message: `${form.accountType} onboarding submitted for review.`,
      type: "info",
    });
    toast.success("Account opening submitted");
    navigate("/");
  };

  const progress = Math.round((step / 6) * 100);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white border border-primary/25 mx-auto overflow-hidden flex items-center justify-center">
            <img src={logoSrc} alt="Bawjiase Community Bank PLC" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-heading font-bold text-foreground">Open Your BCB Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Demo onboarding accepts any valid-looking details.</p>
        </div>

        <GlassCard className="space-y-5">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {step} of 6</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <StepTitle icon={UserRound} title="Customer Details" />
              <Input placeholder="Full legal name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
              <Input inputMode="numeric" placeholder="Account number" value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 16))} className="bg-secondary/50 border-border/60 h-11" />
              <Input inputMode="numeric" placeholder="Phone number e.g. 0241234567" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="bg-secondary/50 border-border/60 h-11" />
              <Input type="password" placeholder="Create password" value={form.password} onChange={(e) => update("password", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <StepTitle icon={BadgeCheck} title="KYC Information" />
              <Input placeholder="Ghana Card number" value={form.ghanaCard} onChange={(e) => update("ghanaCard", e.target.value.toUpperCase())} className="bg-secondary/50 border-border/60 h-11" />
              <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
              <Input placeholder="Residential address" value={form.address} onChange={(e) => update("address", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
              <Input placeholder="Occupation" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
              <Input placeholder="Next of kin" value={form.nextOfKin} onChange={(e) => update("nextOfKin", e.target.value)} className="bg-secondary/50 border-border/60 h-11" />
              <Select value={form.branch} onValueChange={(value) => update("branch", value)}>
                <SelectTrigger className="bg-secondary/50 border-border/60 h-11"><SelectValue placeholder="Select preferred branch" /></SelectTrigger>
                <SelectContent>{branches.map((branch) => <SelectItem key={branch} value={branch}>{branch}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <StepTitle icon={CreditCard} title="Account Type" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {accountTypes.map((type) => (
                  <button key={type} onClick={() => update("accountType", type)}
                    className={`p-3 rounded-xl border text-left transition-all ${form.accountType === type ? "border-primary/40 bg-primary/10" : "border-border/50 bg-secondary/30"}`}>
                    <p className="text-sm font-semibold text-foreground">{type}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Available for demo onboarding</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <StepTitle icon={Camera} title="Document Verification" />
              {[
                ["ghanaCardFront", "Ghana Card front captured"],
                ["ghanaCardBack", "Ghana Card back captured"],
                ["selfie", "Selfie verification captured"],
              ].map(([key, label]) => (
                <button key={key} onClick={() => update(key, !form[key])}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between ${form[key] ? "border-primary/40 bg-primary/10" : "border-border/50 bg-secondary/30"}`}>
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="text-xs text-primary">{form[key] ? "Done" : "Tap to mark"}</span>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <StepTitle icon={FileCheck2} title="Phone Verification" />
              <p className="text-xs text-muted-foreground">Enter any 6 digits for demo OTP verification.</p>
              <Input inputMode="numeric" placeholder="000000" value={form.otp} onChange={(e) => update("otp", e.target.value.replace(/\D/g, "").slice(0, 6))} className="bg-secondary/50 border-border/60 h-12 text-center text-xl tracking-[0.35em]" />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <StepTitle icon={LockKeyhole} title="Create Transaction PIN" />
              <Input type="password" inputMode="numeric" placeholder="4-digit PIN" value={form.transactionPin} onChange={(e) => update("transactionPin", e.target.value.replace(/\D/g, "").slice(0, 4))} className="bg-secondary/50 border-border/60 h-11 text-center tracking-[0.3em]" />
              <Input type="password" inputMode="numeric" placeholder="Confirm PIN" value={form.confirmPin} onChange={(e) => update("confirmPin", e.target.value.replace(/\D/g, "").slice(0, 4))} className="bg-secondary/50 border-border/60 h-11 text-center tracking-[0.3em]" />
            </div>
          )}

          <div className="flex gap-2">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>}
            <Button onClick={next} className="flex-1 bg-primary text-primary-foreground">{step === 6 ? "Complete Registration" : "Continue"}</Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Already registered? <Link to="/login" className="text-primary font-semibold hover:text-primary/80">Login</Link>
          </div>
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
