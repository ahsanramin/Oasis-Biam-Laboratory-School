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
  BadgeCheck, Quote, Sparkles 
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
      await api.post("/api/governing-body", { 
        ...form, 
        name: form.name.trim(), 
        position: form.position.trim(),
        message: form.message ? form.message.trim() : ""
      });
      toast.success("Member added");
      setOpen(false); setForm(emptyForm); void load();
    } catch (e: any) { 
      toast.error(e?.message || "Failed"); 
    }
    finally { setSaving(false); }
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.05] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-black/[0.05]"
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />
        {/* Corner glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/[0.1] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} /> Leadership
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">
                <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Official Board
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Governing Body</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Manage the members of the Oasis BIAM governing board, their designations, and official messages.
            </p>
          </div>
          <Button 
            onClick={() => { setForm(emptyForm); setOpen(true); }} 
            size="lg"
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20 h-12 px-6 shrink-0"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
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
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-transparent to-brand-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md">
          <Users className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-bold mb-2 tracking-tight">No members yet</h3>
          <Button onClick={() => setOpen(true)} className="mt-4 rounded-xl font-bold h-11 px-6">Add First Member</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          <AnimatePresence>
            {filtered.map((m, i) => (
              <motion.div 
                key={m._id} 
                layout 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}
                className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl overflow-hidden ${
                  m.isChairman 
                    ? "bg-gradient-to-br from-amber-500/[0.12] via-[var(--card)]/80 to-[var(--card)]/80 border-amber-500/50 shadow-2xl shadow-amber-500/[0.08]" 
                    : "bg-[var(--card)]/80 border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1"
                }`}
              >
                {/* Top Hairline */}
                <div className={`absolute top-0 left-0 right-0 h-px pointer-events-none ${m.isChairman ? "bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" : "bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"}`} />
                
                {/* Ghost Index Watermark */}
                <div className={`absolute top-2 right-6 text-[100px] font-black leading-none select-none pointer-events-none tracking-tighter transition-colors duration-500 ${m.isChairman ? "text-amber-500/[0.06]" : "text-[var(--fg)]/[0.03] group-hover:text-[var(--fg)]/[0.05]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative flex items-start gap-5 z-10">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {m.isChairman && (
                      <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 grid place-items-center border-2 border-[var(--card)] ring-1 ring-white/20">
                        <Crown className="h-4 w-4 text-white drop-shadow-md" fill="currentColor" />
                      </div>
                    )}
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-inset shadow-lg ${m.isChairman ? "ring-amber-500/50 shadow-amber-500/20" : "ring-[var(--border)] shadow-black/[0.08]"}`}>
                      <img 
                        src={m.image || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"} 
                        alt={m.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-black truncate tracking-tight group-hover:text-[var(--primary)] transition-colors">{m.name}</h3>
                      {m.isChairman && <BadgeCheck className="h-4 w-4 text-amber-500 shrink-0" strokeWidth={2.5} />}
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.16em] truncate mt-1.5 ${m.isChairman ? "text-amber-500" : "text-[var(--fg-muted)]"}`}>
                      {m.position}
                    </p>
                  </div>
                </div>

                {/* Message Preview */}
                {m.message && (
                  <div className="relative mt-5 p-4 rounded-xl bg-[var(--bg-soft)]/60 border border-[var(--border)]/60 ring-1 ring-inset ring-white/[0.02] z-10 flex-1 flex flex-col justify-center">
                    <Quote className="absolute -top-2 -left-1 h-8 w-8 text-[var(--fg)]/[0.04] rotate-12 pointer-events-none" fill="currentColor" />
                    <p className="relative text-[12px] text-[var(--fg-muted)] line-clamp-3 italic leading-relaxed font-medium">
                      "{m.message}"
                    </p>
                  </div>
                )}

                {/* Delete Action */}
                <div className="relative mt-4 pt-3 border-t border-[var(--border)]/50 flex justify-end z-10">
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
      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title="Add Governing Body Member" className="max-w-2xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-2 pb-4 scrollbar-thin">
          
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Full Name <span className="text-red-500">*</span></label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Position <span className="text-red-500">*</span></label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} disabled={uploading || saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
          </div>

          {/* Premium Chairman Toggle */}
          <div 
            onClick={() => setForm({ ...form, isChairman: !form.isChairman })} 
            className={`relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-500 overflow-hidden ${
              form.isChairman 
                ? "border-amber-500/60 bg-gradient-to-r from-amber-500/10 to-transparent ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/[0.05]" 
                : "border-[var(--border)] bg-[var(--bg-soft)]/50 hover:border-[var(--primary)]/30"
            }`}
          >
            {form.isChairman && <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />}
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-xl transition-all duration-500 ${form.isChairman ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 ring-1 ring-inset ring-white/20" : "bg-[var(--border)] text-[var(--fg-muted)]"}`}>
                <Crown className="h-6 w-6" strokeWidth={2.5} fill={form.isChairman ? "currentColor" : "none"} />
              </div>
              <div>
                <p className={`font-bold text-base tracking-tight transition-colors ${form.isChairman ? "text-amber-600 dark:text-amber-400" : "text-[var(--fg)]"}`}>Appoint as Chairman</p>
                <p className="text-[11px] text-[var(--fg-muted)] font-medium mt-0.5">This member's message will be featured on the homepage.</p>
              </div>
            </div>
            
            {/* Premium Switch */}
            <div className={`relative w-14 h-7 rounded-full transition-colors duration-500 ${form.isChairman ? "bg-amber-500 shadow-inner" : "bg-[var(--border)]"}`}>
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-500 flex items-center justify-center ${form.isChairman ? "translate-x-8" : "translate-x-1"}`}>
                 {form.isChairman && <Crown className="h-2.5 w-2.5 text-amber-500" fill="currentColor" />}
              </div>
            </div>
          </div>

          {/* Chairman Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1 flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3" /> Official Message
            </label>
            <textarea 
              value={form.message} 
              onChange={(e) => setForm({ ...form, message: e.target.value })} 
              disabled={uploading || saving}
              rows={4}
              placeholder="Enter the official message for the website..."
              className="w-full p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-[15px] font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-[1.75]"
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
                dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/40"
              }`}
            >
              {form.image ? (
                <div className="relative aspect-[21/9] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-lg">Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30">Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-[21/9] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" strokeWidth={1.5} />}
                  <p className="text-sm font-bold tracking-tight">Drop image or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-5 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={save} 
              loading={saving} 
              disabled={uploading || !form.name.trim() || !form.position.trim()} 
              className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform"
            >
              {saving ? "Saving…" : "Save Member"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}