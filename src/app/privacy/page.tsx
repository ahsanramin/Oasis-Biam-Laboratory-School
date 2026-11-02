"use client";

import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import {
  ShieldCheck, Eye, Database, Cookie,
  UserCheck, Mail, ArrowRight, ShieldAlert, Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Data structure to keep the code clean and render both the TOC and the content
const SECTIONS = [
  {
    id: "information-we-collect",
    icon: Eye,
    title: "1. Information We Collect",
    content: "Oasis BIAM Laboratory School collects information you voluntarily provide when using our website — such as your name, email, phone, and messages when you fill out contact or admission forms."
  },
  {
    id: "how-we-use-it",
    icon: Database,
    title: "2. How We Use Your Information",
    content: "We use your information to respond to inquiries, process admission applications, send school notices, and improve our services. We never sell your data to third parties."
  },
  {
    id: "data-security",
    icon: ShieldCheck,
    title: "3. Data Security",
    content: "Your data is stored securely using industry-standard encryption and access controls. Only authorized administrators may access it."
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "4. Cookies",
    content: "We use cookies to keep you signed in and to remember your theme preferences. You can disable cookies in your browser at any time."
  },
  {
    id: "your-rights",
    icon: UserCheck,
    title: "5. Your Rights",
    content: "You may request deletion of your data at any time by contacting us. We will respond within 30 days."
  },
  {
    id: "contact",
    icon: Mail,
    title: "6. Contact Us",
    content: "For privacy questions, please contact us via the Contact page or email us at info@oasisbiam.edu.bd."
  }
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Last updated: January 2026"
        breadcrumbs={[{ label: "Privacy" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -right-24 w-[560px] h-[560px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= LEFT SIDEBAR (STICKY TOC) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-5">

            {/* TOC Card */}
            <div className="relative p-6 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.04] overflow-hidden">

              {/* Top hairline */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

              {/* Corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/[0.06] rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <h3 className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-5 flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500 grid place-items-center">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                  <ShieldAlert className="h-4 w-4 relative" strokeWidth={2.5} />
                </div>
                Table of Contents
              </h3>

              {/* Nav items */}
              <nav className="relative space-y-1">
                {SECTIONS.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group/nav flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/[0.06] border border-transparent hover:border-[var(--primary)]/20 transition-all duration-300"
                  >
                    <span className="shrink-0 text-[10px] font-black text-[var(--fg-muted)]/60 tabular-nums tracking-tighter group-hover/nav:text-[var(--primary)]/70 transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="tracking-tight leading-snug group-hover/nav:translate-x-0.5 transition-transform duration-300">
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Need Help CTA */}
            <div className="relative p-6 rounded-[2rem] gradient-brand text-white shadow-2xl shadow-brand-500/25 overflow-hidden group">

              {/* Top hairline */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {/* Decorative glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.12] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[900ms] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/[0.15] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-[900ms] pointer-events-none" />

              {/* Dot grid texture */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Ghost watermark */}
              <div className="absolute -bottom-4 -right-2 text-[120px] font-black leading-none text-white/[0.06] select-none pointer-events-none tracking-tighter">
                ★
              </div>

              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2 tracking-tight drop-shadow-sm">Have concerns?</h4>
                <p className="text-white/85 text-sm mb-5 leading-relaxed font-medium">
                  If you have any questions about how your data is handled, our team is here to help.
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full bg-white/10 backdrop-blur-md border-white/25 text-white hover:bg-white hover:text-[var(--primary)] hover:border-white rounded-xl font-bold ring-1 ring-inset ring-white/20 transition-all duration-300 group/cta"
                  >
                    Contact Support
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/cta:translate-x-1" strokeWidth={2.5} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="lg:col-span-8 space-y-5">

          {/* Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.04] mb-10 overflow-hidden"
          >
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent pointer-events-none" />

            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Ghost watermark */}
            <div className="absolute top-4 right-6 text-[120px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter">
              §
            </div>

            <div className="relative">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 ring-1 ring-brand-500/20 text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] mb-4">
                <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Our Commitment
              </div>

              <h2 className="text-3xl lg:text-4xl font-black font-display mb-4 tracking-tight leading-tight">
                Your privacy <span className="gradient-text">matters.</span>
              </h2>
              <p className="text-base text-[var(--fg-muted)] leading-relaxed font-medium">
                At Oasis BIAM Laboratory School, we are committed to protecting the personal information of our students, parents, and visitors. This policy outlines how we collect, use, and safeguard your data.
              </p>
            </div>
          </motion.div>

          {/* Section Cards */}
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
                // 🔧 FIX: scroll-mt-32 prevents the sticky header from covering the section title when scrolling via TOC
                className="scroll-mt-32 relative group"
              >
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-blue-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 overflow-hidden">

                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                  {/* Corner glow */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-500/[0.05] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Ghost number watermark */}
                  <div className="absolute top-3 right-6 text-[80px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.04] transition-colors duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative">
                    {/* Header row */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative shrink-0 w-12 h-12 rounded-2xl bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] grid place-items-center text-[var(--primary)] group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-brand-500/10 group-hover:ring-brand-500/25 transition-all duration-500">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                        <Icon className="h-5 w-5 relative" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--fg)] tracking-tight leading-snug">
                        {section.title}
                      </h3>
                    </div>

                    {/* Body */}
                    <p className="text-[15px] sm:text-base text-[var(--fg-muted)] leading-[1.85] sm:pl-16 font-medium">
                      {section.content}
                    </p>
                  </div>

                  {/* Animated base accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/50 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>
    </>
  );
}