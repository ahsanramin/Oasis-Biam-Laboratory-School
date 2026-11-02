"use client";

import { motion } from "framer-motion";
import { Shield, Book, Star, Heart, Award, CheckCircle2, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, any> = {
  shield: Shield,
  book: Book,
  star: Star,
  heart: Heart,
  award: Award,
};

export function TrustSection({ reasons }: { reasons: any[] }) {
  if (!reasons || !reasons.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Why Choose Us</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.05] mb-6"
          >
            Why Parents <br className="hidden sm:block" />
            <span className="gradient-text">Trust Us.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We don't just teach; we nurture. Here is why generations of families have trusted us with their children's education.
          </motion.p>
        </div>

        {/* ================= REASONS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((r, i) => {
            const Icon = ICONS[r.metadata?.icon] || CheckCircle2;
            const title = r.title || "Trusted Education";
            const description = r.description || "We provide a safe, nurturing, and academically rigorous environment for every student.";

            return (
              <motion.div
                key={r._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: EASE }}
                className="relative group"
              >
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                <div className="relative h-full p-8 rounded-[2rem] flex flex-col overflow-hidden bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500">

                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Ghost index watermark */}
                  <div className="absolute top-3 right-5 text-[72px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* ================= WATERMARK ICON ================= */}
                  <Icon
                    className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--primary)] opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500"
                    strokeWidth={1}
                  />

                  {/* ================= ICON MEDALLION ================= */}
                  <div className="relative z-10 mb-6">
                    <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/20 group-hover:bg-[var(--primary)] group-hover:text-white group-hover:ring-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                      {/* Inner sheen */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.1] via-transparent to-transparent pointer-events-none" />
                      <Icon className="h-6 w-6 relative" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* ================= TEXT CONTENT ================= */}
                  <h3 className="relative z-10 text-xl font-bold mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight leading-snug">
                    {title}
                  </h3>

                  <p className="relative z-10 text-[var(--fg-muted)] leading-relaxed text-sm sm:text-[15px] flex-1 font-medium">
                    {description}
                  </p>

                  {/* ================= ANIMATED BOTTOM ACCENT BAR ================= */}
                  <div className="absolute bottom-0 left-0 right-0 h-1">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-amber-400 transition-all duration-700 rounded-r-full shadow-sm" />
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