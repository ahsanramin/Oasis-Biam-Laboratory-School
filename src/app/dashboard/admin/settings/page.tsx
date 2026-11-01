"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Settings as SettingsIcon, Loader2, Building2, MapPin, Phone, Mail, Globe, Facebook, Youtube, Info, Sparkles } from "lucide-react";

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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-40 rounded-3xl bg-[var(--card)] animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-96 rounded-3xl bg-[var(--card)] animate-pulse" />
          <div className="h-96 rounded-3xl bg-[var(--card)] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return <div className="max-w-4xl mx-auto mt-12 text-center p-12 border-2 border-dashed border-red-500/20 rounded-3xl bg-red-500/5"><Info className="h-12 w-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-red-600 mb-1">Failed to load data</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-slate-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-xs font-semibold text-slate-600 uppercase tracking-widest">
              <SettingsIcon className="h-3.5 w-3.5" /> Configuration
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Platform Settings</h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">Manage global configurations, contact details, and social media links.</p>
          </div>
          <Button onClick={handleSave} loading={saving} size="lg" className="shadow-lg"><Save className="h-4 w-4 mr-2" /> Save All Settings</Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Building2 className="h-5 w-5" /></div>
            <div><h2 className="font-bold text-lg">General Information</h2><p className="text-xs text-[var(--fg-muted)]">Basic identity of the school.</p></div>
          </div>
          <div className="space-y-4">
            <div><label className="text-sm font-semibold mb-1.5 block">School Name</label><Input value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} disabled={saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Tagline / Motto</label><Input value={settings.tagline || ""} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} disabled={saving} /></div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><MapPin className="h-5 w-5" /></div>
            <div><h2 className="font-bold text-lg">Contact Information</h2><p className="text-xs text-[var(--fg-muted)]">How parents and visitors can reach you.</p></div>
          </div>
          <div className="space-y-4">
            <div><label className="text-sm font-semibold mb-1.5 block">Phone</label><Input value={settings.phone || ""} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} disabled={saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Email</label><Input type="email" value={settings.email || ""} onChange={(e) => setSettings({ ...settings, email: e.target.value })} disabled={saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">Address</label><Textarea value={settings.address || ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={3} className="resize-none" disabled={saving} /></div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500"><Sparkles className="h-5 w-5" /></div>
            <div><h2 className="font-bold text-lg">Social Media Links</h2><p className="text-xs text-[var(--fg-muted)]">Connect your website to your social platforms.</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-semibold mb-1.5 block">Facebook URL</label><Input value={settings.facebook || ""} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} disabled={saving} /></div>
            <div><label className="text-sm font-semibold mb-1.5 block">YouTube URL</label><Input value={settings.youtube || ""} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} disabled={saving} /></div>
          </div>
        </Card>

        <div className="lg:col-span-2 flex justify-end pb-8">
          <Button onClick={handleSave} loading={saving} size="lg" className="w-full sm:w-auto px-12"><Save className="h-4 w-4 mr-2" /> Save All Settings</Button>
        </div>
      </motion.div>
    </div>
  );
}