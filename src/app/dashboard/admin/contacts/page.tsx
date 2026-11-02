"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { toast } from "sonner";
import { Mail, Phone, Search, X, MessageSquare, User, Clock, Inbox, Sparkles, Quote } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type ContactMessage = { 
  _id: string; 
  name: string; 
  email: string; 
  phone?: string; 
  message: string; 
  createdAt?: string 
};

export default function AdminContacts() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const r = await api.get<any>("/api/contacts");
        setItems(extractArray<ContactMessage>(r));
      } catch (e: any) { 
        toast.error(e?.message || "Failed to load"); 
        setItems([]); 
      }
      finally { setLoading(false); }
    }
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) || 
      c.message.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={2.5} /> Inbox
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Contact Messages</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Read and respond to inquiries from parents, students, and the community.
            </p>
          </div>
          
          {/* Total Messages Chip */}
          <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/50 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] shrink-0">
            <div className="relative p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
              <Inbox className="h-5 w-5 relative" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-black leading-none tabular-nums tracking-tight">{items.length}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] mt-1.5">Total Messages</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= SEARCH ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="relative max-w-md group"
      >
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-indigo-500/15 via-transparent to-purple-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-indigo-500 transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search messages..." 
            className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-indigo-500/30 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300" 
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[260px] rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/15 to-transparent ring-1 ring-indigo-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">
            {items.length === 0 ? "Inbox is empty" : "No matches found"}
          </h3>
          <p className="text-sm font-medium text-[var(--fg-muted)] mb-6 max-w-sm mx-auto">
            {items.length === 0 
              ? "Messages submitted from the public contact page will appear here." 
              : "Try clearing your search to see all messages."}
          </p>
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="h-11 px-6 rounded-xl font-bold bg-[var(--card)] hover:bg-[var(--bg-soft)] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] text-sm"
            >
              Clear Search
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div 
                key={c._id} 
                layout 
                initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.4, delay: (i % 2) * 0.06, ease: EASE }}
                className="group relative flex flex-col p-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-purple-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-5">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 -m-1 rounded-xl bg-indigo-500/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center font-black text-xl shadow-lg border border-white/20 ring-1 ring-inset ring-white/20">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                      <span className="relative drop-shadow-md">{c.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                      {c.name}
                    </h3>
                    {c.createdAt && (
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3" strokeWidth={2.5} />
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Chips */}
                <div className="relative flex flex-wrap gap-2.5 mb-5">
                  <a 
                    href={`mailto:${c.email}`} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/[0.06] text-indigo-600 dark:text-indigo-400 text-[11px] font-bold tracking-tight ring-1 ring-inset ring-indigo-500/20 hover:bg-indigo-500/10 hover:ring-indigo-500/40 transition-all duration-300 group/chip"
                  >
                    <Mail className="h-3.5 w-3.5 group-hover/chip:scale-110 transition-transform" strokeWidth={2.5} />
                    {c.email}
                  </a>
                  {c.phone && (
                    <a 
                      href={`tel:${c.phone}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-soft)]/80 text-[var(--fg-muted)] text-[11px] font-bold tracking-tight ring-1 ring-inset ring-[var(--border)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] transition-all duration-300 group/chip"
                    >
                      <Phone className="h-3.5 w-3.5 group-hover/chip:scale-110 transition-transform" strokeWidth={2.5} />
                      {c.phone}
                    </a>
                  )}
                </div>

                {/* Message Box */}
                <div className="relative flex-1 p-5 rounded-[1.5rem] bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] overflow-hidden">
                  {/* Background Quote Watermark */}
                  <Quote className="absolute -bottom-4 -right-2 h-20 w-20 text-[var(--fg)]/[0.03] rotate-12 pointer-events-none group-hover:text-[var(--fg)]/[0.05] transition-colors duration-500" fill="currentColor" />
                  
                  <p className="relative text-[13px] leading-relaxed text-[var(--fg)] font-medium whitespace-pre-wrap italic">
                    "{c.message}"
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}