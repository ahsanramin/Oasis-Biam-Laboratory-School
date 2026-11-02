"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Users, FileText, Bell, Activity, Sparkles, GraduationCap, ArrowUpRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>("/api/admin/analytics")
      .then((r) => {
        if (r.success && "data" in r) setData(r.data);
        else setData(r); // Handle unwrapped response
      })
      .finally(() => setLoading(false));
  }, []);

  // Derive faculty count dynamically, fallback to 15
  const facultyCount = data?.usersByRole?.find(
    (u: any) => u._id?.toLowerCase() === "teacher" || u._id?.toLowerCase() === "faculty"
  )?.count || 15;

  const totalUsers = data?.usersByRole?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const totalArticles = data?.articlesByCategory?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const totalNotices = data?.noticesByCategory?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto space-y-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="h-10 w-48 rounded-xl bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-[1.5rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
          ))}
        </div>
        <div className="h-96 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
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

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Platform Insights
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Analytics Overview</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Deep dive into user roles, content distribution, and recent platform activity.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================= SUMMARY STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatSummary label="Total Faculty" value={`${facultyCount}+`} icon={GraduationCap} color="text-amber-500" bg="bg-amber-500/10" ring="ring-amber-500/20" />
        <StatSummary label="Total Users" value={totalUsers} icon={Users} color="text-blue-500" bg="bg-blue-500/10" ring="ring-blue-500/20" />
        <StatSummary label="Articles" value={totalArticles} icon={FileText} color="text-purple-500" bg="bg-purple-500/10" ring="ring-purple-500/20" />
        <StatSummary label="Notices" value={totalNotices} icon={Bell} color="text-emerald-500" bg="bg-emerald-500/10" ring="ring-emerald-500/20" />
      </div>

      {/* ================= BREAKDOWN CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
        
        {/* Users by Role */}
        <BreakdownCard 
          title="Users by Role" 
          data={data?.usersByRole} 
          emptyMsg="No user data available."
          icon={Users}
          color="text-blue-500"
          bg="bg-blue-500/10"
          ring="ring-blue-500/20"
        />

        {/* Articles by Category */}
        <BreakdownCard 
          title="Articles by Category" 
          data={data?.articlesByCategory} 
          emptyMsg="No article data available."
          icon={FileText}
          color="text-purple-500"
          bg="bg-purple-500/10"
          ring="ring-purple-500/20"
        />

        {/* Notices by Category */}
        <BreakdownCard 
          title="Notices by Category" 
          data={data?.noticesByCategory} 
          emptyMsg="No notice data available."
          icon={Bell}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          ring="ring-emerald-500/20"
        />
      </div>

      {/* ================= RECENT ACTIVITY ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden"
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

        <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="p-2.5 rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Recent Activity</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-0.5">
              Latest actions across the platform
            </p>
          </div>
        </div>

        <div className="relative space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
          {data?.recentActivity?.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] italic py-4">No recent activity found.</p>
          ) : (
            data?.recentActivity?.map((log: any, i: number) => (
              <motion.div 
                key={log._id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4, ease: EASE }}
                className="group relative flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-soft)]/50 border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--bg-soft)]/80 transition-all duration-300"
              >
                {/* Left timeline dot */}
                <div className="relative mt-1 shrink-0">
                  <div className="absolute inset-0 -m-1 bg-brand-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-2 h-2 rounded-full bg-brand-500 ring-4 ring-[var(--bg)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--fg)] capitalize tracking-tight leading-snug">
                    {log.action.replace(/\./g, " ")}
                  </p>
                  <p className="text-[11px] font-medium text-[var(--fg-muted)] mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[var(--fg)] font-semibold">{log.actorName}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                    <span className="uppercase tracking-wider text-[9px] font-black">{log.entity}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                    <span>{formatDate(log.createdAt, true)}</span>
                  </p>
                </div>

                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="h-4 w-4 text-[var(--fg-muted)]" strokeWidth={2.5} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
 * Sub-components
 * ============================================================ */

function StatSummary({ label, value, icon: Icon, color, bg, ring }: any) {
  return (
    <div className="relative flex items-center gap-4 p-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      
      <div className={`relative shrink-0 w-12 h-12 rounded-2xl grid place-items-center ring-1 ring-inset ${bg} ${ring} ${color} group-hover:scale-110 transition-transform duration-500`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
        <Icon className="h-5 w-5 relative" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl sm:text-3xl font-black leading-none tabular-nums tracking-tight">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] mt-1.5 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

function BreakdownCard({ title, data, emptyMsg, icon: Icon, color, bg, ring }: any) {
  return (
    <div className="relative p-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
        <div className={`p-2 rounded-lg ${bg} ${ring} ${color} ring-1 ring-inset`}>
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <h3 className="font-bold tracking-tight text-[var(--fg)]">{title}</h3>
      </div>

      <div className="space-y-2.5 flex-1">
        {data?.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)] italic py-2">{emptyMsg}</p>
        ) : (
          data?.map((item: any, i: number) => (
            <motion.div 
              key={item._id || i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-soft)]/50 border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--bg-soft)] transition-all duration-300"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] capitalize truncate pr-2 group-hover:text-[var(--fg)] transition-colors">
                {item._id || "Uncategorized"}
              </span>
              <span className="shrink-0 text-[11px] font-black tabular-nums px-2.5 py-1 rounded-lg bg-[var(--card)] text-[var(--fg)] ring-1 ring-inset ring-[var(--border)] shadow-sm">
                {item.count}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}