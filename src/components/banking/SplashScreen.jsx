import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("bounce"); // bounce -> expand -> fade

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("expand"), 1800);
    const t2 = setTimeout(() => setPhase("fade"), 2400);
    const t3 = setTimeout(() => onComplete(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fade" ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
          style={{ background: "hsl(220 20% 6%)" }}
        >
          {/* Background glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(174 72% 50% / 0.25), transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(200 70% 50% / 0.15), transparent 70%)" }}
          />

          {/* Logo container */}
          <motion.div
            animate={
              phase === "bounce"
                ? { y: [0, -28, 0, -14, 0, -6, 0], scale: [1, 1.08, 0.96, 1.04, 0.98, 1.01, 1] }
                : phase === "expand"
                ? { scale: [1, 1.18, 0.95, 1] }
                : { scale: 1 }
            }
            transition={
              phase === "bounce"
                ? { duration: 1.6, times: [0, 0.2, 0.4, 0.55, 0.7, 0.82, 1], ease: "easeOut" }
                : { duration: 0.4, ease: "easeInOut" }
            }
            className="relative flex flex-col items-center gap-5"
          >
            {/* Icon ring */}
            <div className="relative">
              {/* Outer pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border border-primary/50"
                style={{ margin: "-8px" }}
              />
              {/* Second pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-2xl border border-primary/30"
                style={{ margin: "-8px" }}
              />

              {/* Main icon box */}
              <motion.div
                animate={{ boxShadow: ["0 0 20px hsl(174 72% 50% / 0.3)", "0 0 40px hsl(174 72% 50% / 0.6)", "0 0 20px hsl(174 72% 50% / 0.3)"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center"
              >
                <Building2 className="w-10 h-10 text-primary" />
              </motion.div>
            </div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
                Bawjiase CB
              </h1>
              <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
                Community Bank PLC
              </p>
            </motion.div>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-16 w-32"
          >
            <div className="h-0.5 bg-border/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}