import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassCard from "@/components/banking/GlassCard";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const logoSrc = "/bcb-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ accountNumber: "", password: "" });

  const submit = (event) => {
    event.preventDefault();
    const ok = login(form);
    if (!ok) {
      toast.error("Enter any account number and password for demo access");
      return;
    }
    toast.success("Signed in");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white border border-primary/25 mx-auto overflow-hidden flex items-center justify-center">
            <img src={logoSrc} alt="Bawjiase Community Bank PLC" className="w-full h-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-heading font-bold text-foreground">Bawjiase Community Bank</h1>
          <p className="text-sm text-muted-foreground mt-1">Secure mobile banking demo</p>
        </div>

        <GlassCard className="space-y-5">
          <div>
            <h2 className="text-lg font-heading font-semibold text-foreground">Login</h2>
            <p className="text-xs text-muted-foreground mt-1">Use any account number and password for demo testing.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Account Number</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  inputMode="numeric"
                  placeholder="0012345678"
                  value={form.accountNumber}
                  onChange={(event) => setForm({ ...form, accountNumber: event.target.value.replace(/\D/g, "").slice(0, 16) })}
                  className="pl-9 bg-secondary/50 border-border/60 h-11"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="pl-9 bg-secondary/50 border-border/60 h-11"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground">Login</Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            New customer? <Link to="/register" className="text-primary font-semibold hover:text-primary/80">Register for demo access</Link>
          </div>
          <div className="text-center text-xs">
            <Link to="/forgot-password" className="text-primary font-semibold hover:text-primary/80">Forgot password?</Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
