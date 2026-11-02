"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Plus, Trash2, Bell, Search, X, Loader2, 
  CalendarDays, Tag, Sparkles 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Notice = { 
  _id: string; 
  title: string; 
  content: string; 
  category: string; 
  createdAt?: string 
};

const emptyForm = { title: "", content: "", category: "General" };

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try { 
      const r = await api.get<any>("/api/notices"); 
      setNotices(extractArray<Notice>(r)); 
    }
    catch { 
      setNotices([]); 
    } finally { 
      setLoading(false); 
    }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter((n) => n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notices, search]);

  async function save() {
    if (!form.title.trim()) return toast.error("Title required");
    if (!form.content.trim()) return toast.error("Content required");
    setSaving(true);
    try {
      await api.post("/api/notices", { ...form, title: form.title.trim(), content: form.content.trim() });
      toast.success("Notice published");
      setOpen(false); setForm(emptyForm); void load();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this notice?")) return;
    setDeleting(id);
    try { await api.del(`/api/notices/${id}`); toast.success("Deleted"); setNotices((prev) => prev.filter((n) => n._id !== id)); }
    catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">
              <Bell className="h-3.5 w-3.5" strokeWidth={2.5} /> Announcements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">School Notices</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Publish important announcements for students and parents.
            </p>
          </div>
          <Button 
            onClick={() => { setForm(emptyForm); setOpen(true); }} 
            size="lg" 
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Plus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Add Notice
          </Button>
        </div>
      </motion.div>

      {/* ================= SEARCH ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="relative max-w-md group"
      >
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-slate-500/15 via-transparent to-brand-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search notices..." 
            className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" 
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
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-slate-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-500/15 to-transparent ring-1 ring-slate-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <Bell className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">No notices yet</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            Publish your first announcement to keep students and parents informed.
          </p>
          <Button 
            onClick={() => setOpen(true)}
            className="h-11 px-6 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-all duration-300 ring-1 ring-inset ring-white/20"
          >
            Publish First Notice
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((n, i) => (
              <motion.div 
                key={n._id} 
                layout 
                initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-slate-500/[0.08] via-transparent to-brand-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* Icon */}
                <div className="relative shrink-0">
                  <div className="relative w-14 h-14 rounded-2xl gradient-brand text-white grid place-items-center shadow-lg shadow-brand-500/25 ring-1 ring-inset ring-white/20 group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                    <Bell className="h-6 w-6 relative" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-brand-500/20">
                      <Tag className="h-3 w-3" strokeWidth={2.5} /> {n.category}
                    </span>
                    {n.createdAt && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-soft)]/80 text-[var(--fg-muted)] text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-[var(--border)]">
                        <CalendarDays className="h-3 w-3" strokeWidth={2.5} /> {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold truncate tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                    {n.title}
                  </h3>
                  <p className="text-[13px] font-medium text-[var(--fg-muted)] line-clamp-1 mt-1 leading-relaxed">
                    {n.content}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end shrink-0 sm:pl-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => void remove(n._id)} 
                    disabled={deleting === n._id} 
                    className="w-10 h-10 rounded-xl text-red-500 bg-red-500/[0.04] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                  >
                    {deleting === n._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog open={open} onClose={() => { if (saving) return; setOpen(false); }} title="Publish New Notice" className="max-w-2xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Title <span className="text-red-500">*</span></label>
            <Input 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              disabled={saving} 
              className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" 
              placeholder="Enter notice title..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Category</label>
            <Input 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              disabled={saving} 
              className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" 
              placeholder="e.g. General, Exam, Event"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Content <span className="text-red-500">*</span></label>
            <Textarea 
              rows={6} 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              disabled={saving} 
              className="min-h-[160px] p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-[15px] font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-[1.75]" 
              placeholder="Write the full notice content here..."
            />
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving} className="flex-1 h-12 rounded-xl font-bold">
              Cancel
            </Button>
            <Button 
              onClick={save} 
              loading={saving} 
              disabled={!form.title.trim() || !form.content.trim()} 
              className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform"
            >
              {saving ? "Publishing…" : "Publish Notice"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}