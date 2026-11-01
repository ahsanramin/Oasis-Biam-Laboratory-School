"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="relative py-24 lg:py-32 px-4 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* ================= GRADIENT BORDER WRAPPER ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative p-[1px] rounded-[3rem] bg-gradient-to-br from-[var(--border)] via-[var(--primary)]/30 to-[var(--border)] shadow-2xl shadow-[var(--primary)]/10"
        >
          {/* ================= MAIN CARD ================= */}
          <div className="relative rounded-[calc(3rem-1px)] overflow-hidden bg-[var(--card)]">
            
            {/* Inner Background Patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-amber-500/5 pointer-events-none" />

            {/* ================= FLOATING DECORATIVE ICONS ================= */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-12 text-[var(--primary)]/20 pointer-events-none hidden lg:block"
            >
              <GraduationCap className="w-24 h-24" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 right-12 text-amber-500/20 pointer-events-none hidden lg:block"
            >
              <Star className="w-20 h-20" />
            </motion.div>

            {/* ================= CONTENT ================= */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-20 text-center flex flex-col items-center">
              
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] shadow-sm mb-8"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary)]"></span>
                </span>
                <span className="text-sm font-black uppercase tracking-widest text-[var(--fg)]">
                  Admissions Open for 2027
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black font-display leading-[1.05] mb-6 max-w-4xl tracking-tight text-balance"
              >
                Give your child the <span className="gradient-text">future</span> they deserve.
              </motion.h2>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg lg:text-xl text-[var(--fg-muted)] font-medium mb-10 max-w-2xl leading-relaxed"
              >
                We are now accepting applications for the 2027 academic session. Secure your child's place at Netrokona's premier English-medium institution.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-12"
              >
                <Link href="/admission">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl gradient-brand text-white shadow-[0_0_40px_-10px_var(--primary-glow)] hover:shadow-[0_0_60px_-15px_var(--primary-glow)] hover:scale-105 transition-all duration-300 group overflow-hidden relative"
                  >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                    
                    <span className="relative z-10 flex items-center">
                      Apply Online Now 
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl bg-[var(--bg)]/50 backdrop-blur-md border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
                  >
                    Contact Admissions
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicator (Social Proof) */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-8 border-t border-[var(--border)]/50 w-full max-w-md mx-auto justify-center"
              >
                {/* Avatar Stack */}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-[var(--bg-soft)] overflow-hidden">
                      <img 
                        src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                        alt="Parent" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--card)] bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center text-xs font-black">
                    +1K
                  </div>
                </div>

                {/* Text */}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[var(--fg-muted)]">
                    Trusted by <span className="text-[var(--fg)]">1,200+</span> Parents
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}