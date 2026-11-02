"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Award,
  Medal,
  Star,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Loader2,
  CalendarDays,
  Sparkles,
  Frown,
} from "lucide-react";
import { api, extractArray } from "@/lib/api";

type Achievement = {
  _id: string;
  title: string;
  description?: string;
  year?: string;
  image?: string | null;
  createdAt?: string | Date;
};

const MILESTONES = [
  { value: "20+",   label: "Years of Excellence", icon: Star,        color: "text-amber-500",   bg: "bg-amber-500/10",   ring: "ring-amber-500/25",   glow: "from-amber-500/25" },
  { value: "1200+", label: "Students Taught",     icon: Users,       color: "text-blue-500",    bg: "bg-blue-500/10",    ring: "ring-blue-500/25",    glow: "from-blue-500/25" },
  { value: "98%",   label: "Pass Rate",           icon: TrendingUp,  color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/25", glow: "from-emerald-500/25" },
  { value: "150+",  label: "Awards Won",          icon: Trophy,      color: "text-rose-500",    bg: "bg-rose-500/10",    ring: "ring-rose-500/25",    glow: "from-rose-500/25" },
];

// Cycle fallback icons so image-less cards still look intentional.
const FALLBACK_ICONS = [Trophy, Award, Medal, GraduationCap, BookOpen];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await api.get<Achievement[]>("/api/achievements");
        if (cancelled) return;
        setAchievements(extractArray<Achievement>(result));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not load achievements.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Achievement[]>();

    for (const a of achievements) {
      const fallbackYear = a.createdAt
        ? String(new Date(a.createdAt).getFullYear())
        : String(new Date().getFullYear());
      const year = (a.year || fallbackYear).trim() || fallbackYear;

      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(a);
    }

    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [achievements]);

  return (
    <>
      <PageHeader
        title="Achievements"
        subtitle="Celebrating milestones and recognition at Oasis BIAM"
        breadcrumbs={[{ label: "Achievements" }]}
      />

      <section className="relative max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-24 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-[560px] h-[560px] bg-brand-500/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= MILESTONES ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                className="relative group"
              >
                {/* Hover aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${m.glow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10`} />

                <Card className="relative overflow-hidden text-center p-6 lg:p-7 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] hover:border-[var(--fg)]/10 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500">
                  {/* Corner sheen */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-bl from-[var(--fg)]/[0.05] to-transparent rounded-full blur-2xl pointer-events-none" />

                  <div className="relative inline-flex items-center justify-center">
                    <div className={`inline-flex p-3.5 rounded-2xl ${m.bg} ring-1 ${m.ring} ${m.color} mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                  </div>

                  <p className="relative text-3xl lg:text-[34px] font-black gradient-text mb-2 tracking-tight leading-none">
                    {m.value}
                  </p>
                  <p className="relative text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)] font-bold">
                    {m.label}
                  </p>

                  {/* Animated base accent */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-2/3 bg-gradient-to-r from-transparent via-brand-500/60 to-transparent transition-all duration-500" />
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ================= DYNAMIC TIMELINE ================= */}
        {loading ? (
          <div className="space-y-20">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="flex justify-start md:justify-center mb-10">
                  <div className="h-11 w-32 bg-[var(--border)]/60 rounded-full animate-pulse" />
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="h-72 rounded-[2rem] bg-[var(--border)]/50 animate-pulse" />
                  <div className="h-72 rounded-[2rem] bg-[var(--border)]/50 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative text-center py-24 rounded-[2.5rem] border border-red-500/20 bg-gradient-to-b from-red-500/[0.06] to-transparent backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -z-10" />
            <div className="inline-flex w-20 h-20 rounded-2xl bg-red-500/10 ring-1 ring-red-500/20 items-center justify-center mx-auto mb-6">
              <Frown className="h-10 w-10 text-red-500" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2 tracking-tight">Oops! Something went wrong</h3>
            <p className="text-sm text-red-500/80 font-medium">{error}</p>
          </motion.div>
        ) : grouped.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative text-center py-24 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl -z-10" />
            <div className="inline-flex w-20 h-20 rounded-2xl bg-[var(--bg-soft)] ring-1 ring-[var(--border)] items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-[var(--fg-muted)] opacity-50" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold mb-2 tracking-tight">No achievements yet</h3>
            <p className="text-sm text-[var(--fg-muted)]">Check back soon to see our latest milestones.</p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Continuous Vertical Line for Desktop */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent md:-translate-x-1/2 -z-10" />

            <div className="space-y-24">
              {grouped.map(([year, items], groupIndex) => (
                <div key={year} className="relative">

                  {/* Year Marker */}
                  <div className="flex justify-start md:justify-center mb-12 relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="relative z-10"
                    >
                      {/* Glow behind marker */}
                      <div className="absolute inset-0 -m-4 bg-gradient-to-br from-brand-500/25 via-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                      <div className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[var(--card)]/80 border border-brand-500/30 shadow-xl shadow-brand-500/10 backdrop-blur-xl">
                        {/* Inner ring highlight */}
                        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
                        <Sparkles className="h-4 w-4 text-brand-500" strokeWidth={2.5} />
                        <span className="text-xl font-black gradient-text tracking-[0.08em]">{year}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                    {items.map((a, i) => {
                      const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];

                      return (
                        <motion.div
                          key={a._id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                          className="relative group"
                        >
                          {/* Card outer glow */}
                          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10" />

                          <Card className="relative h-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md hover:border-brand-500/30 hover:shadow-2xl hover:shadow-black/[0.05] transition-all duration-500 flex flex-col">
                            {/* Inner top sheen */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />

                            {/* Image or Icon Header */}
                            {a.image ? (
                              <div className="relative w-full aspect-[16/9] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/30 transition-all duration-500 z-10" />
                                <img
                                  src={a.image}
                                  alt={a.title}
                                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                                  loading="lazy"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                  <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/20">
                                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                                  </div>
                                </div>
                                {/* Year pill over image */}
                                <div className="absolute top-4 right-4 z-20">
                                  <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xl text-white border border-white/25 text-[10px] font-black uppercase tracking-[0.18em] shadow-lg shadow-black/20">
                                    {year}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 pb-0 relative">
                                {/* Ghost number watermark */}
                                <div className="absolute -top-2 right-4 text-[120px] font-black leading-none text-[var(--fg)]/[0.035] select-none pointer-events-none tracking-tighter">
                                  {String(i + 1).padStart(2, "0")}
                                </div>

                                <div className="relative inline-flex p-4 rounded-2xl gradient-brand text-white shadow-lg shadow-brand-500/25 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ring-1 ring-white/20">
                                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                                </div>
                              </div>
                            )}

                            {/* Body */}
                            <div className="p-8 flex flex-col flex-1 relative">
                              <h3 className="text-xl lg:text-[22px] font-bold leading-snug mb-3 text-[var(--fg)] group-hover:text-brand-500 transition-colors duration-300 tracking-tight">
                                {a.title}
                              </h3>
                              <p className="text-sm leading-relaxed text-[var(--fg-muted)] flex-1 font-medium">
                                {a.description || "No description provided for this achievement."}
                              </p>

                              {/* Subtle Footer */}
                              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-2.5 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-[0.18em]">
                                <div className="inline-flex w-7 h-7 rounded-lg bg-[var(--bg-soft)] ring-1 ring-[var(--border)] items-center justify-center">
                                  <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </div>
                                Achieved in {year}
                              </div>
                            </div>

                            {/* Animated base accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}