"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { toast } from "sonner";
import { Shield, ShieldCheck, ShieldAlert, Trash2, Search, X, Loader2, Users } from "lucide-react";

type User = { _id: string; name: string; email: string; image?: string; role: "admin" | "member" | string };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { const r = await api.get<any>("/api/users"); setUsers(extractArray<User>(r)); }
    catch (e: any) { toast.error(e?.message || "Failed to load"); setUsers([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, search]);

  const stats = useMemo(() => ({ total: users.length, admins: users.filter((u) => u.role === "admin").length }), [users]);

  async function toggleRole(id: string, currentRole: string, name: string) {
    const isPromoting = currentRole !== "admin";
    const endpoint = isPromoting ? "make-admin" : "make-member";
    if (!confirm(`${isPromoting ? "Promote" : "Demote"} ${name}?`)) return;
    setUpdatingId(id);
    try {
      await api.post(`/api/users/${id}/${endpoint}`);
      toast.success(`User ${isPromoting ? "promoted" : "demoted"}`);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: isPromoting ? "admin" : "member" } : u)));
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setUpdatingId(null); }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await api.del(`/api/users/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e: any) { toast.error(e?.message || "Failed"); }
    finally { setDeletingId(null); }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" /> User Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Platform Users</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Manage administrator access and oversee the community.</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center"><p className="text-xl font-black">{stats.total}</p><p className="text-[10px] uppercase font-bold text-[var(--fg-muted)]">Total</p></div>
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"><p className="text-xl font-black text-amber-600">{stats.admins}</p><p className="text-[10px] uppercase font-bold text-amber-600/70">Admins</p></div>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, role..." className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-[var(--card)] animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold">No users found</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence>
            {filtered.map((u, i) => {
              const isAdmin = u.role === "admin";
              return (
                <motion.div key={u._id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex flex-col p-5 rounded-2xl border transition-all ${isAdmin ? "bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/30" : "bg-[var(--card)] border-[var(--border)]"}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-full grid place-items-center text-white text-xl font-bold ${isAdmin ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-blue-500 to-indigo-500"}`}>{u.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate">{u.name}</h3>
                      <p className="text-sm text-[var(--fg-muted)] truncate">{u.email}</p>
                      <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${isAdmin ? "bg-amber-500/20 text-amber-600" : "bg-blue-500/20 text-blue-600"}`}>
                        {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />} {u.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-[var(--border)]/50">
                    <button onClick={() => toggleRole(u._id, u.role, u.name)} disabled={updatingId === u._id} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors ${isAdmin ? "bg-[var(--bg-soft)] hover:bg-[var(--border)]" : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600"}`}>
                      {updatingId === u._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isAdmin ? <ShieldAlert className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      {isAdmin ? "Demote" : "Promote"}
                    </button>
                    <button onClick={() => remove(u._id, u.name)} disabled={deletingId === u._id} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500">
                      {deletingId === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}