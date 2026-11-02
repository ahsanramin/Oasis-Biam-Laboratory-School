"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { toast } from "sonner";
import { 
  Shield, ShieldCheck, ShieldAlert, Trash2, 
  Search, X, Loader2, Users, Sparkles, Crown 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type User = { _id: string; name: string; email: string; image?: string; role: "admin" | "member" | string };

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try { 
      const r = await api.get<any>("/api/users"); 
      setUsers(extractArray<User>(r)); 
    }
    catch (e: any) { 
      toast.error(e?.message || "Failed to load"); 
      setUsers([]); 
    }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, search]);

  const stats = useMemo(() => ({ 
    total: users.length, 
    admins: users.filter((u) => u.role === "admin").length 
  }), [users]);

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
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
              <Users className="h-3.5 w-3.5" strokeWidth={2.5} /> User Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Platform Users</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Manage administrator access and oversee the community.
            </p>
          </div>
          
          {/* Stat Chips */}
          <div className="flex gap-3 shrink-0">
            <div className="relative flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-[var(--bg-soft)]/50 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
              <p className="text-2xl font-black tabular-nums tracking-tight leading-none">{stats.total}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-1.5">Total Users</p>
            </div>
            <div className="relative flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-amber-500/[0.06] backdrop-blur-md border border-amber-500/20 ring-1 ring-inset ring-white/[0.04]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums tracking-tight leading-none">{stats.admins}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-600/70 dark:text-amber-400/70 mt-1.5">Admins</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= SEARCH ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="relative max-w-md group"
      >
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-blue-500/15 via-transparent to-brand-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name, email, role..." 
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/15 to-transparent ring-1 ring-blue-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <Users className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">No users found</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            {search ? `No results found for "${search}".` : "There are no users in the system yet."}
          </p>
          {search && (
            <Button 
              onClick={() => setSearch("")}
              className="h-11 px-6 rounded-xl font-bold bg-[var(--card)] hover:bg-[var(--bg-soft)] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] text-sm"
            >
              Clear Search
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          <AnimatePresence>
            {filtered.map((u, i) => {
              const isAdmin = u.role === "admin";
              
              return (
                <motion.div 
                  key={u._id} 
                  layout 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06, ease: EASE }}
                  className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500 backdrop-blur-md ring-1 ring-inset overflow-hidden ${
                    isAdmin 
                      ? "bg-gradient-to-br from-amber-500/[0.08] to-[var(--card)]/80 border-amber-500/40 shadow-xl shadow-amber-500/[0.04] ring-amber-500/20 hover:-translate-y-1" 
                      : "bg-[var(--card)]/70 border-[var(--border)] ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1"
                  }`}
                >
                  {/* Top hairline */}
                  <div className={`absolute top-0 left-0 right-0 h-px pointer-events-none ${isAdmin ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"}`} />
                  
                  {/* Ghost Index Watermark */}
                  <div className={`absolute top-2 right-6 text-[80px] font-black leading-none select-none pointer-events-none tracking-tighter transition-colors duration-500 ${isAdmin ? "text-amber-500/[0.06]" : "text-[var(--fg)]/[0.025] group-hover:text-[var(--fg)]/[0.045]"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Outer Hover Aura (Only for non-admin to add pop) */}
                  {!isAdmin && (
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-500/[0.08] via-transparent to-brand-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />
                  )}

                  <div className="relative flex items-center gap-4 mb-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {isAdmin && (
                        <div className="absolute -top-2 -left-2 z-20 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40 grid place-items-center border-2 border-[var(--card)] ring-1 ring-white/20">
                          <Crown className="h-3.5 w-3.5 text-white drop-shadow-md" fill="currentColor" />
                        </div>
                      )}
                      <div className={`w-16 h-16 rounded-2xl grid place-items-center text-white text-2xl font-black shadow-lg ring-1 ring-inset ${
                        isAdmin 
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20 ring-amber-500/30" 
                          : "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/20 ring-blue-500/30"
                      }`}>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                        <span className="relative drop-shadow-md">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold truncate tracking-tight group-hover:text-[var(--primary)] transition-colors">{u.name}</h3>
                      <p className="text-[11px] font-medium text-[var(--fg-muted)] truncate mt-0.5">{u.email}</p>
                      
                      {/* Role Badge */}
                      <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ${
                        isAdmin 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20" 
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20"
                      }`}>
                        {isAdmin ? <ShieldCheck className="h-3 w-3" strokeWidth={2.5} /> : <Shield className="h-3 w-3" strokeWidth={2.5} />} {u.role}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative flex gap-2.5 mt-auto pt-5 border-t border-[var(--border)]/50">
                    <Button 
                      onClick={() => toggleRole(u._id, u.role, u.name)} 
                      disabled={updatingId === u._id} 
                      className={`relative flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] transition-all duration-300 group/btn overflow-hidden ring-1 ring-inset ${
                        isAdmin 
                          ? "bg-[var(--bg-soft)]/80 hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] border border-[var(--border)] ring-white/[0.04]" 
                          : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 ring-white/[0.04]"
                      }`}
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative flex items-center justify-center gap-1.5">
                        {updatingId === u._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isAdmin ? (
                          <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2.5} />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                        )}
                        {isAdmin ? "Demote" : "Promote"}
                      </span>
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      onClick={() => remove(u._id, u.name)} 
                      disabled={deletingId === u._id} 
                      className="shrink-0 h-10 w-10 p-0 rounded-xl text-red-500 bg-red-500/[0.04] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                    >
                      {deletingId === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
                    </Button>
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

// Reusing the Button component from your design system
function Button({ children, className, variant, ...props }: any) {
  // This is a simplified version just to ensure the code compiles. 
  // In your actual project, you already have this component imported.
  return <button className={`flex items-center justify-center ${className}`} {...props}>{children}</button>;
}