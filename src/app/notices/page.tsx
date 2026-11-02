"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Bell, Pin, Calendar, ArrowRight, Search,
  Filter, FileText, Sparkles, Inbox
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to format dates nicely
function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const CATEGORIES = ["All Notices", "Admission", "Exam", "Event", "General"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Notices");

  // ================= DATA FETCHING =================
  useEffect(() => {
    async function load() {
      try {
        // 🔧 FIX: api.get returns the unwrapped data safely
        const r = await api.get<any>("/api/notices");
        setNotices(extractArray(r));
      } catch (err) {
        console.error("Failed to load notices:", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  // ================= FILTERING LOGIC =================
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesCategory = activeCategory === "All Notices" ||
                              n.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = n.title?.toLowerCase().includes(search.toLowerCase()) ||
                            n.content?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [notices, search, activeCategory]);

  return (
    <>
      <PageHeader
        title="Notice Board"
        subtitle="All the latest updates, announcements, and alerts from the school administration."
        breadcrumbs={[{ label: "Notices" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-12 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -right-24 w-[600px] h-[600px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-32 space-y-5">

            {/* Search Box */}
            <div className="relative group">
              {/* Focus aura */}
              <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-blue-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                  strokeWidth={2.5}
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notices..."
                  className="relative pl-11 h-12 rounded-xl bg-[var(--card)]/80 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 font-medium"
                />
              </div>
            </div>

            {/* Category Filter Card */}
            <Card className="relative p-6 bg-[var(--card)]/70 backdrop-blur-xl border-[var(--border)] shadow-2xl shadow-black/[0.04] overflow-hidden rounded-[2rem]">

              {/* Top hairline */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

              {/* Corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/[0.06] rounded-full blur-2xl pointer-events-none" />

              <h3 className="relative font-bold mb-6 flex items-center gap-2.5 text-base tracking-tight">
                <div className="relative w-8 h-8 rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500 grid place-items-center">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                  <Filter className="h-4 w-4 relative" strokeWidth={2.5} />
                </div>
                Categories
              </h3>

              <div className="relative space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] uppercase tracking-[0.14em] font-black transition-all duration-300 overflow-hidden ${
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 ring-1 ring-inset ring-white/20"
                          : "hover:bg-[var(--bg-soft)]/80 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:translate-x-0.5"
                      }`}
                    >
                      {isActive && (
                        <span className="pointer-events-none absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                      )}
                      <span className="relative">{cat}</span>
                      {isActive && <Sparkles className="relative h-3.5 w-3.5" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ================= RIGHT NOTICE LIST ================= */}
        <div className="lg:col-span-8 xl:col-span-9">

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="relative rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-6 sm:p-8 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                    <Skeleton className="shrink-0 w-14 h-14 rounded-2xl" />
                    <div className="flex-1 space-y-3 w-full">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-7 w-3/4 rounded-lg" />
                      <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-11/12 rounded" />
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-2">
                        <Skeleton className="h-7 w-32 rounded-lg" />
                        <Skeleton className="h-5 w-32 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

              {/* Layered medallion icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                    <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2 tracking-tight">No notices found</h3>
              <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto mb-6 font-medium leading-relaxed">
                {search
                  ? `We couldn't find any notices matching "${search}".`
                  : "There are no notices in this category yet."}
              </p>

              <button
                onClick={() => { setSearch(""); setActiveCategory("All Notices"); }}
                className="text-[var(--primary)] text-xs font-black uppercase tracking-[0.16em] hover:underline underline-offset-4 decoration-2 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotices.map((n, i) => (
                  <motion.div
                    key={n._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
                    className="relative group"
                  >
                    {/* Outer hover aura */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-blue-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                    <Link href={`/notices/${n._id}`}>
                      <Card className={`relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-500 group/card overflow-hidden bg-[var(--card)]/70 backdrop-blur-md`}>

                        {/* Top hairline (featured gets brand, others get white) */}
                        <div className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${
                          n.featured
                            ? "bg-gradient-to-r from-transparent via-brand-500/70 to-transparent"
                            : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                        }`} />

                        {/* Corner glow (featured only) */}
                        {n.featured && (
                          <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/[0.08] rounded-full blur-2xl pointer-events-none" />
                        )}

                        {/* Ghost number watermark */}
                        <div className="absolute top-3 right-6 text-[80px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover/card:text-[var(--fg)]/[0.04] transition-colors duration-500">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        <div className="relative flex flex-col sm:flex-row items-start gap-5 sm:gap-6">

                          {/* Icon */}
                          <div className={`relative shrink-0 w-14 h-14 rounded-2xl grid place-items-center transition-all duration-500 group-hover/card:scale-110 group-hover/card:-rotate-3 ${
                            n.featured
                              ? "gradient-brand text-white shadow-lg shadow-brand-500/30 ring-1 ring-white/20"
                              : "bg-[var(--bg-soft)]/80 text-[var(--primary)] ring-1 ring-inset ring-[var(--border)] group-hover/card:bg-brand-500/10 group-hover/card:ring-brand-500/20"
                          }`}>
                            {n.featured && (
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                            )}
                            {n.featured ? <Pin className="h-6 w-6 relative" strokeWidth={2.5} /> : <Bell className="h-6 w-6 relative" strokeWidth={2.5} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">

                            {/* Badges */}
                            <div className="relative flex flex-wrap items-center gap-2 mb-3">
                              <Badge
                                variant={n.featured ? "warning" : "secondary"}
                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] rounded-full ring-1 ring-inset shadow-sm ${
                                  n.featured
                                    ? "ring-white/20 shadow-amber-500/20"
                                    : "ring-[var(--border)] shadow-black/[0.02]"
                                }`}
                              >
                                {n.featured ? "Pinned Notice" : n.category || "General"}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h3 className="relative font-bold text-xl sm:text-2xl mb-2 group-hover/card:text-[var(--primary)] transition-colors duration-300 line-clamp-2 leading-snug tracking-tight">
                              {n.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="relative text-[var(--fg-muted)] text-sm sm:text-[15px] line-clamp-2 mb-6 leading-relaxed font-medium">
                              {n.content}
                            </p>

                            {/* Footer */}
                            <div className="relative flex flex-wrap items-center justify-between pt-5 border-t border-[var(--border)] gap-4">

                              {/* Date chip */}
                              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-black text-[var(--fg-muted)] bg-[var(--bg-soft)]/80 backdrop-blur-md px-3 py-1.5 rounded-lg ring-1 ring-inset ring-[var(--border)]">
                                <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                                {formatDate(n.publishDate || n.createdAt)}
                              </span>

                              {/* Read link */}
                              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-black text-[var(--primary)] transition-transform duration-300 group-hover/card:translate-x-1">
                                Read Full Notice
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Animated base accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover/card:via-brand-500/50 transition-all duration-500" />
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}