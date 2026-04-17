import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/banking/GlassCard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const initialNotifications = [
  { id: 1, title: "Transfer Successful", message: "GH₵ 500.00 sent to Ama Mensah successfully.", time: "2 min ago", read: false, type: "success" },
  { id: 2, title: "Bill Payment Confirmed", message: "ECG electricity bill of GH₵ 320.00 paid.", time: "1 hr ago", read: false, type: "info" },
  { id: 3, title: "Salary Received", message: "GH₵ 4,500.00 deposited to your savings account.", time: "Yesterday", read: true, type: "success" },
  { id: 4, title: "Card Transaction Alert", message: "Your Visa card ending 7634 was used at Melcom for GH₵ 890.50.", time: "2 days ago", read: true, type: "alert" },
  { id: 5, title: "Security Notice", message: "A new device was used to log into your account.", time: "3 days ago", read: true, type: "warning" },
  { id: 6, title: "Fixed Deposit Matured", message: "Your 6-month fixed deposit of GH₵ 5,000 has matured.", time: "1 week ago", read: true, type: "info" },
];

const typeColors = {
  success: "bg-green-500/15 border-green-500/20",
  info: "bg-primary/10 border-primary/20",
  alert: "bg-orange-500/15 border-orange-500/20",
  warning: "bg-red-500/15 border-red-500/20",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification removed");
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </Button>
        )}
      </motion.div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </GlassCard>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                !n.read ? `${typeColors[n.type]} bg-card/60` : "border-border/30 bg-card/30 hover:bg-card/50"
              )}
              onClick={() => toggleRead(n.id)}
            >
              <div className="mt-0.5 flex-shrink-0">
                {!n.read && <Circle className="w-2.5 h-2.5 fill-primary text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">{n.time}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}