"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Bell, FileText, Users, Building2, 
  Mail, GraduationCap, UserCog, Settings, BarChart3, 
  LogOut, X, MessageSquare, ShieldCheck, User as UserIcon
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity" 
        />
      )}

      {/* ================= SIDEBAR PANEL ================= */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 lg:top-20 inset-y-0 lg:inset-y-auto left-0 z-40 w-72 lg:w-72 shrink-0 flex flex-col transition-transform duration-300 ease-in-out",
          "bg-[var(--card)]/90 backdrop-blur-2xl border-r border-[var(--border)]",
          "h-screen lg:h-[calc(100vh-5rem)]",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        
        {/* ================= USER PROFILE HEADER ================= */}
        <div className="p-5 border-b border-[var(--border)] shrink-0 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-md shrink-0 bg-gradient-to-br from-[var(--grad-from)] to-[var(--grad-to)] grid place-items-center">
              {user?.image ? (
                <img src={user.image} alt={user?.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              )}
            </div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[var(--fg)] truncate">
                {user?.name || "Administrator"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {isAdmin ? (
                  <ShieldCheck className="h-3 w-3 text-[var(--primary)]" />
                ) : (
                  <UserIcon className="h-3 w-3 text-[var(--fg-muted)]" />
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] truncate">
                  {isAdmin ? "Administrator" : "Member"}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-5 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group}>
              {/* Group Label */}
              <h3 className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-[var(--fg-muted)] opacity-60">
                {group.group}
              </h3>
              
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
                          : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)]"
                      )}
                    >
                      {/* Animated Active Background */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 gradient-brand rounded-xl shadow-lg shadow-[var(--primary)]/25"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      <Icon className={cn(
                        "relative z-10 h-4 w-4 shrink-0 transition-transform duration-300",
                        active ? "scale-110" : "group-hover:scale-110"
                      )} />
                      <span className="relative z-10 truncate">{l.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ================= LOGOUT FOOTER ================= */}
        <div className="p-3 border-t border-[var(--border)] shrink-0">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
              <span>Sign Out</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Bye
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}