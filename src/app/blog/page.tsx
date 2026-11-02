"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");

  useEffect(() => {
    async function load() {
      try {
        // 🔧 FIX: api.get returns the data directly
        const r = await api.get<any>("/api/articles");
        setArticles(extractArray(r));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  // Get unique categories from articles
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category).filter(Boolean));
    return ["All Posts", ...Array.from(cats)];
  }, [articles]);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                            a.excerpt?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All Posts" || a.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, search, activeCategory]);

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <>
      <PageHeader
        title="Insights & Articles"
        subtitle="Educational tips, school news, and resources for parents and students."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 space-y-14 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -left-24 w-[560px] h-[560px] bg-brand-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-[520px] h-[520px] bg-blue-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= TOP BAR: Categories & Search ================= */}
        <div className="relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-8 border-b border-[var(--border)]">

          {/* Category filter rail */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 ring-1 ring-inset ring-white/20"
                      : "bg-[var(--bg-soft)]/70 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--border)]/60 ring-1 ring-inset ring-[var(--border)] hover:-translate-y-0.5"
                  }`}
                >
                  {isActive && (
                    <span className="pointer-events-none absolute inset-0 -m-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-60" />
                  )}
                  <span className="relative">{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full xl:w-80 shrink-0 group">
            <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-brand-500/15 via-transparent to-blue-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                strokeWidth={2.5}
              />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="relative pl-11 h-12 rounded-full bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-brand-500/[0.06] focus:border-[var(--primary)]/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-10">
            {/* Featured skeleton */}
            <div className="rounded-[2.5rem] overflow-hidden border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md">
              <div className="grid lg:grid-cols-2">
                <Skeleton className="aspect-video lg:aspect-auto lg:h-full min-h-[400px] rounded-none" />
                <div className="p-8 lg:p-14 space-y-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-12 w-4/5 rounded-xl" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-11/12 rounded" />
                    <Skeleton className="h-4 w-9/12 rounded" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            {/* Grid skeletons */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-[2rem] overflow-hidden border border-[var(--border)] bg-[var(--card)]/60">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="p-7 space-y-3">
                    <Skeleton className="h-6 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-3 w-full rounded" />
                      <Skeleton className="h-3 w-11/12 rounded" />
                      <Skeleton className="h-3 w-9/12 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative text-center py-28 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl -z-10" />
            <div className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 items-center justify-center mb-6 relative">
              <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="relative w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <BookOpen className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">No articles found</h3>
            <p className="text-sm text-[var(--fg-muted)] font-medium">Try adjusting your search or category filter.</p>
          </motion.div>
        ) : (
          <>
            {/* ================= FEATURED ARTICLE HERO ================= */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/[0.08] transition-all duration-500">
                    {/* Top hairline */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent z-20 pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-0">

                      {/* Image side */}
                      <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden">
                        {featured.coverImage ? (
                          <Image
                            src={featured.coverImage}
                            alt={featured.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 gradient-brand">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                          </div>
                        )}
                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent hidden lg:block pointer-events-none" />

                        {/* Featured tag */}
                        <div className="absolute top-6 left-6 z-10">
                          <Badge className="bg-white/15 backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] font-black ring-1 ring-inset ring-white/20 rounded-full">
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            Featured Story
                          </Badge>
                        </div>
                      </div>

                      {/* Content side */}
                      <div className="relative p-8 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-[var(--card)] to-[var(--bg-soft)]/20 overflow-hidden">

                        {/* Ghost watermark */}
                        <div className="absolute -top-6 right-2 text-[180px] font-black leading-none text-[var(--fg)]/[0.035] select-none pointer-events-none tracking-tighter">
                          01
                        </div>
                        {/* Corner glow */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500/[0.07] rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/[0.12] transition-colors duration-500" />

                        <div className="relative">
                          <Badge
                            variant="brand"
                            className="mb-5 w-max px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-black rounded-full shadow-md shadow-brand-500/20 ring-1 ring-inset ring-white/20"
                          >
                            {featured.category}
                          </Badge>

                          <h2 className="text-3xl lg:text-5xl font-black font-display leading-[1.1] mb-6 tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                            {featured.title}
                          </h2>

                          <p className="text-lg text-[var(--fg-muted)] mb-8 line-clamp-3 leading-relaxed font-medium">
                            {featured.excerpt}
                          </p>

                          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.14em] font-bold text-[var(--fg-muted)] mt-auto">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                              {formatDate(featured.createdAt)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                              {featured.readTime || 3} min read
                            </span>
                          </div>
                        </div>

                        {/* CTA circle */}
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 grid place-items-center group-hover:bg-[var(--primary)] group-hover:text-white group-hover:ring-[var(--primary)] transition-all duration-500 group-hover:scale-110 shadow-lg shadow-transparent group-hover:shadow-[var(--primary)]/30">
                          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* ================= GRID OF REST ================= */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {rest.map((a, i) => (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                    className="relative group"
                  >
                    {/* Hover aura */}
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-blue-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                    <Link href={`/blog/${a.slug}`} className="block h-full">
                      <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 h-full flex flex-col">

                        {/* Top hairline */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-10 pointer-events-none" />

                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-[var(--bg-soft)] overflow-hidden">
                          {a.coverImage ? (
                            <Image
                              src={a.coverImage}
                              alt={a.title}
                              fill
                              className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 gradient-brand grid place-items-center text-white">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                              <BookOpen className="h-10 w-10 opacity-50 relative" strokeWidth={2} />
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Category pill */}
                          <div className="absolute top-4 left-4 z-10">
                            <Badge
                              variant="brand"
                              className="shadow-lg shadow-brand-500/25 px-3 py-1 text-[10px] uppercase tracking-[0.16em] font-black ring-1 ring-inset ring-white/20 rounded-full backdrop-blur-md"
                            >
                              {a.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-7 flex-1 flex flex-col relative">
                          <h3 className="font-bold text-xl leading-snug mb-3 group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2 tracking-tight">
                            {a.title}
                          </h3>
                          <p className="text-[var(--fg-muted)] text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-medium">
                            {a.excerpt}
                          </p>

                          {/* Meta footer */}
                          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--fg-muted)] pt-4 border-t border-[var(--border)]">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
                              {formatDate(a.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                              {a.readTime || 3} min
                            </span>
                          </div>
                        </div>

                        {/* Animated base accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>
    </>
  );
}