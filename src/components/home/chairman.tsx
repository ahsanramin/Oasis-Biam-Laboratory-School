"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Quote, Shield, ArrowRight, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { initials } from "@/lib/utils";

export function Chairman({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND ================= */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= MAIN CARD ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[3rem] overflow-hidden gradient-brand shadow-2xl shadow-[var(--primary)]/30"
        >
          
          {/* ================= DECORATIVE ELEMENTS ================= */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-white rounded-full blur-[100px] pointer-events-none"
          />
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-amber-300 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />

          {/* ================= CONTENT ================= */}
          <div className="relative p-8 sm:p-12 lg:p-16 grid lg:grid-cols-5 gap-10 lg:gap-16 items-center text-white">
            
            {/* ================= LEFT: PORTRAIT ================= */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 relative"
            >
              {/* Floating Crown Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 z-20 w-16 h-16 rounded-full bg-amber-400 shadow-2xl shadow-amber-500/50 grid place-items-center border-4 border-white/30"
              >
                <Crown className="h-7 w-7 text-white" fill="currentColor" />
              </motion.div>

              {/* Portrait Frame */}
              <div className="relative aspect-square max-w-sm mx-auto lg:mx-0">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/40 to-white/5 blur-xl" />
                
                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                  {data.image ? (
                    <Image 
                      src={data.image} 
                      alt={data.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/10 grid place-items-center text-white text-8xl font-black">
                      {initials(data.name)}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* ================= RIGHT: MESSAGE ================= */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3 relative"
            >
              {/* Role Badge - HARDCODED TO DEPUTY COMMISSIONER */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-6 text-sm font-bold shadow-lg">
                <Shield className="h-4 w-4" /> Deputy Commissioner, Netrokona
              </div>

              {/* Name */}
              <h2 className="text-4xl lg:text-6xl font-black font-display leading-[1.05] mb-3 tracking-tight">
                {data.name}
              </h2>
              
              {/* Position from DB */}
              <p className="text-lg text-white/70 mb-8 font-medium">{data.position}</p>

              {/* Message Card */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-black/20 backdrop-blur-lg border border-white/15 shadow-xl mb-8">
                <Quote className="absolute -top-4 -left-2 h-12 w-12 text-white/20" fill="currentColor" />
                
                <p className="text-base sm:text-lg leading-relaxed text-white/95 relative z-10 font-medium italic">
                  "{data.message || "Our commitment is to build an institution where every child has the opportunity to learn, grow, and thrive."}"
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link href="/about">
                  <Button 
                    size="lg"
                    className="!bg-white !text-[var(--primary)] hover:!bg-white/90 !shadow-2xl !shadow-black/20 font-bold rounded-xl px-8 group"
                  >
                    Learn More 
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}