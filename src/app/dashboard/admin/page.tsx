"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { 
  Users, FileText, Megaphone, GraduationCap, 
  ArrowUpRight, ArrowRight, Activity, Zap, 
  Sparkles, CheckCircle2, Database, Server, Crown 
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const EASE = [0.22, 1, 0.36, 1] as const;

type Stats = {
  students?: number; 
  teachers?: number;
  articlesCount?: number; 
  noticesCount?: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const r = await api.get<any>("/api/stats");
        setStats((r as any)?.data || (r as any) || {});
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadStats();
  }, []);

  const statCards = [
    { label: "Total Faculty", value: stats?.teachers ?? 0, icon: Users, color: "from-blue-500 to-cyan-500", href: "/dashboard/admin/teachers", bgGlow: "bg-blue-500/[0.08]", ring: "ring-blue-500/20", text: "text-blue-500" },
    { label: "Total Students", value: stats?.students ?? 0, icon: GraduationCap, color: "from-purple-500 to-indigo-500", href: "/dashboard/admin/admissions", bgGlow: "bg-purple-500/[0.08]", ring: "ring-purple-500/20", text: "text-purple-500" },
    { label: "Published Articles", value: stats?.articlesCount ?? 0, icon: FileText, color: "from-emerald-500 to-teal-500", href: "/dashboard/admin/articles", bgGlow: "bg-emerald-500/[0.08]", ring: "ring-emerald-500/20", text: "text-emerald-500" },
    { label: "Active Notices", value: stats?.noticesCount ?? 0, icon: Megaphone, color: "from-rose-500 to-orange-500", href: "/dashboard/admin/notices", bgGlow: "bg-rose-500/[0.08]", ring: "ring-rose-500/20", text: "text-rose-500" },
  ];

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-black/[0.04]"
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />
        {/* Corner glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/[0.1] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">
            <Crown className="h-3.5 w-3.5" strokeWidth={2.5} /> Admin Overview
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]">
            Welcome back, <span className="gradient-text">Admin</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-3 max-w-xl font-medium leading-relaxed">
            Here is a live snapshot of what is happening at Oasis BIAM Laboratory School today.
          </p>
        </div>
      </motion.div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: (i % 4) * 0.06, duration: 0.5, ease: EASE }}
              className="relative group h-full"
            >
              <Link href={stat.href} className="block h-full">
                
                {/* Outer hover aura */}
                <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${stat.bgGlow} via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none`} />

                <div className="relative h-full p-6 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] group-hover:border-[var(--primary)]/40 group-hover:shadow-2xl group-hover:shadow-black/[0.06] group-hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col justify-between">
                  
                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Ghost index watermark */}
                  <div className="absolute top-2 right-6 text-[80px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.045] transition-colors duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="relative z-10 flex items-start justify-between mb-6">
                    {/* Icon Medallion */}
                    <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} grid place-items-center text-white shadow-lg ring-1 ring-inset ring-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                      <Icon className="h-6 w-6 relative drop-shadow-sm" strokeWidth={2.5} />
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-soft)]/80 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] grid place-items-center opacity-0 group-hover:opacity-100 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-500 group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4 text-[var(--fg-muted)] group-hover:text-white transition-colors" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.16em] mb-2">{stat.label}</p>
                    {loading ? (
                      <Skeleton className="h-10 w-24 rounded-lg bg-[var(--border)]/50" />
                    ) : (
                      <p className="text-4xl font-black text-[var(--fg)] tracking-tight tabular-nums leading-none">
                        {stat.value.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Animated bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1">
                    <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${stat.color} transition-all duration-700 rounded-r-full shadow-sm`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        
        {/* Left Column: Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }} 
          className="lg:col-span-1"
        >
          <div className="relative p-6 sm:p-8 h-full flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden">
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

            <h3 className="relative font-bold text-lg mb-6 flex items-center gap-3 tracking-tight">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20 shadow-sm">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                <Zap className="h-4 w-4 relative" strokeWidth={2.5} />
              </div>
              Quick Actions
            </h3>
            
            <div className="relative space-y-3 flex-1">
              {[
                { label: "Add New Teacher", href: "/dashboard/admin/teachers", icon: Users },
                { label: "Write an Article", href: "/dashboard/admin/articles", icon: FileText },
                { label: "Upload Gallery Image", href: "/dashboard/admin/gallery", icon: Sparkles },
                { label: "Post a Notice", href: "/dashboard/admin/notices", icon: Megaphone },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href} className="block group/action">
                    <div className="relative flex items-center justify-between p-4 rounded-xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] hover:bg-[var(--bg-soft)] hover:border-[var(--primary)]/30 transition-all duration-300 overflow-hidden">
                      
                      {/* Hover aura */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 bg-[var(--primary)]/[0.08] rounded-full blur-xl opacity-0 group-hover/action:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="relative flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm group-hover/action:scale-110 transition-transform duration-300">
                          <Icon className="h-4 w-4 text-[var(--fg-muted)] group-hover/action:text-[var(--primary)] transition-colors" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-[var(--fg-muted)] group-hover/action:text-[var(--fg)] transition-colors tracking-tight">{action.label}</span>
                      </div>
                      
                      <ArrowRight className="relative h-4 w-4 text-[var(--fg-muted)] opacity-50 group-hover/action:opacity-100 group-hover/action:text-[var(--primary)] group-hover/action:translate-x-1 transition-all duration-300" strokeWidth={2.5} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column: System Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4, duration: 0.6, ease: EASE }} 
          className="lg:col-span-2"
        >
          <div className="relative p-6 sm:p-8 h-full flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden">
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
            
            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            <h3 className="relative font-bold text-lg mb-6 flex items-center gap-3 tracking-tight">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20 shadow-sm">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                <Activity className="h-4 w-4 relative" strokeWidth={2.5} />
              </div>
              System Status
            </h3>

            <div className="relative grid sm:grid-cols-2 gap-5 flex-1 mb-6">
              {/* Server API */}
              <div className="relative p-5 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] flex flex-col justify-center overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded-md bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm">
                    <Server className="h-3.5 w-3.5 text-[var(--fg-muted)]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.14em]">Server API</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  </span>
                  <p className="font-black text-lg tracking-tight">Online</p>
                </div>
              </div>

              {/* Database */}
              <div className="relative p-5 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] flex flex-col justify-center overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded-md bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm">
                    <Database className="h-3.5 w-3.5 text-[var(--fg-muted)]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.14em]">Database</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
                  <p className="font-black text-lg tracking-tight">Connected</p>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="relative p-5 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20 ring-1 ring-inset ring-white/[0.04] flex gap-3.5 items-start overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 ring-1 ring-inset ring-indigo-500/20 shrink-0 mt-0.5">
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 leading-relaxed">
                <strong className="font-bold text-indigo-700 dark:text-indigo-300">Pro Tip:</strong> You can manage your entire website from the sidebar. Use "Settings" to update your contact details instantly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}