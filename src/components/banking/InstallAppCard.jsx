import React, { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/banking/GlassCard";
import { toast } from "sonner";

export default function InstallAppCard() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setInstalled(Boolean(standalone));

    const handleBeforeInstall = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      toast.success("BCB installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      toast.info("Use your browser menu and choose Install App or Add to Home Screen.");
      return;
    }

    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <GlassCard className="mb-5 border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-heading font-semibold text-foreground">
            {installed ? "BCB is installed" : "Install BCB on this device"}
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Open BCB like a normal app with the bank logo on your home screen.
          </p>
        </div>
        {!installed && (
          <Button size="sm" onClick={installApp} className="flex-shrink-0">
            <Download className="w-3.5 h-3.5" /> Install
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
