"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

// =========================================
// ANIMATION VARIANTS
// =========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
  },
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]">
      
      {/* ================= PREMIUM BACKGROUND ================= */}
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-40 mask-fade-bottom pointer-events-none z-0" 
        style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)" }}
      />
      
      {/* Floating Ambient Orb 1 (Primary) */}
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)] rounded-full blur-[120px] pointer-events-none z-0" 
      />
      
      {/* Floating Ambient Orb 2 (Accent) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-amber-500 rounded-full blur-[100px] pointer-events-none z-0" 
      />

      {/* ================= MAIN CONTENT ================= */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center"
      >
        {/* Breadcrumb Pill */}
        <motion.div variants={itemVariants}>
          <nav 
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-sm mb-8"
          >
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors group"
            >
              <Home className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">Home</span>
            </Link>
            
            {breadcrumbs.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <ChevronRight className="h-3.5 w-3.5 text-[var(--fg-muted)]/50" />
                {b.href ? (
                  <Link 
                    href={b.href} 
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--primary)]">
                    {b.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </motion.div>

        {/* Massive Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display leading-[1.05] tracking-tighter mb-6 max-w-4xl text-balance text-[var(--fg)]"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            variants={itemVariants}
            className="text-lg lg:text-xl text-[var(--fg-muted)] font-medium max-w-2xl leading-relaxed text-balance"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}