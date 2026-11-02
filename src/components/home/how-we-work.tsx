"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Award, Shield, Zap, Target, Sparkles, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// =========================================
// PREMIUM TINT SYSTEM (Consistent with other sections)
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
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    hoverIcon: "group-hover:bg-indigo-500",
    gradient: "from-indigo-500 to-blue-500",
    orb: "bg-indigo-500",
    ring: "ring-indigo-500/20",
    glow: "from-indigo-500/20",
  },
};

export function HowWeWork() {
  const features = [
    {
      title: "Personalized Learning",
      description: "Every student receives tailored attention from our expert faculty to ensure they reach their maximum potential.",
      icon: Users,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.blue,
    },
    {
      title: "Modern Curriculum",
      description: "English Version National Curriculum designed to prepare students for global challenges.",
      icon: BookOpen,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.amber,
    },
    {
      title: "Award-Winning Faculty",
      description: "Learn from highly qualified educators dedicated to academic excellence.",
      icon: Award,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.emerald,
    },
    {
      title: "Safe & Nurturing Environment",
      description: "A secure, inclusive campus equipped with modern facilities, labs, and a vast library to foster holistic growth.",
      icon: Shield,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.purple,
    },
    {
      title: "Continuous Assessment",
      description: "Regular progress tracking and parent-teacher meetings.",
      icon: Target,
      className: "md:col-span-1 lg:col-span-1",
      tint: TINTS.rose,
    },
    {
      title: "Co-Curricular Activities",
      description: "Sports, debates, and clubs for all-round development.",
      icon: Zap,
      className: "md:col-span-2 lg:col-span-2",
      tint: TINTS.indigo,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/3" />
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
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">The Oasis Advantage</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.05] mb-6"
          >
            Everything your child <br className="hidden sm:block" />
            needs to <span className="gradient-text">succeed.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="text-base lg:text-lg text-[var(--fg-muted)] font-medium leading-relaxed"
          >
            We combine traditional values with modern educational practices to create a learning environment where every student thrives.
          </motion.p>
        </div>

        {/* ================= BENTO GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 lg:gap-6 auto-rows-[minmax(240px,auto)]">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const theme = feature.tint;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                className={`relative group ${feature.className}`}
              >
                {/* Outer hover aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${theme.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none`} />

                <div
                  className={`
                    relative h-full p-6 sm:p-8 rounded-[2rem] flex flex-col overflow-hidden
                    bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)]
                    ring-1 ring-inset ring-white/[0.04]
                    hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1
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
                  <div className="absolute top-3 right-5 text-[72px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">

                    {/* Icon medallion */}
                    <div className={`
                      relative w-14 h-14 rounded-2xl grid place-items-center mb-7 shrink-0
                      ${theme.iconBg} ${theme.iconColor}
                      ring-1 ${theme.ring}
                      group-hover:scale-110 group-hover:-rotate-3 group-hover:text-white transition-all duration-500
                      shadow-sm
                      ${theme.hoverIcon}
                    `}>
                      {/* Inner sheen */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                      <Icon className="h-7 w-7 relative" strokeWidth={2.5} />
                    </div>

                    {/* Text content */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight leading-snug">
                      {feature.title}
                    </h3>

                    <p className="text-[var(--fg-muted)] font-medium leading-relaxed text-sm sm:text-[15px] flex-1">
                      {feature.description}
                    </p>

                    {/* Learn more indicator */}
                    <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--primary)] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </div>
                  </div>

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