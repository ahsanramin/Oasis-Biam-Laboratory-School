"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Sparkles, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { initials } from "@/lib/utils";

export function Principal({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* ================= LEFT: PREMIUM PORTRAIT ================= */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glowing Halo Behind Portrait */}
          <div className="absolute -inset-6 gradient-brand rounded-[3rem] blur-3xl opacity-20 animate-pulse" />

          {/* Portrait Card */}
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--bg-soft)] border border-[var(--border)] shadow-2xl group">
            {data.image ? (
              <Image 
                src={data.image} 
                alt={data.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : (
              <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-8xl font-black">
                {initials(data.name)}
              </div>
            )}
            
            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Decorative Corner Accent */}
            <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </motion.div>

        {/* ================= RIGHT: MESSAGE ================= */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Dual Premium Badges for Official Titles */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">
                Principal, Oasis BIAM Laboratory School
              </span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Additional District Commissioner (ADC) for Education and ICT
              </span>
            </div>
          </div>

          {/* Name */}
          <h2 className="text-4xl lg:text-6xl font-black font-display leading-[1.05] tracking-tight mb-3 break-words">
            {data.name}
          </h2>
          
          {/* Designation from Database (Optional fallback) */}
          <p className="text-lg text-[var(--fg-muted)] font-semibold mb-8">
            {data.designation || "Principal"}
          </p>

          {/* Glassmorphic Message Card */}
          <div className="relative p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-xl mb-8 overflow-hidden group">
            <Quote 
              className="absolute -top-2 -left-2 h-20 w-20 text-[var(--primary)]/10 group-hover:text-[var(--primary)]/20 transition-colors duration-500" 
              fill="currentColor"
            />
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-amber-400 to-transparent opacity-60" />

            <p className="relative z-10 text-base sm:text-lg leading-relaxed text-[var(--fg-muted)] font-medium italic">
              "{data.bio || "Our mission is to nurture the next generation with wisdom, discipline, and compassion. Every child who walks through our doors carries the potential to change the world — our job is to help them discover it."}"
            </p>

            <div className="relative z-10 mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-[var(--fg)]">{data.name.split(" ")[0]}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
                  Principal Signature
                </p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-500 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link href={`/teachers/${data._id}`}>
              <Button 
                size="lg"
                className="rounded-xl font-bold gradient-brand shadow-lg shadow-[var(--primary)]/25 hover:scale-105 transition-transform group"
              >
                Read Full Message 
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}