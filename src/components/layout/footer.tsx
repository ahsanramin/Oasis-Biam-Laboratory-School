"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, Phone, Facebook, Youtube, Mail, 
  ArrowRight, Send, Sparkles, ShieldCheck, FileText 
} from "lucide-react";
import { motion } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/teachers", label: "Faculty" },
    { href: "/gallery", label: "Gallery" },
    { href: "/events", label: "Events" },
    { href: "/notices", label: "Notice Board" },
  ];

  return (
    <footer className="relative border-t border-[var(--border)] overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-fade-bottom pointer-events-none" />

      {/* ================= NEWSLETTER CTA STRIP ================= */}
      <div className="relative border-b border-[var(--border)]/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl gradient-brand text-white grid place-items-center shadow-lg shadow-[var(--primary)]/20 shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--fg)]">Stay in the loop.</h3>
              <p className="text-sm font-medium text-[var(--fg-muted)]">Get the latest news and updates directly in your inbox.</p>
            </div>
          </div>
          
          <div className="flex w-full md:w-auto relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              className="w-full md:w-80 pl-11 pr-32 h-12 rounded-xl bg-[var(--card)] border border-[var(--border)] focus:border-[var(--primary)] outline-none text-sm font-medium transition-all"
            />
            <button className="absolute right-1 top-1 bottom-1 px-5 rounded-lg gradient-brand text-white text-sm font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2">
              Subscribe <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 grid gap-12 lg:gap-8 lg:grid-cols-12">
        
        {/* Column 1: Brand (5 Cols) */}
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-[var(--primary)]/20 group-hover:scale-105 transition-transform bg-white border border-[var(--border)]">
              <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized />
            </div>
            <div>
              <p className="font-extrabold text-2xl gradient-text leading-tight">Oasis BIAM</p>
              <p className="text-[10px] font-bold text-[var(--fg-muted)] tracking-[0.2em] uppercase">Laboratory School</p>
            </div>
          </Link>
          
          <p className="text-sm font-medium text-[var(--fg-muted)] leading-relaxed mb-8 max-w-sm">
            English version of the National Curriculum. Governed by the District Administration Netrokona &amp; BIAM Foundation since 2003.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/oasisbiam.netrakona/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-11 h-11 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://www.youtube.com/@OASIS-BIAMLaboratorySchool" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group w-11 h-11 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/30"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="mailto:info@oasisbiam.edu.bd" 
              className="group w-11 h-11 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--primary)]/30"
              aria-label="Email"
            >
              <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links (3 Cols) */}
        <div className="lg:col-span-3">
          <h4 className="font-black mb-6 uppercase tracking-[0.15em] text-xs text-[var(--fg)]">Quick Links</h4>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link 
                  href={l.href} 
                  className="group flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors"
                >
                  <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Info (4 Cols) */}
        <div className="lg:col-span-4">
          <h4 className="font-black mb-6 uppercase tracking-[0.15em] text-xs text-[var(--fg)]">Contact Us</h4>
          <ul className="space-y-4 text-sm font-bold text-[var(--fg-muted)]">
            <li>
              <a href="https://maps.google.com/?q=Barhatta+Road,+Netrokona" target="_blank" rel="noopener noreferrer" className="flex gap-3 group hover:text-[var(--primary)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/30 group-hover:bg-[var(--primary)]/5 transition-colors">
                  <MapPin className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <span className="pt-1.5">Barhatta Road, Netrokona, 2400</span>
              </a>
            </li>
            <li>
              <a href="tel:+8801724483490" className="flex gap-3 group hover:text-[var(--primary)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/30 group-hover:bg-[var(--primary)]/5 transition-colors">
                  <Phone className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <span className="pt-1.5">01724-483490</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@oasisbiam.edu.bd" className="flex gap-3 group hover:text-[var(--primary)] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/30 group-hover:bg-[var(--primary)]/5 transition-colors">
                  <Mail className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <span className="pt-1.5">info@oasisbiam.edu.bd</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-[var(--border)] bg-[var(--bg-soft)]/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <p className="text-xs font-bold text-[var(--fg-muted)] order-2 md:order-1">
            © {currentYear} Oasis BIAM Laboratory School. Crafted by <span className="gradient-text font-black">Ahsan Labib Ramin</span>.
          </p>

          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link href="/privacy" className="text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Terms of Service
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}