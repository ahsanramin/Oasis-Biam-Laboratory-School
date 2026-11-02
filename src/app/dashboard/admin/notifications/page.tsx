"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Check, CheckCheck, Bell, Inbox, 
  Sparkles, Clock, ShieldCheck, AlertCircle, 
  CheckCircle2, Info 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Helper to get icon and colors based on notification type
function getTypeConfig(type: string) {
  switch (type) {
    case "success":
      return { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" };
    case "warning":
      return { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20" };
    case "error":
      return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20" };
    default:
      return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20" };
  }
}

export default function AdminNotifications() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<any>("/api/notifications?limit=100"); 
      if (r.success && "data" in r) setItems(r.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function markRead(id: string) { 
    await api.patch(`/api/notifications/${id}/read`); 
    void load(); 
  }

  async function markAll() { 
    await api.post(`/api/notifications/read-all`); 
    toast.success("All marked as read"); 
    void load(); 
  }

  return (
    <div className="relative max-w-5xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
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

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">
              <Bell className="h-3.5 w-3.5" strokeWidth={2.5} /> Inbox
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Notifications</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Stay up to date with the latest system alerts and platform activity.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={markAll} 
            className="relative shrink-0 h-12 px-6 rounded-xl font-bold bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
          >
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />
            <CheckCheck className="h-4 w-4 mr-2 text-[var(--primary)]" strokeWidth={2.5} /> 
            Mark All Read
          </Button>
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
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
                <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">You're all caught up!</h3>
          <p className="text-sm text-[var(--fg-muted)] max-w-sm mx-auto font-medium leading-relaxed">
            There are no new notifications at this time. We'll let you know when something happens.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {items.map((n, i) => {
              const config = getTypeConfig(n.type);
              const Icon = config.icon;
              
              return (
                <motion.div 
                  key={n._id} 
                  layout 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  transition={{ duration: 0.4, delay: (i % 5) * 0.05, ease: EASE }}
                  className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-[2rem] border transition-all duration-500 backdrop-blur-md ring-1 ring-inset overflow-hidden ${
                    !n.read 
                      ? "bg-gradient-to-r from-brand-500/[0.06] to-[var(--card)]/80 border-brand-500/30 shadow-xl shadow-brand-500/[0.04] ring-brand-500/20" 
                      : "bg-[var(--card)]/70 border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-black/[0.04] ring-white/[0.04]"
                  }`}
                >
                  {/* Top hairline */}
                  <div className={`absolute top-0 left-0 right-0 h-px pointer-events-none ${!n.read ? "bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"}`} />
                  
                  {/* Outer hover aura (only for read items to add interactivity) */}
                  {n.read && (
                    <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />
                  )}

                  {/* Type Icon */}
                  <div className="relative shrink-0 pt-1">
                    <div className={`relative w-12 h-12 rounded-xl grid place-items-center ring-1 ring-inset shadow-sm ${config.bg} ${config.ring} ${config.color} group-hover:scale-110 transition-transform duration-500`}>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                      <Icon className="h-5 w-5 relative" strokeWidth={2.5} />
                    </div>
                    {!n.read && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500 border-2 border-[var(--card)]" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <p className={`font-bold text-lg tracking-tight truncate ${!n.read ? "text-[var(--fg)]" : "text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors"}`}>
                        {n.title}
                      </p>
                      
                      {/* Type Badge */}
                      <Badge 
                        variant={n.type} 
                        className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] rounded-md ring-1 ring-inset ${config.bg} ${config.color} ${config.ring} border-transparent shadow-sm`}
                      >
                        {n.type}
                      </Badge>

                      {/* New Badge */}
                      {!n.read && (
                        <Badge 
                          variant="brand" 
                          className="px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] rounded-md bg-brand-500 text-white shadow-sm shadow-brand-500/20"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${!n.read ? "text-[var(--fg)]/90 font-medium" : "text-[var(--fg-muted)] font-medium"}`}>
                      {n.message}
                    </p>
                    
                    <div className="flex items-center gap-1.5 mt-3">
                      <Clock className="h-3.5 w-3.5 text-[var(--fg-muted)]" strokeWidth={2.5} />
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        {formatDate(n.createdAt, true)}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  {!n.read && (
                    <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--border)] flex justify-end">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        onClick={() => markRead(n._id)}
                        className="w-10 h-10 rounded-xl bg-[var(--card)]/80 backdrop-blur-md border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[var(--fg-muted)] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300 group/btn"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4 group-hover/btn:scale-110 transition-transform" strokeWidth={2.5} />
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}