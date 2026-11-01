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
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-32 space-y-8">
            
            {/* Search Box */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notices..."
                className="pl-11 h-12 rounded-xl bg-[var(--card)] border-[var(--border)] focus:border-[var(--primary)] shadow-sm"
              />
            </div>

            {/* Category Filter Card */}
            <Card className="p-6 bg-[var(--card)]/80 backdrop-blur-xl border-[var(--border)] shadow-xl shadow-black/5">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-[var(--primary)]" /> Categories
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                        isActive 
                          ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 translate-x-1" 
                          : "hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {cat}
                      {isActive && <Sparkles className="h-4 w-4" />}
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
                <Skeleton key={i} className="h-40 w-full rounded-3xl" />
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[2rem] bg-[var(--card)]/50 flex flex-col items-center">
              <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-full grid place-items-center mb-6">
                <Inbox className="h-10 w-10 text-[var(--fg-muted)] opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No notices found</h3>
              <p className="text-[var(--fg-muted)] max-w-sm mx-auto mb-6">
                {search 
                  ? `We couldn't find any notices matching "${search}".` 
                  : "There are no notices in this category yet."}
              </p>
              <button 
                onClick={() => { setSearch(""); setActiveCategory("All Notices"); }}
                className="text-[var(--primary)] font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {filteredNotices.map((n, i) => (
                  <motion.div 
                    key={n._id} 
                    layout
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link href={`/notices/${n._id}`}>
                      <Card className={`relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-[var(--card)]`}>
                        
                        {/* Featured Gradient Line */}
                        {n.featured && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-amber-400 to-[var(--primary)]" />
                        )}

                        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                          
                          {/* Icon */}
                          <div className={`shrink-0 w-14 h-14 rounded-2xl grid place-items-center shadow-sm transition-transform duration-300 group-hover:scale-110 ${n.featured ? "gradient-brand text-white shadow-[var(--primary)]/30" : "bg-[var(--bg-soft)] text-[var(--primary)] border border-[var(--border)]"}`}>
                            {n.featured ? <Pin className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <Badge variant={n.featured ? "warning" : "secondary"} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {n.featured ? "Pinned Notice" : n.category || "General"}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-xl sm:text-2xl mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                              {n.title}
                            </h3>
                            
                            {/* Excerpt */}
                            <p className="text-[var(--fg-muted)] text-sm sm:text-base line-clamp-2 mb-6 leading-relaxed">
                              {n.content}
                            </p>
                            
                            {/* Footer */}
                            <div className="flex flex-wrap items-center justify-between pt-5 border-t border-[var(--border)] gap-4">
                              <span className="flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] bg-[var(--bg-soft)] px-3 py-1.5 rounded-lg">
                                <Calendar className="h-4 w-4 text-[var(--primary)]" />
                                {formatDate(n.publishDate || n.createdAt)}
                              </span>
                              
                              <span className="flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition-transform group-hover:translate-x-1">
                                Read Full Notice <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
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