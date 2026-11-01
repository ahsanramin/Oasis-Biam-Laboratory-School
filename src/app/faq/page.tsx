"use client";

import { useEffect, useState, useMemo } from "react";
import { api, extractArray } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, Search, HelpCircle, MessageSquare, 
  GraduationCap, BookOpen, Building2, ShieldCheck, Sparkles
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
      <section className="relative pt-16 pb-12 overflow-hidden border-b border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-black mb-6">How can we help you?</h2>
            <div className="relative w-full shadow-2xl shadow-[var(--primary)]/10 rounded-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-[var(--fg-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for answers (e.g., 'transport', 'fees')..."
                className="pl-16 pr-8 h-20 text-lg rounded-full bg-[var(--card)] border-2 border-transparent focus:border-[var(--primary)] transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
        
        {/* ================= CATEGORY PILLS ================= */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || HelpCircle;
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-105"
                    : "bg-[var(--card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-soft)]"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[var(--fg-muted)]")} />
                {cat}
              </button>
            );
          })}
        </div>

        {/* ================= FAQ ACCORDION ================= */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="w-20 h-20 bg-[var(--bg-soft)] rounded-full grid place-items-center mx-auto mb-6">
              <HelpCircle className="h-10 w-10 text-[var(--fg-muted)] opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-[var(--fg-muted)] mb-8 max-w-sm mx-auto">
              We couldn't find an answer matching "{search}". Try a different keyword or browse categories.
            </p>
            <Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq._id;
                return (
                  <motion.div
                    key={faq._id}
                    layout // 🚀 Smooth layout shift when opening/closing
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "rounded-2xl border overflow-hidden transition-colors duration-300",
                      isOpen 
                        ? "bg-[var(--card)] border-[var(--primary)] shadow-xl shadow-[var(--primary)]/5" 
                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/50"
                    )}
                  >
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq._id)}
                      className="w-full flex items-center justify-between p-6 sm:p-7 text-left gap-4"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "shrink-0 w-10 h-10 rounded-xl grid place-items-center transition-all duration-300",
                          isOpen 
                            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 scale-110" 
                            : "bg-[var(--bg-soft)] text-[var(--fg-muted)]"
                        )}>
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mb-1 block">
                            {faq.category}
                          </span>
                          <span className="font-bold text-lg sm:text-xl text-[var(--fg)] leading-snug">
                            {faq.question}
                          </span>
                        </div>
                      </div>
                      <div className={cn(
                        "shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all duration-300",
                        isOpen ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--bg-soft)] text-[var(--fg-muted)]"
                      )}>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-transform duration-300",
                            isOpen && "rotate-180"
                          )}
                        />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-7 sm:px-7 sm:pl-[5.25rem] text-[var(--fg-muted)] leading-relaxed text-base">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
          viewport={{ once: true }}
          className="mt-24 p-8 lg:p-14 rounded-[2.5rem] bg-gradient-to-br from-[var(--card)] to-[var(--bg-soft)] border border-[var(--border)] text-center relative overflow-hidden shadow-sm"
        >
          {/* Decorative background */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--primary)] opacity-10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] mb-6 shadow-xl">
              <MessageSquare className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-black font-display mb-4">
              Still have questions?
            </h2>
            <p className="text-[var(--fg-muted)] mb-10 max-w-lg mx-auto text-lg">
              Can't find the answer you're looking for? Our friendly admissions and support team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto shadow-glow rounded-xl px-8">
                  Contact Support
                </Button>
              </Link>
              <Link href="/admission">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl px-8 bg-[var(--card)]">
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