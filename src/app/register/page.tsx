"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight,
  CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

function getPasswordStrength(pass: string) {
  let score = 0;
  if (!pass) return score;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const strength = getPasswordStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!agreeTerms) return toast.error("Please agree to the Terms of Service");

    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      if (res.error) throw new Error(res.error.message);

      // 🔧 FIX: Cast user to any to access custom `role` field
      const userRole = (res.data?.user as any)?.role;

      if (userRole === "admin") {
        toast.success("Admin account created! Welcome aboard.");
        router.push("/dashboard/admin");
      } else {
        toast.success("Account created! Welcome aboard.");
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard"
      });
    } catch (err: any) {
      toast.error(err.message || "Google signup failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--bg)]">

      {/* =========================================
          LEFT SIDE: REGISTER FORM
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden order-2 lg:order-1"
      >
        {/* Ambient glows (mobile visible) */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] lg:hidden pointer-events-none" />
        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-amber-500/[0.06] rounded-full blur-[100px] lg:hidden pointer-events-none" />

        {/* Back button (mobile) */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] hover:text-[var(--fg)] z-20 group/back"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/back:-translate-x-0.5" strokeWidth={2.5} />
          Back
        </Link>

        <div className="relative w-full max-w-[440px] z-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/25 blur-lg" />
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow bg-white border border-[var(--border)] ring-1 ring-inset ring-white/20">
                  <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
                </div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-sm text-[var(--fg-muted)] font-medium">Join the Oasis BIAM community today.</p>
          </div>

          {/* Form card */}
          <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/[0.06] overflow-hidden">

            {/* Top hairline edge-light */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent pointer-events-none" />

            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/[0.08] rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative space-y-5">

              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] ml-0.5">
                  Full Name
                </label>
                <div className="relative group">
                  {/* Focus aura */}
                  <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                    strokeWidth={2.5}
                  />
                  <Input
                    placeholder="e.g. Ahsan Labib"
                    className="relative pl-12 h-14 bg-[var(--bg-soft)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:bg-[var(--bg)] focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 text-base rounded-xl font-medium"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ease: EASE }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] ml-0.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                    strokeWidth={2.5}
                  />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="relative pl-12 h-14 bg-[var(--bg-soft)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:bg-[var(--bg)] focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 text-base rounded-xl font-medium"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: EASE }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] ml-0.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                    strokeWidth={2.5}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="relative pl-12 pr-12 h-14 bg-[var(--bg-soft)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:bg-[var(--bg)] focus:ring-2 focus:ring-brand-500/10 transition-all duration-300 text-base rounded-xl tracking-widest font-medium"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors duration-300 p-2 rounded-lg hover:bg-[var(--primary)]/[0.08] z-10"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2.5} /> : <Eye className="h-5 w-5" strokeWidth={2.5} />}
                  </button>
                </div>

                {/* Strength indicator */}
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          strength >= level
                            ? strength === 1 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.55)]"
                              : strength === 2 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.55)]"
                              : strength === 3 ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.55)]"
                              : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.55)]"
                            : "bg-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.16em]">
                    <span className={strength > 0 ? "text-[var(--fg-muted)]" : "text-transparent"}>
                      Security Level
                    </span>
                    <span
                      className={
                        strength === 1 ? "text-red-500"
                          : strength === 2 ? "text-amber-500"
                          : strength === 3 ? "text-blue-500"
                          : strength === 4 ? "text-emerald-500"
                          : "text-transparent"
                      }
                    >
                      {form.password.length === 0 ? "None" : strength === 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, ease: EASE }}
                className="flex items-start gap-3 pt-2"
              >
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-md border-[var(--border)] text-[var(--primary)] focus:ring-2 focus:ring-brand-500/20 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <label htmlFor="terms" className="text-xs font-medium text-[var(--fg-muted)] leading-relaxed cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[var(--primary)] hover:underline underline-offset-4 decoration-2 font-bold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[var(--primary)] hover:underline underline-offset-4 decoration-2 font-bold">
                    Privacy Policy
                  </Link>.
                </label>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, ease: EASE }}
              >
                <Button
                  type="submit"
                  className="relative w-full h-14 gradient-brand text-base font-bold shadow-xl shadow-[var(--primary)]/25 hover:shadow-2xl hover:shadow-[var(--primary)]/35 hover:scale-[1.01] transition-all duration-300 rounded-xl group mt-2 overflow-hidden"
                  loading={loading}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative inline-flex items-center">
                    Create Account
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
                <span className="px-4 bg-[var(--card)] text-[var(--fg-muted)]">Or sign up with</span>
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
          </div>

          {/* Login link */}
          <p className="mt-8 text-center text-sm font-bold text-[var(--fg-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] hover:underline underline-offset-4 decoration-2 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      {/* =========================================
          RIGHT SIDE: BRANDING PANEL
          ========================================= */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="hidden lg:flex relative flex-col justify-between p-12 lg:p-20 overflow-hidden bg-[var(--bg)] border-l border-[var(--border)] order-1 lg:order-2"
      >
        {/* Dot-grid with radial mask */}
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
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[100px] pointer-events-none"
        />

        {/* Brand lockup (right-aligned) */}
        <Link href="/" className="relative z-10 flex items-center gap-4 justify-end w-max ml-auto group">
          <div className="text-right">
            <p className="font-extrabold text-2xl leading-tight gradient-text tracking-tight">Oasis BIAM</p>
            <p className="text-[10px] font-black text-[var(--fg-muted)] tracking-[0.24em] uppercase">Laboratory School</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/25 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/30 border border-white/20 ring-1 ring-inset ring-white/20 bg-white group-hover:scale-105 transition-transform duration-500">
              <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
            </div>
          </div>
        </Link>

        <div className="relative z-10 max-w-xl ml-auto text-right mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            {/* Eyebrow badge */}
            <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/60 backdrop-blur-md border border-[var(--primary)]/25 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-8 ml-auto">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Join the Future
            </div>

            <h1 className="text-5xl lg:text-6xl font-black font-display leading-[1.02] mb-8 tracking-tight">
              Start your journey with{" "}
              <span className="gradient-text">Oasis BIAM</span>.
            </h1>
            <p className="text-lg text-[var(--fg-muted)] font-medium leading-relaxed mb-12">
              Create an account to access exclusive resources, track your progress, and become part of our thriving educational community.
            </p>

            {/* Feature list */}
            <div className="space-y-5 flex flex-col items-end">
              {[
                "Instant access to the member dashboard",
                "Receive real-time school notices",
                "Apply for admission seamlessly"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-4 flex-row-reverse group/item"
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
        <div className="relative z-10 flex items-center justify-end gap-8 pt-10 border-t border-[var(--border)]/60">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 grid place-items-center">
              <Zap className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
            </div>
            Instant Access
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-black text-[var(--fg-muted)] uppercase tracking-[0.18em]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 grid place-items-center">
              <ShieldCheck className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
            </div>
            100% Secure
          </div>
        </div>
      </motion.div>
    </div>
  );
}