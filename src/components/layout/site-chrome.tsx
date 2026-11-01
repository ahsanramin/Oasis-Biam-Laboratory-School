"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we are anywhere inside the dashboard area
  const isDashboard = pathname?.startsWith("/dashboard");

  // =========================================
  // DASHBOARD MODE (Barebones)
  // =========================================
  if (isDashboard) {
    return <>{children}</>;
  }

  // =========================================
  // PUBLIC SITE MODE (Full Chrome)
  // =========================================
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}