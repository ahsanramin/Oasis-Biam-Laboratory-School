"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we are anywhere inside the dashboard area
  const isDashboard = pathname?.startsWith("/dashboard");

  // =========================================
  // DASHBOARD MODE (Barebones — no chrome, no transitions)
  // =========================================
  if (isDashboard) {
    return <>{children}</>;
  }

  // =========================================
  // PUBLIC SITE MODE (Full Chrome + Premium Transitions)
  // =========================================
  return (
    <>
      {/* ===== Global ambient background (public pages only) ===== */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-[var(--bg)]"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px]" />
      </div>

      <Navbar />

      {/* ===== Main with smooth page transition ===== */}
      <main className="relative flex-1 pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}