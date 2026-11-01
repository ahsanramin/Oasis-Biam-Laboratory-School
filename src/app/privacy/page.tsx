"use client";

import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Eye, Database, Cookie, 
  UserCheck, Mail, ArrowRight, ShieldAlert 
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

export default function PrivacyPage() {
  return (
    <>
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Last updated: January 2026" 
        breadcrumbs={[{ label: "Privacy" }]} 
      />
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* ================= LEFT SIDEBAR (STICKY TOC) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <div className="p-6 rounded-[2rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--fg-muted)] mb-5 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--primary)]" /> Table of Contents
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
              <h4 className="font-bold text-lg mb-2 relative z-10">Have concerns?</h4>
              <p className="text-white/80 text-sm mb-5 relative z-10">If you have any questions about how your data is handled, our team is here to help.</p>
              <Link href="/contact">
                <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white hover:text-[var(--primary)] relative z-10">
                  Contact Support <ArrowRight className="h-4 w-4 ml-2" />
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
            <h2 className="text-3xl font-black font-display mb-4">Your privacy matters.</h2>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed">
              At Oasis BIAM Laboratory School, we are committed to protecting the personal information of our students, parents, and visitors. This policy outlines how we collect, use, and safeguard your data.
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
                // 🔧 FIX: scroll-mt-32 prevents the sticky header from covering the section title when scrolling via TOC
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