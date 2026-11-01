"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-session";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative p-10 sm:p-12 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent rounded-full" />
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 gradient-brand rounded-2xl blur-xl"
          />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-white">
            <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary)] text-white grid place-items-center border-2 border-[var(--bg)] shadow-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <h2 className="text-xl font-black text-[var(--fg)] mb-2 tracking-tight">Oasis BIAM</h2>
        <p className="text-sm font-medium text-[var(--fg-muted)] mb-8 text-center">
          {loading ? "Authenticating your session..." : "Redirecting to your dashboard..."}
        </p>
        <div className="w-full h-1.5 bg-[var(--bg-soft)] rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 gradient-brand rounded-full"
          />
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--primary)]" />
          <span>Please wait</span>
        </div>
      </motion.div>
    </div>
  );
}