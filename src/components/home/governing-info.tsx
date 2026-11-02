"use client";

import { Building2, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// =========================================
// TINT SYSTEM
// =========================================
const TINTS = {
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
};

export function GoverningInfo({ about }: { about: any }) {
  // Safe fallbacks if data is missing
  const districtInfo = about?.districtAdministration || "The school is directly supervised by the District Administration of Netrokona, ensuring transparent, high-standard educational management and community alignment.";
  const biamInfo = about?.biamFoundation || "Operating under the prestigious BIAM Foundation, we leverage their extensive educational expertise and national resources to maintain world-class academic excellence.";

  const cards = [
    {
      icon: Building2,
      title: "District Administration Netrokona",
      body: districtInfo,
      tint: TINTS.blue
    },
    {
      icon: ShieldCheck,
      title: "BIAM Foundation",
      body: biamInfo,
      tint: TINTS.amber
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
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

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Our Governance</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]"
          >
            Guided by <br className="hidden sm:block" />
            <span className="gradient-text">Trusted Institutions.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="mt-6 text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Our institution operates under the direct supervision and partnership of the region's most trusted educational and governmental bodies.
          </motion.p>
        </div>

        {/* ================= INFO CARDS GRID ================= */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const theme = c.tint;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
                className="relative group"
              >
                {/* Outer hover aura */}
                <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none`} />

                <div
                  className={`
                    relative h-full p-8 sm:p-10 rounded-[2.5rem]
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                    ring-1 ring-inset ring-white/[0.04]
                    ${theme.border} ${theme.shadow} hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5
                    transition-all duration-500 flex flex-col overflow-hidden
                  `}
                >

                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Background glowing orb */}
                  <div
                    className={`
                      absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.18] blur-3xl
                      pointer-events-none group-hover:opacity-40 group-hover:scale-125 transition-all duration-700
                      ${theme.orb}
                    `}
                  />

                  {/* Ghost watermark icon */}
                  <Icon className={`absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.03] ${theme.icon} pointer-events-none rotate-12`} strokeWidth={1} />

                  {/* Ghost index number */}
                  <div className="absolute top-4 right-6 text-[80px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.04] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Icon medallion */}
                  <div className="relative z-10 mb-8">
                    <div
                      className={`
                        relative inline-flex items-center justify-center w-16 h-16 rounded-2xl
                        ${theme.bg} ${theme.icon} ring-1 ${theme.ring}
                        group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500
                        shadow-sm
                      `}
                    >
                      {/* Inner sheen */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                      <Icon className="h-8 w-8 relative" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="relative z-10 flex-1 flex flex-col">

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--fg)] mb-4 leading-tight tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                      {c.title}
                    </h3>

                    {/* Body */}
                    <p className="text-[var(--fg-muted)] leading-[1.75] text-[15px] sm:text-base mb-8 flex-1 font-medium">
                      {c.body}
                    </p>

                    {/* Trust badge footer */}
                    <div className="relative pt-6 border-t border-[var(--border)] flex items-center gap-3">
                      <div className={`p-1 rounded-full ${theme.bg} ${theme.icon} ring-1 ${theme.ring}`}>
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)]">
                        Officially Recognized
                      </span>
                    </div>
                  </div>

                  {/* Animated bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${theme.gradient} transition-all duration-700 rounded-r-full shadow-sm`} />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}