"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal, Star, Sparkles, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

// Extracted tint system for cleaner code and consistency
const TINTS = {
  amber: {
    icon: "text-amber-500",
    bg: "bg-amber-500/10",
    orb: "bg-amber-500",
    border: "hover:border-amber-500/40",
    shadow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
    ring: "ring-amber-500/20",
    glow: "from-amber-500/25",
  },
  blue: {
    icon: "text-blue-500",
    bg: "bg-blue-500/10",
    orb: "bg-blue-500",
    border: "hover:border-blue-500/40",
    shadow: "hover:shadow-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
    ring: "ring-blue-500/20",
    glow: "from-blue-500/25",
  },
  emerald: {
    icon: "text-emerald-500",
    bg: "bg-emerald-500/10",
    orb: "bg-emerald-500",
    border: "hover:border-emerald-500/40",
    shadow: "hover:shadow-emerald-500/10",
    gradient: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/20",
    glow: "from-emerald-500/25",
  },
  purple: {
    icon: "text-purple-500",
    bg: "bg-purple-500/10",
    orb: "bg-purple-500",
    border: "hover:border-purple-500/40",
    shadow: "hover:shadow-purple-500/10",
    gradient: "from-purple-500 to-pink-500",
    ring: "ring-purple-500/20",
    glow: "from-purple-500/25",
  },
};

export function Achievements({ stats }: { stats: any }) {
  const items = [
    {
      icon: Trophy,
      title: "Best School Award",
      subtitle: "Netrokona District, 2024",
      tint: TINTS.amber
    },
    {
      icon: Award,
      title: "Academic Excellence",
      subtitle: "Consistent 98% pass rate",
      tint: TINTS.blue
    },
    {
      icon: Medal,
      title: "Science Olympiad",
      subtitle: "3 national medals in 2025",
      tint: TINTS.emerald
    },
    {
      icon: Star,
      title: "20+ Years Legacy",
      subtitle: "Established since 2003",
      tint: TINTS.purple
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg-soft)]">

      {/* ================= AMBIENT BACKGROUND ================= */}

      {/* Dot grid with radial mask (replaces flat bg-grid-pattern) */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      {/* Layered ambient glows */}
      <div className="absolute top-0 left-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.1] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-amber-500/[0.1] rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Our Pride</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]"
          >
            Recognized for <br />
            <span className="gradient-text">Excellence & Impact.</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="mt-6 text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            From national olympiads to consistent academic success, our commitment to quality education has earned us recognition across the region.
          </motion.p>
        </div>

        {/* ================= ACHIEVEMENTS GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {items.map((a, i) => {
            const Icon = a.icon;
            const theme = a.tint;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                className="relative group"
              >
                {/* ================= OUTER HOVER AURA ================= */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none`} />

                <div
                  className={`
                    relative h-full p-6 sm:p-7 rounded-[2rem] cursor-default
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                    ring-1 ring-inset ring-white/[0.04]
                    ${theme.border} ${theme.shadow} hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1
                    transition-all duration-500 flex flex-col overflow-hidden
                  `}
                >

                  {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none z-20" />

                  {/* ================= BACKGROUND ORB ================= */}
                  <div
                    className={`
                      absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.15] blur-2xl pointer-events-none
                      group-hover:scale-150 group-hover:opacity-[0.28] transition-all duration-700 ${theme.orb}
                    `}
                  />

                  {/* ================= GHOST INDEX WATERMARK ================= */}
                  <div className="absolute top-3 right-5 text-[70px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* ================= ICON MEDALLION ================= */}
                  <div className="relative mb-7 z-10">
                    <div
                      className={`
                        relative inline-flex items-center justify-center w-14 h-14 rounded-2xl
                        ${theme.bg} ${theme.icon} ring-1 ${theme.ring}
                        group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500
                        shadow-sm
                      `}
                    >
                      {/* Inner sheen */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                      <Icon className="h-7 w-7 relative" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* ================= TEXT CONTENT ================= */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg sm:text-xl text-[var(--fg)] mb-2.5 leading-snug tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                      {a.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--fg-muted)] leading-relaxed mt-auto">
                      {a.subtitle}
                    </p>
                  </div>

                  {/* ================= BOTTOM ACCENT BAR ================= */}
                  <div className="absolute bottom-0 left-0 right-0 h-1">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${theme.gradient} transition-all duration-700 rounded-r-full shadow-sm`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= CTA LINK ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          className="mt-16 text-center"
        >
          <Link
            href="/achievements"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] text-[12px] font-black uppercase tracking-[0.14em] text-[var(--fg)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] overflow-hidden"
          >
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

            {/* Hover aura */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <span className="relative">View All Achievements</span>
            <ChevronRight
              className="relative h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}