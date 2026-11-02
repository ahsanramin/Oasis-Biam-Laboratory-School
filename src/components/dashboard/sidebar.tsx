"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Bell, FileText, Users, Building2,
  Mail, GraduationCap, UserCog, Settings, BarChart3,
  LogOut, X, MessageSquare, ShieldCheck, User as UserIcon,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";

// =========================================
// NAVIGATION STRUCTURE (Grouped for scanning)
// =========================================
const ADMIN_NAV = [
  {
    group: "Overview",
    links: [
      { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Content Management",
    links: [
      { href: "/dashboard/admin/notices", label: "Notices", icon: Bell },
      { href: "/dashboard/admin/articles", label: "Articles", icon: FileText },
      { href: "/dashboard/admin/teachers", label: "Faculty & Staff", icon: Users },
      { href: "/dashboard/admin/governing-body", label: "Governing Body", icon: Building2 },
    ],
  },
  {
    group: "Community",
    links: [
      { href: "/dashboard/admin/admissions", label: "Admissions", icon: GraduationCap },
      { href: "/dashboard/admin/contacts", label: "Messages", icon: Mail },
    ],
  },
  {
    group: "Administration",
    links: [
      { href: "/dashboard/admin/users", label: "User Management", icon: UserCog },
      { href: "/dashboard/admin/notifications", label: "Notifications", icon: MessageSquare },
      { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/dashboard/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
];

const MEMBER_NAV = [
  {
    group: "My Account",
    links: [
      { href: "/dashboard/member", label: "My Profile", icon: LayoutDashboard },
    ],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useAuth() as any;

  const navGroups = isAdmin ? ADMIN_NAV : MEMBER_NAV;

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <>
      {/* ================= MOBILE BACKDROP ================= */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* ================= SIDEBAR PANEL ================= */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 lg:top-20 inset-y-0 lg:inset-y-auto left-0 z-40 w-72 lg:w-72 shrink-0 flex flex-col transition-transform duration-500",
          "bg-[var(--card)]/70 backdrop-blur-2xl border-r border-[var(--border)]",
          "h-screen lg:h-[calc(100vh-5rem)]",
          "overflow-hidden",
          open ? "translate-x-0 shadow-2xl shadow-black/[0.08]" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 -right-12 w-48 h-48 bg-brand-500/[0.08] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-12 w-40 h-40 bg-amber-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-500/[0.03] rounded-full blur-3xl" />
        </div>

        {/* Right hairline edge-light (subtle premium divider) */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent pointer-events-none" />

        {/* ================= USER PROFILE HEADER ================= */}
        <div className="relative p-5 border-b border-[var(--border)] shrink-0 overflow-hidden">

          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

          {/* Corner glow */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/[0.1] rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-center gap-3">

            {/* Avatar with layered ring */}
            <div className="relative shrink-0">
              {/* Outer glow */}
              <div className="absolute inset-0 -m-1 rounded-full bg-[var(--primary)]/25 blur-md opacity-60" />
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-lg shadow-black/[0.08] bg-gradient-to-br from-[var(--grad-from)] to-[var(--grad-to)] grid place-items-center">
                {/* Inner sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] to-transparent pointer-events-none" />
                {user?.image ? (
                  <img src={user.image} alt={user?.name || "User"} className="relative w-full h-full object-cover" />
                ) : (
                  <span className="relative text-white font-black text-lg tracking-tight drop-shadow-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                )}
              </div>
            </div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[var(--fg)] truncate tracking-tight">
                {user?.name || "Administrator"}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)]">
                {isAdmin ? (
                  <ShieldCheck className="h-3 w-3 text-[var(--primary)]" strokeWidth={2.5} />
                ) : (
                  <UserIcon className="h-3 w-3 text-[var(--fg-muted)]" strokeWidth={2.5} />
                )}
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] truncate">
                  {isAdmin ? "Administrator" : "Member"}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-all duration-300 hover:rotate-90 shrink-0 ring-1 ring-inset ring-transparent hover:ring-[var(--border)]"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-6 relative">
          {navGroups.map((group) => (
            <div key={group.group}>

              {/* Group Label with divider */}
              <div className="px-3 mb-3 flex items-center gap-2">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)]/70 whitespace-nowrap">
                  {group.group}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
              </div>

              {/* Links */}
              <div className="space-y-1">
                {group.links.map((l) => {
                  const Icon = l.icon;
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={onClose}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                        active
                          ? "text-white"
                          : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)]/80"
                      )}
                    >
                      {/* Animated Active Background */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 gradient-brand rounded-xl shadow-lg shadow-[var(--primary)]/30 ring-1 ring-inset ring-white/20 overflow-hidden"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        >
                          {/* Inner sheen on active pill */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent pointer-events-none" />
                        </motion.div>
                      )}

                      {/* Icon medallion */}
                      <div className={cn(
                        "relative z-10 shrink-0 w-6 h-6 grid place-items-center transition-transform duration-300",
                        active ? "scale-110" : "group-hover:scale-110"
                      )}>
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "drop-shadow-sm" : ""
                          )}
                          strokeWidth={2.5}
                        />
                      </div>

                      <span className="relative z-10 truncate tracking-tight">{l.label}</span>

                      {/* Active dot indicator (right side) */}
                      {active && (
                        <span className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ================= LOGOUT FOOTER ================= */}
        <div className="relative p-3 border-t border-[var(--border)] shrink-0 overflow-hidden">

          {/* Bottom hairline */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />

          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:text-red-600 bg-transparent hover:bg-red-500/[0.08] border border-transparent hover:border-red-500/25 transition-all duration-300 overflow-hidden"
          >
            {/* Hover aura */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500/[0.15] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <LogOut
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
                strokeWidth={2.5}
              />
              <span className="tracking-tight">Sign Out</span>
            </div>

            <span className="relative text-[9px] font-black uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Bye
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}