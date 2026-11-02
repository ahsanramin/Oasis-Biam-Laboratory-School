"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { initials } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Principal({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ================= LEFT: PREMIUM PORTRAIT ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative order-1 lg:order-1"
        >
          <div className="absolute -inset-6 gradient-brand rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--bg-soft)] border border-[var(--border)] ring-1 ring-inset ring-white/[0.06] shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-20 pointer-events-none" />
            {data.image ? (
              <Image src={data.image} alt={data.name} fill className="object-cover group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out" />
            ) : (
              <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-8xl font-black">
                <span className="relative drop-shadow-lg">{initials(data.name)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </motion.div>

        {/* ================= RIGHT: MESSAGE ================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="order-2 lg:order-2"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg)]">Principal, Oasis BIAM</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">ADC for Education & ICT</span>
            </div>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black font-display leading-[1.02] tracking-tight mb-3 break-words">
            {data.name}
          </h2>

          <p className="text-lg text-[var(--fg-muted)] font-semibold mb-8 tracking-tight">
            {data.designation || "Principal"}
          </p>

          <div className="relative p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-xl mb-8 overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent z-20 pointer-events-none" />
            <Quote className="absolute -top-2 -left-2 h-20 w-20 text-[var(--primary)]/10 group-hover:text-[var(--primary)]/20 transition-colors duration-500" fill="currentColor" />
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[var(--primary)] via-amber-400 to-transparent opacity-60" />

            <p className="relative z-10 text-base sm:text-lg leading-[1.75] text-[var(--fg-muted)] font-medium italic">
              "{data.bio || "Our mission is to nurture the next generation with wisdom, discipline, and compassion. Every child who walks through our doors carries the potential to change the world — our job is to help them discover it."}"
            </p>

            <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border)] flex items-center">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-black text-[var(--fg)] tracking-tight truncate">{data.name}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mt-1">Principal Signature</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/teachers/${data._id}`}>
              <Button size="lg" className="relative rounded-xl font-bold gradient-brand text-white shadow-lg hover:scale-[1.02] transition-all duration-300 group overflow-hidden ring-1 ring-inset ring-white/20">
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative inline-flex items-center">
                  Read Full Message <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}