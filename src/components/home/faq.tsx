"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!faqs || !faqs.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
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

      <div className="relative max-w-4xl mx-auto px-4 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-16">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">Got Questions?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]"
          >
            Frequently <br className="sm:hidden" />
            <span className="gradient-text">Asked Questions.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="mt-6 text-base lg:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Find answers to the most common questions about our curriculum, admissions, and campus life.
          </motion.p>
        </div>

        {/* ================= FAQ ACCORDION LIST ================= */}
        <div className="space-y-3.5">
          {faqs.map((f, i) => {
            const isOpen = open === f._id;

            return (
              <motion.div
                key={f._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.04, duration: 0.6, ease: EASE }}
                className={cn(
                  "group relative rounded-[1.5rem] border overflow-hidden transition-all duration-500",
                  isOpen
                    ? "bg-[var(--card)] border-[var(--primary)]/40 shadow-xl shadow-brand-500/[0.06]"
                    : "bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-lg hover:shadow-black/[0.03]"
                )}
              >
                {/* Top hairline edge-light */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none z-20",
                  isOpen
                    ? "bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
                    : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                )} />

                {/* Hover aura (only when closed) */}
                {!isOpen && (
                  <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-br from-brand-500/[0.08] via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />
                )}

                {/* Ghost index watermark */}
                <div className={cn(
                  "absolute top-2 right-4 text-[64px] font-black leading-none select-none pointer-events-none tracking-tighter transition-colors duration-500",
                  isOpen
                    ? "text-brand-500/[0.06]"
                    : "text-[var(--fg)]/[0.025] group-hover:text-[var(--fg)]/[0.04]"
                )}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Question Button */}
                <button
                  onClick={() => setOpen(isOpen ? null : f._id)}
                  className="relative w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4 z-10"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">

                    {/* Icon medallion */}
                    <div className={cn(
                      "relative shrink-0 w-10 h-10 rounded-xl grid place-items-center transition-all duration-500",
                      isOpen
                        ? "gradient-brand text-white shadow-lg shadow-brand-500/30 scale-110 ring-1 ring-inset ring-white/20"
                        : "bg-[var(--bg-soft)] text-[var(--fg-muted)] ring-1 ring-inset ring-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] group-hover:ring-[var(--primary)]/20"
                    )}>
                      {isOpen && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                      )}
                      <HelpCircle className="h-5 w-5 relative" strokeWidth={2.5} />
                    </div>

                    {/* Question text */}
                    <span className={cn(
                      "font-bold text-base sm:text-lg leading-snug transition-colors duration-300 tracking-tight min-w-0",
                      isOpen
                        ? "text-[var(--fg)]"
                        : "text-[var(--fg)] group-hover:text-[var(--primary)]"
                    )}>
                      {f.title || f.question}
                    </span>
                  </div>

                  {/* Chevron indicator */}
                  <div className={cn(
                    "shrink-0 w-9 h-9 rounded-full grid place-items-center transition-all duration-500 ring-1 ring-inset",
                    isOpen
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-[var(--primary)]/20 rotate-180"
                      : "bg-[var(--bg-soft)]/60 text-[var(--fg-muted)] ring-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] group-hover:ring-[var(--primary)]/20"
                  )}>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </button>

                {/* Animated Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="relative overflow-hidden"
                    >
                      {/* Answer top divider */}
                      <div className="mx-5 sm:mx-6 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

                      <div className="px-5 pb-6 pt-5 sm:px-6 sm:pl-[5.25rem] text-[var(--fg-muted)] leading-[1.8] text-[15px] font-medium">
                        {f.description || f.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated base accent when open */}
                {isOpen && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ================= STILL HAVE QUESTIONS CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mt-16 p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xl shadow-black/[0.04] group/cta"
        >
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />

          {/* Corner glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/[0.1] rounded-full blur-2xl group-hover/cta:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500 grid place-items-center shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
              <MessageSquare className="h-5 w-5 relative" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-[var(--fg)] tracking-tight">
                Still have questions?
              </h4>
              <p className="text-xs sm:text-sm font-medium text-[var(--fg-muted)] mt-1">
                Our friendly admissions team is ready to help.
              </p>
            </div>
          </div>

          <Link href="/contact" className="relative z-10 w-full sm:w-auto shrink-0">
            <button className="relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden group/btn ring-1 ring-inset ring-white/20">
              {/* Sheen sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative">Contact Support</span>
              <ArrowRight
                className="relative h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                strokeWidth={2.5}
              />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}