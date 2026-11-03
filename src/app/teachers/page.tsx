"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, Mail, Phone, BookOpen, Users, Sparkles, Inbox,
  Crown, UserCog, GraduationCap 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

// Safe helper for initials
function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

// 🎯 SORTING LOGIC: Principal -> Vice Principal -> Teachers (by order)
function getRolePriority(role: string): number {
  if (role === "principal") return 0;
  if (role === "vice-principal") return 1;
  return 2; // teacher
}

const ROLE_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  "principal": { label: "Principal", icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10" },
  "vice-principal": { label: "Vice Principal", icon: UserCog, color: "text-blue-500", bg: "bg-blue-500/10" },
  "teacher": { label: "Teacher", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const CATEGORIES = [
  { id: "all", label: "All Faculty", icon: Users },
  { id: "principal", label: "Principal", icon: Crown },
  { id: "vice-principal", label: "Vice Principal", icon: UserCog },
  { id: "teacher", label: "Teachers", icon: GraduationCap },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ================= DATA FETCHING =================
  useEffect(() => {
    async function loadTeachers() {
      try {
        const r = await api.get<any>("/api/teachers");
        setTeachers(extractArray<any>(r));
      } catch (err) {
        console.error("Failed to load faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadTeachers();
  }, []);

  // ================= FILTER & SEARCH =================
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesRole = filter === "all" || t.role === filter;
      const q = search.toLowerCase();
      const matchesSearch = 
        t.name?.toLowerCase().includes(q) || 
        t.subject?.toLowerCase().includes(q) || 
        t.designation?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [teachers, filter, search]);

  // ================= PREMIUM SORTING (Principal -> VP -> Teachers) =================
  const sortedTeachers = useMemo(() => {
    return [...filteredTeachers].sort((a, b) => {
      // 1. Sort by Role Priority
      const roleDiff = getRolePriority(a.role) - getRolePriority(b.role);
      if (roleDiff !== 0) return roleDiff;
      
      // 2. Sort by Serial Number (Order)
      const orderA = typeof a.order === 'number' ? a.order : 999;
      const orderB = typeof b.order === 'number' ? b.order : 999;
      return orderA - orderB;
    });
  }, [filteredTeachers]);

  return (
    <>
      <PageHeader
        title="Our Expert Faculty"
        subtitle="Dedicated educators shaping the future of our students."
        breadcrumbs={[{ label: "Faculty" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= STICKY FILTER BAR ================= */}
        <div className="sticky top-24 z-30 mb-12">
          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-3 p-2 bg-[var(--bg)]/70 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] shadow-2xl shadow-black/[0.06] overflow-hidden">

            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

            {/* Role Tabs */}
            <div className="relative flex w-full lg:w-auto overflow-x-auto no-scrollbar p-1 gap-1">
              {CATEGORIES.map((tab) => {
                const isActive = filter === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={cn(
                      "relative flex-1 lg:flex-none whitespace-nowrap px-6 py-3 rounded-xl text-[11px] uppercase tracking-[0.14em] font-black transition-colors duration-300 flex items-center justify-center gap-2",
                      isActive ? "text-[var(--primary)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl ring-1 ring-inset ring-[var(--primary)]/20 shadow-sm shadow-brand-500/10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5 relative z-10" strokeWidth={2.5} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80 shrink-0 px-2 pb-2 lg:pb-0 lg:pr-2 group">
              <div className="absolute inset-0 lg:inset-2 lg:top-0 lg:bottom-0 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-blue-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
              <div className="relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                  strokeWidth={2.5}
                />
                <Input
                  placeholder="Search by name or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="relative pl-11 h-12 bg-[var(--card)]/80 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/30 focus:bg-[var(--bg)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 rounded-xl transition-all duration-300 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FACULTY GRID ================= */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-1.5 overflow-hidden">
                  <Skeleton className="aspect-[4/5] rounded-[1.6rem]" />
                </div>
                <div className="px-2 space-y-2 text-center">
                  <Skeleton className="h-5 w-2/3 mx-auto rounded-lg" />
                  <Skeleton className="h-3.5 w-1/2 mx-auto rounded-lg" />
                  <Skeleton className="h-7 w-24 mx-auto rounded-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative mb-6">
              <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                  <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 tracking-tight">No faculty found</h3>
            <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto font-medium leading-relaxed">
              We couldn't find any teachers matching your current filters or search query.
            </p>
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-6 text-[var(--primary)] text-xs font-black uppercase tracking-[0.16em] hover:underline underline-offset-4 decoration-2 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            <AnimatePresence>
              {sortedTeachers.map((t, i) => {
                const meta = ROLE_META[t.role] || ROLE_META["teacher"];
                const RoleIcon = meta.icon;

                return (
                  <motion.div
                    key={t._id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.04, ease: EASE }}
                    className="relative group"
                  >
                    {/* Outer hover aura */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 -z-10 pointer-events-none" />

                    <Link href={`/teachers/${t._id}`} className="block h-full">
                      <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-500 h-full flex flex-col">

                        {/* Top hairline */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                        {/* Image Section */}
                        <div className="relative aspect-[4/5] bg-[var(--bg-soft)] overflow-hidden">
                          {t.image ? (
                            <Image
                              src={t.image}
                              alt={t.name}
                              fill
                              className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 gradient-brand grid place-items-center text-white">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                              <span className="relative text-6xl font-black tracking-tight drop-shadow-lg">
                                {getInitials(t.name)}
                              </span>
                            </div>
                          )}

                          {/* Always-on gradient (bottom heavy) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* 🔧 REMOVED: Ghost Index Number (01, 02, 03...) */}

                          {/* Role Badge */}
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className={cn("backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-white/20 rounded-full", meta.bg)}>
                              <RoleIcon className="h-3 w-3 mr-1" strokeWidth={2.5} />
                              {meta.label}
                            </Badge>
                          </div>

                          {/* Hover Contact Actions */}
                          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2.5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                            {t.email && (
                              <a
                                href={`mailto:${t.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="relative p-3 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20"
                                title="Send Email"
                              >
                                <Mail className="h-4 w-4" strokeWidth={2.5} />
                              </a>
                            )}
                            {t.phone && (
                              <a
                                href={`tel:${t.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="relative p-3 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-emerald-500 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20"
                                title="Call"
                              >
                                <Phone className="h-4 w-4" strokeWidth={2.5} />
                              </a>
                            )}
                            <div className="relative p-3 rounded-full bg-white/15 backdrop-blur-xl text-white hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 border border-white/25 ring-1 ring-inset ring-white/20 cursor-pointer">
                              <BookOpen className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="relative p-6 text-center flex-1 flex flex-col justify-between bg-gradient-to-b from-[var(--card)]/40 to-[var(--bg-soft)]/10">
                          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent pointer-events-none" />
                          
                          <div>
                            <h3 className="font-bold text-lg sm:text-xl mb-1.5 group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1 tracking-tight leading-tight">
                              {t.name}
                            </h3>
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] line-clamp-1">
                              {t.designation || "Faculty Member"}
                            </p>
                          </div>

                          {/* 🔧 REMOVED: "General" fallback. Now only shows if subject exists */}
                          {t.subject && (
                            <div className="mt-5 flex justify-center">
                              <Badge
                                variant="secondary"
                                className="px-3.5 py-1 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm shadow-brand-500/10 ring-1 ring-inset ring-[var(--primary)]/20 text-[10px] font-black uppercase tracking-[0.14em] rounded-full hover:bg-[var(--primary)]/15 transition-colors"
                              >
                                {t.subject}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Animated base accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  );
}