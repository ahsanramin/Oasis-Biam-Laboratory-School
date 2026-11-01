"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users, Sparkles, Mail, Phone, BookOpen, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Safe helper for initials
function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export function TeachersSection({ teachers }: { teachers: any[] }) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Meet Our Faculty</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]">
              Our Expert <br className="hidden sm:block" />
              <span className="gradient-text">Teachers & Staff.</span>
            </h2>
            
            <p className="mt-4 text-lg text-[var(--fg-muted)] font-medium max-w-xl">
              Learn from passionate educators committed to unlocking every student's full potential.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/teachers">
              <Button variant="outline" size="lg" className="rounded-xl font-bold group bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                View All Faculty
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= TEACHERS GRID ================= */}
        {teachers.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--card)]/50 flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-full grid place-items-center mb-6">
              <UserX className="h-10 w-10 text-[var(--fg-muted)] opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No faculty members yet</h3>
            <p className="text-[var(--fg-muted)] max-w-sm mx-auto">
              The administration will add faculty members soon. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {teachers.slice(0, 4).map((t, i) => (
              <motion.div 
                key={t._id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Main Link Wrapper */}
                <div className="group block h-full relative">
                  <Link href={`/teachers/${t._id}`} className="absolute inset-0 z-0" aria-label={`View ${t.name}'s profile`} />
                  
                  <div className="relative z-10 pointer-events-none rounded-[2rem] overflow-hidden bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] group-hover:border-[var(--primary)]/40 group-hover:shadow-2xl group-hover:shadow-[var(--primary)]/10 group-hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                    
                    {/* ================= IMAGE SECTION ================= */}
                    <div className="relative aspect-[4/5] bg-[var(--bg-soft)] overflow-hidden">
                      {t.image ? (
                        <Image 
                          src={t.image} 
                          alt={t.name} 
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-6xl font-black">
                          {getInitials(t.name)}
                        </div>
                      )}
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Subject Badge */}
                      {t.subject && (
                        <Badge 
                          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white border-white/30 shadow-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                        >
                          {t.subject}
                        </Badge>
                      )}

                      {/* Hover Contact Actions */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto">
                        {t.email && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `mailto:${t.email}`;
                            }}
                            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg"
                            title="Send Email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        )}
                        {t.phone && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `tel:${t.phone}`;
                            }}
                            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg">
                          <BookOpen className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* ================= TEXT CONTENT ================= */}
                    <div className="p-5 sm:p-6 text-center flex-1 flex flex-col justify-center relative bg-gradient-to-b from-[var(--card)] to-[var(--bg-soft)]/30">
                      <h3 className="font-bold text-lg text-[var(--fg)] mb-1 truncate group-hover:text-[var(--primary)] transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider truncate">
                        {t.designation || "Faculty Member"}
                      </p>
                    </div>

                    {/* Animated Bottom Accent Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1">
                      <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-amber-400 transition-all duration-500 rounded-r-full" />
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}