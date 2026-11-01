"use client";

import { useState, useEffect } from "react";
import { Menu, User, LayoutDashboard, ChevronDown, Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        "h-16 sticky top-16 lg:top-20 z-20",
        "bg-[var(--card)]/70 backdrop-blur-2xl border-b border-[var(--border)]",
        "flex items-center justify-between px-4 lg:px-8",
        "shadow-sm"
      )}
    >
      {/* ================= GRADIENT ACCENT LINE ================= */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent pointer-events-none" />

      {/* ================= LEFT: MENU & CONTEXT ================= */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 rounded-xl bg-[var(--bg-soft)] hover:bg-[var(--border)] text-[var(--fg)] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Context Header */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            {/* Glowing Icon Bubble */}
            <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-xl blur-md" />
            <div className="relative w-10 h-10 rounded-xl gradient-brand grid place-items-center text-white shadow-lg shadow-[var(--primary)]/25">
              <LayoutDashboard className="h-5 w-5" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg text-[var(--fg)] leading-none">Dashboard</h1>
              {isAdmin && (
                <Badge className="gradient-brand text-white border-none text-[9px] font-black uppercase tracking-wider px-2 py-0.5 shadow-sm">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-semibold text-[var(--fg-muted)] mt-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              {greeting}, {user?.name?.split(" ")[0] || "User"} — welcome back!
            </p>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand grid place-items-center text-white shadow-md">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <p className="font-black text-sm text-[var(--fg)]">Dashboard</p>
        </div>
      </div>

      {/* ================= RIGHT: ACTIONS & PROFILE ================= */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Notifications Bell (Placeholder) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-[var(--bg-soft)] hover:bg-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors hidden sm:flex"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[var(--card)] animate-pulse" />
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-[var(--border)]" />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Card */}
        <div 
          className={cn(
            "flex items-center gap-3 pl-2 pr-2 sm:pr-4 py-1.5 rounded-xl",
            "bg-[var(--bg-soft)] border border-[var(--border)]",
            "hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-md",
            "transition-all duration-300 cursor-pointer group"
          )}
        >
          {/* Avatar with Online Status */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden gradient-brand grid place-items-center text-white text-sm font-black shadow-sm ring-2 ring-[var(--card)]">
              {user?.image ? (
                <img src={user.image} alt={user?.name} className="w-full h-full object-cover" />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            {/* Online Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--card)]" />
          </div>

          {/* User Info */}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-[var(--fg)] truncate max-w-[120px] leading-tight group-hover:text-[var(--primary)] transition-colors">
              {user?.name || "Guest User"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)] leading-tight">
              {user?.role || "Member"}
            </p>
          </div>

          {/* Dropdown Chevron */}
          <ChevronDown className="hidden sm:block h-4 w-4 text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:rotate-180 transition-all duration-300" />
        </div>

      </div>
    </header>
  );
}