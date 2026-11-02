"use client";

import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import {
  FileCheck2, Copyright, User, GraduationCap,
  Scale, RefreshCw, ArrowRight, ShieldAlert, Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Data structure to keep the code clean and render both the TOC and the content
const SECTIONS = [
  {
    id: "acceptance-of-terms",
    icon: FileCheck2,
    title: "1. Acceptance of Terms",
    content: "By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations."
  },
  {
    id: "use-of-content",
    icon: Copyright,
    title: "2. Use of Content",
    content: "All content on this website is provided by Oasis BIAM Laboratory School for informational purposes. You may not reproduce, distribute, or modify our content without written permission."
  },
  {
    id: "user-accounts",
    icon: User,
    title: "3. User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
  },
  {
    id: "admission",
    icon: GraduationCap,
    title: "4. Admission",
    content: "Submission of an admission application does not guarantee enrollment. All admissions are subject to assessment and available capacity."
  },
  {
    id: "limitation-of-liability",
    icon: Scale,
    title: "5. Limitation of Liability",
    content: "We are not liable for any damages arising from the use or inability to use this website."
  },
  {
    id: "changes-to-terms",
    icon: RefreshCw,
    title: "6. Changes to Terms",
    content: "We reserve the right to update these Terms at any time. Changes take effect immediately upon posting."
  }
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms of Service"
        subtitle="Last updated: January 2026"
        breadcrumbs={[{ label: "Terms" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16 overflow-hidden">

        {/* ===== Layered ambient background ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -right-24 w-[560px] h-[560px] bg-amber-500/[0.06] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-brand-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        </div>

        {/* ================= LEFT SIDEBAR (STICKY TOC) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-5">

            {/* TOC Card */}
            <div className="relative p-6 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.04] overflow-hidden">

              {/* Top hairline */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

              {/* Corner glow (amber to differentiate from Privacy) */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/[0.08] rounded-full blur-2xl pointer-events-none" />

              {/* Header */}
              <h3 className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-5 flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-500 grid place-items-center">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                  <ShieldAlert className="h-4 w-4 relative" strokeWidth={2.5} />
                </div>
                On this page
              </h3>

              {/* Nav items */}
              <nav className="relative space-y-1">
                {SECTIONS.map((section, i) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group/nav flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[12px] font-bold text-[var(--fg-muted)] hover:text-amber-500 hover:bg-amber-500/[0.06] border border-transparent hover:border-amber-500/25 transition-all duration-300"
                  >
                    <span className="shrink-0 text-[10px] font-black text-[var(--fg-muted)]/60 tabular-nums tracking-tighter group-hover/nav:text-amber-500/70 transition-colors">
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
            <div className="relative p-6 rounded-[2rem] bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white shadow-2xl shadow-amber-500/25 overflow-hidden group">

              {/* Top hairline */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {/* Decorative glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.12] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[900ms] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-500/[0.15] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-[900ms] pointer-events-none" />

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
                §
              </div>

              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2 tracking-tight drop-shadow-sm">Need clarification?</h4>
                <p className="text-white/85 text-sm mb-5 leading-relaxed font-medium">
                  If you have any questions about our terms, our administration team is here to help.
                </p>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full bg-white/15 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-amber-600 hover:border-white rounded-xl font-bold ring-1 ring-inset ring-white/25 transition-all duration-300 group/cta"
                  >
                    Contact Us
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
            {/* Top hairline (amber accent for differentiation) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />

            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Ghost watermark */}
            <div className="absolute top-4 right-6 text-[120px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter">
              §
            </div>

            <div className="relative">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
                <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Legal Agreement
              </div>

              <h2 className="text-3xl lg:text-4xl font-black font-display mb-4 tracking-tight leading-tight">
                Our commitment <span className="gradient-text">to you.</span>
              </h2>
              <p className="text-base text-[var(--fg-muted)] leading-relaxed font-medium">
                Please read these Terms of Service carefully before using the Oasis BIAM Laboratory School website. By accessing or using our services, you agree to be bound by these terms.
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
                // scroll-mt-32 prevents the sticky header from covering the title
                className="scroll-mt-32 relative group"
              >
                {/* Outer hover aura (amber-tinted) */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-amber-500/[0.1] via-transparent to-brand-500/[0.05] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-amber-500/40 hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 overflow-hidden">

                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                  {/* Corner glow (amber) */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Ghost number watermark */}
                  <div className="absolute top-3 right-6 text-[80px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter group-hover:text-[var(--fg)]/[0.04] transition-colors duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative">
                    {/* Header row */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative shrink-0 w-12 h-12 rounded-2xl bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] grid place-items-center text-amber-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-amber-500/10 group-hover:ring-amber-500/25 transition-all duration-500">
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
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>
    </>
  );
}