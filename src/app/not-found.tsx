"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, SearchX, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= BACKGROUND EFFECTS ================= */}
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern mask-fade-bottom opacity-20 pointer-events-none -z-10" />

      {/* ================= MAIN CARD ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="relative text-center p-8 sm:p-12 rounded-[3rem] bg-[var(--card)]/60 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/5">
          
          {/* Top Accent Gradient Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent rounded-full" />

          {/* Glowing Icon Orb */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-24 h-24 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 grid place-items-center mb-8 shadow-[0_0_40px_var(--primary-glow)]"
          >
            <SearchX className="h-12 w-12 text-[var(--primary)]" />
          </motion.div>

          {/* Massive 404 */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[100px] sm:text-[140px] leading-none font-black gradient-text tracking-tighter drop-shadow-sm"
          >
            404
          </motion.h1>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-3 text-[var(--fg)]">Lost in the campus?</h2>
            <p className="text-[var(--fg-muted)] text-lg mb-10 max-w-md mx-auto leading-relaxed">
              The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto gradient-brand shadow-glow rounded-xl px-8 h-14 font-bold text-base group">
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" /> Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 h-14 font-bold text-base bg-[var(--card)] hover:bg-[var(--bg-soft)] border-[var(--border)] transition-colors">
                <LifeBuoy className="h-5 w-5 mr-2 text-[var(--primary)]" /> Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}