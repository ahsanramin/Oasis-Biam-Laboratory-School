"use client";

import { motion } from "framer-motion";
import { Quote, Star, Sparkles, User } from "lucide-react";

export function Testimonials({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || !testimonials.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />

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
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Testimonials</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] mb-6"
          >
            What Parents <br className="hidden sm:block" />
            <span className="gradient-text">Say About Us.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            Don't just take our word for it. Hear directly from the parents who trust us with their children's future.
          </motion.p>
        </div>

        {/* ================= TESTIMONIALS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => {
            // Fallback data extraction for safety
            const author = t.metadata?.author || "Anonymous Parent";
            const role = t.metadata?.role || "Parent";
            const initial = author.charAt(0).toUpperCase();
            const quoteText = t.description || t.quote || "This school has been a blessing for our family. The teachers are incredibly dedicated.";

            return (
              <motion.div 
                key={t._id || i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="group relative h-full p-8 rounded-[2rem] flex flex-col overflow-hidden bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1.5 transition-all duration-300">
                  
                  {/* ================= WATERMARK QUOTE ICON ================= */}
                  <Quote 
                    className="absolute -top-4 -right-2 h-24 w-24 text-[var(--primary)]/5 group-hover:text-[var(--primary)]/10 rotate-12 transition-colors duration-500 pointer-events-none" 
                    fill="currentColor"
                  />

                  {/* ================= STAR RATING ================= */}
                  <div className="relative z-10 flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500 drop-shadow-sm" />
                    ))}
                  </div>

                  {/* ================= QUOTE TEXT ================= */}
                  <p className="relative z-10 text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed italic mb-8 flex-1">
                    "{quoteText}"
                  </p>

                  {/* ================= AUTHOR SECTION ================= */}
                  <div className="relative z-10 pt-6 border-t border-[var(--border)] flex items-center gap-4 mt-auto">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full gradient-brand grid place-items-center text-white text-lg font-black shadow-md ring-2 ring-[var(--card)]">
                        {initial}
                      </div>
                      {/* Online/Verified indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[var(--card)] grid place-items-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Author Info */}
                    <div>
                      <p className="text-sm font-black text-[var(--fg)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                        {author}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-muted)] mt-0.5">
                        {role}
                      </p>
                    </div>
                  </div>

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