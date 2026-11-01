"use client";

import { useAuth } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

// =========================================
// 1. PREMIUM LOADING SCREEN
// =========================================
function PremiumLoader({ message = "Verifying access..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Glassmorphic Loading Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
      >
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent rounded-full" />

        {/* Animated Logo Orb */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 gradient-brand rounded-2xl blur-xl"
          />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-white">
            <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized />
          </div>
          {/* Shield Badge Overlay */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--primary)] text-white grid place-items-center border-2 border-[var(--bg)] shadow-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-black text-[var(--fg)] mb-2 tracking-tight">Oasis BIAM</h2>
        <p className="text-sm font-medium text-[var(--fg-muted)] mb-6 text-center">{message}</p>

        {/* Premium Progress Bar */}
        <div className="w-full h-1.5 bg-[var(--bg-soft)] rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 gradient-brand rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

// =========================================
// 2. AUTH GUARD COMPONENT
// =========================================
export function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    // Redirect logic
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (requireAdmin && !isAdmin) {
      router.replace("/dashboard/member");
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

  // ================= 1. AUTHENTICATING =================
  if (loading) {
    return <PremiumLoader message="Authenticating your session..." />;
  }

  // ================= 2. REDIRECTING (UNAUTHENTICATED) =================
  if (!isAuthenticated) {
    return <PremiumLoader message="Redirecting to login..." />;
  }

  // ================= 3. REDIRECTING (UNAUTHORIZED) =================
  if (requireAdmin && !isAdmin) {
    return <PremiumLoader message="Verifying permissions..." />;
  }

  // ================= 4. AUTHORIZED =================
  return <>{children}</>;
}