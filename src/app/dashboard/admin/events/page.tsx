"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Plus, Trash2, Upload, CalendarDays, MapPin, 
  Search, X, ImagePlus, Loader2, Sparkles 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Event = { 
  _id: string; 
  title: string; 
  date: string; 
  time?: string; 
  location?: string; 
  description?: string; 
  image?: string; 
  createdAt?: string 
};

const emptyForm = { title: "", date: "", location: "", description: "", image: "" };

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { 
      const r = await api.get<any>("/api/events"); 
      setEvents(extractArray<Event>(r)); 
    }
    catch { 
      setEvents([]); 
    } finally { 
      setLoading(false); 
    }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((ev) => [ev.title, ev.location, ev.description].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));
  }, [events, search]);

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose an image."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤5 MB."); return; }
    const tempUrl = URL.createObjectURL(file);
    const prevImage = form.image;
    setForm((f) => ({ ...f, image: tempUrl }));
    setUploading(true);
    try {
      const r = await api.upload(file);
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f) => ({ ...f, image: url })); toast.success("Cover image uploaded"); }
      else { setForm((f) => ({ ...f, image: prevImage })); toast.error("Upload failed"); }
    } catch (e: any) { setForm((f) => ({ ...f, image: prevImage })); toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Event title is required");
    if (!form.date) return toast.error("Event date is required");
    setSaving(true);
    try {
      await api.post("/api/events", form);
      toast.success("Event added successfully");
      setOpen(false); setForm(emptyForm); void load();
    } catch (e: any) { toast.error(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    try { await api.del(`/api/events/${id}`); toast.success("Event deleted"); setEvents((prev) => prev.filter((ev) => ev._id !== id)); }
    catch (e: any) { toast.error(e?.message || "Failed to delete"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} /> Event Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">School Events</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Publish and manage upcoming school events.
            </p>
          </div>
          <Button 
            onClick={() => { setForm(emptyForm); setOpen(true); }} 
            size="lg" 
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Plus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Add New Event
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
            placeholder="Search events..." 
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
            <div key={i} className="h-[220px] rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <CalendarDays className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">No events scheduled</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            Publish your first school event, competition, or important date.
          </p>
          <Button 
            onClick={() => setOpen(true)}
            className="h-11 px-6 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-all duration-300 ring-1 ring-inset ring-white/20"
          >
            Create First Event
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((ev, i) => (
              <motion.div 
                key={ev._id} 
                layout 
                initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className="group relative flex flex-col sm:flex-row items-stretch gap-5 p-5 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* Image */}
                <div className="relative w-full sm:w-56 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0 bg-[var(--border)] ring-1 ring-inset ring-white/[0.06]">
                  <img 
                    src={ev.image || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"} 
                    alt={ev.title} 
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-500 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-brand-500/20">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.5} /> {ev.date}
                    </span>
                    {ev.location && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-soft)]/80 text-[var(--fg-muted)] text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-[var(--border)]">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} /> {ev.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold truncate tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                    {ev.title}
                  </h3>
                  <p className="text-[13px] font-medium text-[var(--fg-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                    {ev.description || "No description."}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-end shrink-0 sm:px-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => void remove(ev._id)} 
                    disabled={deleting === ev._id} 
                    className="w-10 h-10 rounded-xl text-red-500 bg-red-500/[0.04] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                  >
                    {deleting === ev._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Create New Event" className="max-w-2xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Event Title <span className="text-red-500">*</span></label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Annual Sports Day 2026" disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Date <span className="text-red-500">*</span></label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Location</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Main Campus Ground" disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Description</label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={uploading || saving} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-relaxed" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Cover Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {form.image ? (
                <div className="relative aspect-[21/9] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-lg"><Upload className="h-4 w-4 mr-2" strokeWidth={2.5} /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading} className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30"><Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-[21/9] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" strokeWidth={1.5} />}
                  <p className="text-sm font-bold tracking-tight">Drop a cover image here, or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.title.trim() || !form.date} className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform">
              {saving ? "Saving…" : "Publish Event"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}