"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Search, X, ImagePlus, Loader2, Crown, Users, ShieldCheck } from "lucide-react";

type Member = { _id: string; name: string; position: string; image?: string; isChairman?: boolean };
const emptyForm = { name: "", position: "", image: "", isChairman: false };

export default function AdminGoverningBody() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { const r = await api.get<any>("/api/governing-body"); setMembers(extractArray<Member>(r)); }
    catch { setMembers([]); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.position.toLowerCase().includes(q));
  }, [members, search]);

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose an image."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤5 MB."); return; }
    const tempUrl = URL.createObjectURL(file);
    const prevImage = form.image;
    setForm((f: any) => ({ ...f, image: tempUrl }));
    setUploading(true);
    try {
      const r = await api.upload(file); // 🔧 FIXED
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f: any) => ({ ...f, image: url })); toast.success("Photo uploaded"); }
      else { setForm((f: any) => ({ ...f, image: prevImage })); toast.error("Upload failed"); }
    } catch (e: any) { setForm((f: any) => ({ ...f, image: prevImage })); toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name required");
    if (!form.position.trim()) return toast.error("Position required");
    setSaving(true);
    try {
      await api.post("/api/governing-body", { ...form, name: form.name.trim(), position: form.position.trim() });
      toast.success("Member added");
      setOpen(false); setForm(emptyForm); void load();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!confirm("Remove this member?")) return;
    setDeleting(id);
    try { await api.del(`/api/governing-body/${id}`); toast.success("Removed"); setMembers((prev) => prev.filter((m) => m._id !== id)); }
    catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> Leadership
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Governing Body</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Manage the members of the Oasis BIAM governing board.</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setOpen(true); }} size="lg"><Plus className="h-4 w-4" /> Add Member</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or position..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-[var(--card)] animate-pulse" />)}</div>
      ) : members.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Users className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">No members yet</h3>
          <Button onClick={() => setOpen(true)} className="mt-4">Add First Member</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div key={m._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all ${m.isChairman ? "bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30" : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 ${m.isChairman ? "ring-2 ring-amber-500" : ""}`}>
                  <img src={m.image || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"} alt={m.name} className="w-full h-full object-cover" />
                  {m.isChairman && <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-bl-lg rounded-tr-lg"><Crown className="h-3 w-3" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold truncate">{m.name}</h3>
                  <p className={`text-sm font-semibold truncate ${m.isChairman ? "text-amber-500" : "text-[var(--fg-muted)]"}`}>{m.position}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => void remove(m._id)} disabled={deleting === m._id} className="text-red-500">
                  {deleting === m._id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Add Governing Body Member" className="max-w-xl">
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pb-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold mb-1.5 block">Full Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={uploading || saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Position *</label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} disabled={uploading || saving} /></div>
          </div>
          <div onClick={() => setForm({ ...form, isChairman: !form.isChairman })} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${form.isChairman ? "border-amber-500 bg-amber-500/10" : "border-[var(--border)]"}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${form.isChairman ? "bg-amber-500 text-white" : "bg-[var(--border)]"}`}><Crown className="h-5 w-5" /></div>
              <div><p className="font-bold text-sm">Appoint as Chairman</p></div>
            </div>
            <div className={`w-11 h-6 rounded-full relative ${form.isChairman ? "bg-amber-500" : "bg-[var(--border)]"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.isChairman ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-1.5 block">Profile Photo</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden ${dragActive ? "border-[var(--primary)]" : form.image ? "border-[var(--border)]" : "border-[var(--border)]"}`}>
              {form.image ? (
                <div className="relative aspect-square max-h-[250px] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })}>Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-square max-h-[250px] flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)]">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" />}
                  <p className="text-sm font-semibold">Drop or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.name.trim() || !form.position.trim()} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">{saving ? "Saving…" : "Save Member"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}