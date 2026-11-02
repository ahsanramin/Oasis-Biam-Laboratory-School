"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, SearchX, LifeBuoy, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden bg-[var(--bg)]">

      {/* ================= BACKGROUND EFFECTS ================= */}

      {/* Layered ambient glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-[var(--primary)]/[0.1] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[var(--accent)]/[0.1] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Dot grid with radial mask */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      {/* ================= MAIN CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="relative text-center p-8 sm:p-12 rounded-[3rem] bg-[var(--card)]/[0.7] backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/[0.06] overflow-hidden">

          {/* Top hairline edge-light (replaces flat bar) */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent pointer-events-none" />

          {/* Inner corner glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/[0.08] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--accent)]/[0.06] rounded-full blur-3xl pointer-events-none" />

          {/* Ghost "404" watermark behind everything */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[280px] sm:text-[340px] font-black leading-none text-[var(--fg)]/[0.02] select-none pointer-events-none tracking-tighter">
            404
          </div>

          <div className="relative">

            {/* Glowing Icon Medallion */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
              className="relative mx-auto mb-8 w-max"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 -m-4 bg-[var(--primary)]/25 rounded-full blur-2xl pointer-events-none" />

              {/* Gradient ring */}
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-transparent ring-1 ring-[var(--primary)]/30 grid place-items-center shadow-[0_0_40px_var(--primary-glow)]">
                {/* Inner chip */}
                <div className="relative w-16 h-16 rounded-full bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 grid place-items-center">
                  {/* Inner sheen */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                  <SearchX className="relative h-8 w-8 text-[var(--primary)]" strokeWidth={2.5} />
                </div>
              </div>
            </motion.div>

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-4"
            >
              <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Page Not Found
            </motion.div>

            {/* Massive 404 */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
              className="text-[100px] sm:text-[140px] leading-[0.9] font-black gradient-text tracking-tighter drop-shadow-sm"
            >
              404
            </motion.h1>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
            >
              <h2 className="text-2xl sm:text-3xl font-black mb-3 text-[var(--fg)] tracking-tight">
                Lost in the campus?
              </h2>
              <p className="text-sm sm:text-base text-[var(--fg-muted)] mb-10 max-w-md mx-auto leading-relaxed font-medium">
                The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto gradient-brand shadow-glow rounded-xl px-8 h-14 font-bold text-base group overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all duration-300"
                >
                  {/* Sheen sweep */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative inline-flex items-center">
                    <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                    Back to Home
                  </span>
                </Button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl px-8 h-14 font-bold text-base bg-[var(--card)]/80 backdrop-blur-md hover:bg-[var(--bg-soft)] border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] hover:shadow-md transition-all duration-300 ring-1 ring-inset ring-white/[0.04] group"
                >
                  <LifeBuoy className="h-5 w-5 mr-2 text-[var(--primary)] group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}