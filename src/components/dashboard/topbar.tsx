"use client";

import { useState, useEffect } from "react";
import { Menu, User, LayoutDashboard, ChevronDown, Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, isAdmin } = useAuth();
  const [greeting, setGreeting] = useState("");

  // ================= DYNAMIC GREETING =================
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <header
      className={cn(
        "relative h-16 sticky top-16 lg:top-20 z-20",
        "bg-[var(--card)]/70 backdrop-blur-2xl border-b border-[var(--border)]",
        "flex items-center justify-between px-4 lg:px-8",
        "shadow-sm shadow-black/[0.02]"
      )}
    >
      {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

      {/* ================= GRADIENT ACCENT LINE (bottom) ================= */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent pointer-events-none" />

      {/* ================= AMBIENT CORNER GLOW ================= */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      {/* ================= LEFT: MENU & CONTEXT ================= */}
      <div className="relative flex items-center gap-3 lg:gap-4 z-10">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-[var(--bg-soft)]/80 backdrop-blur-md hover:bg-[var(--border)] text-[var(--fg)] hover:text-[var(--primary)] transition-all duration-300 ring-1 ring-inset ring-[var(--border)] hover:ring-[var(--primary)]/30 hover:scale-105"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Desktop Context Header */}
        <div className="hidden lg:flex items-center gap-4">

          {/* Icon Bubble */}
          <div className="relative shrink-0">
            {/* Outer glow */}
            <div className="absolute inset-0 -m-1 bg-[var(--primary)]/25 rounded-xl blur-md opacity-70 pointer-events-none" />
            <div className="relative w-11 h-11 rounded-xl gradient-brand grid place-items-center text-white shadow-lg shadow-[var(--primary)]/25 ring-1 ring-inset ring-white/25">
              {/* Inner sheen */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
              <LayoutDashboard className="h-5 w-5 relative" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title block */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-[var(--fg)] leading-none tracking-tight">
                Dashboard
              </h1>
              {isAdmin && (
                <Badge className="relative gradient-brand text-white border-none text-[9px] font-black uppercase tracking-[0.14em] px-2 py-0.5 shadow-sm shadow-brand-500/20 ring-1 ring-inset ring-white/25 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                  <span className="relative">Admin</span>
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-semibold text-[var(--fg-muted)] mt-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" strokeWidth={2.5} />
              {greeting}, {user?.name?.split(" ")[0] || "User"} — welcome back!
            </p>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-lg gradient-brand grid place-items-center text-white shadow-md shadow-brand-500/25 ring-1 ring-inset ring-white/20">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
            <LayoutDashboard className="h-4 w-4 relative" strokeWidth={2.5} />
          </div>
          <p className="font-black text-sm text-[var(--fg)] tracking-tight">Dashboard</p>
        </div>
      </div>

      {/* ================= RIGHT: ACTIONS & PROFILE ================= */}
      <div className="relative flex items-center gap-2 sm:gap-3 z-10">

        {/* Notifications Bell (Placeholder) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-[var(--bg-soft)]/80 backdrop-blur-md hover:bg-[var(--card)] text-[var(--fg-muted)] hover:text-[var(--primary)] transition-all duration-300 hidden sm:flex ring-1 ring-inset ring-[var(--border)] hover:ring-[var(--primary)]/30 hover:shadow-md hover:shadow-brand-500/[0.05] group/bell"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 group-hover/bell:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[var(--card)] animate-pulse shadow-sm shadow-red-500/50" />
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-[var(--border)] to-transparent" />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Card */}
        <div
          className={cn(
            "relative flex items-center gap-3 pl-2 pr-2 sm:pr-4 py-1.5 rounded-xl",
            "bg-[var(--bg-soft)]/80 backdrop-blur-md border border-[var(--border)]",
            "ring-1 ring-inset ring-white/[0.04]",
            "hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-lg hover:shadow-black/[0.04]",
            "transition-all duration-500 cursor-pointer group overflow-hidden"
          )}
        >
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

          {/* Hover corner glow */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-500/[0.08] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Avatar with Online Status */}
          <div className="relative shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden gradient-brand grid place-items-center text-white text-sm font-black shadow-sm ring-2 ring-[var(--card)]">
              {/* Inner sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-transparent pointer-events-none" />
              {user?.image ? (
                <img src={user.image} alt={user?.name} className="relative w-full h-full object-cover" />
              ) : user?.name ? (
                <span className="relative tracking-tight">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="relative h-4 w-4" strokeWidth={2.5} />
              )}
            </div>
            {/* Online Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--card)] shadow-sm shadow-emerald-500/50">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </span>
          </div>

          {/* User Info */}
          <div className="relative hidden sm:block text-left">
            <p className="text-xs font-black text-[var(--fg)] truncate max-w-[120px] leading-tight group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight">
              {user?.name || "Guest User"}
            </p>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] leading-tight mt-0.5">
              {user?.role || "Member"}
            </p>
          </div>

          {/* Dropdown Chevron */}
          <ChevronDown
            className="relative hidden sm:block h-4 w-4 text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:rotate-180 transition-all duration-500"
            strokeWidth={2.5}
          />
        </div>

      </div>
    </header>
  );
}