"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, Trash2, Edit, Upload, Users, Crown, UserCog, 
  GraduationCap, Search, ImagePlus, Loader2, UserPlus 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Role = "teacher" | "vice-principal" | "principal";
type Teacher = { 
  _id: string; 
  name: string; 
  role: Role | string; 
  designation?: string; 
  subject?: string; 
  image?: string | null; 
  bio?: string; 
  email?: string; 
  phone?: string;
  order?: number; 
};

const ROLE_META: Record<Role, { label: string; singular: string; icon: typeof Crown; badge: "brand" | "success" | "warning" }> = {
  principal: { label: "Principals", singular: "Principal", icon: Crown, badge: "warning" },
  "vice-principal": { label: "Vice Principals", singular: "Vice Principal", icon: UserCog, badge: "success" },
  teacher: { label: "Teachers", singular: "Teacher", icon: GraduationCap, badge: "brand" },
};

const ROLE_ORDER: Role[] = ["principal", "vice-principal", "teacher"];
const ROLES = [{ value: "teacher", label: "Teacher" }, { value: "vice-principal", label: "Vice Principal" }, { value: "principal", label: "Principal" }];

// 🔧 FIX: Added 'order' to emptyForm
const emptyForm = { name: "", role: "teacher", designation: "Teacher", subject: "", image: "", bio: "", email: "", phone: "", order: 999 };

function getInitials(name: string) { 
  return name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "?"; 
}

export default function AdminTeachers() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<any>("/api/teachers");
      setItems(extractArray<Teacher>(r));
    } catch { setItems([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) => [t.name, t.email, t.subject, t.designation, t.role].filter(Boolean).some((v) => String(v).toLowerCase().includes(q)));
  }, [items, search]);

  const grouped = useMemo(() => {
    const out: Record<Role, Teacher[]> = { principal: [], "vice-principal": [], teacher: [] };
    for (const t of filtered) { const key = (t.role as Role) in out ? (t.role as Role) : "teacher"; out[key].push(t); }
    
    // Sort each group by order
    Object.keys(out).forEach(key => {
       out[key as Role].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
    });

    return out;
  }, [filtered]);

  const stats = useMemo(() => ({
    total: items.length,
    principal: items.filter((t) => t.role === "principal").length,
    vp: items.filter((t) => t.role === "vice-principal").length,
    teacher: items.filter((t) => t.role === "teacher").length,
  }), [items]);

  function openAdd() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openEdit(t: Teacher) { setEditing(t); setForm({ ...emptyForm, ...t }); setOpen(true); }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Choose JPG, PNG, or WebP."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤5 MB."); return; }
    const tempUrl = URL.createObjectURL(file);
    const prevImage = form.image;
    setForm((f: any) => ({ ...f, image: tempUrl }));
    setUploading(true);
    try {
      const r = await api.upload(file);
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;
      if (url) { setForm((f: any) => ({ ...f, image: url })); toast.success("Image uploaded"); }
      else { setForm((f: any) => ({ ...f, image: prevImage || "" })); toast.error("Upload failed"); }
    } catch (e: any) { setForm((f: any) => ({ ...f, image: prevImage || "" })); toast.error(e?.message || "Upload failed"); }
    finally { setUploading(false); }
  }

  async function save() {
    if (!form.name?.trim()) return toast.error("Name is required.");
    setSaving(true);
    try {
      const { _id, ...payload } = form;
      // Ensure order is sent as a Number
      payload.order = Number(payload.order) || 999;
      
      if (editing) await api.patch(`/api/teachers/${editing._id}`, payload);
      else await api.post("/api/teachers", payload);
      toast.success(editing ? "Updated" : "Added");
      setOpen(false);
      void load();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setSaving(false); }
  }

  async function remove(t: Teacher) {
    if (!confirm(`Remove ${t.name}?`)) return;
    setDeleting(t._id);
    try { await api.del(`/api/teachers/${t._id}`); toast.success("Removed"); setItems((p) => p.filter((x) => x._id !== t._id)); }
    catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeleting(null); }
  }

  function handleRoleChange(newRole: string) {
    let newDesignation = form.designation;
    if (newRole === "principal") newDesignation = "Principal";
    if (newRole === "vice-principal") newDesignation = "Vice Principal";
    if (newRole === "teacher" && (form.designation === "Principal" || form.designation === "Vice Principal")) {
      newDesignation = "Teacher";
    }
    setForm({ ...form, role: newRole, designation: newDesignation });
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
              <Users className="h-3.5 w-3.5" strokeWidth={2.5} /> Faculty Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Teachers, Leaders & Staff</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Manage every member of the Oasis BIAM faculty.
            </p>
          </div>
          <Button onClick={openAdd} size="lg" className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20">
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <UserPlus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Add Faculty
          </Button>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill icon={Users} label="Total" value={stats.total} tone="brand" />
        <StatPill icon={Crown} label="Principals" value={stats.principal} tone="warning" />
        <StatPill icon={UserCog} label="Vice Principals" value={stats.vp} tone="success" />
        <StatPill icon={GraduationCap} label="Teachers" value={stats.teacher} tone="brand" />
      </div>

      {/* SEARCH */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} className="relative max-w-md group">
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-blue-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, subject, or role..." className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
        </div>
      </motion.div>

      {/* GRID */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-96 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md">
          <Users className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-bold mb-2 tracking-tight">No faculty members yet</h3>
          <Button onClick={openAdd} className="mt-4 rounded-xl font-bold"><Plus className="h-4 w-4 mr-2" /> Add first member</Button>
        </div>
      ) : (
        <div className="space-y-12">
          {ROLE_ORDER.map((roleKey) => {
            const list = grouped[roleKey];
            if (list.length === 0) return null;
            const meta = ROLE_META[roleKey];
            const Icon = meta.icon;
            return (
              <section key={roleKey}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl gradient-brand text-white shadow-lg shadow-brand-500/20 ring-1 ring-inset ring-white/20"><Icon className="h-4 w-4" strokeWidth={2.5} /></div>
                  <h2 className="text-xl font-black tracking-tight">{meta.label}</h2>
                  <Badge variant={meta.badge} className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]">{list.length}</Badge>
                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {list.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, ease: EASE }}>
                      <TeacherCard teacher={t} deleting={deleting === t._id} onEdit={() => openEdit(t)} onDelete={() => remove(t)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* DIALOG */}
      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title={editing ? "Edit Faculty Member" : "Add Faculty Member"} className="max-w-2xl">
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Profile Photo</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-300 ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)] hover:border-[var(--primary)]/40"}`}>
              {form.image ? (
                <div className="relative aspect-[16/10] group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-lg"><Upload className="h-4 w-4 mr-2" strokeWidth={2.5} /> Replace</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, image: "" })} disabled={uploading} className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30"><Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} /> Remove</Button>
                  </div>
                  {uploading && <div className="absolute inset-0 bg-black/60 grid place-items-center backdrop-blur-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" strokeWidth={1.5} />}
                  <p className="text-sm font-bold tracking-tight">Drop image or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Full Name <span className="text-red-500">*</span></label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Role</label>
              <Select value={form.role} onChange={(e) => handleRoleChange(e.target.value)} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl">
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
            </div>
          </div>

          {/* 🔧 NEW: Display Order (Serial Number) Input */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Display Order (Serial)</label>
              <Input 
                type="number" 
                value={form.order} 
                onChange={(e) => setForm({ ...form, order: e.target.value })} 
                placeholder="e.g. 1, 2, 3..."
                className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" 
              />
              <p className="text-[10px] text-[var(--fg-muted)] ml-1">Smaller numbers appear first.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Subject</label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Designation</label>
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Bio / Message</label>
            <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-relaxed" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.name?.trim()} className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform">
              {saving ? "Saving…" : editing ? "Update Member" : "Add Member"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "brand" | "warning" | "success" }) {
  const toneCls = { brand: "text-[var(--primary)] bg-[var(--primary)]/10 ring-[var(--primary)]/20", warning: "text-amber-500 bg-amber-500/10 ring-amber-500/20", success: "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20" }[tone];
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-sm">
      <div className={`p-2 rounded-xl ring-1 ring-inset ${toneCls}`}><Icon className="h-4 w-4" strokeWidth={2.5} /></div>
      <div className="min-w-0"><p className="text-xl font-black leading-none tabular-nums">{value}</p><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] mt-1.5 truncate">{label}</p></div>
    </div>
  );
}

function TeacherCard({ teacher: t, deleting, onEdit, onDelete }: { teacher: Teacher; deleting: boolean; onEdit: () => void; onDelete: () => void }) {
  const meta = ROLE_META[(t.role as Role) in ROLE_META ? (t.role as Role) : "teacher"];
  const Icon = meta.icon;
  return (
    <div className="group overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md hover:border-[var(--primary)]/40 hover:shadow-xl transition-all duration-500 flex flex-col h-full relative">
      
      {/* Order Badge */}
      <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-black">
        #{t.order || 999}
      </div>

      <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--primary)]/10 to-transparent">
        {t.image ? (
          <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full grid place-items-center gradient-brand text-white text-4xl font-black">
            <span className="relative drop-shadow-lg">{getInitials(t.name)}</span>
          </div>
        )}
        <Badge variant={meta.badge} className="absolute top-3 left-3 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/20 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em]">
          <Icon className="h-3 w-3 mr-1" strokeWidth={2.5} /> {meta.singular}
        </Badge>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg truncate tracking-tight">{t.name}</h3>
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] mt-1 truncate">{t.designation || "—"}</p>
        {t.subject && <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--primary)] mt-2 truncate">{t.subject}</p>}
        
        <div className="flex gap-2 mt-5 pt-4 border-t border-[var(--border)] mt-auto">
          <Button variant="outline" size="sm" className="flex-1 h-9 rounded-lg font-bold text-xs hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all" onClick={onEdit}><Edit className="h-3.5 w-3.5 mr-1.5" /> Edit</Button>
          <Button variant="ghost" size="sm" onClick={onDelete} disabled={deleting} className="h-9 w-9 rounded-lg p-0 text-[var(--fg-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
          </Button>
        </div>
      </div>
    </div>
  );
}