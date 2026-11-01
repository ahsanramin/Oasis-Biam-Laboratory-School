"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Hero } from "@/components/home/hero";
import { NewsTicker } from "@/components/home/news-ticker";
import { Stats } from "@/components/home/stats";
import { Principal } from "@/components/home/principal";
import { TeachersSection } from "@/components/home/teachers-section";
import { Chairman } from "@/components/home/chairman";
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
import { ServerCrash, RefreshCw } from "lucide-react";

// =========================================
// PREMIUM SKELETON LOADER
// =========================================
function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Skeleton */}
      <Skeleton className="h-[70vh] sm:h-[80vh] w-full rounded-[3rem] animate-shimmer" />
      
      {/* News Ticker Skeleton */}
      <Skeleton className="h-12 w-full rounded-xl animate-shimmer" />
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl animate-shimmer" />
        ))}
      </div>

      {/* Principal / Leadership Skeleton */}
      <div className="grid md:grid-cols-2 gap-8 items-center py-12">
        <Skeleton className="aspect-[4/5] w-full max-w-sm mx-auto rounded-[3rem] animate-shimmer" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 rounded-full animate-shimmer" />
          <Skeleton className="h-12 w-3/4 rounded-xl animate-shimmer" />
          <Skeleton className="h-4 w-full animate-shimmer" />
          <Skeleton className="h-4 w-5/6 animate-shimmer" />
          <Skeleton className="h-4 w-4/6 animate-shimmer" />
        </div>
      </div>

      {/* Teachers Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] rounded-[2rem] animate-shimmer" />
            <Skeleton className="h-6 w-2/3 mx-auto animate-shimmer" />
            <Skeleton className="h-4 w-1/2 mx-auto animate-shimmer" />
          </div>
        ))}
      </div>
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
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md w-full p-8 sm:p-12 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-2xl border border-[var(--border)] shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full grid place-items-center mx-auto mb-6">
            <ServerCrash className="h-10 w-10 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-black mb-3 text-[var(--fg)]">Connection Interrupted</h2>
          <p className="text-[var(--fg-muted)] mb-8 leading-relaxed">
            We couldn't connect to our servers to load the homepage content. Please check your internet connection or try again.
          </p>
          
          <Button 
            onClick={fetchHomeData} 
            size="lg" 
            className="w-full gradient-brand shadow-glow rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
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
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* 1. HERO - Full screen cinematic banner */}
        <Hero />

        {/* 2. NEWS TICKER - Scrolling announcements */}
        <NewsTicker notices={data?.latestNotices || []} />

        {/* 3. STATS - Animated counters */}
        <Stats />

        {/* 4. PRINCIPAL - Leadership message */}
        <Principal data={data?.principal} />

        {/* 5. TEACHERS - Faculty showcase */}
        <TeachersSection teachers={data?.teachers || []} />

        {/* 6. CHAIRMAN - Governing body message */}
        <Chairman data={data?.chairman} />

        {/* 7. GOVERNING INFO - Trust institutions */}
        <GoverningInfo about={data?.about} />

        {/* 8. HOW WE WORK - Bento features */}
        <HowWeWork />

        {/* 9. TRUST SECTION - Why parents trust us */}
        <TrustSection reasons={data?.trustReasons || []} />

        {/* 10. GALLERY PREVIEW - Bento grid of images */}
        <GalleryPreview />

        {/* 11. ACHIEVEMENTS - Awards and recognition */}
        <Achievements stats={data?.stats} />

        {/* 12. UPCOMING EVENTS - Calendar highlights (REAL DATA) */}
        <UpcomingEvents events={data?.upcomingEvents || []} />

        {/* 13. TESTIMONIALS - Parent reviews */}
        <Testimonials testimonials={data?.testimonials || []} />

        {/* 14. PARTNERS - Government bodies */}
        <Partners />

        {/* 15. BLOG PREVIEW - Latest articles */}
        <BlogPreview articles={data?.latestArticles || []} />

        {/* 16. FAQ - Common questions */}
        <FAQ faqs={data?.faqs || []} />

        {/* 17. CTA - Final call to action */}
        <CTA />
      </motion.div>
    </AnimatePresence>
  );
}