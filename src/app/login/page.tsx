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
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  ShieldCheck, CheckCircle2, Sparkles, ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // =========================================
  // EMAIL / PASSWORD LOGIN
  // =========================================
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email, password });
      
      if (res.error) throw new Error(res.error.message);
      
      // Safely check role to route correctly
      const userRole = (res.data?.user as { role?: string })?.role;
      
      if (userRole === "admin") {
        toast.success("Welcome back, Admin!");
        router.push("/dashboard/admin");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
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
      // Dynamically gets the exact frontend domain (works for localhost & Vercel)
      const origin = window.location.origin; 
      
      await authClient.signIn.social({ 
        provider: "google", 
        // After successful Google auth, Better Auth will redirect here
        callbackURL: `${origin}/dashboard`,
        // If it fails, redirect back to login
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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex relative flex-col justify-between p-12 lg:p-20 overflow-hidden border-r border-[var(--border)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[100px] pointer-events-none" 
        />

        <Link href="/" className="relative z-10 flex items-center gap-4 w-max group">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-[var(--primary)]/30 border border-white/10 bg-white group-hover:scale-105 transition-transform duration-300">
            <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
          </div>
          <div>
            <p className="font-extrabold text-2xl leading-tight gradient-text">Oasis BIAM</p>
            <p className="text-[11px] font-bold text-[var(--fg-muted)] tracking-[0.2em] uppercase">Laboratory School</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-xl mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-8">
              <Sparkles className="h-4 w-4" /> The Future is Here
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black font-display leading-[1.05] mb-8 tracking-tight">
              Welcome back to the <span className="gradient-text">future</span> of education.
            </h1>
            <p className="text-lg text-[var(--fg-muted)] font-medium leading-relaxed mb-12">
              Log in to manage your dashboard, access exclusive school resources, and stay connected with the Oasis BIAM community.
            </p>

            <div className="space-y-5">
              {[
                "Access your personalized dashboard",
                "Manage notices, articles, and events",
                "Secure, role-based authentication"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 grid place-items-center">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <span className="text-base font-bold text-[var(--fg)]">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-8 pt-10 border-t border-[var(--border)]/50">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
            <ShieldCheck className="h-5 w-5 text-emerald-500" /> Bank-Level Security
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
            <Lock className="h-5 w-5 text-blue-500" /> 256-Bit Encryption
          </div>
        </div>
      </motion.div>

      {/* =========================================
          RIGHT SIDE: LOGIN FORM
          ========================================= */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] lg:hidden pointer-events-none" />
        
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] z-20">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="relative p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

            <div className="text-center mb-8">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow bg-white border border-[var(--border)]">
                  <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
                </div>
              </div>
              <h2 className="text-3xl font-black font-display tracking-tight mb-2">Sign In</h2>
              <p className="text-[var(--fg-muted)] text-sm font-medium">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="admin@oasisbiam.edu" 
                    className="pl-12 h-14 bg-[var(--bg-soft)] border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all text-base rounded-xl" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Password</label>
                  <Link href="#" className="text-xs font-bold text-[var(--primary)] hover:underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-12 pr-12 h-14 bg-[var(--bg-soft)] border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all text-base rounded-xl tracking-widest" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-3">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer" />
                <label htmlFor="remember" className="text-sm font-bold text-[var(--fg-muted)] cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button type="submit" className="w-full h-14 gradient-brand text-lg font-bold shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] transition-transform rounded-xl group" loading={loading}>
                  Sign In <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                <span className="px-4 bg-[var(--card)] text-[var(--fg-muted)]">Or continue with</span>
              </div>
            </div>

            <Button variant="outline" size="lg" className="w-full h-14 bg-[var(--bg-soft)] hover:bg-[var(--border)] border-transparent font-bold text-base rounded-xl transition-colors" onClick={handleGoogle} loading={googleLoading} type="button">
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <p className="mt-8 text-center text-sm font-bold text-[var(--fg-muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--primary)] hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}