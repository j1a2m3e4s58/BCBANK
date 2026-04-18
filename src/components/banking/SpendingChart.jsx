import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "./GlassCard";

const data = [
  { month: "Jan", income: 3200, expense: 1800 },
  { month: "Feb", income: 2800, expense: 2100 },
  { month: "Mar", income: 3500, expense: 1600 },
  { month: "Apr", income: 4100, expense: 2400 },
  { month: "May", income: 3800, expense: 1900 },
  { month: "Jun", income: 4500, expense: 2200 },
  { month: "Jul", income: 3900, expense: 2600 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-strong rounded-lg border border-border/60 p-3">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: GH₵ {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SpendingChart() {
  return (
    <GlassCard className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">Cash Flow</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Income vs Expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[11px] text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(174 72% 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(174 72% 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(200 70% 50%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(200 70% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" name="Income" stroke="hsl(174 72% 50%)" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" name="Expenses" stroke="hsl(200 70% 50%)" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}