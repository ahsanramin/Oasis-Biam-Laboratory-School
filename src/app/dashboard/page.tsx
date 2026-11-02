"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-session";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function DashboardIndex() {
  const router = useRouter();
  const { isAdmin, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (isAdmin) router.replace("/dashboard/admin");
    else router.replace("/dashboard/member");
  }, [isAdmin, loading, isAuthenticated, router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      
      {/* ===== Layered Ambient Background Glows ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.08] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Subtle radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      {/* ===== Main Card ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative p-10 sm:p-14 rounded-[3rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/[0.08] flex flex-col items-center max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Top hairline edge-light */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent pointer-events-none" />

        {/* Corner glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none" />

        {/* Logo Medallion */}
        <div className="relative mb-8">
          {/* Outer pulsing glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -m-4 gradient-brand rounded-full blur-2xl"
          />
          
          <div className="relative w-24 h-24 rounded-[1.75rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-white ring-1 ring-inset ring-white/30">
            {/* Inner sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.2] via-transparent to-transparent z-10 pointer-events-none" />
            <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized priority />
          </div>
          
          {/* Floating Shield Badge */}
          <motion.div 
            animate={{ y: [0, -4, 0] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white grid place-items-center border-2 border-[var(--card)] shadow-xl shadow-emerald-500/30 ring-1 ring-inset ring-white/30 z-20"
          >
            <ShieldCheck className="h-5 w-5 drop-shadow-sm" strokeWidth={2.5} />
          </motion.div>
        </div>

        {/* Typography */}
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--fg)] mb-2 tracking-tight text-center leading-tight">
          Oasis BIAM <br className="hidden sm:block" />
          <span className="gradient-text">Laboratory School</span>
        </h2>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.18em] mb-8">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Secure Portal
        </div>

        <p className="text-sm font-medium text-[var(--fg-muted)] mb-8 text-center leading-relaxed">
          {loading ? "Authenticating your session..." : "Redirecting to your dashboard..."}
        </p>

        {/* Premium Indeterminate Progress Bar */}
        <div className="w-full h-2 bg-[var(--bg-soft)]/80 rounded-full overflow-hidden relative border border-[var(--border)]/50 shadow-inner">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 gradient-brand rounded-full shadow-[0_0_12px_var(--primary)]"
          />
        </div>

        {/* Status Footer */}
        <div className="mt-6 flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-brand-500" strokeWidth={2.5} />
          <span className="text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.2em]">
            Please wait
          </span>
        </div>
      </motion.div>
    </div>
  );
}