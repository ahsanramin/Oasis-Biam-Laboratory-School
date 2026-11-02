"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, GraduationCap, Award, TrendingUp, BookOpen, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// =========================================
// 1. PREMIUM TINT SYSTEM
// =========================================
const TINTS = {
  blue: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    hoverIcon: "group-hover:bg-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    orb: "bg-blue-500",
    ring: "ring-blue-500/20",
    glow: "from-blue-500/20",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    hoverIcon: "group-hover:bg-amber-500",
    gradient: "from-amber-500 to-orange-500",
    orb: "bg-amber-500",
    ring: "ring-amber-500/20",
    glow: "from-amber-500/20",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    hoverIcon: "group-hover:bg-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
    orb: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    glow: "from-emerald-500/20",
  },
  purple: {
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    hoverIcon: "group-hover:bg-purple-500",
    gradient: "from-purple-500 to-pink-500",
    orb: "bg-purple-500",
    ring: "ring-purple-500/20",
    glow: "from-purple-500/20",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    hoverIcon: "group-hover:bg-rose-500",
    gradient: "from-rose-500 to-red-500",
    orb: "bg-rose-500",
    ring: "ring-rose-500/20",
    glow: "from-rose-500/20",
  },
};

// =========================================
// 2. ANIMATED COUNTER COMPONENT
// =========================================
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2000);
      // Cubic ease-out for a smooth finish
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export function Stats() {
  const items = [
    { label: "Total Students", value: 1250, suffix: "+", icon: Users, tint: TINTS.blue },
    { label: "Expert Teachers", value: 45, suffix: "+", icon: GraduationCap, tint: TINTS.amber },
    { label: "Years of Excellence", value: 21, suffix: "+", icon: Award, tint: TINTS.emerald },
    { label: "Awards Won", value: 150, suffix: "+", icon: TrendingUp, tint: TINTS.purple },
    { label: "Library Books", value: 5000, suffix: "+", icon: BookOpen, tint: TINTS.rose },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)] border-y border-[var(--border)]">

      {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-blue-500/[0.05] rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
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

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 z-10">

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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">By The Numbers</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.05] mb-6"
          >
            Trusted by the <span className="gradient-text">Community.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Over two decades of delivering academic excellence, shaping leaders, and building a legacy of trust in Netrokona.
          </motion.p>
        </div>

        {/* ================= STATS GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {items.map((s, i) => {
            const Icon = s.icon;
            const theme = s.tint;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                // The last item on a 2-col mobile grid should span full width
                className={`relative group ${i === 4 ? "col-span-2 md:col-span-1" : ""}`}
              >
                {/* Outer hover aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none`} />

                <div
                  className={`
                    relative h-full p-6 rounded-[2rem] flex flex-col items-start overflow-hidden
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                    ring-1 ring-inset ring-white/[0.04]
                    hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5
                    transition-all duration-500
                  `}
                >

                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Background glowing orb */}
                  <div className={`
                    absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.15] blur-2xl pointer-events-none
                    group-hover:scale-150 group-hover:opacity-[0.28] transition-all duration-700 ${theme.orb}
                  `} />

                  {/* Ghost index watermark */}
                  <div className="absolute top-3 right-4 text-[64px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Icon medallion */}
                  <div className={`
                    relative z-10 mb-5 inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500
                    ${theme.iconBg} ${theme.iconColor} ring-1 ${theme.ring}
                    ${theme.hoverIcon}
                    group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 group-hover:ring-0 shadow-sm
                  `}>
                    {/* Inner sheen */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                    <Icon className="h-6 w-6 relative" strokeWidth={2.5} />
                  </div>

                  {/* Number */}
                  <p className="relative z-10 text-4xl lg:text-5xl font-black text-[var(--fg)] mb-2 tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300 tabular-nums">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>

                  {/* Label */}
                  <p className="relative z-10 text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em] leading-tight mt-auto">
                    {s.label}
                  </p>

                  {/* Animated bottom accent bar */}
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