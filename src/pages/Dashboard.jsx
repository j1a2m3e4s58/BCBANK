import React from "react";
import { Link } from "react-router-dom";
import { Bell, TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowRight, Banknote, Target } from "lucide-react";
import { motion } from "framer-motion";
import BalanceCard from "@/components/banking/BalanceCard";
import QuickActions from "@/components/banking/QuickActions";
import TransactionItem from "@/components/banking/TransactionItem";
import StatWidget from "@/components/banking/StatWidget";
import SpendingChart from "@/components/banking/SpendingChart";
import GlassCard from "@/components/banking/GlassCard";
import { sampleTransactions, sampleNotifications } from "@/lib/sampleData";

export default function Dashboard() {
  const unreadCount = sampleNotifications.filter(n => !n.read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground">{greeting},</p>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground mt-0.5 tracking-tight">Kwame Asante 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/support" className="p-2.5 rounded-xl bg-card/60 border border-border/50 hover:border-primary/30 transition-colors">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </Link>
          <Link to="/notifications" className="relative p-2.5 rounded-xl bg-card/60 border border-border/50 hover:border-primary/30 transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          <BalanceCard />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatWidget icon={TrendingUp} label="Income" value="GH₵ 4,500" trend="+12%" trendUp color="primary" index={0} />
            <StatWidget icon={TrendingDown} label="Expenses" value="GH₵ 2,840" trend="-8%" trendUp={false} color="blue" index={1} />
            <StatWidget icon={Wallet} label="Savings" value="GH₵ 12,300" trend="+5%" trendUp color="purple" index={2} />
            <StatWidget icon={PiggyBank} label="Invested" value="GH₵ 3,200" trend="+18%" trendUp color="orange" index={3} />
          </div>

          <QuickActions />
          <SpendingChart />

          {/* Quick Links Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Apply for Loan", sub: "From 15% p.a.", path: "/loans", icon: Banknote, color: "from-primary/15 to-primary/5 border-primary/20" },
              { label: "Savings Goals", sub: "3 active goals", path: "/savings", icon: Target, color: "from-purple-500/15 to-purple-500/5 border-purple-500/20" },
              { label: "Track Budget", sub: "April 2026", path: "/budget", icon: TrendingDown, color: "from-orange-500/15 to-orange-500/5 border-orange-500/20" },
            ].map((item, i) => (
              <Link key={item.path} to={item.path}>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className={`p-3 rounded-xl border bg-gradient-to-b ${item.color} hover:scale-[1.02] transition-all cursor-pointer`}>
                  <item.icon className="w-4 h-4 text-foreground mb-2 opacity-70" />
                  <p className="text-xs font-semibold text-foreground leading-tight">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-semibold text-foreground">Recent Activity</h3>
              <Link to="/transactions" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-0.5">
              {sampleTransactions.slice(0, 6).map((tx, i) => (
                <TransactionItem key={tx.id} transaction={tx} index={i} />
              ))}
            </div>
          </GlassCard>

          {/* Savings goal mini */}
          <GlassCard className="border-primary/15 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(174 72% 50% / 0.06), hsl(200 70% 50% / 0.04))" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Savings Goal</p>
                <p className="text-sm font-heading font-semibold text-foreground mt-0.5">New Car 🚗</p>
              </div>
              <span className="text-xs font-bold text-primary">42%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} transition={{ duration: 1.2, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
              <span>GH₵ 12,500 saved</span><span>GH₵ 30,000 goal</span>
            </div>
            <Link to="/savings" className="mt-3 block text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
              View all goals →
            </Link>
          </GlassCard>

          {/* Promo */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-xl p-4 border border-primary/20 glow-teal-sm"
            style={{ background: "linear-gradient(135deg, hsl(174 72% 50% / 0.1), hsl(200 70% 50% / 0.06))" }}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
            <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-1">Special Offer</p>
            <h3 className="text-sm font-heading font-semibold text-foreground mb-1">Earn 22% p.a. on Fixed Deposits</h3>
            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">Lock your savings for 90+ days and earn premium interest rates.</p>
            <Link to="/savings" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Start Saving →
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}