"use client";

import { Building2, GraduationCap, ShieldCheck, Landmark, School, BookOpen, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { motion } from "framer-motion";

const PARTNERS = [
  { name: "District Administration", icon: Landmark, tint: "text-blue-500", bg: "bg-blue-500/10", hover: "group-hover:bg-blue-500" },
  { name: "BIAM Foundation", icon: ShieldCheck, tint: "text-emerald-500", bg: "bg-emerald-500/10", hover: "group-hover:bg-emerald-500" },
  { name: "Ministry of Education", icon: GraduationCap, tint: "text-amber-500", bg: "bg-amber-500/10", hover: "group-hover:bg-amber-500" },
  { name: "Netrokona Board", icon: School, tint: "text-purple-500", bg: "bg-purple-500/10", hover: "group-hover:bg-purple-500" },
  { name: "National Curriculum", icon: BookOpen, tint: "text-rose-500", bg: "bg-rose-500/10", hover: "group-hover:bg-rose-500" },
  { name: "Govt of Bangladesh", icon: Building2, tint: "text-indigo-500", bg: "bg-indigo-500/10", hover: "group-hover:bg-indigo-500" },
];

export function Partners() {
  return (
    <section className="relative py-16 overflow-hidden bg-[var(--bg)] border-y border-[var(--border)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)]">
              Our Trusted Partners
            </span>
          </div>
          <p className="text-lg font-bold text-[var(--fg)]">
            Guided & Supported By <span className="gradient-text">Leading Institutions</span>
          </p>
        </motion.div>

        {/* ================= MARQUEE ================= */}
        <div className="relative mask-fade-edges">
          <Marquee speed="slow">
            {PARTNERS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div 
                  key={i} 
                  className="group flex items-center gap-4 px-6 py-4 mx-3 rounded-[1.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300 whitespace-nowrap cursor-default"
                >
                  {/* Icon Bubble */}
                  <div className={`
                    w-12 h-12 rounded-xl grid place-items-center transition-all duration-300 shrink-0
                    ${p.bg} ${p.tint} ${p.hover} group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 shadow-sm
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  {/* Name */}
                  <span className="font-bold text-base text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                    {p.name}
                  </span>
                </div>
              );
            })}
          </Marquee>
        </div>

      </div>
    </section>
  );
}