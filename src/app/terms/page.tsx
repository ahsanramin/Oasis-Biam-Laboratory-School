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

export default function TermsPage() {
  return (
    <>
      <PageHeader 
        title="Terms of Service" 
        subtitle="Last updated: January 2026" 
        breadcrumbs={[{ label: "Terms" }]} 
      />
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* ================= LEFT SIDEBAR (STICKY TOC) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            
            <div className="p-6 rounded-[2rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--fg-muted)] mb-5 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--primary)]" /> On this page
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 border border-transparent hover:border-[var(--primary)]/20"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>

            {/* Need Help CTA */}
            <div className="p-6 rounded-[2rem] gradient-brand text-white shadow-xl shadow-[var(--primary)]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <h4 className="font-bold text-lg mb-2 relative z-10">Need clarification?</h4>
              <p className="text-white/80 text-sm mb-5 relative z-10">If you have any questions about our terms, our administration team is here to help.</p>
              <Link href="/contact">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-[var(--primary)] relative z-10">
                  Contact Us <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-sm mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-4">
              <Sparkles className="h-4 w-4" /> Legal Agreement
            </div>
            <h2 className="text-3xl font-black font-display mb-4">Our commitment to you.</h2>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed">
              Please read these Terms of Service carefully before using the Oasis BIAM Laboratory School website. By accessing or using our services, you agree to be bound by these terms.
            </p>
          </motion.div>

          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                // scroll-mt-32 prevents the sticky header from covering the title
                className="scroll-mt-32 p-8 sm:p-10 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] grid place-items-center text-[var(--primary)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--fg)]">
                    {section.title}
                  </h3>
                </div>
                <p className="text-lg text-[var(--fg-muted)] leading-loose pl-0 sm:pl-16">
                  {section.content}
                </p>
              </motion.div>
            );
          })}
        </div>

      </section>
    </>
  );
}