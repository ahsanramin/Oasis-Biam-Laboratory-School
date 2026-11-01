"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ImageIcon, Calendar, LogOut, Trophy,
  FileText, Bell, Building2, GraduationCap, Mail, UserCog,
  Settings, Menu, X, Home, ExternalLink,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

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
      <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-[var(--card)]/90 backdrop-blur-2xl border-r border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <Link href="/" className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)] hover:bg-[var(--bg-soft)]/50 transition-colors group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border)] bg-white group-hover:scale-105 transition-transform">
              <img src="https://i.ibb.co.com/7NzsPGvc/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-extrabold text-lg leading-tight gradient-text">Oasis BIAM</p>
              <p className="text-[9px] font-bold text-[var(--fg-muted)] tracking-widest uppercase">Dashboard</p>
            </div>
          </Link>

          <div className="flex lg:hidden items-center justify-between p-4 border-b border-[var(--border)]">
            <span className="font-bold text-sm text-[var(--fg-muted)]">Navigation</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-[var(--border)] text-[var(--fg-muted)]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center justify-between px-4 py-3 mb-4 rounded-xl font-bold transition-all bg-[var(--bg-soft)] text-[var(--fg)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-[var(--border)] hover:border-[var(--primary)]/30 group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-[var(--primary)]" />
                  <span>Back to Home</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
              </Link>

              <div className="h-px bg-[var(--border)] mb-4" />

              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                    pathname === l.href
                      ? "gradient-brand text-white shadow-glow"
                      : "text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]"
                  )}
                >
                  <l.icon className="h-5 w-5" /> {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={async () => { await authClient.signOut(); router.push("/"); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full lg:ml-72 transition-all duration-300 flex flex-col h-screen overflow-hidden">
          <div className="lg:hidden p-4 pb-0 shrink-0 bg-[var(--bg)]/80 backdrop-blur-md z-30">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm text-sm font-semibold"
            >
              <Menu className="h-4 w-4" /> Menu
            </button>
          </div>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}