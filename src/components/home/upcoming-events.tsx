"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, MapPin, ArrowRight, Sparkles, CalendarDays, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Event = {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
};

// ==========================================
// HELPER: PARSE DATE INTO DAY & MONTH
// ==========================================
function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { day: "??", month: "???" };
  }

  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

export function UpcomingEvents({ events = [] }: { events?: Event[] }) {
  // If no events exist in the database, don't render the section
  if (!events || events.length === 0) {
    return null; 
  }

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
              <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">School Calendar</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]">
              Upcoming <br className="hidden sm:block" />
              <span className="gradient-text">Events & Programs.</span>
            </h2>
            
            <p className="mt-4 text-lg text-[var(--fg-muted)] font-medium max-w-xl">
              Stay updated with the latest activities, competitions, and important dates happening on our campus.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/events">
              <Button variant="outline" size="lg" className="rounded-xl font-bold group bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                View All Events
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= EVENTS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((ev, i) => {
            const { day, month } = formatEventDate(ev.date);

            return (
              <motion.div 
                key={ev._id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="group relative h-full p-6 sm:p-8 rounded-[2rem] flex flex-col overflow-hidden bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1.5 transition-all duration-300">
                  
                  {/* Background Watermark */}
                  <CalendarDays className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--primary)] opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                  {/* ================= DATE & TAG HEADER ================= */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
                    {/* Premium Date Stub */}
                    <div className="shrink-0 w-16 h-20 rounded-2xl gradient-brand text-white grid place-items-center shadow-lg shadow-[var(--primary)]/25 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300 border border-white/10">
                      <div className="text-center">
                        <p className="text-3xl font-black leading-none">{day}</p>
                        <p className="text-[10px] font-black tracking-widest mt-1 uppercase opacity-90">{month}</p>
                      </div>
                    </div>

                    {/* Tag Badge */}
                    <Badge variant="brand" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 border-transparent shadow-sm">
                      Event
                    </Badge>
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl leading-snug mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {ev.title}
                    </h3>
                    
                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6 flex-1 line-clamp-3">
                      {ev.description || "No description provided for this event."}
                    </p>
                  </div>

                  {/* ================= FOOTER DETAILS ================= */}
                  <div className="relative z-10 pt-5 mt-auto border-t border-[var(--border)] space-y-2.5">
                    {ev.time && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--fg-muted)]">
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-soft)] grid place-items-center shrink-0">
                          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" />
                        </div>
                        {ev.time}
                      </div>
                    )}
                    
                    {ev.location && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--fg-muted)]">
                        <div className="w-6 h-6 rounded-full bg-[var(--bg-soft)] grid place-items-center shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />
                        </div>
                        {ev.location}
                      </div>
                    )}
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