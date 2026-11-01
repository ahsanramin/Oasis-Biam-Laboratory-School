"use client";

import { motion } from "framer-motion";
import { Shield, Book, Star, Heart, Award, CheckCircle2, Sparkles } from "lucide-react";

const ICONS: Record<string, any> = {
  shield: Shield,
  book: Book,
  star: Star,
  heart: Heart,
  award: Award,
};

export function TrustSection({ reasons }: { reasons: any[] }) {
  if (!reasons || !reasons.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Why Choose Us</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] mb-6"
          >
            Why Parents <br className="hidden sm:block" />
            <span className="gradient-text">Trust Us.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            We don't just teach; we nurture. Here is why generations of families have trusted us with their children's education.
          </motion.p>
        </div>

        {/* ================= REASONS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((r, i) => {
            const Icon = ICONS[r.metadata?.icon] || CheckCircle2;
            const title = r.title || "Trusted Education";
            const description = r.description || "We provide a safe, nurturing, and academically rigorous environment for every student.";

            return (
              <motion.div 
                key={r._id || i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="group relative h-full p-8 rounded-[2rem] flex flex-col overflow-hidden bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1.5 transition-all duration-300">
                  
                  {/* ================= WATERMARK ICON ================= */}
                  <Icon 
                    className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--primary)] opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" 
                  />

                  {/* ================= ICON BUBBLE ================= */}
                  <div className="relative z-10 mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-sm">
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* ================= TEXT CONTENT ================= */}
                  <h3 className="relative z-10 text-xl font-bold mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                    {title}
                  </h3>
                  
                  <p className="relative z-10 text-[var(--fg-muted)] leading-relaxed text-sm sm:text-base flex-1">
                    {description}
                  </p>

                  {/* ================= ANIMATED BOTTOM ACCENT BAR ================= */}
                  <div className="absolute bottom-0 left-0 w-full h-1">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-amber-400 transition-all duration-500 rounded-r-full" />
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}