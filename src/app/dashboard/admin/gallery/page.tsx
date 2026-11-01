"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Image as ImageIcon, Loader2, Search, X, ImagePlus, Camera } from "lucide-react";

type GalleryImage = { _id: string; title: string; image: string; createdAt?: string };

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { const r = await api.get<any>("/api/gallery"); setImages(extractArray<GalleryImage>(r)); }
    catch { setImages([]); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return images;
    return images.filter((img) => img.title.toLowerCase().includes(q));
  }, [images, search]);

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
      if (url) { setForm((f) => ({ ...f, image: url })); toast.success("Image uploaded"); }
      else { setForm((f) => ({ ...f, image: prevImage })); toast.error("Upload failed"); }
    } catch (e: any) { setForm((f) => ({ ...f, image: prevImage })); toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.image) return toast.error("Upload an image first");
    if (!form.title.trim()) return toast.error("Enter a title");
    setSaving(true);
    try {
      await api.post("/api/gallery", { ...form, title: form.title.trim() });
      toast.success("Added to Gallery");
      setOpen(false); setForm({ title: "", image: "" }); void load();
    } catch (e: any) { toast.error(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    setDeleting(id);
    try { await api.del(`/api/gallery/${id}`); toast.success("Deleted"); setImages((prev) => prev.filter((i) => i._id !== id)); }
    catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-500 uppercase tracking-widest">
              <Camera className="h-3.5 w-3.5" /> Media Library
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">School Gallery</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Manage the visual story of Oasis BIAM.</p>
          </div>
          <Button onClick={() => { setForm({ title: "", image: "" }); setOpen(true); }} size="lg" className="shadow-lg shadow-brand-500/20"><Plus className="h-4 w-4" /> Add New Image</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"><X className="h-4 w-4 text-[var(--fg-muted)]" /></button>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl bg-[var(--card)] animate-pulse" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
          <ImageIcon className="h-12 w-12 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">Gallery is empty</h3>
          <Button onClick={() => setOpen(true)} className="mt-4">Upload First Image</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div key={img._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="group relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)]">
                <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between gap-2">
                  <p className="text-white font-semibold truncate text-sm">{img.title}</p>
                  <button onClick={() => void remove(img._id)} disabled={deleting === img._id} className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl">
                    {deleting === img._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Upload Gallery Image" className="max-w-lg">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Image Title *</label>
            <Input placeholder="e.g. Annual Science Fair 2026" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} disabled={uploading || saving} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Photo *</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)]"}`}>
              {form.image ? (
                <div className="relative aspect-video group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}><Upload className="h-4 w-4" /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading}><Trash2 className="h-4 w-4" /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)]">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" />}
                  <p className="text-sm font-semibold">Drop or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.image || !form.title.trim()} className="flex-1">{saving ? "Saving…" : "Save to Gallery"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}