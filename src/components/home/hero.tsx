"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, PlayCircle, Sparkles, Activity
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// ==========================================
// SLIDE DATA
// ==========================================
const SLIDES = [
  {
    id: 1,
    image: "https://i.ibb.co.com/j9p9vNfJ/images-1.jpg",
    badge: "Admission Open — Session 2027",
    titleWords: ["The", "Future", "of"],
    highlight: "Education",
    titleWords2: ["Starts", "Here."],
    subtitle: "Empowering the next generation through the English Version National Curriculum, world-class faculty, and a legacy of 20+ years of excellence.",
    ctaText: "Apply for Admission",
    ctaLink: "/admission",
  },
  {
    id: 2,
    image: "https://i.ibb.co.com/67z0dmbS/images.jpg",
    badge: "World-Class Facilities",
    titleWords: ["Where", "Innovation"],
    highlight: "Meets",
    titleWords2: ["Tradition."],
    subtitle: "A campus designed for the future. From advanced science labs to a vast library, we provide the perfect environment for your child to thrive.",
    ctaText: "Explore Campus",
    ctaLink: "/about",
  }
];

// ==========================================
// LIVE VISITOR INDICATOR
// ==========================================
function LiveVisitors() {
  const [count, setCount] = useState(24);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => Math.max(15, prev + Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 ring-1 ring-inset ring-white/10 text-[11px] text-white/75 font-black uppercase tracking-[0.14em] shadow-lg shadow-black/20"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-sm shadow-emerald-400/50" />
      </span>
      <Activity className="h-3 w-3 text-emerald-400" strokeWidth={2.5} />
      <span className="normal-case tracking-normal">
        <span className="text-white font-black tabular-nums">{count}</span> people viewing
      </span>
    </motion.div>
  );
}

// ==========================================
// FLOATING PARTICLES
// ==========================================
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 15,
      opacity: Math.random() * 0.3 + 0.15,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "white",
          }}
        />
      ))}
    </div>
  );
}

// ==========================================
// AURORA BACKGROUND
// ==========================================
function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 60, 0, -60, 0], y: [0, -60, -100, -60, 0], scale: [1, 1.15, 1.1, 0.95, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -100, 0, 100, 0], y: [0, 40, 100, 40, 0], scale: [1, 0.9, 1.15, 1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full blur-[120px] opacity-20"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
      />
    </div>
  );
}

// ==========================================
// MAIN HERO COMPONENT
// ==========================================
export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const spotlight = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(800px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.06), transparent 50%)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#020617]"
    >
      
      {/* ===== LAYER 1: Background Image ===== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt="Oasis BIAM Campus"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* ===== LAYER 2: Overlays ===== */}
      <div className="absolute inset-0 z-0 bg-[#020617]/65" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#020617_95%)]" />
      <div className="absolute top-0 inset-x-0 h-32 z-0 bg-gradient-to-b from-[#020617] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 z-0 bg-gradient-to-t from-[#020617] to-transparent" />

      {/* ===== LAYER 3: Aurora + Particles + Grid + Spotlight ===== */}
      <AuroraBackground />
      <FloatingParticles />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 z-0 pointer-events-none" />
      <motion.div style={{ background: spotlight }} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top edge-light hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none" />

      {/* ===== LAYER 4: MAIN CONTENT ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-20 mt-16 pb-32">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center w-full max-w-5xl"
          >
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 ring-1 ring-inset ring-white/10 text-white text-[11px] md:text-xs font-black uppercase tracking-[0.16em] mb-7 shadow-2xl shadow-black/30 group cursor-pointer hover:bg-white/[0.1] hover:border-white/25 transition-all duration-300"
            >
              <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <Sparkles className="h-3.5 w-3.5 text-amber-400 relative" strokeWidth={2.5} />
              <span className="relative normal-case tracking-normal">{slide.badge}</span>
              <ArrowRight className="h-3.5 w-3.5 text-white/60 group-hover:translate-x-1 transition-all duration-300 relative" strokeWidth={2.5} />
            </motion.div>

            {/* ===== HEADLINE ===== */}
            <h1 className="font-black text-white text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-tighter font-display mb-6 drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] w-full flex flex-col items-center gap-1 md:gap-2">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                className="block text-white/95"
              >
                {slide.titleWords.join(" ")}
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                className="gradient-text block"
              >
                {slide.highlight}
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="block text-white/95"
              >
                {slide.titleWords2.join(" ")}
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
              className="text-white/85 text-sm sm:text-base lg:text-lg font-medium leading-relaxed mb-9 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl mx-auto"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2, ease: EASE }}
              className="flex flex-col sm:flex-row gap-3 mb-7 w-full sm:w-auto justify-center"
            >
              <Link href={slide.ctaLink} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="relative w-full sm:w-auto h-[52px] px-8 text-base font-bold rounded-xl group bg-white text-black hover:bg-gray-50 shadow-[0_0_30px_-8px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_-8px_rgba(255,255,255,0.7)] hover:scale-[1.02] transition-all duration-300 overflow-hidden ring-1 ring-inset ring-white/60"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />
                  <span className="relative z-10 flex items-center">
                    {slide.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2.5} />
                  </span>
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="relative w-full sm:w-auto h-[52px] px-8 text-base font-bold border border-white/25 text-white hover:bg-white/[0.08] backdrop-blur-xl rounded-xl group ring-1 ring-inset ring-white/10 hover:border-white/40 overflow-hidden"
                >
                  <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                  <span className="relative">Watch Tour</span>
                </Button>
              </Link>
            </motion.div>

            {/* Live Visitors */}
            <LiveVisitors />

          </motion.div>
        </AnimatePresence>

      </div>

      {/* ===== LAYER 5: Slide Navigation ===== */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`relative h-1 rounded-full transition-all duration-500 overflow-hidden ring-1 ring-inset ring-white/10 ${
              currentSlide === idx ? "w-12 bg-white/25" : "w-1.5 bg-white/20 hover:bg-white/50"
            }`}
          >
            {currentSlide === idx && (
              <motion.div
                key={currentSlide}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 9, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-amber-400 shadow-sm shadow-[var(--primary)]/50"
              />
            )}
          </button>
        ))}
      </div>

      {/* ===== LAYER 6: Scroll Indicator ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8, ease: EASE }}
        className="absolute bottom-10 right-6 hidden xl:flex flex-col items-center gap-2 z-20"
      >
        <span
          className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-white/30 ring-1 ring-inset ring-white/10 flex justify-center pt-1.5 bg-white/[0.04] backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-1.5 rounded-full bg-white/70"
          />
        </div>
      </motion.div>

    </section>
  );
}