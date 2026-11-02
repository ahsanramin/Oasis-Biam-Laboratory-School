"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Phone, Facebook, Youtube, Mail,
  ArrowRight, Send, Sparkles, ShieldCheck, FileText
} from "lucide-react";
import { motion } from "framer-motion";

const LOGO = "https://i.ibb.co.com/7NzsPGvc/logo.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

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

      {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)",
        }}
      />

      {/* ================= NEWSLETTER CTA STRIP ================= */}
      <div className="relative border-b border-[var(--border)]/60">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Icon + copy */}
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl gradient-brand text-white grid place-items-center shadow-lg shadow-brand-500/25 shrink-0 ring-1 ring-inset ring-white/25">
              {/* Inner sheen */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
              <Sparkles className="h-6 w-6 relative" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--fg)] tracking-tight">Stay in the loop.</h3>
              <p className="text-sm font-medium text-[var(--fg-muted)] leading-relaxed">
                Get the latest news and updates directly in your inbox.
              </p>
            </div>
          </div>

          {/* Right: Newsletter input */}
          <div className="flex w-full md:w-auto relative group">
            {/* Focus aura */}
            <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/20 via-transparent to-amber-500/20 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
              strokeWidth={2.5}
            />
            <input
              type="email"
              placeholder="Enter your email address..."
              className="relative w-full md:w-80 pl-11 pr-32 h-12 rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 outline-none text-sm font-medium transition-all duration-300"
            />
            <button className="relative absolute right-1 top-1 bottom-1 px-5 rounded-lg gradient-brand text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 ring-1 ring-inset ring-white/20 overflow-hidden group/sub">
              {/* Sheen sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/sub:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative">Subscribe</span>
              <Send className="h-3.5 w-3.5 relative" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 grid gap-12 lg:gap-8 lg:grid-cols-12">

        {/* Column 1: Brand (5 Cols) */}
        <div className="lg:col-span-5">

          {/* Brand lockup */}
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative">
              {/* Logo glow */}
              <div className="absolute inset-0 -m-1 rounded-2xl bg-[var(--primary)]/25 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/25 group-hover:scale-105 transition-transform duration-500 bg-white border border-[var(--border)] ring-1 ring-inset ring-white/20">
                <Image src={LOGO} alt="Oasis BIAM" fill className="object-cover" unoptimized />
              </div>
            </div>
            <div>
              <p className="font-extrabold text-2xl gradient-text leading-tight tracking-tight">Oasis BIAM</p>
              <p className="text-[10px] font-black text-[var(--fg-muted)] tracking-[0.24em] uppercase">Laboratory School</p>
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
              className="group relative w-11 h-11 rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[var(--fg-muted)] hover:text-white hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 hover:ring-blue-500/30"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
            </a>
            <a
              href="https://www.youtube.com/@OASIS-BIAMLaboratorySchool"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-11 h-11 rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[var(--fg-muted)] hover:text-white hover:bg-red-600 hover:border-red-600 flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-600/30 hover:ring-red-500/30"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
            </a>
            <a
              href="mailto:info@oasisbiam.edu.bd"
              className="group relative w-11 h-11 rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[var(--fg-muted)] hover:text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] flex items-center justify-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--primary)]/30 hover:ring-[var(--primary)]/30"
              aria-label="Email"
            >
              <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links (3 Cols) */}
        <div className="lg:col-span-3">
          <h4 className="font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-[var(--fg)]">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors duration-300 tracking-tight"
                >
                  <ArrowRight
                    className="h-3 w-3 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                    strokeWidth={2.5}
                  />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact Info (4 Cols) */}
        <div className="lg:col-span-4">
          <h4 className="font-black mb-6 uppercase tracking-[0.2em] text-[10px] text-[var(--fg)]">
            Contact Us
          </h4>
          <ul className="space-y-4 text-sm font-bold text-[var(--fg-muted)]">
            <li>
              <a
                href="https://maps.google.com/?q=Barhatta+Road,+Netrokona"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 group hover:text-[var(--primary)] transition-colors duration-300"
              >
                <div className="relative w-8 h-8 rounded-lg bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/40 group-hover:bg-[var(--primary)]/5 group-hover:ring-[var(--primary)]/20 transition-all duration-300">
                  <MapPin className="h-4 w-4 text-[var(--primary)]" strokeWidth={2.5} />
                </div>
                <span className="pt-1.5 tracking-tight">Barhatta Road, Netrokona, 2400</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+8801724483490"
                className="flex gap-3 group hover:text-[var(--primary)] transition-colors duration-300"
              >
                <div className="relative w-8 h-8 rounded-lg bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/40 group-hover:bg-[var(--primary)]/5 group-hover:ring-[var(--primary)]/20 transition-all duration-300">
                  <Phone className="h-4 w-4 text-[var(--primary)]" strokeWidth={2.5} />
                </div>
                <span className="pt-1.5 tracking-tight">01724-483490</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:info@oasisbiam.edu.bd"
                className="flex gap-3 group hover:text-[var(--primary)] transition-colors duration-300"
              >
                <div className="relative w-8 h-8 rounded-lg bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] grid place-items-center shrink-0 group-hover:border-[var(--primary)]/40 group-hover:bg-[var(--primary)]/5 group-hover:ring-[var(--primary)]/20 transition-all duration-300">
                  <Mail className="h-4 w-4 text-[var(--primary)]" strokeWidth={2.5} />
                </div>
                <span className="pt-1.5 tracking-tight break-all">info@oasisbiam.edu.bd</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-[var(--border)] bg-[var(--bg-soft)]/40 backdrop-blur-sm">

        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-[11px] font-bold text-[var(--fg-muted)] order-2 md:order-1 tracking-wide">
            © {currentYear} Oasis BIAM Laboratory School. Crafted by{" "}
            <span className="gradient-text font-black">Ahsan Labib Ramin</span>.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link
              href="/privacy"
              className="group text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors duration-300 flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="group text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] hover:text-[var(--primary)] transition-colors duration-300 flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              Terms of Service
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
}