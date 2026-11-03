"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CTA() {
  return (
    <section className="relative py-24 lg:py-32 px-4 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/[0.1] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-amber-500/[0.1] rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle radial dot grid behind section */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none -z-10"
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

      <div className="max-w-6xl mx-auto">

        {/* ================= GRADIENT BORDER WRAPPER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative p-[1px] rounded-[3rem] bg-gradient-to-br from-[var(--border)] via-[var(--primary)]/40 to-[var(--border)] shadow-2xl shadow-black/[0.06]"
        >
          {/* ================= MAIN CARD ================= */}
          <div className="relative rounded-[calc(3rem-1px)] overflow-hidden bg-[var(--card)]">

            {/* Top hairline edge-light */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-30 pointer-events-none" />

            {/* ================= INNER BACKGROUND PATTERNS ================= */}
            {/* Radial-masked dot grid */}
            <div
              className="absolute inset-0 opacity-[0.4] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
                backgroundSize: "32px 32px",
                maskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 70% at 50% 50%, #000 30%, transparent 100%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/[0.04] via-transparent to-amber-500/[0.04] pointer-events-none" />

            {/* ================= GHOST WATERMARK ================= */}
            <div className="absolute top-4 right-8 text-[180px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter z-0">
              ★
            </div>

            {/* ================= FLOATING DECORATIVE ICONS ================= */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-12 text-[var(--primary)]/[0.18] pointer-events-none hidden lg:block"
            >
              <GraduationCap className="w-24 h-24" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 right-12 text-amber-500/[0.18] pointer-events-none hidden lg:block"
            >
              <Star className="w-20 h-20" strokeWidth={1.5} />
            </motion.div>

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-20 text-center flex flex-col items-center">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
                className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-lg shadow-black/[0.03] mb-8 overflow-hidden"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)] shadow-sm shadow-brand-500/50"></span>
                </span>
                <span className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">
                  Admissions Open for 2027
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
                className="text-4xl md:text-5xl lg:text-7xl font-black font-display leading-[1.02] mb-6 max-w-4xl tracking-tight text-balance"
              >
                Give your child the <span className="gradient-text">future</span> they deserve.
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
                className="text-base lg:text-lg text-[var(--fg-muted)] font-medium mb-10 max-w-2xl leading-relaxed"
              >
                We are now accepting applications for the 2027 academic session. Secure your child's place at Netrokona's premier English-medium institution.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
                className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-4"
              >
                <Link href="/admission" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="relative w-full sm:w-auto h-16 px-10 text-base font-bold rounded-2xl gradient-brand text-white shadow-[0_0_40px_-10px_var(--primary-glow)] hover:shadow-[0_0_60px_-15px_var(--primary-glow)] hover:scale-[1.03] transition-all duration-500 group overflow-hidden ring-1 ring-inset ring-white/20"
                  >
                    {/* Top hairline */}
                    <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    {/* Sheen sweep */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center">
                      Apply Online Now
                      <ArrowRight
                        className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                        strokeWidth={2.5}
                      />
                    </span>
                  </Button>
                </Link>

                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative w-full sm:w-auto h-16 px-10 text-base font-bold rounded-2xl bg-[var(--bg)]/60 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:bg-[var(--card)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Top hairline */}
                    <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                    {/* Hover aura */}
                    <span className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <span className="relative">Contact Admissions</span>
                  </Button>
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}