"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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
      
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 space-y-12">
        
        {/* Top Bar: Categories & Search */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-[var(--border)] pb-8">
          <div className="flex flex-wrap gap-2 w-full xl:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-105" 
                    : "bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--border)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)]" />
            <Input 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 rounded-full bg-[var(--card)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] shadow-sm" 
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 rounded-[2rem]" />
              <Skeleton className="h-96 rounded-[2rem]" />
              <Skeleton className="h-96 rounded-[2rem]" />
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-24 bg-[var(--bg-soft)] rounded-3xl border border-[var(--border)] border-dashed">
            <BookOpen className="h-12 w-12 text-[var(--fg-muted)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-[var(--fg-muted)]">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <>
            {/* Featured Article Hero */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden">
                        {featured.coverImage ? (
                          <Image 
                            src={featured.coverImage} 
                            alt={featured.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                            unoptimized 
                          />
                        ) : (
                          <div className="absolute inset-0 gradient-brand" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                        <div className="absolute top-6 left-6 z-10">
                          <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 shadow-lg px-4 py-1.5 text-sm">
                            Featured Story
                          </Badge>
                        </div>
                      </div>
                      <div className="p-8 lg:p-14 flex flex-col justify-center relative bg-gradient-to-br from-[var(--card)] to-[var(--bg-soft)]/30">
                        <Badge variant="brand" className="mb-4 w-max px-3 py-1">{featured.category}</Badge>
                        <h2 className="text-3xl lg:text-5xl font-black font-display leading-[1.15] mb-6 group-hover:text-[var(--primary)] transition-colors duration-300">
                          {featured.title}
                        </h2>
                        <p className="text-lg text-[var(--fg-muted)] mb-8 line-clamp-3 leading-relaxed">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm font-bold text-[var(--fg-muted)] mt-auto">
                          <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[var(--primary)]" />{formatDate(featured.createdAt)}</span>
                          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[var(--primary)]" />{featured.readTime || 3} min read</span>
                        </div>
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-[var(--primary)]/10 grid place-items-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid of Rest */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {rest.map((a, i) => (
                  <motion.div 
                    key={a._id} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/blog/${a.slug}`} className="group block h-full">
                      <div className="rounded-[2rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300 h-full flex flex-col">
                        <div className="relative aspect-[4/3] bg-[var(--bg-soft)] overflow-hidden">
                          {a.coverImage ? (
                            <Image 
                              src={a.coverImage} 
                              alt={a.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                              unoptimized 
                            />
                          ) : (
                            <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-4xl">
                              <BookOpen className="h-10 w-10 opacity-50" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <Badge className="absolute top-4 left-4 shadow-lg" variant="brand">{a.category}</Badge>
                        </div>
                        <div className="p-7 flex-1 flex flex-col">
                          <h3 className="font-bold text-xl leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                            {a.title}
                          </h3>
                          <p className="text-[var(--fg-muted)] text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                            {a.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-bold text-[var(--fg-muted)] pt-4 border-t border-[var(--border)]">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(a.createdAt)}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{a.readTime || 3} min</span>
                          </div>
                        </div>
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