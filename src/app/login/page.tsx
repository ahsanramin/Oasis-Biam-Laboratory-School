"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  ShieldCheck, CheckCircle2, Sparkles, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 🎯 ADDED to read URL errors
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 🎯 Catch OAuth errors from the URL and show a friendly toast
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unable_to_link_account") {
      toast.error("An account with this email already exists. Please sign in with your password instead of Google.");
    } else if (error === "oauth") {
      toast.error("Failed to authenticate with Google. Please try again.");
    }
  }, [searchParams]);

  // =========================================
  // EMAIL / PASSWORD LOGIN
  // =========================================
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      
      if (res.error) throw new Error(res.error.message);
      
      const userRole = (res.data?.user as { role?: string })?.role;
      
      if (userRole === "admin") {
        toast.success("Welcome back, Admin!");
        router.push("/dashboard/admin");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard/member");
      }
      
      router.refresh();
    } catch (err: unknown) { 
      toast.error(err instanceof Error ? err.message : "Login failed"); 
    } finally { 
      setLoading(false); 
    }
  }

  // =========================================
  // GOOGLE OAUTH LOGIN
  // =========================================
  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const origin = window.location.origin; 
      
      await authClient.signIn.social({ 
        provider: "google", 
        callbackURL: `${origin}/dashboard`,
        errorCallbackURL: `${origin}/login?error=oauth`,
      });
    } catch (err: unknown) { 
      toast.error(err instanceof Error ? err.message : "Google login failed"); 
      setGoogleLoading(false); 
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--bg)]">

      {/* =========================================
          LEFT SIDE: SAAS BRANDING
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="hidden lg:flex relative flex-col justify-between p-12 lg:p-20 overflow-hidden border-r border-[var(--border)]"
      >
        {/* Refined dot-grid with radial mask */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)",
          }}
        />

        {/* Ambient glows */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.18, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Brand lockup */}
        <Link href="/" className="relative z-10 flex items-center gap-4 w-max group">
          <div className="relative">
            <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/25 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/30 border border-white/20 ring-1 ring-inset ring-white/20 bg-white group-hover:scale-105 transition-transform duration-500">
              <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
            </div>
          </div>
          <div>
            <p className="font-extrabold text-2xl leading-tight gradient-text tracking-tight">Oasis BIAM</p>
            <p className="text-[10px] font-black text-[var(--fg-muted)] tracking-[0.24em] uppercase">Laboratory School</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-xl mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          >
            {/* Eyebrow badge */}
            <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/60 backdrop-blur-md border border-[var(--primary)]/25 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-8">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> The Future is Here
            </div>

            <h1 className="text-5xl lg:text-6xl font-black font-display leading-[1.02] mb-8 tracking-tight">
              Welcome back to the{" "}
              <span className="gradient-text">future</span> of education.
            </h1>
            <p className="text-lg text-[var(--fg-muted)] font-medium leading-relaxed mb-12">
              Log in to manage your dashboard, access exclusive school resources, and stay connected with the Oasis BIAM community.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                "Access your personalized dashboard",
                "Manage notices, articles, and events",
                "Secure, role-based authentication",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-4 group/item"
                >
                  <div className="relative w-9 h-9 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 grid place-items-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-[var(--primary)]/20 transition-all duration-300">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" strokeWidth={2.5} />
                  </div>
                  <span className="text-base font-bold text-[var(--fg)] group-hover/item:text-[var(--primary)] transition-colors duration-300 tracking-tight">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security footer */}
        <div className="relative z-10 flex items-center gap-8 pt-10 border-t border-[var(--border)]/60">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 grid place-items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
            </div>
            Bank-Level Security
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 grid place-items-center">
              <Lock className="h-4 w-4 text-blue-500" strokeWidth={2.5} />
            </div>
            256-Bit Encryption
          </div>
        </div>
      </motion.div>

      {/* =========================================
          RIGHT SIDE: LOGIN FORM
          ========================================= */}
      <div className="relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">

        {/* Ambient glow for mobile */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] lg:hidden pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-amber-500/[0.06] rounded-full blur-[100px] lg:hidden pointer-events-none" />

        {/* Back button (mobile) */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] hover:text-[var(--fg)] z-20 group/back"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/back:-translate-x-0.5" strokeWidth={2.5} />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="relative w-full max-w-[440px] z-10"
        >
          <div className="relative p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/[0.06] overflow-hidden">

            {/* Top hairline edge-light */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent pointer-events-none" />

            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/[0.08] rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative text-center mb-8">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/25 blur-lg" />
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow bg-white border border-[var(--border)] ring-1 ring-inset ring-white/20">
                    <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-black font-display tracking-tight mb-2">Sign In</h2>
              <p className="text-sm text-[var(--fg-muted)] font-medium">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] ml-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  {/* Focus aura */}
                  <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                    strokeWidth={2.5}
                  />
                  <Input
                    type="email"
                    placeholder="admin@oasisbiam.edu"
                    className="relative pl-12 h-14 bg-[var(--bg-soft)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:bg-[var(--bg)] focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 text-base rounded-xl font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ease: EASE }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between ml-0.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--primary)] hover:text-[var(--primary)]/80 hover:underline underline-offset-4 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                    strokeWidth={2.5}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="relative pl-12 pr-12 h-14 bg-[var(--bg-soft)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:bg-[var(--bg)] focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 text-base rounded-xl tracking-widest font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors duration-300 p-2 rounded-lg hover:bg-[var(--primary)]/[0.08] z-10"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2.5} /> : <Eye className="h-5 w-5" strokeWidth={2.5} />}
                  </button>
                </div>
              </motion.div>

              {/* Remember me */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, ease: EASE }}
                className="flex items-center gap-3 pt-1"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer w-4 h-4 rounded-md border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-brand-500/20 focus:ring-offset-0 cursor-pointer transition-all"
                  />
                </div>
                <label htmlFor="remember" className="text-sm font-bold text-[var(--fg-muted)] cursor-pointer select-none hover:text-[var(--fg)] transition-colors">
                  Remember me for 30 days
                </label>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ease: EASE }}
              >
                <Button
                  type="submit"
                  className="relative w-full h-14 gradient-brand text-base font-bold shadow-xl shadow-[var(--primary)]/25 hover:shadow-2xl hover:shadow-[var(--primary)]/35 hover:scale-[1.01] transition-all duration-300 rounded-xl group overflow-hidden"
                  loading={loading}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative inline-flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                  </span>
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="px-4 bg-[var(--card)] text-[var(--fg-muted)]">Or continue with</span>
              </div>
            </div>

            {/* Google */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 bg-[var(--card)] hover:bg-[var(--bg-soft)] border border-[var(--border)] hover:border-[var(--primary)]/30 font-bold text-base rounded-xl transition-all duration-300 hover:shadow-md ring-1 ring-inset ring-white/[0.03] group/google"
              onClick={handleGoogle}
              loading={googleLoading}
              type="button"
            >
              <svg className="h-5 w-5 mr-3 transition-transform duration-300 group-hover/google:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            {/* Register link */}
            <p className="mt-8 text-center text-sm font-bold text-[var(--fg-muted)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[var(--primary)] hover:underline underline-offset-4 decoration-2 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.22em] text-[var(--fg-muted)]/70">
            © {new Date().getFullYear()} Oasis BIAM · All rights reserved
          </p>
        </motion.div>
      </div>
    </div>
  );
}