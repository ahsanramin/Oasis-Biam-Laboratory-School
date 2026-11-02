"use client";

import { Building2, GraduationCap, ShieldCheck, Landmark, School, BookOpen, Sparkles } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const PARTNERS = [
  { name: "District Administration", icon: Landmark, tint: "text-blue-500", bg: "bg-blue-500/10", hover: "group-hover:bg-blue-500", ring: "ring-blue-500/20" },
  { name: "BIAM Foundation", icon: ShieldCheck, tint: "text-emerald-500", bg: "bg-emerald-500/10", hover: "group-hover:bg-emerald-500", ring: "ring-emerald-500/20" },
  { name: "Ministry of Education", icon: GraduationCap, tint: "text-amber-500", bg: "bg-amber-500/10", hover: "group-hover:bg-amber-500", ring: "ring-amber-500/20" },
  { name: "Mymensingh Board", icon: School, tint: "text-purple-500", bg: "bg-purple-500/10", hover: "group-hover:bg-purple-500", ring: "ring-purple-500/20" },
  { name: "National Curriculum", icon: BookOpen, tint: "text-rose-500", bg: "bg-rose-500/10", hover: "group-hover:bg-rose-500", ring: "ring-rose-500/20" },
  { name: "Govt of Bangladesh", icon: Building2, tint: "text-indigo-500", bg: "bg-indigo-500/10", hover: "group-hover:bg-indigo-500", ring: "ring-indigo-500/20" },
];

export function Partners() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden bg-[var(--bg)] border-y border-[var(--border)]">

      {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[420px] h-[420px] bg-[var(--primary)]/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-brand-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center justify-center mb-12 text-center"
        >
          {/* Eyebrow badge */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              Our Trusted Partners
            </span>
          </div>

          <p className="text-lg lg:text-xl font-bold text-[var(--fg)] tracking-tight">
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
                  className="group relative flex items-center gap-4 px-5 py-3.5 mx-3 rounded-[1.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-500 whitespace-nowrap cursor-default"
                >
                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-10" />

                  {/* Inner hover aura */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/[0.08] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Icon medallion */}
                  <div className={`
                    relative w-12 h-12 rounded-xl grid place-items-center transition-all duration-500 shrink-0
                    ${p.bg} ${p.tint} ${p.hover} ring-1 ${p.ring} group-hover:ring-0
                    group-hover:text-white group-hover:scale-110 group-hover:-rotate-3
                    shadow-sm
                  `}>
                    {/* Inner sheen */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                    <Icon className="h-6 w-6 relative" strokeWidth={2.5} />
                  </div>

                  {/* Name */}
                  <span className="relative font-bold text-base text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight">
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