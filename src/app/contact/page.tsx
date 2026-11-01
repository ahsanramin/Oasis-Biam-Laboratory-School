"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
  MapPin, Mail, Phone, Send, Clock, 
  MessageSquare, CheckCircle2, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // 🔧 FIX: api.post throws on failure, so no need for r.success check
      await api.post("/api/contacts", form);
      toast.success("Message sent! We'll get back to you soon.");
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader 
        title="Contact Us" 
        subtitle="We'd love to hear from you. Our doors are always open." 
        breadcrumbs={[{ label: "Contact" }]} 
      />
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 lg:gap-20 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* ================= LEFT COLUMN: INFO ================= */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-6 w-max">
            <MessageSquare className="h-3.5 w-3.5" /> Get In Touch
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black font-display leading-tight mb-6">
            Let's start a <span className="gradient-text">conversation.</span>
          </h2>
          <p className="text-[var(--fg-muted)] text-lg mb-10 leading-relaxed">
            Whether you're a parent, a prospective student, or a community member — we are here to help. Reach out to us through any of these channels.
          </p>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Visit Campus", value: "Barhatta Road, Netrokona, Bangladesh, 2400", href: "#" },
              { icon: Mail, label: "Email Us", value: "info@oasisbiam.edu.bd", href: "mailto:info@oasisbiam.edu.bd" },
              { icon: Phone, label: "Call Us", value: "+880 1724-483490", href: "tel:+8801724483490" },
              { icon: Clock, label: "Office Hours", value: "Sun - Thu, 8:00 AM - 4:00 PM", href: "#" },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.a 
                  key={i} 
                  href={c.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-5 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-soft)] hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all group cursor-pointer"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl gradient-brand grid place-items-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-1">{c.label}</p>
                    <p className="font-semibold text-[var(--fg)] text-sm sm:text-base group-hover:text-[var(--primary)] transition-colors">{c.value}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* ================= RIGHT COLUMN: FORM ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/5 relative overflow-hidden">
            {/* Form Top Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-[var(--primary)] to-amber-500" />
            
            <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
            <p className="text-sm text-[var(--fg-muted)] mb-8">We usually respond within 24 hours.</p>

            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg-muted)] ml-1">Your Name <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="John Doe" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                    className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] transition-colors h-12"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg-muted)] ml-1">Email Address <span className="text-red-500">*</span></label>
                  <Input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                    className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] transition-colors h-12"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg-muted)] ml-1">Phone Number</label>
                  <Input 
                    placeholder="+880 1XXX-XXXXXX" 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] transition-colors h-12"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--fg-muted)] ml-1">Subject</label>
                  <Input 
                    placeholder="Admission Inquiry" 
                    value={form.subject} 
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                    className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] transition-colors h-12"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--fg-muted)] ml-1">Your Message <span className="text-red-500">*</span></label>
                <Textarea 
                  placeholder="How can we help you today?" 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  required 
                  rows={5} 
                  className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] focus:border-[var(--primary)] transition-colors resize-none"
                />
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                size="lg" 
                className={`w-full h-14 text-lg font-bold rounded-xl mt-4 transition-all duration-300 ${
                  submitted ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "gradient-brand shadow-glow hover:scale-[1.01]"
                }`}
              >
                {submitted ? (
                  <><CheckCircle2 className="h-5 w-5 mr-2" /> Message Sent Successfully!</>
                ) : loading ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-5 w-5 mr-2" /> Send Message</>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </section>
    </>
  );
}