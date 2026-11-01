"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Upload, CalendarDays, MapPin, Search, X, ImagePlus, Loader2 } from "lucide-react";

type Event = { _id: string; title: string; date: string; time?: string; location?: string; description?: string; image?: string; createdAt?: string };
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
    try { const r = await api.get<any>("/api/events"); setEvents(extractArray<Event>(r)); }
    catch { setEvents([]); } finally { setLoading(false); }
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
      const r = await api.upload(file); // 🔧 FIXED
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-500 uppercase tracking-widest">
              <CalendarDays className="h-3.5 w-3.5" /> Event Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">School Events</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Publish and manage upcoming school events.</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setOpen(true); }} size="lg"><Plus className="h-4 w-4" /> Add New Event</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-[var(--card)] animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <CalendarDays className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">No events scheduled</h3>
          <Button onClick={() => setOpen(true)} className="mt-4">Create First Event</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((ev, i) => (
              <motion.div key={ev._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="group flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 transition-all">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0 bg-[var(--border)]">
                  <img src={ev.image || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"} alt={ev.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0 py-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-xs font-bold">
                      <CalendarDays className="h-3.5 w-3.5" /> {ev.date}
                    </span>
                    {ev.location && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--border)] text-[var(--fg-muted)] text-xs font-semibold"><MapPin className="h-3.5 w-3.5" /> {ev.location}</span>}
                  </div>
                  <h3 className="text-xl font-bold truncate">{ev.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] mt-1 line-clamp-2">{ev.description || "No description."}</p>
                </div>
                <div className="flex items-center justify-end shrink-0 px-2">
                  <Button variant="ghost" size="icon" onClick={() => void remove(ev._id)} disabled={deleting === ev._id} className="text-red-500">
                    {deleting === ev._id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Create New Event" className="max-w-2xl">
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pb-2">
          <div><label className="text-sm font-semibold mb-1.5 block">Event Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Annual Sports Day 2026" disabled={uploading || saving} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold mb-1.5 block">Date *</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} disabled={uploading || saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Location</label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Main Campus Ground" disabled={uploading || saving} /></div>
          </div>
          <div><label className="text-sm font-semibold mb-1.5 block">Description</label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={uploading || saving} /></div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Cover Image</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)]"}`}>
              {form.image ? (
                <div className="relative aspect-[21/9] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}><Upload className="h-4 w-4" /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading}><Trash2 className="h-4 w-4" /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-[21/9] flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)]">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" />}
                  <p className="text-sm font-semibold">Drop or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.title.trim() || !form.date} className="flex-1">{saving ? "Saving…" : "Publish Event"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}