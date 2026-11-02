"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Save, Settings as SettingsIcon, Loader2, Building2, 
  MapPin, Phone, Mail, Globe, Facebook, Youtube, 
  Info, Sparkles, ShieldCheck, AlertTriangle 
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const r = await api.get<any>("/api/settings");
        setSettings((r as any)?.data || (r as any) || null);
      } catch (e: any) { toast.error(e?.message || "Failed to load"); }
      finally { setLoading(false); }
    }
    void loadSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const { _id, ...payload } = settings;
      await api.put("/api/settings", payload);
      toast.success("Settings saved successfully!");
    } catch (e: any) { toast.error(e?.message || "Failed to save"); }
    finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="h-40 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          <div className="h-96 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          <div className="h-60 lg:col-span-2 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="relative max-w-3xl mx-auto mt-12 py-24 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="w-24 h-24 rounded-full bg-red-500/10 ring-1 ring-red-500/20 grid place-items-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3 text-[var(--fg)]">Failed to load data</h2>
          <p className="text-sm font-medium text-[var(--fg-muted)] mb-8 max-w-sm mx-auto">
            We couldn't connect to the server to fetch your settings. Please check your connection and try again.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="h-11 px-6 rounded-xl font-bold hover:bg-[var(--bg-soft)]">
            Retry Connection
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-slate-500/10 border border-slate-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">
              <SettingsIcon className="h-3.5 w-3.5" strokeWidth={2.5} /> Configuration
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Platform Settings</h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Manage global configurations, contact details, and social media links.
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            loading={saving} 
            size="lg" 
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20 h-12 px-6 shrink-0"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Save className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Save All Settings
          </Button>
        </div>
      </motion.div>

      {/* ================= FORM GRID ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="grid lg:grid-cols-2 gap-5 lg:gap-6"
      >
        
        {/* General Information */}
        <div className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-inset ring-blue-500/20">
              <Building2 className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">General Information</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-0.5">Basic identity of the school.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">School Name</label>
              <Input value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Tagline / Motto</label>
              <Input value={settings.tagline || ""} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
              <MapPin className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Contact Information</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-0.5">How parents and visitors can reach you.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Phone</label>
              <Input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Email</label>
              <Input type="email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Address</label>
              <Textarea value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={3} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all resize-none leading-relaxed" disabled={saving} />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden lg:col-span-2">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 ring-1 ring-inset ring-indigo-500/20">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Social Media Links</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-0.5">Connect your website to your social platforms.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Facebook URL</label>
              <Input value={settings.facebook || ""} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">YouTube URL</label>
              <Input value={settings.youtube || ""} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} disabled={saving} className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl font-medium" />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="lg:col-span-2 flex justify-end pt-4 pb-8">
          <Button 
            onClick={handleSave} 
            loading={saving} 
            size="lg" 
            className="relative w-full sm:w-auto px-12 h-14 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-300 ring-1 ring-inset ring-white/20 group overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Save className="h-5 w-5 mr-2 relative" strokeWidth={2.5} /> Save All Settings
          </Button>
        </div>

      </motion.div>
    </div>
  );
}