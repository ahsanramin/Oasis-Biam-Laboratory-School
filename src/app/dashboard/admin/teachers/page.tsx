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
import { Plus, Trash2, Edit, Upload, Users, Crown, UserCog, GraduationCap, Search, ImagePlus, Loader2, Mail, Phone, X, UserPlus } from "lucide-react";

type Role = "teacher" | "vice-principal" | "principal";
type Teacher = { _id: string; name: string; role: Role | string; designation?: string; subject?: string; image?: string | null; bio?: string; email?: string; phone?: string };

const ROLE_META: Record<Role, { label: string; singular: string; icon: typeof Crown; badge: "brand" | "success" | "warning" }> = {
  principal: { label: "Principals", singular: "Principal", icon: Crown, badge: "warning" },
  "vice-principal": { label: "Vice Principals", singular: "Vice Principal", icon: UserCog, badge: "success" },
  teacher: { label: "Teachers", singular: "Teacher", icon: GraduationCap, badge: "brand" },
};
const ROLE_ORDER: Role[] = ["principal", "vice-principal", "teacher"];
const ROLES = [{ value: "teacher", label: "Teacher" }, { value: "vice-principal", label: "Vice Principal" }, { value: "principal", label: "Principal" }];
const emptyForm = { name: "", role: "teacher", designation: "Teacher", subject: "", image: "", bio: "", email: "", phone: "" };

function getInitials(name: string) { return name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "?"; }

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
      const r = await api.upload(file); // 🔧 FIXED
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" /> Faculty Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Teachers, Leaders &amp; Staff</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Manage every member of the Oasis BIAM faculty.</p>
          </div>
          <Button onClick={openAdd} size="lg" className="shadow-lg shadow-blue-500/20"><UserPlus className="h-4 w-4" /> Add Faculty</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill icon={Users} label="Total" value={stats.total} tone="brand" />
        <StatPill icon={Crown} label="Principals" value={stats.principal} tone="warning" />
        <StatPill icon={UserCog} label="Vice Principals" value={stats.vp} tone="success" />
        <StatPill icon={GraduationCap} label="Teachers" value={stats.teacher} tone="brand" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, subject, or role..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-96 rounded-2xl bg-[var(--card)] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Users className="h-16 w-16 text-[var(--fg-muted)] opacity-40 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">No faculty members yet</h3>
          <Button onClick={openAdd} className="mt-4"><Plus className="h-4 w-4" /> Add first member</Button>
        </div>
      ) : (
        <div className="space-y-10">
          {ROLE_ORDER.map((roleKey) => {
            const list = grouped[roleKey];
            if (list.length === 0) return null;
            const meta = ROLE_META[roleKey];
            const Icon = meta.icon;
            return (
              <section key={roleKey}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl gradient-brand text-white shadow-lg"><Icon className="h-4 w-4" /></div>
                  <h2 className="text-lg font-bold">{meta.label}</h2>
                  <Badge variant={meta.badge}>{list.length}</Badge>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <TeacherCard teacher={t} deleting={deleting === t._id} onEdit={() => openEdit(t)} onDelete={() => remove(t)} />
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Dialog open={open} onClose={() => { if (saving || uploading) return; setOpen(false); }} title={editing ? "Edit Faculty Member" : "Add Faculty Member"} className="max-w-2xl">
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pb-2">
          <div>
            <label className="text-sm font-semibold mb-2 block">Photo</label>
            <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) void handleFileUpload(f); }} className={`rounded-2xl border-2 border-dashed overflow-hidden transition-all ${dragActive ? "border-[var(--primary)] bg-[var(--primary)]/5" : form.image ? "border-[var(--border)]" : "border-[var(--border)]"}`}>
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
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full aspect-[16/10] flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)]">
                  {uploading ? <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" /> : <ImagePlus className="h-8 w-8" />}
                  <p className="text-sm font-semibold">Drop or click to browse</p>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFileUpload(f); e.target.value = ""; }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-sm font-semibold mb-1.5 block">Full Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Role</label><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</Select></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-sm font-semibold mb-1.5 block">Designation</label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Subject</label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-sm font-semibold mb-1.5 block">Email</label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div><label className="text-sm font-semibold mb-1.5 block">Bio</label><Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving || uploading} className="flex-1">Cancel</Button>
            <Button onClick={save} loading={saving} disabled={uploading || !form.name?.trim()} className="flex-1">{saving ? "Saving…" : editing ? "Update" : "Add"}</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "brand" | "warning" | "success" }) {
  const toneCls = { brand: "text-[var(--primary)] bg-[var(--primary)]/10", warning: "text-amber-500 bg-amber-500/10", success: "text-emerald-500 bg-emerald-500/10" }[tone];
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className={`p-2 rounded-xl ${toneCls}`}><Icon className="h-4 w-4" /></div>
      <div className="min-w-0"><p className="text-xl font-black leading-none">{value}</p><p className="text-xs text-[var(--fg-muted)] mt-1 truncate">{label}</p></div>
    </div>
  );
}

function TeacherCard({ teacher: t, deleting, onEdit, onDelete }: { teacher: Teacher; deleting: boolean; onEdit: () => void; onDelete: () => void }) {
  const meta = ROLE_META[(t.role as Role) in ROLE_META ? (t.role as Role) : "teacher"];
  const Icon = meta.icon;
  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:shadow-md transition-all">
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--primary)]/10 to-transparent">
        {t.image ? <img src={t.image} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center gradient-brand text-white text-4xl font-black">{getInitials(t.name)}</div>}
        <Badge variant={meta.badge} className="absolute top-3 right-3 shadow-lg"><Icon className="h-3 w-3 mr-1" /> {meta.singular}</Badge>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg truncate">{t.name}</h3>
        <p className="text-sm text-[var(--fg-muted)] truncate">{t.designation || "—"}</p>
        {t.subject && <p className="text-xs font-medium text-[var(--primary)] mt-1 truncate">{t.subject}</p>}
        <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" className="flex-1" onClick={onEdit}><Edit className="h-4 w-4" /> Edit</Button>
          <Button variant="ghost" size="sm" onClick={onDelete} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
          </Button>
        </div>
      </div>
    </div>
  );
}