"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, MapPin, ArrowRight, Sparkles, CalendarDays, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EASE = [0.22, 1, 0.36, 1] as const;

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
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shadow-sm shadow-black/[0.02] mb-5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg)]">School Calendar</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]">
              Upcoming <br className="hidden sm:block" />
              <span className="gradient-text">Events & Programs.</span>
            </h2>

            <p className="mt-4 text-base lg:text-lg text-[var(--fg-muted)] font-medium max-w-xl leading-relaxed">
              Stay updated with the latest activities, competitions, and important dates happening on our campus.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="relative rounded-xl font-bold group bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] overflow-hidden text-[12px] uppercase tracking-[0.14em]"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                {/* Hover aura */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="relative">View All Events</span>
                <ArrowRight
                  className="relative h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
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
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: EASE }}
                className="relative group"
              >
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                <div className="relative h-full p-6 sm:p-8 rounded-[2rem] flex flex-col overflow-hidden bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500">

                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Ghost index watermark */}
                  <div className="absolute top-3 right-5 text-[72px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Background watermark icon */}
                  <CalendarDays
                    className="absolute -bottom-6 -right-6 w-32 h-32 text-[var(--primary)] opacity-[0.03] rotate-12 pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500"
                    strokeWidth={1}
                  />

                  {/* ================= DATE & TAG HEADER ================= */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-6">

                    {/* Premium Date Stub */}
                    <div className="relative shrink-0 w-16 h-20 rounded-2xl gradient-brand text-white grid place-items-center shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500 border border-white/20 ring-1 ring-inset ring-white/20">
                      {/* Inner sheen */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                      <div className="text-center relative">
                        <p className="text-3xl font-black leading-none tracking-tight tabular-nums">{day}</p>
                        <p className="text-[10px] font-black tracking-[0.18em] mt-1 uppercase opacity-90">{month}</p>
                      </div>
                    </div>

                    {/* Tag Badge */}
                    <Badge
                      variant="brand"
                      className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 border-transparent shadow-sm ring-1 ring-inset ring-[var(--primary)]/20 rounded-full"
                    >
                      Event
                    </Badge>
                  </div>

                  {/* ================= CONTENT ================= */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg sm:text-xl leading-snug mb-3 text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2 tracking-tight">
                      {ev.title}
                    </h3>

                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6 flex-1 line-clamp-3 font-medium">
                      {ev.description || "No description provided for this event."}
                    </p>
                  </div>

                  {/* ================= FOOTER DETAILS ================= */}
                  <div className="relative z-10 pt-5 mt-auto border-t border-[var(--border)] space-y-2.5">
                    {ev.time && (
                      <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] grid place-items-center shrink-0">
                          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                        </div>
                        <span className="normal-case tracking-tight text-[var(--fg)] font-bold text-xs">{ev.time}</span>
                      </div>
                    )}

                    {ev.location && (
                      <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        <div className="w-7 h-7 rounded-lg bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] grid place-items-center shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                        </div>
                        <span className="normal-case tracking-tight text-[var(--fg)] font-bold text-xs">{ev.location}</span>
                      </div>
                    )}
                  </div>

                  {/* ================= ANIMATED BOTTOM ACCENT BAR ================= */}
                  <div className="absolute bottom-0 left-0 right-0 h-1">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-[var(--primary)] to-amber-400 transition-all duration-700 rounded-r-full shadow-sm" />
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