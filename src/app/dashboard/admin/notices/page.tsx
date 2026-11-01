"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Bell, Search, X, Loader2, CalendarDays, Tag } from "lucide-react";

type Notice = { _id: string; title: string; content: string; category: string; createdAt?: string };
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
    try { const r = await api.get<any>("/api/notices"); setNotices(extractArray<Notice>(r)); }
    catch { setNotices([]); } finally { setLoading(false); }
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-slate-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-xs font-semibold text-slate-600 uppercase tracking-widest">
              <Bell className="h-3.5 w-3.5" /> Announcements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">School Notices</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Publish important announcements for students and parents.</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setOpen(true); }} size="lg"><Plus className="h-4 w-4" /> Add Notice</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"><X className="h-4 w-4 text-[var(--fg-muted)]" /></button>}
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[var(--card)] animate-pulse" />)}</div>
      ) : notices.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Bell className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">No notices yet</h3>
          <Button onClick={() => setOpen(true)} className="mt-4">Publish First Notice</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((n, i) => (
              <motion.div key={n._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group flex items-center gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 transition-all">
                <div className="w-12 h-12 rounded-xl gradient-brand grid place-items-center text-white shrink-0 shadow-lg"><Bell className="h-5 w-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider"><Tag className="h-3 w-3" /> {n.category}</span>
                    {n.createdAt && <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--fg-muted)]"><CalendarDays className="h-3 w-3" /> {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}
                  </div>
                  <h3 className="text-lg font-bold truncate">{n.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] line-clamp-1 mt-0.5">{n.content}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => void remove(n._id)} disabled={deleting === n._id} className="text-red-500">
                  {deleting === n._id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving) return; setOpen(false); }} title="Publish New Notice" className="max-w-2xl">
        <div className="space-y-5">
          <div><label className="text-sm font-semibold mb-1.5 block">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} disabled={saving} /></div>
          <div><label className="text-sm font-semibold mb-1.5 block">Category</label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={saving} /></div>
          <div><label className="text-sm font-semibold mb-1.5 block">Content *</label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} disabled={saving} className="min-h-[160px]" /></div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={!form.title.trim() || !form.content.trim()} className="flex-1">{saving ? "Publishing…" : "Publish Notice"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}