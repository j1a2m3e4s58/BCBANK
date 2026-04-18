import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, ChevronDown, ChevronRight, Mail, MessageCircle, Phone, Send, User } from "lucide-react";
import { useBankingData } from "@/lib/BankingDataContext";
import { toast } from "sonner";

const faqs = [
  { q: "How do I reset my PIN?", a: "Go to Settings and use the change PIN flow. Demo mode accepts the stored transaction PIN." },
  { q: "How long do transfers take?", a: "Intra-bank transfers are instant. Inter-bank and wallet flows are shown instantly here for demo testing." },
  { q: "What are the transfer limits?", a: "Transfer and card limits are shown in the app and can be adjusted for the demo card controls." },
  { q: "How do I dispute a transaction?", a: "Go to Transactions, open the receipt, and tap report issue. It now appears in the support disputes list." },
  { q: "Is my money insured?", a: "This demo simulates a Ghana community bank experience. Final public wording should be reviewed by the bank before launch." },
];

const botReplies = {
  help: "I can help with account inquiries, transfers, cards, and support tickets. What do you need?",
  balance: "Your current balance is available on the dashboard. Would you like help finding a recent transaction?",
  transfer: "You can send Account to Account, Account to Wallet, and Wallet to Account from the Transfers page.",
  card: "Go to Cards to freeze a card, adjust limits, request replacement, or review card controls.",
  loan: "We offer Personal, Business, and Salary Advance loans in the demo. Visit Loans to continue.",
  default: "Thanks for reaching out. A support agent would normally follow up during business hours.",
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(botReplies)) {
    if (key !== "default" && lower.includes(key)) return botReplies[key];
  }
  return botReplies.default;
}

export default function Support() {
  const { disputes, addDispute } = useBankingData();
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Hello. I am Bawji, your virtual assistant. How can I help you today?", time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [issueForm, setIssueForm] = useState({ title: "", channel: "General", summary: "" });
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: input, time: "Now" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", text: getBotReply(userMsg.text), time: "Now" }]);
    }, 1000);
  };

  const submitIssue = () => {
    if (!issueForm.title.trim() || !issueForm.summary.trim()) {
      toast.error("Enter issue title and details");
      return;
    }
    addDispute({
      title: issueForm.title,
      channel: issueForm.channel,
      summary: issueForm.summary,
    });
    setIssueForm({ title: "", channel: "General", summary: "" });
    toast.success("Support issue submitted");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Support Center</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Help, contact options, and dispute tracking</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link to="/legal/security" className="rounded-xl border border-border/40 bg-card/50 p-3 hover:border-primary/30 transition-colors">
          <p className="text-xs font-semibold text-foreground">Security Center</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Fraud and PIN safety</p>
        </Link>
        <Link to="/legal/fees" className="rounded-xl border border-border/40 bg-card/50 p-3 hover:border-primary/30 transition-colors">
          <p className="text-xs font-semibold text-foreground">Fees and Limits</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Charges before you pay</p>
        </Link>
      </div>

      <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl w-fit">
        {["chat", "faq", "disputes", "contact"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="flex flex-col" style={{ height: "420px" }}>
              <div className="flex items-center gap-3 pb-3 border-b border-border/40 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Bawji Assistant</p>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><p className="text-[10px] text-green-400">Online</p></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "bot" && <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-auto"><Bot className="w-3 h-3 text-primary" /></div>}
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/40"}`}>{msg.text}</div>
                    {msg.role === "user" && <div className="w-7 h-7 rounded-full bg-secondary/60 border border-border/40 flex items-center justify-center flex-shrink-0 mt-auto"><User className="w-3 h-3 text-muted-foreground" /></div>}
                  </motion.div>
                ))}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-xs text-muted-foreground">Typing...</div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="bg-secondary/50 border-border/60 text-sm flex-1" />
                <Button onClick={sendMessage} size="icon" className="bg-primary text-primary-foreground h-9 w-9">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {tab === "faq" && (
          <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            {faqs.map((faq, i) => (
              <GlassCard key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="cursor-pointer">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{faq.q}</p>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-xs text-muted-foreground mt-2 leading-relaxed overflow-hidden">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {tab === "disputes" && (
          <motion.div key="disputes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <GlassCard className="space-y-3">
              <h3 className="text-sm font-heading font-semibold text-foreground">Submit New Issue</h3>
              <Input placeholder="Issue title" value={issueForm.title} onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })} className="bg-secondary/40 border-border/40" />
              <Input placeholder="Channel e.g. Transfer, Card, Wallet" value={issueForm.channel} onChange={(e) => setIssueForm({ ...issueForm, channel: e.target.value })} className="bg-secondary/40 border-border/40" />
              <textarea value={issueForm.summary} onChange={(e) => setIssueForm({ ...issueForm, summary: e.target.value })} placeholder="Describe what happened" className="min-h-28 w-full rounded-lg border border-border/40 bg-secondary/40 p-3 text-sm text-foreground outline-none" />
              <Button onClick={submitIssue} className="bg-primary text-primary-foreground">Submit Issue</Button>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Your Open Cases</h3>
              <div className="space-y-2">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="p-3 rounded-xl bg-secondary/30 border border-border/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{dispute.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{dispute.reference} - {dispute.channel}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${dispute.status === "Resolved" ? "bg-green-500/15 text-green-400" : dispute.status === "In Review" ? "bg-yellow-500/15 text-yellow-400" : "bg-blue-500/15 text-blue-400"}`}>
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{dispute.summary}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">{dispute.createdAt}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {tab === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {[
              { icon: Phone, label: "Call Us", value: "+233 30 123 4567", sub: "Mon-Fri, 8am-5pm", action: "tel:+233301234567", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: MessageCircle, label: "WhatsApp", value: "+233 55 987 6543", sub: "Available 24/7", action: "https://wa.me/233559876543?text=Hello%20BCB%20Support", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: Mail, label: "Email Support", value: "support@bawjiasecb.com", sub: "Response within 24 hrs", action: "mailto:support@bawjiasecb.com?subject=BCB%20Mobile%20Banking%20Support", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            ].map((c, i) => (
              <motion.a key={i} href={c.action} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="flex items-center gap-4 hover:border-primary/30 cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${c.bg}`}>
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.value}</p>
                    <p className="text-[10px] text-muted-foreground">{c.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </GlassCard>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
