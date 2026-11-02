"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Hero } from "@/components/home/hero";
import { NewsTicker } from "@/components/home/news-ticker";
import { Stats } from "@/components/home/stats";
import { Chairman } from "@/components/home/chairman"; // 🎯 Moved up
import { Principal } from "@/components/home/principal";
import { VicePrincipal } from "@/components/home/vice-principal";
import { TeachersSection } from "@/components/home/teachers-section";
import { GoverningInfo } from "@/components/home/governing-info";
import { HowWeWork } from "@/components/home/how-we-work";
import { TrustSection } from "@/components/home/trust-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Achievements } from "@/components/home/achievements";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Testimonials } from "@/components/home/testimonials";
import { Partners } from "@/components/home/partners";
import { BlogPreview } from "@/components/home/blog-preview";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ServerCrash, RefreshCw, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// =========================================
// PREMIUM SKELETON LOADER
// =========================================
function HomeSkeleton() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8 space-y-12 overflow-hidden">

      {/* ===== Ambient background layers ===== */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-24 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
      </div>

      {/* Hero Skeleton */}
      <div className="relative rounded-[3rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
        <Skeleton className="h-[70vh] sm:h-[80vh] w-full rounded-none animate-shimmer" />
      </div>

      {/* News Ticker Skeleton */}
      <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
        <Skeleton className="h-12 w-full rounded-none animate-shimmer" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-2 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
            <Skeleton className="h-32 rounded-[1.35rem] animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Chairman Skeleton */}
      <div className="relative rounded-[3rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-8 overflow-hidden">
         <div className="flex flex-col md:flex-row gap-8 items-center">
             <Skeleton className="w-48 h-48 rounded-full shrink-0 animate-shimmer" />
             <div className="space-y-4 flex-1 w-full">
                <Skeleton className="h-6 w-32 rounded-full animate-shimmer" />
                <Skeleton className="h-10 w-2/3 rounded-xl animate-shimmer" />
                <Skeleton className="h-24 w-full rounded-xl animate-shimmer" />
             </div>
         </div>
      </div>

      {/* Principal Skeleton */}
      <div className="relative grid md:grid-cols-2 gap-8 items-center py-12">
        <div className="relative rounded-[3rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-2 overflow-hidden mx-auto max-w-sm w-full">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <Skeleton className="aspect-[4/5] w-full rounded-[2.35rem] animate-shimmer" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-32 rounded-full animate-shimmer" />
          <Skeleton className="h-12 w-3/4 rounded-xl animate-shimmer" />
          <div className="space-y-2.5 pt-2">
            <Skeleton className="h-4 w-full rounded animate-shimmer" />
            <Skeleton className="h-4 w-5/6 rounded animate-shimmer" />
            <Skeleton className="h-4 w-4/6 rounded animate-shimmer" />
          </div>
          <div className="pt-4 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Vice Principal Skeleton (Reversed Layout) */}
      <div className="relative grid md:grid-cols-2 gap-8 items-center py-12">
        <div className="space-y-4 order-2 md:order-1">
          <Skeleton className="h-7 w-32 rounded-full animate-shimmer" />
          <Skeleton className="h-12 w-3/4 rounded-xl animate-shimmer" />
          <div className="space-y-2.5 pt-2">
            <Skeleton className="h-4 w-full rounded animate-shimmer" />
            <Skeleton className="h-4 w-5/6 rounded animate-shimmer" />
            <Skeleton className="h-4 w-4/6 rounded animate-shimmer" />
          </div>
          <div className="pt-4 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl animate-shimmer" />
          </div>
        </div>
        <div className="relative rounded-[3rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-2 overflow-hidden mx-auto max-w-sm w-full order-1 md:order-2">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
          <Skeleton className="aspect-[4/5] w-full rounded-[2.35rem] animate-shimmer" />
        </div>
      </div>

      {/* Teachers Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="relative rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md p-1.5 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
              <Skeleton className="aspect-[4/5] rounded-[1.6rem] animate-shimmer" />
            </div>
            <div className="px-1 space-y-2 text-center">
              <Skeleton className="h-5 w-2/3 mx-auto rounded-lg animate-shimmer" />
              <Skeleton className="h-3.5 w-1/2 mx-auto rounded-lg animate-shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Subtle loading caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        className="flex items-center justify-center gap-2 pt-4 pb-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--fg-muted)]/70">
          Preparing your experience
        </p>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
      </motion.div>
    </div>
  );
}

// =========================================
// HOME PAGE COMPONENT
// =========================================
export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // =========================================
  // FETCH HOME DATA
  // =========================================
  const fetchHomeData = async () => {
    setLoading(true);
    setError(false);

    try {
      const r = await api.get<any>("/api/home");

      // 🔧 FIX: Proper API unwrapping
      const unwrapped = r?.data || r;

      if (!unwrapped || typeof unwrapped !== "object") {
        throw new Error("Invalid response from server");
      }

      setData(unwrapped);
    } catch (err) {
      console.error("❌ Failed to load homepage data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHomeData();
  }, []);

  // =========================================
  // PREMIUM ERROR STATE
  // =========================================
  if (error) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden bg-[var(--bg)]">

        {/* ===== Layered ambient background ===== */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-red-500/[0.08] rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[320px] h-[320px] bg-amber-500/[0.05] rounded-full blur-[100px]" />
        </div>

        {/* Radial dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/[0.06] text-center overflow-hidden"
        >
          {/* Top hairline edge-light */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent pointer-events-none" />

          {/* Corner glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/[0.08] rounded-full blur-3xl pointer-events-none" />

          {/* Eyebrow badge */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/60 backdrop-blur-md border border-red-500/25 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-6">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Connection Issue
          </div>

          {/* Layered medallion icon */}
          <div className="relative mx-auto mb-6 w-max">
            <div className="absolute inset-0 -m-4 bg-red-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/[0.04] ring-1 ring-red-500/25 grid place-items-center shadow-lg shadow-red-500/10">
              <div className="relative w-16 h-16 rounded-full bg-red-500/10 ring-1 ring-red-500/20 grid place-items-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                <ServerCrash className="relative h-8 w-8 text-red-500" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h2 className="relative text-2xl sm:text-3xl font-black mb-3 text-[var(--fg)] tracking-tight leading-tight">
            Connection <span className="gradient-text">Interrupted</span>
          </h2>
          <p className="relative text-sm text-[var(--fg-muted)] mb-8 leading-relaxed font-medium">
            We couldn't connect to our servers to load the homepage content. Please check your internet connection or try again.
          </p>

          <Button
            onClick={fetchHomeData}
            size="lg"
            className="relative w-full gradient-brand shadow-glow rounded-xl h-14 font-bold group overflow-hidden hover:scale-[1.01] hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all duration-300"
          >
            {/* Sheen sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative inline-flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} />
              Retry Connection
            </span>
          </Button>

          <p className="relative mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--fg-muted)]/60">
            Your data is safe · Try again anytime
          </p>
        </motion.div>
      </div>
    );
  }

  // =========================================
  // LOADING STATE
  // =========================================
  if (loading) {
    return <HomeSkeleton />;
  }

  // =========================================
  // MAIN PAGE ASSEMBLY
  // =========================================
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* 1. HERO - Full screen cinematic banner */}
        <Hero />

        {/* 2. NEWS TICKER - Scrolling announcements */}
        <NewsTicker notices={data?.latestNotices || []} />

        {/* 3. STATS - Animated counters */}
        <Stats />

        {/* 🎯 4. CHAIRMAN - Governing body message */}
        <Chairman data={data?.chairman} />

        {/* 🎯 5. PRINCIPAL - Leadership message */}
        <Principal data={data?.principal} />

        {/* 🎯 6. VICE PRINCIPAL - Leadership message */}
        <VicePrincipal data={data?.vicePrincipal} />

        {/* 7. TEACHERS - Faculty showcase */}
        <TeachersSection teachers={data?.teachers || []} />

        {/* 8. GOVERNING INFO - Trust institutions */}
        <GoverningInfo about={data?.about} />

        {/* 9. HOW WE WORK - Bento features */}
        <HowWeWork />

        {/* 10. TRUST SECTION - Why parents trust us */}
        <TrustSection reasons={data?.trustReasons || []} />

        {/* 11. GALLERY PREVIEW - Bento grid of images */}
        <GalleryPreview />

        {/* 12. ACHIEVEMENTS - Awards and recognition */}
        <Achievements stats={data?.stats} />

        {/* 13. UPCOMING EVENTS - Calendar highlights (REAL DATA) */}
        <UpcomingEvents events={data?.upcomingEvents || []} />

        {/* 14. TESTIMONIALS - Parent reviews */}
        <Testimonials testimonials={data?.testimonials || []} />

        {/* 15. PARTNERS - Government bodies */}
        <Partners />

        {/* 16. BLOG PREVIEW - Latest articles */}
        <BlogPreview articles={data?.latestArticles || []} />

        {/* 17. FAQ - Common questions */}
        <FAQ faqs={data?.faqs || []} />

        {/* 18. CTA - Final call to action */}
        <CTA />
      </motion.div>
    </AnimatePresence>
  );
}