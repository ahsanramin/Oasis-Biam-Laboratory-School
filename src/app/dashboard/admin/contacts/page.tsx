"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { toast } from "sonner";
import { Mail, Phone, Search, X, MessageSquare, User, Clock, Inbox } from "lucide-react";

type ContactMessage = { _id: string; name: string; email: string; phone?: string; message: string; createdAt?: string };

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
      } catch (e: any) { toast.error(e?.message || "Failed to load"); setItems([]); }
      finally { setLoading(false); }
    }
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.message.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              <MessageSquare className="h-3.5 w-3.5" /> Inbox
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Contact Messages</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Read and respond to inquiries from parents, students, and the community.</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Inbox className="h-5 w-5" /></div>
            <div><p className="text-xl font-black leading-none">{items.length}</p><p className="text-xs text-[var(--fg-muted)] mt-1">Total Messages</p></div>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-[var(--card)] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Inbox className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold">Inbox is empty</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((c, i) => (
              <motion.div key={c._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center font-bold text-lg shrink-0">{c.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate">{c.name}</h3>
                    {c.createdAt && <p className="text-xs text-[var(--fg-muted)] flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" />{new Date(c.createdAt).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 text-xs font-semibold hover:bg-indigo-500/20"><Mail className="h-3.5 w-3.5" />{c.email}</a>
                  {c.phone && <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--border)] text-xs font-semibold"><Phone className="h-3.5 w-3.5" />{c.phone}</a>}
                </div>
                <div className="flex-1 p-4 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)]">
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)] whitespace-pre-wrap">"{c.message}"</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}