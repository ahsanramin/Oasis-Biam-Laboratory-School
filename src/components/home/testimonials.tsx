"use client";

import { motion } from "framer-motion";
import { Quote, Star, Sparkles, User } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Testimonials({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || !testimonials.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[620px] h-[620px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/3" />
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Testimonials</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.05] mb-6"
          >
            What Parents <br className="hidden sm:block" />
            <span className="gradient-text">Say About Us.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Don't just take our word for it. Hear directly from the parents who trust us with their children's future.
          </motion.p>
        </div>

        {/* ================= TESTIMONIALS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => {
            // Fallback data extraction for safety
            const author = t.metadata?.author || "Anonymous Parent";
            const role = t.metadata?.role || "Parent";
            const initial = author.charAt(0).toUpperCase();
            const quoteText = t.description || t.quote || "This school has been a blessing for our family. The teachers are incredibly dedicated.";

            return (
              <motion.div
                key={t._id || i}
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

                  {/* ================= WATERMARK QUOTE ICON ================= */}
                  <Quote
                    className="absolute -top-4 -right-2 h-24 w-24 text-[var(--primary)]/[0.06] group-hover:text-[var(--primary)]/[0.12] rotate-12 transition-colors duration-500 pointer-events-none"
                    fill="currentColor"
                  />

                  {/* ================= STAR RATING ================= */}
                  <div className="relative z-10 flex gap-0.5 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-amber-500 text-amber-500 drop-shadow-sm"
                        strokeWidth={2.5}
                      />
                    ))}
                  </div>

                  {/* ================= QUOTE TEXT ================= */}
                  <p className="relative z-10 text-base sm:text-[17px] text-[var(--fg-muted)] leading-[1.75] italic mb-8 flex-1 font-medium">
                    "{quoteText}"
                  </p>

                  {/* ================= AUTHOR SECTION ================= */}
                  <div className="relative z-10 pt-6 border-t border-[var(--border)] flex items-center gap-4 mt-auto">

                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="relative w-12 h-12 rounded-full gradient-brand grid place-items-center text-white text-lg font-black shadow-md ring-2 ring-[var(--card)] ring-offset-0">
                        {/* Inner sheen */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.15] to-transparent pointer-events-none" />
                        <span className="relative tracking-tight">{initial}</span>
                      </div>

                      {/* Verified indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--card)] grid place-items-center shadow-sm shadow-emerald-500/30">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[var(--fg)] leading-tight group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight truncate">
                        {author}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-1 truncate">
                        {role}
                      </p>
                    </div>
                  </div>

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