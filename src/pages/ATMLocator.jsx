import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/banking/GlassCard";
import { MapPin, Navigation, Phone, Clock, Wifi, Building2 } from "lucide-react";

const locations = [
  { id: 1, name: "Bawjiase Main Branch", type: "branch", address: "Main Street, Bawjiase", distance: "0.2 km", hours: "Mon–Fri: 8am–5pm", phone: "+233 30 123 4567", atm: true, open: true },
  { id: 2, name: "Kasoa Junction ATM", type: "atm", address: "Kasoa Junction, Central Region", distance: "1.4 km", hours: "24/7", phone: null, atm: true, open: true },
  { id: 3, name: "Bawjiase Market Branch", type: "branch", address: "Market Square, Bawjiase", distance: "2.1 km", hours: "Mon–Sat: 8am–4pm", phone: "+233 30 765 4321", atm: true, open: false },
  { id: 4, name: "Ofaakor ATM", type: "atm", address: "Ofaakor Road, Awutu Senya", distance: "3.8 km", hours: "24/7", phone: null, atm: true, open: true },
  { id: 5, name: "Kasoa Branch", type: "branch", address: "Kasoa Town Center", distance: "5.2 km", hours: "Mon–Fri: 8am–5pm, Sat: 9am–1pm", phone: "+233 30 234 5678", atm: true, open: true },
];

export default function ATMLocator() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = locations.filter(l => filter === "all" || l.type === filter);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">ATM & Branch Locator</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Find Bawjiase Community Bank locations near you</p>
      </div>

      {/* Map Placeholder */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 h-44 bg-secondary/40">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Interactive map view</p>
          <p className="text-[10px] text-muted-foreground/60">Enable location access for directions</p>
        </div>
        {/* Fake map dots */}
        {[{ top: "30%", left: "25%" }, { top: "50%", left: "55%" }, { top: "65%", left: "35%" }, { top: "40%", left: "70%" }].map((pos, i) => (
          <div key={i} className="absolute w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg"
            style={{ top: pos.top, left: pos.left }} />
        ))}
        <button className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
          <Navigation className="w-3 h-3" /> Use My Location
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "branch", "atm"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "All" : f === "branch" ? "Branches" : "ATMs"}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="w-3 h-3 text-primary" />
          <span>{filtered.filter(l => l.open).length} open now</span>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((loc, i) => (
          <motion.div key={loc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlassCard onClick={() => setSelected(selected === loc.id ? null : loc.id)}
              className={`cursor-pointer transition-all ${selected === loc.id ? "border-primary/30 glow-border" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${loc.type === "branch" ? "bg-primary/10 border border-primary/20" : "bg-secondary border border-border/60"}`}>
                  {loc.type === "branch" ? <Building2 className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{loc.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium uppercase ${loc.open ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {loc.open ? "Open" : "Closed"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-primary">
                      <Navigation className="w-2.5 h-2.5" />{loc.distance}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-2.5 h-2.5" />{loc.hours}
                    </span>
                  </div>
                  {selected === loc.id && loc.phone && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 flex gap-2">
                      <a href={`tel:${loc.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                        <Phone className="w-3 h-3" /> Call Branch
                      </a>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/40 text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">
                        <Navigation className="w-3 h-3" /> Directions
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}