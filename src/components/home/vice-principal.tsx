"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Sparkles, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { initials } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function VicePrincipal({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-blue-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[520px] h-[520px] bg-indigo-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
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

        {/* ================= LEFT: MESSAGE ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="relative order-2 lg:order-1"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)]">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg)]">Vice Principal, Oasis BIAM</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <BadgeCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 dark:text-blue-400">Senior Academic Administrator</span>
            </div>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black font-display leading-[1.02] tracking-tight mb-3 break-words">
            {data.name}
          </h2>

          <p className="text-lg text-[var(--fg-muted)] font-semibold mb-8 tracking-tight">
            {data.designation || "Vice Principal"}
          </p>

          <div className="relative p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-xl mb-8 overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-20 pointer-events-none" />
            <Quote className="absolute -top-2 -left-2 h-20 w-20 text-blue-500/10 group-hover:text-blue-500/20 transition-colors duration-500" fill="currentColor" />
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-400 to-transparent opacity-60" />

            <p className="relative z-10 text-base sm:text-lg leading-[1.75] text-[var(--fg-muted)] font-medium italic">
              "{data.bio || "We are dedicated to fostering an environment of academic rigor and personal growth. Every student's success is our top priority, and we work tirelessly to support our faculty in delivering excellence."}"
            </p>

            <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border)] flex items-center">
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-black text-[var(--fg)] tracking-tight truncate">{data.name}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mt-1">Vice Principal Signature</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/teachers/${data._id}`}>
              <Button size="lg" className="relative rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:scale-[1.02] transition-all duration-300 group overflow-hidden ring-1 ring-inset ring-white/20">
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative inline-flex items-center">
                  Read Full Message <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ================= RIGHT: PREMIUM PORTRAIT ================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative order-1 lg:order-2"
        >
          <div className="absolute -inset-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--bg-soft)] border border-[var(--border)] shadow-2xl group">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-20 pointer-events-none" />
            {data.image ? (
              <Image src={data.image} alt={data.name} fill className="object-cover group-hover:scale-[1.06] transition-transform duration-[900ms] ease-out" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 grid place-items-center text-white text-8xl font-black">
                <span className="relative drop-shadow-lg">{initials(data.name)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}