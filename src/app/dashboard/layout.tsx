"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ImageIcon, Calendar, LogOut, Trophy,
  FileText, Bell, Building2, GraduationCap, Mail, UserCog,
  Settings, Menu, X, Home, ExternalLink, ShieldCheck
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const adminLinks = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/achievements", label: "Achievements", icon: Trophy },
    { href: "/dashboard/admin/teachers", label: "Faculty", icon: Users },
    { href: "/dashboard/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/dashboard/admin/events", label: "Events", icon: Calendar },
    { href: "/dashboard/admin/articles", label: "Articles", icon: FileText },
    { href: "/dashboard/admin/notices", label: "Notices", icon: Bell },
    { href: "/dashboard/admin/governing-body", label: "Governing Body", icon: Building2 },
    { href: "/dashboard/admin/admissions", label: "Admissions", icon: GraduationCap },
    { href: "/dashboard/admin/contacts", label: "Contacts", icon: Mail },
    { href: "/dashboard/admin/users", label: "Users", icon: UserCog },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  const memberLinks = [
    { href: "/dashboard/member", label: "My Profile", icon: LayoutDashboard },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <AuthGuard>
      <div className="relative flex h-screen bg-[var(--bg)] overflow-hidden">
        
        {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        </div>

        {/* ================= MOBILE BACKDROP ================= */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-[var(--card)]/70 backdrop-blur-2xl border-r border-[var(--border)] flex flex-col transition-transform duration-500 ease-in-out shadow-2xl shadow-black/[0.06]",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {/* Right hairline edge-light */}
          <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--border)] to-transparent pointer-events-none" />

          {/* Logo Area */}
          <Link href="/" className="relative flex items-center gap-3 px-6 py-6 border-b border-[var(--border)] hover:bg-[var(--bg-soft)]/50 transition-colors group">
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
            
            <div className="relative">
              <div className="absolute inset-0 -m-1 rounded-xl bg-[var(--primary)]/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] ring-1 ring-inset ring-white/20 bg-white group-hover:scale-105 transition-transform duration-500">
                <img src="https://i.ibb.co.com/7NzsPGvc/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div>
              <p className="font-extrabold text-lg leading-tight gradient-text tracking-tight">Oasis BIAM</p>
              <p className="text-[9px] font-black text-[var(--fg-muted)] tracking-[0.24em] uppercase mt-0.5">Dashboard</p>
            </div>
          </Link>

          {/* Mobile Header Close */}
          <div className="flex lg:hidden items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">Navigation</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-2 rounded-lg bg-[var(--bg-soft)]/80 text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors ring-1 ring-inset ring-[var(--border)]"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <nav className="space-y-1.5">
              
              {/* Back to Home CTA */}
              <Link
                href="/"
                className="group relative flex items-center justify-between px-4 py-3.5 mb-6 rounded-xl font-bold transition-all duration-300 bg-[var(--bg-soft)]/60 border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:bg-[var(--card)] hover:border-[var(--primary)]/40 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-inset ring-[var(--primary)]/20 group-hover:scale-110 transition-transform duration-300">
                    <Home className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm tracking-tight text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">Back to Home</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-[var(--fg-muted)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--primary)] transition-all duration-300 relative z-10" strokeWidth={2.5} />
              </Link>

              {/* Section Label */}
              <div className="px-4 mb-2 flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)]/70">
                  {isAdmin ? "Admin Menu" : "Member Menu"}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
              </div>

              {/* Links */}
              {links.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 group overflow-hidden",
                      isActive
                        ? "text-white shadow-lg shadow-brand-500/25 ring-1 ring-inset ring-white/20"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)]/60"
                    )}
                  >
                    {/* Active Gradient Background */}
                    {isActive && (
                      <div className="absolute inset-0 gradient-brand -z-10" />
                    )}
                    {/* Inner sheen for active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent -z-10 pointer-events-none" />
                    )}
                    
                    <l.icon 
                      className={cn(
                        "h-5 w-5 transition-transform duration-300", 
                        isActive ? "text-white scale-110" : "text-[var(--fg-muted)] group-hover:text-[var(--primary)] group-hover:scale-110"
                      )} 
                      strokeWidth={2.5}
                    /> 
                    <span className="tracking-tight">{l.label}</span>

                    {/* Active Dot Indicator */}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout Footer */}
          <div className="relative p-4 border-t border-[var(--border)] bg-[var(--bg)]/30">
            {/* Bottom hairline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />

            <button
              onClick={async () => { await authClient.signOut(); router.push("/"); }}
              className="group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-500 bg-transparent hover:bg-red-500/[0.08] border border-transparent hover:border-red-500/25 transition-all duration-300 overflow-hidden"
            >
              {/* Hover aura */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500/[0.15] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <LogOut className="h-5 w-5 relative group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={2.5} /> 
              <span className="relative tracking-tight">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="relative flex-1 w-full lg:ml-72 transition-all duration-300 flex flex-col h-screen overflow-hidden">
          
          {/* Mobile Header */}
          <div className="lg:hidden p-4 pb-0 shrink-0 z-30 relative">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md shadow-sm text-sm font-bold text-[var(--fg)] ring-1 ring-inset ring-white/[0.04] hover:bg-[var(--card)] hover:border-[var(--primary)]/30 transition-all duration-300 group"
            >
              <Menu className="h-4 w-4 text-[var(--primary)] group-hover:scale-110 transition-transform" strokeWidth={2.5} /> 
              <span className="tracking-tight">Menu</span>
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin relative z-10">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}