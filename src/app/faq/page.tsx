"use client";

import { useEffect, useState, useMemo } from "react";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown, Search, HelpCircle, MessageSquare,
  GraduationCap, BookOpen, Building2, ShieldCheck, Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- FALLBACK DATA (Used if database is empty) ---
const DEFAULT_FAQS = [
  { _id: "f1", category: "Admission", question: "How do I apply for admission for the 2027 session?", answer: "You can apply online through our Admission page. Simply fill out the application form with the required details. Once submitted, our admissions team will contact you to schedule the assessment and interview." },
  { _id: "f2", category: "Admission", question: "What is the age requirement for Play Group?", answer: "For admission to the Play Group, the child must be between 3.5 to 4.5 years old by the start of the academic session." },
  { _id: "f3", category: "Admission", question: "Are there any entrance exams for Class I to VII?", answer: "Yes, students applying for Class I to VII must take a brief written assessment in English, Mathematics, and Science (where applicable) to determine their placement and readiness." },
  { _id: "f4", category: "Academics", question: "Which curriculum does Oasis BIAM follow?", answer: "We strictly follow the English Version of the National Curriculum, approved by the Ministry of Education, Bangladesh. We offer classes from Play to Class VII." },
  { _id: "f5", category: "Academics", question: "What are the school timings?", answer: "The school operates from 8:00 AM to 2:00 PM, Sunday through Thursday. Friday and Saturday are the weekly holidays." },
  { _id: "f6", category: "Academics", question: "How do you ensure student safety on campus?", answer: "We have a strict security protocol with CCTV monitoring, trained security guards, and a secure pick-up/drop-off system. Parents are only allowed inside after checking in at the main gate." },
  { _id: "f7", category: "Facilities", question: "Do you provide school transport?", answer: "Yes, we operate a fleet of safe and secure school buses covering the major residential areas of Netrokona town. You can select this option during the admission process." },
  { _id: "f8", category: "Facilities", question: "Is there a science lab and computer lab?", answer: "Absolutely. We have fully equipped Science Labs for Physics, Chemistry, and Biology, as well as a modern Computer Lab where students learn coding and basic IT skills." },
  { _id: "f9", category: "Facilities", question: "How large is the school library?", answer: "Our library boasts over 5,000 books, including academic resources, reference materials, encyclopedias, and a vast collection of English literature and children's storybooks." },
  { _id: "f10", category: "General", question: "Who governs the school?", answer: "The school is governed by the District Administration of Netrokona and the BIAM Foundation, ensuring high standards of education and transparent management." },
  { _id: "f11", category: "General", question: "How can I contact the school administration?", answer: "You can call us at 01724-483490, email us at info@oasisbiam.edu.bd, or visit our campus at Barhatta Road, Netrokona during office hours." },
  { _id: "f12", category: "General", question: "Does the school offer any scholarships?", answer: "Yes, we offer merit-based scholarships to top-performing students, as well as need-based financial assistance for deserving students from the local community." },
];

// Icons for each category to make the pills look premium
const CATEGORY_ICONS: Record<string, any> = {
  "All": Sparkles,
  "Admission": GraduationCap,
  "Academics": BookOpen,
  "Facilities": Building2,
  "General": ShieldCheck,
};

const CATEGORIES = ["All", "Admission", "Academics", "Facilities", "General"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        // 🔧 FIX: API unwrapping
        const r = await api.get<any>("/api/content?type=faq&limit=100");
        const dbFaqs = extractArray(r);

        if (dbFaqs.length > 0) {
          const mapped = dbFaqs.map((f: any) => ({
            _id: f._id,
            category: f.subtitle || "General",
            question: f.title,
            answer: f.description,
          }));
          setFaqs(mapped);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (err) {
        // Fallback if backend isn't ready
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    }
    void loadFaqs();
  }, []);

  // Filter Logic
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchCategory = category === "All" || f.category.toLowerCase() === category.toLowerCase();
      const matchSearch = f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, category, search]);

  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to the most common questions about our curriculum, admissions, and campus life."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      {/* ================= HERO / SEARCH SECTION ================= */}
      <section className="relative pt-20 pb-14 overflow-hidden border-b border-[var(--border)]">

        {/* Layered ambient glows */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-brand-500/[0.08] blur-[120px] rounded-full" />
          <div className="absolute top-10 left-1/4 w-[400px] h-[300px] bg-amber-500/[0.05] blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-500/[0.05] blur-[100px] rounded-full" />
        </div>

        {/* Subtle dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.035] -z-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-6">
              <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Help Center
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black mb-8 tracking-tight leading-[1.1]">
              How can we <span className="gradient-text">help you?</span>
            </h2>

            {/* Search input with focus aura */}
            <div className="relative group">
              {/* Focus aura glow */}
              <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-brand-500/20 via-amber-500/15 to-blue-500/20 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

              <div className="relative rounded-full shadow-2xl shadow-brand-500/[0.06]">
                <Search
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10"
                  strokeWidth={2.5}
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for answers (e.g., 'transport', 'fees')..."
                  className="pl-16 pr-8 h-[68px] text-base rounded-full bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/15 transition-all duration-300 font-medium"
                />
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      <section className="relative max-w-4xl mx-auto px-4 lg:px-8 py-16 overflow-hidden">

        {/* Ambient background for content */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-brand-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= CATEGORY PILLS ================= */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || HelpCircle;
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 ring-1 ring-inset ring-white/20"
                    : "bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/[0.03]"
                )}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-0 -m-0.5 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
                )}
                <Icon className={cn("h-3.5 w-3.5 relative transition-colors", isActive ? "text-white" : "text-[var(--fg-muted)]")} strokeWidth={2.5} />
                <span className="relative">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* ================= FAQ ACCORDION ================= */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-6 sm:p-7 space-y-3">
                <div className="flex items-center gap-5">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-2.5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative text-center py-24 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Layered medallion icon */}
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                  <HelpCircle className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 tracking-tight">No results found</h3>
            <p className="text-sm text-[var(--fg-muted)] mb-8 max-w-sm mx-auto font-medium leading-relaxed">
              We couldn't find an answer matching "{search}". Try a different keyword or browse categories.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="rounded-xl font-bold hover:border-[var(--primary)]/40 hover:bg-brand-500/[0.06] hover:text-[var(--primary)] transition-all duration-300"
            >
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3.5">
            <AnimatePresence>
              {filteredFaqs.map((faq, index) => {
                const isOpen = openId === faq._id;
                return (
                  <motion.div
                    key={faq._id}
                    layout // 🚀 Smooth layout shift when opening/closing
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={cn(
                      "relative rounded-2xl border overflow-hidden transition-all duration-500 group",
                      isOpen
                        ? "bg-[var(--card)] border-[var(--primary)]/50 shadow-xl shadow-brand-500/[0.06]"
                        : "bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-black/[0.03]"
                    )}
                  >
                    {/* Top hairline edge-light */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none",
                      isOpen
                        ? "bg-gradient-to-r from-transparent via-brand-500/60 to-transparent opacity-100"
                        : "bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-100"
                    )} />

                    {/* Hover aura */}
                    {!isOpen && (
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-500/[0.08] via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />
                    )}

                    {/* Ghost number watermark */}
                    <div className={cn(
                      "absolute top-2 right-4 text-[80px] font-black leading-none select-none pointer-events-none tracking-tighter transition-opacity duration-500",
                      isOpen
                        ? "text-brand-500/[0.06]"
                        : "text-[var(--fg)]/[0.025] group-hover:text-[var(--fg)]/[0.04]"
                    )}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="relative w-full flex items-center justify-between p-6 sm:p-7 text-left gap-4 z-10"
                    >
                      <div className="flex items-center gap-5 min-w-0 flex-1">

                        {/* Icon medallion */}
                        <div className={cn(
                          "relative shrink-0 w-11 h-11 rounded-xl grid place-items-center transition-all duration-500",
                          isOpen
                            ? "gradient-brand text-white shadow-lg shadow-brand-500/30 scale-110 ring-1 ring-white/20"
                            : "bg-[var(--bg-soft)] text-[var(--fg-muted)] ring-1 ring-inset ring-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] group-hover:ring-[var(--primary)]/20"
                        )}>
                          {isOpen && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                          )}
                          <HelpCircle className="h-5 w-5 relative" strokeWidth={2.5} />
                        </div>

                        <div className="min-w-0">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 block transition-colors",
                            isOpen ? "text-[var(--primary)]" : "text-[var(--fg-muted)]"
                          )}>
                            {faq.category}
                          </span>
                          <span className={cn(
                            "font-bold text-base sm:text-lg text-[var(--fg)] leading-snug tracking-tight block transition-colors",
                            isOpen ? "text-[var(--fg)]" : "group-hover:text-[var(--primary)]"
                          )}>
                            {faq.question}
                          </span>
                        </div>
                      </div>

                      {/* Chevron circle */}
                      <div className={cn(
                        "shrink-0 w-9 h-9 rounded-full grid place-items-center transition-all duration-500 ring-1 ring-inset",
                        isOpen
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-[var(--primary)]/20 rotate-180"
                          : "bg-[var(--bg-soft)] text-[var(--fg-muted)] ring-[var(--border)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)] group-hover:ring-[var(--primary)]/20"
                      )}>
                        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="relative overflow-hidden"
                        >
                          {/* Answer top divider */}
                          <div className="mx-6 sm:mx-7 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

                          <div className="relative px-6 pb-7 pt-5 sm:px-7 sm:pl-[5.25rem] text-[var(--fg-muted)] leading-relaxed text-[15px] font-medium">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Animated base accent when open */}
                    {isOpen && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ================= STILL HAVE QUESTIONS CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-24 p-8 lg:p-14 rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-xl border border-[var(--border)] text-center overflow-hidden shadow-2xl shadow-black/[0.04]"
        >
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />

          {/* Dual decorative glows */}
          <div className="absolute -top-24 -right-20 w-72 h-72 bg-brand-500/[0.12] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-amber-500/[0.08] rounded-full blur-3xl pointer-events-none" />

          {/* Ghost watermark */}
          <div className="absolute top-4 right-8 text-[120px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter">
            ★
          </div>

          <div className="relative z-10">

            {/* Icon medallion */}
            <div className="relative inline-flex mb-7">
              <div className="absolute inset-0 -m-2 bg-brand-500/15 rounded-full blur-xl pointer-events-none" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/25 grid place-items-center shadow-lg shadow-brand-500/10">
                <div className="w-11 h-11 rounded-xl bg-[var(--bg)] ring-1 ring-[var(--border)] grid place-items-center">
                  <MessageSquare className="h-5 w-5 text-[var(--primary)]" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black font-display mb-4 tracking-tight">
              Still have <span className="gradient-text">questions?</span>
            </h2>
            <p className="text-[var(--fg-muted)] mb-10 max-w-lg mx-auto text-base leading-relaxed font-medium">
              Can't find the answer you're looking for? Our friendly admissions and support team is ready to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto gradient-brand shadow-glow rounded-xl px-8 h-12 font-bold group overflow-hidden"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative inline-flex items-center">
                    Contact Support
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </Button>
              </Link>
              <Link href="/admission" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl px-8 h-12 font-bold bg-[var(--card)]/80 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-brand-500/[0.06] hover:text-[var(--primary)] transition-all duration-300"
                >
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </section>
    </>
  );
}