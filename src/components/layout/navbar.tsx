"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogIn, LogOut, LayoutDashboard,
  ChevronDown, Search, UserPlus, Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/admission", label: "Admission" }, // 🎯 ADDED HERE
  { href: "/teachers", label: "Faculty" },
  { href: "/blog", label: "Blog" },
  { href: "/notices", label: "Notices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" }
];

const MORE_LINKS = [
  { href: "/achievements", label: "Achievements" },
  // Admission removed from here
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 w-full",
          scrolled
            ? "bg-[var(--card)]/70 backdrop-blur-2xl border-b border-[var(--border)] shadow-sm shadow-black/[0.04] py-2"
            : "bg-transparent py-4"
        )}
      >
        {/* Top hairline edge-light (visible when scrolled) */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
        )}

        {/* Gradient accent line (bottom) */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent pointer-events-none" />
        )}

        <div className="max-w-[1536px] mx-auto px-4 lg:px-8 flex items-center justify-between flex-nowrap gap-4">

          {/* =========================================
              LEFT: LOGO
              ========================================= */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">

            {/* Logo with glow halo + foil */}
            <div className="relative">
              <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/30 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-2xl overflow-hidden shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 border border-[var(--border)] ring-1 ring-inset ring-white/30 bg-white">
                <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized />
              </div>
            </div>

            {/* Visible on mobile with responsive text sizes */}
            <div className="block whitespace-nowrap">
              <p className="font-extrabold text-base sm:text-lg lg:text-xl leading-tight gradient-text tracking-tight flex items-center gap-1.5">
                Oasis BIAM
              </p>
              <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-[var(--fg-muted)] tracking-[0.2em] sm:tracking-[0.24em] uppercase font-black">
                Laboratory School
              </p>
            </div>
          </Link>

          {/* =========================================
              CENTER: DESKTOP NAVIGATION
              ========================================= */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-[var(--bg-soft)]/70 backdrop-blur-md px-2 py-1.5 rounded-full border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] shrink shadow-sm shadow-black/[0.02]">
            {MAIN_LINKS.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-3 2xl:px-4 py-2 rounded-full text-xs 2xl:text-sm font-bold transition-colors duration-300 whitespace-nowrap z-10 tracking-tight",
                    isActive ? "text-[var(--primary)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-[var(--card)] rounded-full shadow-sm shadow-black/[0.04] ring-1 ring-inset ring-white/[0.06] -z-10 overflow-hidden"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    >
                      {/* Inner sheen */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  )}
                  {l.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative shrink-0" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button className={cn(
                "relative px-3 2xl:px-4 py-2 rounded-full text-xs 2xl:text-sm font-bold flex items-center gap-1 transition-colors duration-300 whitespace-nowrap z-10 tracking-tight",
                moreOpen ? "text-[var(--primary)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              )}>
                More
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-300", moreOpen && "rotate-180")}
                  strokeWidth={2.5}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-3 w-56 bg-[var(--card)]/80 backdrop-blur-2xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.06] rounded-2xl shadow-2xl shadow-black/[0.12] overflow-hidden py-2 z-50"
                  >
                    {/* Top hairline */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

                    {MORE_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="relative flex items-center gap-2.5 px-5 py-3 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-soft)]/60 transition-colors duration-300 group/item tracking-tight"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover/item:bg-[var(--primary)] group-hover/item:scale-125 transition-all duration-300" />
                        {l.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* =========================================
              RIGHT: ACTIONS & AUTH BUTTONS
              ========================================= */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">

            {/* Premium Search Trigger */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden 2xl:flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:bg-[var(--card)] hover:border-[var(--primary)]/30 hover:shadow-md hover:shadow-black/[0.03] transition-all duration-300 text-xs font-bold text-[var(--fg-muted)] group"
            >
              <Search className="h-3.5 w-3.5 group-hover:text-[var(--primary)] transition-colors duration-300" strokeWidth={2.5} />
              <span className="tracking-tight">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] font-mono text-[10px] group-hover:border-[var(--primary)]/30 transition-colors duration-300">
                ⌘K
              </kbd>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-[var(--border)] to-transparent hidden sm:block mx-1" />

            <ThemeToggle />

            {/* Auth Buttons (Desktop) */}
            {loading ? (
              <div className="w-24 h-10 bg-[var(--bg-soft)]/60 backdrop-blur-md animate-pulse rounded-xl hidden sm:block ring-1 ring-inset ring-white/[0.04]" />
            ) : isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href={isAdmin ? "/dashboard/admin" : "/dashboard/member"}>
                  <Button className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 font-bold h-10 px-5 rounded-xl group overflow-hidden ring-1 ring-inset ring-white/20">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <LayoutDashboard className="h-4 w-4 mr-2 relative" strokeWidth={2.5} />
                    <span className="relative">Dashboard</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="relative h-10 px-4 border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:bg-red-500/[0.08] hover:text-red-500 hover:border-red-500/30 hover:shadow-md hover:shadow-red-500/[0.08] rounded-xl font-bold text-[var(--fg-muted)] transition-all duration-300 group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="font-bold text-[var(--fg)] hover:bg-[var(--bg-soft)]/80 hover:text-[var(--primary)] h-10 px-4 rounded-xl transition-colors duration-300 tracking-tight"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 font-bold h-10 px-5 rounded-xl group overflow-hidden ring-1 ring-inset ring-white/20">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <Sparkles className="h-4 w-4 mr-2 relative group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                    <span className="relative">Register</span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden p-2.5 rounded-xl bg-[var(--bg-soft)]/80 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:bg-[var(--card)] hover:border-[var(--primary)]/30 transition-all duration-300 shrink-0 group"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
              ) : (
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* =========================================
          MOBILE MENU (FULL SCREEN OVERLAY)
          ========================================= */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 xl:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-[var(--bg)] border-l border-[var(--border)] z-50 xl:hidden flex flex-col shadow-2xl shadow-black/20"
            >
              {/* Ambient glows */}
              <div className="absolute top-0 -right-12 w-48 h-48 bg-brand-500/[0.08] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 -left-12 w-48 h-48 bg-amber-500/[0.05] rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-6 border-b border-[var(--border)]">
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                <p className="font-black text-xl gradient-text tracking-tight">Menu</p>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-[var(--bg-soft)]/80 backdrop-blur-md text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/[0.08] transition-all duration-300 ring-1 ring-inset ring-[var(--border)] hover:ring-[var(--primary)]/30 group"
                >
                  <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                </button>
              </div>

              {/* Nav items */}
              <div className="relative flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
                {[...MAIN_LINKS, ...MORE_LINKS].map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 + 0.1 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "relative block px-4 py-3.5 rounded-xl font-bold transition-all duration-300 tracking-tight",
                        pathname === l.href
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-inset ring-[var(--primary)]/20"
                          : "hover:bg-[var(--bg-soft)]/80 text-[var(--fg)] hover:text-[var(--primary)]"
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="relative p-4 border-t border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md">
                {/* Bottom hairline */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />

                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link href={isAdmin ? "/dashboard/admin" : "/dashboard/member"} onClick={() => setOpen(false)}>
                      <Button className="relative w-full gradient-brand shadow-lg shadow-brand-500/25 h-12 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20">
                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                        <LayoutDashboard className="h-5 w-5 mr-2 relative" strokeWidth={2.5} />
                        <span className="relative">Go to Dashboard</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl border border-red-500/20 ring-1 ring-inset ring-red-500/[0.08] text-red-500 hover:bg-red-500/[0.08] font-bold transition-all duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" strokeWidth={2.5} />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] font-bold hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all duration-300"
                      >
                        <LogIn className="h-5 w-5 mr-2" strokeWidth={2.5} />
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button className="relative w-full h-12 gradient-brand shadow-lg shadow-brand-500/25 font-bold rounded-xl group overflow-hidden ring-1 ring-inset ring-white/20">
                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                        <UserPlus className="h-5 w-5 mr-2 relative" strokeWidth={2.5} />
                        <span className="relative">Register</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}