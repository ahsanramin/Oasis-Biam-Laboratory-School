"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Plus, Trash2, Search, ImagePlus, Loader2, 
  Crown, Users, ShieldCheck, MessageSquare, 
  BadgeCheck, Quote, Sparkles, Edit 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Member = { 
  _id: string; 
  name: string; 
  position: string; 
  image?: string; 
  isChairman?: boolean;
  message?: string;
};

const emptyForm = { name: "", position: "", image: "", isChairman: false, message: "" };

export default function AdminGoverningBody() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null); // 🎯 Added for Edit
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { 
      const r = await api.get<any>("/api/governing-body"); 
      setMembers(extractArray<Member>(r)); 
    }
    catch { 
      setMembers([]); 
    } finally { 
      setLoading(false); 
    }
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
      const r = await api.upload(file);
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f: any) => ({ ...f, image: url })); toast.success("Photo uploaded"); }
      else { setForm((f: any) => ({ ...f, image: prevImage })); toast.error("Upload failed"); }
    } catch (e: any) { 
      setForm((f: any) => ({ ...f, image: prevImage })); 
      toast.error(e?.message || "Upload failed"); 
    }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name required");
    if (!form.position.trim()) return toast.error("Position required");
    setSaving(true);
    try {
      const payload = { 
        ...form, 
        name: form.name.trim(), 
        position: form.position.trim(),
        message: form.message ? form.message.trim() : ""
      };

      if (editingId) {
        await api.patch(`/api/governing-body/${editingId}`, payload);
        toast.success("Member updated");
      } else {
        await api.post("/api/governing-body", payload);
        toast.success("Member added");
      }
      
      setOpen(false); 
      setForm(emptyForm); 
      setEditingId(null);
      void load();
    } catch (e: any) { 
      toast.error(e?.message || "Failed"); 
    }
    finally { setSaving(false); }
  }

  function openEdit(m: Member) {
    setForm(m);
    setEditingId(m._id);
    setOpen(true);
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  }

  async function remove(id: string) {
    if (!confirm("Remove this member?")) return;
    setDeleting(id);
    try { 
      await api.del(`/api/governing-body/${id}`); 
      toast.success("Removed"); 
      setMembers((prev) => prev.filter((m) => m._id !== id)); 
    }
    catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeleting(null); }
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} /> Leadership
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Governing Body</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Manage the members of the Oasis BIAM governing board and their official messages.
            </p>
          </div>
          <Button 
            onClick={openAdd} 
            size="lg"
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Plus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Add Member
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
            placeholder="Search by name or position..." 
            className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" 
          />
        </div>
      </motion.div>

      {/* ================= GRID ================= */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md">
          <Users className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-bold mb-2 tracking-tight">No members yet</h3>
          <Button onClick={openAdd} className="mt-4 rounded-xl font-bold">Add First Member</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div 
                key={m._id} 
                layout 
                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className={`group relative flex flex-col p-5 rounded-[2rem] border transition-all duration-500 backdrop-blur-md overflow-hidden ${
                  m.isChairman 
                    ? "bg-gradient-to-br from-amber-500/[0.08] to-transparent border-amber-500/40 shadow-xl shadow-amber-500/[0.05]" 
                    : "bg-[var(--card)]/70 border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-black/[0.04]"
                }`}
              >
                {/* Top Hairline */}
                <div className={`absolute top-0 left-0 right-0 h-px pointer-events-none ${m.isChairman ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"}`} />

                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 ring-1 ring-inset shadow-lg ${m.isChairman ? "ring-amber-500/50 shadow-amber-500/20" : "ring-[var(--border)] shadow-black/[0.05]"}`}>
                    <img 
                      src={m.image || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"} 
                      alt={m.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    {m.isChairman && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-500 text-white p-1.5 rounded-bl-xl shadow-lg border border-white/20">
                        <Crown className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-bold truncate tracking-tight group-hover:text-[var(--primary)] transition-colors">{m.name}</h3>
                    <p className={`text-[11px] font-black uppercase tracking-[0.14em] truncate mt-1 ${m.isChairman ? "text-amber-500" : "text-[var(--fg-muted)]"}`}>
                      {m.position}
                    </p>
                  </div>
                </div>

                {/* Message Preview */}
                {m.message && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]/50">
                    <p className="text-xs text-[var(--fg-muted)] line-clamp-2 italic leading-relaxed">
                      "{m.message}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--border)]/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEdit(m)} 
                    className="h-8 w-8 rounded-lg bg-transparent text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 ring-1 ring-inset ring-transparent hover:ring-[var(--primary)]/20 transition-all duration-300 opacity-50 group-hover:opacity-100"
                  >
                    <Edit className="h-4 w-4" strokeWidth={2.5} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => void remove(m._id)} 
                    disabled={deleting === m._id} 
                    className="h-8 w-8 rounded-lg bg-transparent text-[var(--fg-muted)] hover:text-red-500 hover:bg-red-500/10 ring-1 ring-inset ring-transparent hover:ring-red-500/20 transition-all duration-300 opacity-50 group-hover:opacity-100"
                  >
                    {deleting === m._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================= DIALOG (MODAL) ================= */}
      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title={editingId ? "Edit Governing Body Member" : "Add Governing Body Member"} className="max-w-xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Full Name <span className="text-red-500">*</span></label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Position <span className="text-red-500">*</span></label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
          </div>

          {/* Chairman Toggle */}
          <div 
            onClick={() => setForm({ ...form, isChairman: !form.isChairman })} 
            className={`relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
              form.isChairman 
                ? "border-amber-500/50 bg-amber-500/[0.08] ring-1 ring-amber-500/20" 
                : "border-[var(--border)] bg-[var(--bg-soft)]/50 hover:border-[var(--primary)]/30"
            }`}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className={`p-2 rounded-lg transition-colors ${form.isChairman ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "bg-[var(--border)] text-[var(--fg-muted)]"}`}>
                <Crown className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-sm tracking-tight">Appoint as Chairman</p>
                <p className="text-[10px] text-[var(--fg-muted)] font-medium mt-0.5">This member's message will appear on the homepage.</p>
              </div>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors ${form.isChairman ? "bg-amber-500" : "bg-[var(--border)]"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isChairman ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </div>
          </div>

          {/* Chairman Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1 flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3" /> Chairman's Message
            </label>
            <textarea 
              value={form.message} 
              onChange={(e) => setForm({ ...form, message: e.target.value })} 
              disabled={uploading || saving}
              rows={4}
              placeholder="Enter the official message for the website..."
              className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Profile Photo</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} 
              onDragLeave={() => setDragActive(false)} 
              onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} 
              className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 ${
                dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/30"
              }`}
            >
              {form.image ? (
                <div className="relative aspect-square max-h-[250px] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-lg">Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30">Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-square max-h-[250px] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" strokeWidth={1.5} />}
                  <p className="text-sm font-bold tracking-tight">Drop image or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={save} 
              loading={saving} 
              disabled={uploading || !form.name.trim() || !form.position.trim()} 
              className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform"
            >
              {saving ? "Saving…" : editingId ? "Update Member" : "Save Member"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}