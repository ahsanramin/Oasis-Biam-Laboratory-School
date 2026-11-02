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

const EASE = [0.22, 1, 0.36, 1] as const;

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

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 lg:gap-16 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -right-24 w-[560px] h-[560px] bg-brand-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-[520px] h-[520px] bg-blue-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-32">

            {/* Featured Event Card */}
            {loading ? (
              <Skeleton className="h-[420px] rounded-[2.5rem]" />
            ) : featuredEvent ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative p-8 sm:p-10 rounded-[2.5rem] gradient-brand text-white shadow-2xl shadow-[var(--primary)]/25 overflow-hidden group"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

                {/* Decorative glows */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/[0.12] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[900ms] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-400/[0.15] rounded-full blur-3xl group-hover:scale-125 transition-transform duration-[900ms] pointer-events-none" />

                {/* Dot-grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Ghost watermark */}
                <div className="absolute -bottom-6 -right-2 text-[140px] font-black leading-none text-white/[0.06] select-none pointer-events-none tracking-tighter">
                  ★
                </div>

                <div className="relative z-10">
                  <Badge className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xl mb-6 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] font-black shadow-lg shadow-black/10 ring-1 ring-inset ring-white/20 rounded-full transition-colors">
                    <Sparkles className="h-3 w-3 mr-1.5" strokeWidth={2.5} /> Featured Event
                  </Badge>

                  <h3 className="text-3xl sm:text-4xl font-black font-display leading-[1.05] mb-4 tracking-tight drop-shadow-lg">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-white/85 mb-8 leading-relaxed line-clamp-3 font-medium">
                    {featuredEvent.description || "Join us for this special upcoming event."}
                  </p>

                  {/* Meta block */}
                  <div className="relative space-y-3 text-sm font-bold bg-black/25 p-5 rounded-2xl backdrop-blur-xl border border-white/10 ring-1 ring-inset ring-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center ring-1 ring-inset ring-white/20 shrink-0">
                        <Calendar className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <span className="text-white/95">{getFormattedDate(featuredEvent.date).full}</span>
                    </div>
                    {featuredEvent.time && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center ring-1 ring-inset ring-white/20 shrink-0">
                          <Clock className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                        <span className="text-white/95">{featuredEvent.time}</span>
                      </div>
                    )}
                    {featuredEvent.location && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center ring-1 ring-inset ring-white/20 shrink-0">
                          <MapPin className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                        <span className="text-white/95">{featuredEvent.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Calendar Download CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
              className="relative mt-6"
            >
              <Card className="relative p-6 flex flex-col sm:flex-row items-center gap-4 bg-[var(--card)]/70 backdrop-blur-xl border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-brand-500/[0.06] transition-all duration-500 group cursor-pointer overflow-hidden rounded-[2rem]">

                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                {/* Hover aura */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-500/[0.08] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative w-14 h-14 rounded-2xl bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 text-[var(--primary)] grid place-items-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                  <CalendarDays className="h-7 w-7 relative" strokeWidth={2.5} />
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <p className="font-bold text-lg tracking-tight">Academic Calendar</p>
                  <p className="text-sm text-[var(--fg-muted)] font-medium mt-0.5">Download the full year PDF schedule.</p>
                </div>

                <Download className="hidden sm:block h-4 w-4 text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" strokeWidth={2.5} />
              </Card>
            </motion.div>

          </div>
        </div>

        {/* ================= RIGHT TIMELINE ================= */}
        <div className="lg:col-span-8 relative space-y-8">

          {/* Continuous vertical timeline line */}
          {!loading && timelineEvents.length > 0 && (
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[var(--primary)] via-[var(--border)] to-transparent hidden md:block" />
          )}

          {loading ? (
            // Skeleton loader
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative md:pl-24">
                <Skeleton className="hidden md:block absolute left-0 top-0 w-16 h-20 rounded-2xl" />
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-6 sm:p-8 space-y-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-7 w-3/4 rounded-lg" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-11/12 rounded" />
                    <Skeleton className="h-4 w-9/12 rounded" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-8 w-28 rounded-lg" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          ) : timelineEvents.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative py-28 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

              <div className="relative mb-6">
                <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                    <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 tracking-tight">No upcoming events</h3>
              <p className="text-sm text-[var(--fg-muted)] font-medium">Check back later for new school activities.</p>
            </motion.div>
          ) : (
            // Timeline cards
            timelineEvents.map((ev, i) => {
              const date = getFormattedDate(ev.date);
              return (
                <motion.div
                  key={ev._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                  className="relative md:pl-24 group"
                >
                  {/* Floating Date Badge */}
                  <div className="hidden md:flex absolute left-0 top-0 w-16 h-20 rounded-2xl bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] group-hover:border-[var(--primary)]/50 flex-col items-center justify-center z-10 shadow-lg shadow-black/[0.02] group-hover:shadow-xl group-hover:shadow-brand-500/[0.12] transition-all duration-500 group-hover:-translate-y-1 overflow-hidden">
                    {/* Inner sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                    {/* Glow */}
                    <div className="absolute inset-0 -m-2 bg-brand-500/0 group-hover:bg-brand-500/20 rounded-2xl blur-md transition-colors duration-500 pointer-events-none -z-10" />
                    <span className="relative text-2xl font-black text-[var(--primary)] leading-none mb-1 tracking-tight">{date.day}</span>
                    <span className="relative text-[10px] font-black text-[var(--fg-muted)] tracking-[0.18em]">{date.month}</span>
                    <span className="relative text-[9px] font-bold text-[var(--fg-muted)]/70 mt-0.5 tracking-wider">{date.year}</span>
                  </div>

                  {/* Event Card */}
                  <div className="relative">
                    {/* Outer hover aura */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-blue-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                    <Card className="relative p-6 sm:p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 overflow-hidden">

                      {/* Top hairline */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge
                          variant="brand"
                          className="px-3 py-1 text-[10px] uppercase tracking-[0.16em] font-black rounded-full ring-1 ring-inset ring-white/20 shadow-sm shadow-brand-500/20"
                        >
                          Event
                        </Badge>
                        <span className="text-[11px] font-bold text-[var(--fg-muted)] md:hidden flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" strokeWidth={2.5} /> {date.full}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight leading-snug">
                        {ev.title}
                      </h3>
                      <p className="text-[var(--fg-muted)] leading-relaxed mb-6 line-clamp-3 font-medium">
                        {ev.description || "No description provided for this event."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--border)] text-xs font-bold text-[var(--fg-muted)]">
                        {ev.time && (
                          <span className="flex items-center gap-2 bg-[var(--bg-soft)]/80 backdrop-blur-md px-3 py-1.5 rounded-lg ring-1 ring-inset ring-[var(--border)] hover:ring-brand-500/30 transition-colors">
                            <Clock className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} /> {ev.time}
                          </span>
                        )}
                        {ev.location && (
                          <span className="flex items-center gap-2 bg-[var(--bg-soft)]/80 backdrop-blur-md px-3 py-1.5 rounded-lg ring-1 ring-inset ring-[var(--border)] hover:ring-brand-500/30 transition-colors">
                            <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} /> {ev.location}
                          </span>
                        )}
                      </div>

                      {/* Animated base accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/50 transition-all duration-500" />
                    </Card>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}