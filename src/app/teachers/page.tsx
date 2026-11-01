"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, BookOpen, Users, Sparkles, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Safe helper for initials
function getInitials(name: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ================= DATA FETCHING =================
  useEffect(() => {
    async function loadTeachers() {
      try {
        // 🔧 FIX: Proper API unwrapping
        const r = await api.get<any>("/api/teachers");
        setTeachers(extractArray(r));
      } catch (err) {
        console.error("Failed to load faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadTeachers();
  }, []);

  // ================= FILTERING & SEARCH =================
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      // 1. Filter by Role Tab
      const matchesRole = filter === "all" || t.role === filter;
      
      // 2. Filter by Search Query
      const q = search.toLowerCase();
      const matchesSearch = 
        t.name?.toLowerCase().includes(q) || 
        t.subject?.toLowerCase().includes(q) || 
        t.designation?.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [teachers, filter, search]);

  return (
    <>
      <PageHeader 
        title="Our Expert Faculty" 
        subtitle="Dedicated educators shaping the future of our students." 
        breadcrumbs={[{ label: "Faculty" }]} 
      />
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* ================= STICKY FILTER BAR ================= */}
        <div className="sticky top-24 z-30 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-2 bg-[var(--bg)]/80 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] shadow-lg shadow-black/5">
            
            {/* Role Tabs */}
            <div className="flex w-full lg:w-auto overflow-x-auto no-scrollbar p-1 gap-1">
              {[
                { id: "all", label: "All Staff" },
                { id: "principal", label: "Principal" },
                { id: "vice-principal", label: "Vice Principal" },
                { id: "teacher", label: "Teachers" }
              ].map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setFilter(tab.id)}
                    className={`relative flex-1 lg:flex-none whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive ? "text-[var(--primary)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80 shrink-0 px-2 pb-2 lg:pb-0 lg:pr-2">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)]" />
              <Input 
                placeholder="Search by name or subject..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-[var(--card)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] rounded-xl transition-all" 
              />
            </div>

          </div>
        </div>

        {/* ================= FACULTY GRID ================= */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] rounded-[2rem]" />
                <Skeleton className="h-6 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--card)]/50 flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-full grid place-items-center mb-6">
              <Inbox className="h-10 w-10 text-[var(--fg-muted)] opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No faculty found</h3>
            <p className="text-[var(--fg-muted)] max-w-sm mx-auto">
              We couldn't find any teachers matching your current filters or search query.
            </p>
            <button 
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="mt-6 text-[var(--primary)] font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredTeachers.map((t, i) => (
                <motion.div 
                  key={t._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/teachers/${t._id}`} className="group block h-full">
                    <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:shadow-2xl hover:shadow-[var(--primary)]/10 transition-all duration-300 h-full flex flex-col">
                      
                      {/* Image Section */}
                      <div className="relative aspect-[4/5] bg-[var(--bg-soft)] overflow-hidden">
                        {t.image ? (
                          <Image 
                            src={t.image} 
                            alt={t.name} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                            unoptimized 
                          />
                        ) : (
                          <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-6xl font-black">
                            {getInitials(t.name)}
                          </div>
                        )}
                        
                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Hover Contact Actions */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          {t.email && (
                            <a 
                              href={`mailto:${t.email}`} 
                              onClick={(e) => e.stopPropagation()} // Prevent triggering the card link
                              className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg"
                              title="Send Email"
                            >
                              <Mail className="h-5 w-5" />
                            </a>
                          )}
                          {t.phone && (
                            <a 
                              href={`tel:${t.phone}`} 
                              onClick={(e) => e.stopPropagation()}
                              className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg"
                              title="Call Phone"
                            >
                              <Phone className="h-5 w-5" />
                            </a>
                          )}
                          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[var(--primary)] hover:scale-110 transition-all shadow-lg cursor-pointer">
                            <BookOpen className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Text Content */}
                      <div className="p-6 text-center flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[var(--card)] to-[var(--bg-soft)]/30">
                        <div>
                          <h3 className="font-bold text-xl mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                            {t.name}
                          </h3>
                          <p className="text-sm font-bold text-[var(--fg-muted)] line-clamp-1">
                            {t.designation || "Faculty Member"}
                          </p>
                        </div>
                        
                        <div className="mt-5">
                          <Badge variant="secondary" className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm">
                            {t.subject || "General"}
                          </Badge>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  );
}