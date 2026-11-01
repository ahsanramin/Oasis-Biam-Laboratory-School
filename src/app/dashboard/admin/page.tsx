"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Users, FileText, Megaphone, GraduationCap, ArrowUpRight, ArrowRight, Activity, Zap, Sparkles, CheckCircle2, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  students?: number; teachers?: number;
  articlesCount?: number; noticesCount?: number;
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
    { label: "Total Faculty", value: stats?.teachers ?? 0, icon: Users, color: "from-blue-500 to-cyan-500", href: "/dashboard/admin/teachers", bgGlow: "bg-blue-500/10" },
    { label: "Total Students", value: stats?.students ?? 0, icon: GraduationCap, color: "from-purple-500 to-indigo-500", href: "/dashboard/admin/admissions", bgGlow: "bg-purple-500/10" },
    { label: "Published Articles", value: stats?.articlesCount ?? 0, icon: FileText, color: "from-emerald-500 to-teal-500", href: "/dashboard/admin/articles", bgGlow: "bg-emerald-500/10" },
    { label: "Active Notices", value: stats?.noticesCount ?? 0, icon: Megaphone, color: "from-rose-500 to-orange-500", href: "/dashboard/admin/notices", bgGlow: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-500/10 via-transparent to-transparent p-6 sm:p-10">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-500 uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Admin Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, <span className="gradient-text">Admin</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--fg-muted)] mt-2 max-w-xl font-medium">
            Here is a live snapshot of what is happening at Oasis BIAM Laboratory School today.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={stat.href}>
                <Card className="p-6 relative overflow-hidden group hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-lg cursor-pointer h-full">
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${stat.bgGlow} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} grid place-items-center text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="p-2 rounded-full bg-[var(--bg-soft)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[11px] font-bold text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">{stat.label}</p>
                    {loading ? <Skeleton className="h-10 w-20 mt-1" /> : <p className="text-4xl font-black text-[var(--fg)] tracking-tight">{stat.value.toLocaleString()}</p>}
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Zap className="h-4 w-4" /></div>
              Quick Actions
            </h3>
            <div className="space-y-3 flex-1">
              {[
                { label: "Add New Teacher", href: "/dashboard/admin/teachers", icon: Users },
                { label: "Write an Article", href: "/dashboard/admin/articles", icon: FileText },
                { label: "Upload Gallery Image", href: "/dashboard/admin/gallery", icon: Sparkles },
                { label: "Post a Notice", href: "/dashboard/admin/notices", icon: Megaphone },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={i} href={action.href} className="block group">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-soft)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[var(--fg-muted)] group-hover:text-[var(--primary)] transition-colors" />
                        <span className="text-sm font-semibold text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">{action.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[var(--fg-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
          <Card className="p-6 h-full relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Activity className="h-4 w-4" /></div>
              System Status
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 relative z-10 flex-1">
              <div className="p-4 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-[var(--fg-muted)]" />
                  <span className="text-[11px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Server API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <p className="font-bold text-lg">Online</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-[var(--fg-muted)]" />
                  <span className="text-[11px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="font-bold text-lg">Connected</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 relative z-10 flex gap-3 items-start">
              <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <strong className="font-bold">Pro Tip:</strong> You can manage your entire website from the sidebar. Use "Settings" to update your contact details instantly.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}