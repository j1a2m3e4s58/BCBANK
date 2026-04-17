import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Phone, Mail, ChevronRight, Send, Bot, User, ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do I reset my PIN?", a: "Go to Settings → Security → Change PIN. You'll need your current PIN or OTP sent to your registered phone." },
  { q: "How long do transfers take?", a: "Intra-bank transfers are instant. Inter-bank transfers take 1–2 business days via GIP/ACH." },
  { q: "What are the transfer limits?", a: "Daily transfer limit is GH₵ 10,000 for regular accounts. Premium accounts get GH₵ 50,000 daily." },
  { q: "How do I dispute a transaction?", a: "Go to Transactions → tap the transaction → Report Issue. Our team responds within 48 hours." },
  { q: "Is my money insured?", a: "Yes. All deposits are insured up to GH₵ 6,250 by the Ghana Deposit Protection Corporation (GDPC)." },
];

const botReplies = {
  "help": "I can help with account inquiries, transfers, cards, and more. What do you need?",
  "balance": "Your current balance is GH₵ 24,850.00. Would you like to view recent transactions?",
  "transfer": "To make a transfer, go to the Transfer page from the main menu. Need help with a specific issue?",
  "card": "For card issues, go to Cards → manage your card settings there. What's the problem?",
  "loan": "We offer Personal, Business, and Salary Advance loans. Visit the Loans section to apply!",
  "default": "Thanks for reaching out! A support agent will follow up within 2 hours during business hours (Mon–Fri, 8am–5pm)."
};

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(botReplies)) {
    if (key !== "default" && lower.includes(key)) return botReplies[key];
  }
  return botReplies.default;
}

export default function Support() {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Hello! I'm Bawji, your virtual assistant. How can I help you today?", time: "Now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: input, time: "Now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now() + 1, role: "bot", text: getBotReply(userMsg.text), time: "Now" }]);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Support Center</h1>
        <p className="text-xs text-muted-foreground mt-0.5">We're here to help you</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl w-fit">
        {["chat", "faq", "contact"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {t === "chat" ? "Live Chat" : t === "faq" ? "FAQs" : "Contact Us"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="flex flex-col" style={{ height: "420px" }}>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-border/40 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Bawji Assistant</p>
                  <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><p className="text-[10px] text-green-400">Online</p></div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-auto">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/40"}`}>
                      {msg.text}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-secondary/60 border border-border/40 flex items-center justify-center flex-shrink-0 mt-auto">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 flex gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border/40">
                <Input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..." className="bg-secondary/50 border-border/60 text-sm flex-1" />
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
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-muted-foreground mt-2 leading-relaxed overflow-hidden">
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </motion.div>
        )}

        {tab === "contact" && (
          <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {[
              { icon: Phone, label: "Call Us", value: "+233 30 123 4567", sub: "Mon–Fri, 8am–5pm", action: "tel:+233301234567", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: MessageCircle, label: "WhatsApp", value: "+233 55 987 6543", sub: "Available 24/7", action: "https://wa.me/233559876543", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              { icon: Mail, label: "Email Support", value: "support@bawjiasecb.com", sub: "Response within 24 hrs", action: "mailto:support@bawjiasecb.com", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            ].map((c, i) => (
              <motion.a key={i} href={c.action} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
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