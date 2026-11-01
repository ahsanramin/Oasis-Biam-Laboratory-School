"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Award, Plus, Trash2, Upload, Search, X, ImagePlus, Loader2, AlertCircle } from "lucide-react";

type Achievement = { _id: string; title: string; year?: string; description?: string; image?: string | null; createdAt?: string | Date };
const emptyForm = { title: "", year: String(new Date().getFullYear()), description: "", image: "" };

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get<any>("/api/achievements");
      const data = extractArray<any>(r);
      setAchievements(data);
    } catch (e) { console.error(e); setAchievements([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter((a) => [a.title, a.year, a.description].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));
  }, [achievements, search]);

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose a JPG, PNG, or WebP image."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤5 MB."); return; }

    const tempUrl = URL.createObjectURL(file);
    setForm((f: any) => ({ ...f, image: tempUrl }));
    setUploading(true);
    try {
      const r = await api.upload(file); // 🔧 FIXED
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f: any) => ({ ...f, image: url })); toast.success("Image uploaded"); }
      else { setForm((f: any) => ({ ...f, image: "" })); toast.error("Upload failed"); }
    } catch (e: any) { setForm((f: any) => ({ ...f, image: "" })); toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    try {
      await api.post("/api/achievements", { title: form.title.trim(), year: form.year.trim(), description: form.description.trim(), image: form.image || null });
      toast.success("Achievement saved");
      setOpen(false); setForm(emptyForm); void load();
    } catch (e: any) { toast.error(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }

  async function remove(a: Achievement) {
    if (!confirm(`Delete "${a.title}"?`)) return;
    setDeleting(a._id);
    try {
      await api.del(`/api/achievements/${a._id}`);
      setAchievements((prev) => prev.filter((x) => x._id !== a._id));
      toast.success("Deleted");
    } catch (e: any) { toast.error(e?.message || "Failed to delete"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 uppercase tracking-widest">
              <Award className="h-3.5 w-3.5" /> School Achievements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Achievements Management</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Publish and manage the awards, milestones, and accomplishments of Oasis BIAM.</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setOpen(true); }} size="lg" className="shadow-lg shadow-amber-500/20">
            <Plus className="h-4 w-4" /> Add Achievement
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search achievements..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:border-[var(--primary)]/50 focus:ring-4 focus:ring-[var(--primary)]/10" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"><X className="h-4 w-4 text-[var(--fg-muted)]" /></button>}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-[var(--card)] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Award className="h-12 w-12 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">{search ? "No matches" : "No achievements yet"}</h3>
          <p className="text-sm text-[var(--fg-muted)]">{search ? "Try another search." : "Add the school's first achievement."}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.article key={a._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:shadow-lg transition-all">
                <div className="relative h-40 bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20">
                  {a.image ? <img src={a.image} alt={a.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center"><Award className="h-14 w-14 text-amber-300" /></div>}
                  {a.year && <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-xs font-bold text-slate-700">{a.year}</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg line-clamp-1">{a.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] mt-2 line-clamp-3 min-h-[60px]">{a.description || "No description."}</p>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => void remove(a)} disabled={deleting === a._id} className="text-red-500">
                      {deleting === a._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Add Achievement" className="max-w-2xl">
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pb-2">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Title *</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Achievement Title" disabled={saving} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Year</label>
            <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} disabled={saving} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Description</label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={saving} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {form.image ? (
                <div className="relative aspect-[16/10] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}><Upload className="h-4 w-4" /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading}><Trash2 className="h-4 w-4" /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)]">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" />}
                  <p className="text-sm font-semibold">Drop an image or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.title.trim()} className="flex-1">{saving ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}