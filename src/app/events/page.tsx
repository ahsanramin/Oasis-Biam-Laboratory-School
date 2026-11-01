"use client";

import { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Calendar, MapPin, Clock, ArrowRight, CalendarDays, Download, Sparkles, Loader2, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, extractArray } from "@/lib/api";

// Type definition matching your backend schema
type Event = {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
};

// Helper to format the date nicely for the timeline badges
function getFormattedDate(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return { day: "??", month: "???", year: "????", full: dateString };
  
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
    full: d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // 🔧 FIX: Fetch from actual backend API
        const r = await api.get<any>("/api/events");
        setEvents(extractArray<Event>(r));
      } catch (error) {
        console.error("Failed to load events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    void fetchEvents();
  }, []);

  // Separate the most upcoming event for the featured card
  const featuredEvent = useMemo(() => events.length > 0 ? events[0] : null, [events]);
  const timelineEvents = useMemo(() => events.length > 1 ? events.slice(1) : [], [events]);

  return (
    <>
      <PageHeader 
        title="Events & Calendar" 
        subtitle="Stay informed about upcoming school activities and programs." 
        breadcrumbs={[{ label: "Events" }]} 
      />
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32">
            
            {/* Featured Event Card */}
            {loading ? (
              <Skeleton className="h-[400px] rounded-[2rem]" />
            ) : featuredEvent ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 sm:p-10 rounded-[2.5rem] gradient-brand text-white shadow-2xl shadow-[var(--primary)]/20 relative overflow-hidden group"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md mb-6 px-4 py-1.5 shadow-lg">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Featured Event
                  </Badge>
                  
                  <h3 className="text-3xl sm:text-4xl font-black font-display leading-[1.1] mb-4">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-white/80 mb-8 leading-relaxed line-clamp-3">
                    {featuredEvent.description || "Join us for this special upcoming event."}
                  </p>
                  
                  <div className="space-y-4 text-sm font-bold bg-black/20 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center"><Calendar className="h-4 w-4" /></div>
                      <span>{getFormattedDate(featuredEvent.date).full}</span>
                    </div>
                    {featuredEvent.time && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center"><Clock className="h-4 w-4" /></div>
                        <span>{featuredEvent.time}</span>
                      </div>
                    )}
                    {featuredEvent.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 grid place-items-center"><MapPin className="h-4 w-4" /></div>
                        <span>{featuredEvent.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
            
            {/* Calendar Download CTA */}
            <Card className="mt-6 p-6 flex flex-col sm:flex-row items-center gap-4 bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <CalendarDays className="h-7 w-7"/>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-lg">Academic Calendar</p>
                <p className="text-sm text-[var(--fg-muted)]">Download the full year PDF schedule.</p>
              </div>
            </Card>
          </div>
        </div>

        {/* ================= RIGHT TIMELINE ================= */}
        <div className="lg:col-span-8 relative space-y-8">
          
          {/* Continuous Vertical Line for Desktop */}
          {!loading && timelineEvents.length > 0 && (
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--primary)] via-[var(--border)] to-transparent hidden md:block" />
          )}
          
          {loading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative md:pl-24">
                <Skeleton className="hidden md:block absolute left-0 top-0 w-16 h-16 rounded-2xl" />
                <Skeleton className="h-48 rounded-[2rem] w-full" />
              </div>
            ))
          ) : timelineEvents.length === 0 ? (
            // Empty State
            <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-[var(--card)]/50 flex flex-col items-center">
              <Inbox className="h-12 w-12 text-[var(--fg-muted)] mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No upcoming events</h3>
              <p className="text-[var(--fg-muted)]">Check back later for new school activities.</p>
            </div>
          ) : (
            // Timeline Cards
            timelineEvents.map((ev, i) => {
              const date = getFormattedDate(ev.date);
              return (
                <motion.div 
                  key={ev._id} 
                  initial={{ opacity: 0, x: -20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1, duration: 0.4 }} 
                  className="relative md:pl-24 group"
                >
                  {/* Floating Date Badge */}
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-20 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] group-hover:border-[var(--primary)] flex-col items-center justify-center z-10 shadow-sm group-hover:shadow-[var(--primary)]/20 group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <span className="text-2xl font-black text-[var(--primary)] leading-none mb-1">{date.day}</span>
                    <span className="text-[10px] font-bold text-[var(--fg-muted)] tracking-widest">{date.month}</span>
                    <span className="text-[9px] font-medium text-[var(--fg-muted)] mt-0.5">{date.year}</span>
                  </div>

                  {/* Event Card */}
                  <Card className="p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge variant="brand" className="px-3 py-1 text-xs shadow-sm">Event</Badge>
                      <span className="text-xs font-bold text-[var(--fg-muted)] md:hidden flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {date.full}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-[var(--fg-muted)] leading-relaxed mb-6 line-clamp-3">
                      {ev.description || "No description provided for this event."}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-[var(--border)] text-sm font-bold text-[var(--fg-muted)]">
                      {ev.time && (
                        <span className="flex items-center gap-2 bg-[var(--bg-soft)] px-3 py-1.5 rounded-lg">
                          <Clock className="h-4 w-4 text-[var(--primary)]"/> {ev.time}
                        </span>
                      )}
                      {ev.location && (
                        <span className="flex items-center gap-2 bg-[var(--bg-soft)] px-3 py-1.5 rounded-lg">
                          <MapPin className="h-4 w-4 text-[var(--primary)]"/> {ev.location}
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}