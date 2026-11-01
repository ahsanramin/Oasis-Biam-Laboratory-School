"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ({ faqs }: { faqs: any[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!faqs || !faqs.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Got Questions?</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]"
          >
            Frequently <br className="sm:hidden" />
            <span className="gradient-text">Asked Questions.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-[var(--fg-muted)] max-w-2xl mx-auto font-medium"
          >
            Find answers to the most common questions about our curriculum, admissions, and campus life.
          </motion.p>
        </div>

        {/* ================= FAQ ACCORDION LIST ================= */}
        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === f._id;
            
            return (
              <motion.div 
                key={f._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={cn(
                  "group rounded-[1.5rem] border overflow-hidden transition-all duration-300",
                  isOpen 
                    ? "bg-[var(--card)] border-[var(--primary)]/40 shadow-xl shadow-[var(--primary)]/5" 
                    : "bg-[var(--card)]/70 backdrop-blur-xl border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--card)]"
                )}
              >
                {/* Question Button */}
                <button 
                  onClick={() => setOpen(isOpen ? null : f._id)} 
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Bubble */}
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-xl grid place-items-center transition-all duration-300",
                      isOpen 
                        ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 scale-110" 
                        : "bg-[var(--bg-soft)] text-[var(--fg-muted)] group-hover:text-[var(--primary)]"
                    )}>
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    
                    {/* Question Text */}
                    <span className={cn(
                      "font-bold text-lg leading-snug transition-colors",
                      isOpen ? "text-[var(--fg)]" : "text-[var(--fg)] group-hover:text-[var(--primary)]"
                    )}>
                      {f.title || f.question}
                    </span>
                  </div>

                  {/* Chevron Indicator */}
                  <div className={cn(
                    "shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all duration-300",
                    isOpen ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--fg-muted)]"
                  )}>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                </button>

                {/* Animated Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pl-[5.25rem] text-[var(--fg-muted)] leading-relaxed text-base">
                        {f.description || f.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ================= STILL HAVE QUESTIONS CTA ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-[2rem] bg-[var(--bg-soft)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center shrink-0">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[var(--fg)]">Still have questions?</h4>
              <p className="text-sm font-medium text-[var(--fg-muted)] mt-0.5">Our friendly admissions team is ready to help.</p>
            </div>
          </div>
          
          <Link href="/contact" className="relative z-10 w-full sm:w-auto shrink-0">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-[var(--primary)]/20 hover:scale-105 transition-transform duration-300">
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}