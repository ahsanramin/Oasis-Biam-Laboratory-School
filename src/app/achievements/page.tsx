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
  { value: "20+", label: "Years of Excellence", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "1200+", label: "Students Taught", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "98%", label: "Pass Rate", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "150+", label: "Awards Won", icon: Trophy, color: "text-rose-500", bg: "bg-rose-500/10" },
];

// Cycle fallback icons so image-less cards still look intentional.
const FALLBACK_ICONS = [Trophy, Award, Medal, GraduationCap, BookOpen];

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

      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        
        {/* ================= MILESTONES ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {MILESTONES.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="relative overflow-hidden text-center p-6 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-soft)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative inline-flex p-4 rounded-2xl ${m.bg} ${m.color} mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="relative text-3xl lg:text-4xl font-black gradient-text mb-2 tracking-tight">{m.value}</p>
                  <p className="relative text-[11px] uppercase tracking-widest text-[var(--fg-muted)] font-bold">{m.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ================= DYNAMIC TIMELINE ================= */}
        {loading ? (
          <div className="space-y-16">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 w-24 bg-[var(--border)] rounded-full mb-8 animate-pulse" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 rounded-3xl bg-[var(--border)] animate-pulse" />
                  <div className="h-64 rounded-3xl bg-[var(--border)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed border-red-500/20 bg-red-500/5">
            <Frown className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-1">Oops! Something went wrong</h3>
            <p className="text-sm text-red-500/80">{error}</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50">
            <Award className="h-12 w-12 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">No achievements yet</h3>
            <p className="text-sm text-[var(--fg-muted)]">Check back soon to see our latest milestones.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Continuous Vertical Line for Desktop */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--border)] via-[var(--border)] to-transparent md:-translate-x-1/2 -z-10" />

            <div className="space-y-20">
              {grouped.map(([year, items], groupIndex) => (
                <div key={year} className="relative">
                  
                  {/* Year Marker */}
                  <div className="flex justify-start md:justify-center mb-10 relative">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="relative z-10"
                    >
                      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--card)] border-2 border-brand-500/30 shadow-lg shadow-brand-500/10 backdrop-blur-md">
                        <Sparkles className="h-4 w-4 text-brand-500" />
                        <span className="text-xl font-black gradient-text tracking-wider">{year}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                    {items.map((a, i) => {
                      const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];
                      // Alternate alignment for premium timeline feel
                      const isEven = i % 2 === 0;

                      return (
                        <motion.div
                          key={a._id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                          <Card className="group h-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col">
                            {/* Image or Icon Header */}
                            {a.image ? (
                              <div className="relative w-full aspect-[16/9] overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                <img
                                  src={a.image}
                                  alt={a.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-lg">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 pb-0">
                                <div className="inline-flex p-4 rounded-2xl gradient-brand text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                                  <Icon className="h-6 w-6" />
                                </div>
                              </div>
                            )}

                            {/* Body */}
                            <div className="p-8 flex flex-col flex-1">
                              <h3 className="text-xl font-bold leading-tight mb-3 text-[var(--fg)] group-hover:text-brand-500 transition-colors">
                                {a.title}
                              </h3>
                              <p className="text-sm leading-relaxed text-[var(--fg-muted)] flex-1">
                                {a.description || "No description provided for this achievement."}
                              </p>
                              
                              {/* Subtle Footer */}
                              <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
                                <CalendarDays className="h-4 w-4" />
                                Achieved in {year}
                              </div>
                            </div>
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