"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal, Star, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

// Extracted tint system for cleaner code and consistency
const TINTS = {
  amber: {
    icon: "text-amber-500",
    bg: "bg-amber-500/10",
    orb: "bg-amber-500",
    border: "hover:border-amber-500/40",
    shadow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
  },
  blue: {
    icon: "text-blue-500",
    bg: "bg-blue-500/10",
    orb: "bg-blue-500",
    border: "hover:border-blue-500/40",
    shadow: "hover:shadow-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
  },
  emerald: {
    icon: "text-emerald-500",
    bg: "bg-emerald-500/10",
    orb: "bg-emerald-500",
    border: "hover:border-emerald-500/40",
    shadow: "hover:shadow-emerald-500/10",
    gradient: "from-emerald-500 to-teal-500",
  },
  purple: {
    icon: "text-purple-500",
    bg: "bg-purple-500/10",
    orb: "bg-purple-500",
    border: "hover:border-purple-500/40",
    shadow: "hover:shadow-purple-500/10",
    gradient: "from-purple-500 to-pink-500",
  },
};

export function Achievements({ stats }: { stats: any }) {
  const items = [
    { 
      icon: Trophy, 
      title: "Best School Award", 
      subtitle: "Netrokona District, 2024", 
      tint: TINTS.amber 
    },
    { 
      icon: Award, 
      title: "Academic Excellence", 
      subtitle: "Consistent 98% pass rate", 
      tint: TINTS.blue 
    },
    { 
      icon: Medal, 
      title: "Science Olympiad", 
      subtitle: "3 national medals in 2025", 
      tint: TINTS.emerald 
    },
    { 
      icon: Star, 
      title: "20+ Years Legacy", 
      subtitle: "Established since 2003", 
      tint: TINTS.purple 
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg-soft)]">
      
      {/* ================= AMBIENT BACKGROUND ================= */}
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 mask-fade-bottom pointer-events-none" />
      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Our Pride</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]"
          >
            Recognized for <br />
            <span className="gradient-text">Excellence & Impact.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            From national olympiads to consistent academic success, our commitment to quality education has earned us recognition across the region.
          </motion.p>
        </div>

        {/* ================= ACHIEVEMENTS GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {items.map((a, i) => {
            const Icon = a.icon;
            const theme = a.tint;
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div 
                  className={`
                    group relative h-full p-6 sm:p-8 rounded-[2rem] cursor-default
                    bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] 
                    ${theme.border} ${theme.shadow} hover:shadow-2xl hover:-translate-y-1
                    transition-all duration-300 flex flex-col overflow-hidden
                  `}
                >
                  
                  {/* ================= BACKGROUND ORB ================= */}
                  <div 
                    className={`
                      absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.15] blur-2xl pointer-events-none
                      group-hover:scale-150 group-hover:opacity-[0.25] transition-all duration-500 ${theme.orb}
                    `} 
                  />

                  {/* ================= ICON ================= */}
                  <div className="relative mb-6 z-10">
                    <div 
                      className={`
                        inline-flex p-4 rounded-2xl ${theme.bg} ${theme.icon}
                        group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300
                        ring-1 ring-inset ring-white/10
                      `}
                    >
                      <Icon className="h-8 w-8" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* ================= TEXT CONTENT ================= */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl text-[var(--fg)] mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--fg-muted)] leading-relaxed mt-auto">
                      {a.subtitle}
                    </p>
                  </div>

                  {/* ================= BOTTOM ACCENT BAR ================= */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 rounded-r-full`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= CTA LINK ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/achievements" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold text-[var(--fg)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-lg transition-all group"
          >
            View All Achievements 
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}