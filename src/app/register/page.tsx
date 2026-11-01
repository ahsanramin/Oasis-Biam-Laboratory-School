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
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden order-2 lg:order-1"
      >
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--primary)]/10 rounded-full blur-[100px] lg:hidden pointer-events-none" />
        
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--fg)] z-20">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="w-full max-w-[440px] relative z-10">
          <div className="text-center mb-8">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-glow bg-white border border-[var(--border)]">
                <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight mb-2">Create Account</h2>
            <p className="text-[var(--fg-muted)] text-sm font-medium">Join the Oasis BIAM community today.</p>
          </div>

          <div className="relative p-6 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <Input 
                    placeholder="e.g. Ahsan Labib" 
                    className="pl-12 h-14 bg-[var(--bg-soft)] border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all text-base rounded-xl" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    className="pl-12 h-14 bg-[var(--bg-soft)] border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all text-base rounded-xl" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--fg-muted)]">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min. 8 characters" 
                    className="pl-12 pr-12 h-14 bg-[var(--bg-soft)] border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--bg)] transition-all text-base rounded-xl tracking-widest" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required 
                    minLength={8} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          strength >= level 
                            ? strength === 1 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                              : strength === 2 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                              : strength === 3 ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                              : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            : "bg-[var(--border)]"
                        }`} 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className={strength > 0 ? "text-[var(--fg)]" : "text-transparent"}>Security Level</span>
                    <span className={strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-blue-500" : strength === 4 ? "text-emerald-500" : "text-transparent"}>
                      {form.password.length === 0 ? "None" : strength === 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer" 
                />
                <label htmlFor="terms" className="text-xs font-medium text-[var(--fg-muted)] leading-relaxed cursor-pointer select-none">
                  I agree to the <Link href="/terms" className="text-[var(--primary)] hover:underline font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--primary)] hover:underline font-bold">Privacy Policy</Link>.
                </label>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Button 
                  type="submit" 
                  className="w-full h-14 gradient-brand text-lg font-bold shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] transition-transform rounded-xl group mt-2" 
                  loading={loading}
                >
                  Create Account <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                <span className="px-4 bg-[var(--card)] text-[var(--fg-muted)]">Or sign up with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 bg-[var(--bg-soft)] hover:bg-[var(--border)] border-transparent font-bold text-base rounded-xl transition-colors" 
              onClick={handleGoogle} 
              loading={googleLoading} 
              type="button"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm font-bold text-[var(--fg-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--primary)] hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="hidden lg:flex relative flex-col justify-between p-12 lg:p-20 overflow-hidden bg-[var(--bg)] border-l border-[var(--border)] order-1 lg:order-2"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[var(--primary)] rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[100px] pointer-events-none" 
        />

        <Link href="/" className="relative z-10 flex items-center gap-4 justify-end w-max ml-auto group">
          <div className="text-right">
            <p className="font-extrabold text-2xl leading-tight gradient-text">Oasis BIAM</p>
            <p className="text-[11px] font-bold text-[var(--fg-muted)] tracking-[0.2em] uppercase">Laboratory School</p>
          </div>
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-[var(--primary)]/30 border border-white/10 bg-white group-hover:scale-105 transition-transform duration-300">
            <Image src={LOGO} alt="Logo" fill className="object-cover" unoptimized />
          </div>
        </Link>

        <div className="relative z-10 max-w-xl ml-auto text-right mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-8 ml-auto">
              <Sparkles className="h-4 w-4" /> Join the Future
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black font-display leading-[1.05] mb-8 tracking-tight">
              Start your journey with <span className="gradient-text">Oasis BIAM</span>.
            </h1>
            <p className="text-lg text-[var(--fg-muted)] font-medium leading-relaxed mb-12">
              Create an account to access exclusive resources, track your progress, and become part of our thriving educational community.
            </p>

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
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                  className="flex items-center gap-4 flex-row-reverse"
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

        <div className="relative z-10 flex items-center justify-end gap-8 pt-10 border-t border-[var(--border)]/50">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
            <Zap className="h-5 w-5 text-amber-500" /> Instant Access
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-muted)] uppercase tracking-wider">
            <ShieldCheck className="h-5 w-5 text-emerald-500" /> 100% Secure
          </div>
        </div>
      </motion.div>
    </div>
  );
}