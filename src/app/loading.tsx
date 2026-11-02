"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] bg-[var(--bg)] flex flex-col items-center justify-center overflow-hidden">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Subtle radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center px-6 max-w-lg mx-auto text-center"
      >
        {/* ================= LOGO ================= */}
        <div className="relative mb-8">
          {/* Glowing pulse behind logo */}
          <div className="absolute inset-0 -m-4 bg-brand-500/30 rounded-full blur-2xl animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 ring-1 ring-inset ring-white/30 bg-white">
            <Image 
              src={LOGO} 
              alt="Oasis BIAM Laboratory School Logo" 
              fill 
              className="object-cover" 
              unoptimized 
              priority 
            />
          </div>
        </div>

        {/* ================= FULL SCHOOL NAME ================= */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-balance leading-[1.15] gradient-text mb-3 drop-shadow-sm">
          Oasis BIAM Laboratory School
        </h1>
        
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[var(--fg-muted)]">
          Preparing your experience
        </p>

        {/* ================= PREMIUM LOADING BAR ================= */}
        <div className="w-64 sm:w-72 h-1.5 bg-[var(--border)]/50 rounded-full overflow-hidden mt-8 relative">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 gradient-brand rounded-full shadow-[0_0_10px_var(--primary)]"
          />
        </div>
      </motion.div>
    </div>
  );
}