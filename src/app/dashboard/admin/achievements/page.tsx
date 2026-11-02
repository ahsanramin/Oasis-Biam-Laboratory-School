"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Award, Plus, Trash2, Upload, Search, X, 
  ImagePlus, Loader2, Sparkles 
} from "lucide-react";

type Achievement = { 
  _id: string; 
  title: string; 
  year?: string; 
  description?: string; 
  image?: string | null; 
  createdAt?: string | Date 
};

const emptyForm = { title: "", year: String(new Date().getFullYear()), description: "", image: "" };
const EASE = [0.22, 1, 0.36, 1] as const;

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
    } catch (e) { 
      console.error(e); 
      setAchievements([]); 
    }
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
      const r = await api.upload(file);
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f: any) => ({ ...f, image: url })); toast.success("Image uploaded"); }
      else { setForm((f: any) => ({ ...f, image: "" })); toast.error("Upload failed"); }
    } catch (e: any) { 
      setForm((f: any) => ({ ...f, image: "" })); 
      toast.error(e?.message || "Upload failed"); 
    }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    try {
      await api.post("/api/achievements", { 
        title: form.title.trim(), 
        year: form.year.trim(), 
        description: form.description.trim(), 
        image: form.image || null 
      });
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
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none" />
        {/* Corner glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
              <Award className="h-3.5 w-3.5" strokeWidth={2.5} /> School Achievements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Achievements Management</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Publish and manage the awards, milestones, and accomplishments of Oasis BIAM.
            </p>
          </div>
          <Button 
            onClick={() => { setForm(emptyForm); setOpen(true); }} 
            size="lg" 
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Plus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Add Achievement
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
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-amber-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search achievements..." 
            className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" 
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] transition-colors">
              <X className="h-4 w-4 text-[var(--fg-muted)]" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ================= GRID ================= */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md">
          <Award className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-bold mb-2 tracking-tight">{search ? "No matches" : "No achievements yet"}</h3>
          <p className="text-sm text-[var(--fg-muted)] font-medium">{search ? "Try another search." : "Add the school's first achievement."}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.article 
                key={a._id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* ================= IMAGE ================= */}
                <div className="relative h-48 bg-gradient-to-br from-amber-500/10 to-transparent overflow-hidden">
                  {a.image ? (
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out" />
                  ) : (
                    <div className="w-full h-full grid place-items-center">
                      <Award className="h-14 w-14 text-amber-500/30" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Year Badge */}
                  {a.year && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-xl border border-white/25 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-black/20 ring-1 ring-inset ring-white/20">
                      {a.year}
                    </span>
                  )}
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg tracking-tight line-clamp-1 group-hover:text-[var(--primary)] transition-colors duration-300">
                    {a.title}
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)] mt-2 line-clamp-3 min-h-[60px] leading-relaxed font-medium">
                    {a.description || "No description provided."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => void remove(a)} 
                      disabled={deleting === a._id} 
                      className="h-9 px-3 rounded-lg text-[11px] font-bold text-[var(--fg-muted)] hover:text-red-500 hover:bg-red-500/10 ring-1 ring-inset ring-transparent hover:ring-red-500/20 transition-all duration-300"
                    >
                      {deleting === a._id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 mr-2" strokeWidth={2.5} />
                      )} 
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Add Achievement" className="max-w-2xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Title <span className="text-red-500">*</span></label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Achievement Title" disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Year</label>
            <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Description</label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={saving} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-relaxed" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {form.image ? (
                <div className="relative aspect-[16/10] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-lg"><Upload className="h-4 w-4 mr-2" /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading} className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30"><Trash2 className="h-4 w-4 mr-2" /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" strokeWidth={1.5} />}
                  <p className="text-sm font-bold tracking-tight">Drop an image or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.title.trim()} className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform">
              {saving ? "Saving…" : "Save Achievement"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}