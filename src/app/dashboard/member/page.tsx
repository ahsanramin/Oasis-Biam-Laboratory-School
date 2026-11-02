"use client";

import { useAuth } from "@/hooks/use-session";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Phone, Sparkles, BadgeCheck, ShieldCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MemberDashboard() {
  const { user } = useAuth();

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
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
      >
        <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Member Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Welcome, <span className="gradient-text">{user?.name || "Member"}</span>
        </h1>
        <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
          Here is your personal profile overview and account information.
        </p>
      </motion.div>

      {/* ================= PROFILE CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="max-w-2xl"
      >
        <Card className="relative p-8 sm:p-10 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl shadow-2xl shadow-black/[0.04] overflow-hidden group">
          
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

          {/* Corner glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="relative flex items-center gap-6 mb-8 pb-8 border-b border-[var(--border)]">
            
            {/* Avatar Medallion */}
            <div className="relative shrink-0">
              {/* Glow behind avatar */}
              <div className="absolute inset-0 -m-2 bg-gradient-to-br from-brand-500 to-amber-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full gradient-brand grid place-items-center text-white text-3xl sm:text-4xl font-black shadow-lg shadow-brand-500/25 ring-2 ring-[var(--card)] border border-white/20">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                <span className="relative drop-shadow-md">{user?.name?.[0] || "M"}</span>
              </div>
              
              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[var(--card)] grid place-items-center shadow-sm shadow-emerald-500/30">
                <BadgeCheck className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Name & Role */}
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight truncate">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-soft)] border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                  <ShieldCheck className="h-3 w-3 text-brand-500" strokeWidth={2.5} /> {user?.role || "Member"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Rows */}
          <div className="relative space-y-4">
            
            {/* Email */}
            <div className="group/row flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] hover:bg-[var(--bg-soft)] transition-all duration-300">
              <div className="relative shrink-0 p-2.5 rounded-xl bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm group-hover/row:scale-110 group-hover/row:text-brand-500 transition-all duration-300 text-[var(--fg-muted)]">
                <Mail className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mb-1">Email Address</p>
                <p className="text-sm font-bold text-[var(--fg)] truncate">{user?.email || "Not provided"}</p>
              </div>
            </div>

            {/* Address */}
            <div className="group/row flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] hover:bg-[var(--bg-soft)] transition-all duration-300">
              <div className="relative shrink-0 p-2.5 rounded-xl bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm group-hover/row:scale-110 group-hover/row:text-brand-500 transition-all duration-300 text-[var(--fg-muted)]">
                <MapPin className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mb-1">Current Address</p>
                <p className="text-sm font-bold text-[var(--fg)] truncate">{user?.address || "No address set"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="group/row flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02] hover:bg-[var(--bg-soft)] transition-all duration-300">
              <div className="relative shrink-0 p-2.5 rounded-xl bg-[var(--card)] ring-1 ring-inset ring-[var(--border)] shadow-sm group-hover/row:scale-110 group-hover/row:text-brand-500 transition-all duration-300 text-[var(--fg-muted)]">
                <Phone className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mb-1">Phone Number</p>
                <p className="text-sm font-bold text-[var(--fg)] truncate">{user?.phone || "Not provided"}</p>
              </div>
            </div>

          </div>
        </Card>
      </motion.div>
    </div>
  );
}