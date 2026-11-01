"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, MapPin, Users, Award, 
  PlayCircle, Star, Sparkles, Activity
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

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
// ANIMATED COUNTER
// ==========================================
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let rafId: number;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [started, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ==========================================
// WORD-BY-WORD TEXT REVEAL
// ==========================================
function RevealWords({ 
  words, 
  className = "", 
  delay = 0,
}: { 
  words: string[]; 
  className?: string; 
  delay?: number;
}) {
  return (
    <span className={`inline-flex flex-wrap justify-center gap-x-3 md:gap-x-4 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

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
      transition={{ delay: 1.2, duration: 0.6 }}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-xs text-white/70 font-semibold"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <Activity className="h-3 w-3 text-emerald-400" />
      <span><span className="text-white font-black">{count}</span> people viewing</span>
    </motion.div>
  );
}

// ==========================================
// FLOATING PARTICLES (Reduced for performance)
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
// AURORA BACKGROUND (Simplified)
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
      className="relative h-[100svh] min-h-[640px] max-h-[900px] w-full flex flex-col justify-between overflow-hidden bg-[#020617]"
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
            className="object-cover"
            priority
            quality={100}
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* ===== LAYER 2: Overlays ===== */}
      <div className="absolute inset-0 z-0 bg-[#020617]/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020617_90%)]" />
      <div className="absolute top-0 inset-x-0 h-32 z-0 bg-gradient-to-b from-[#020617] to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 z-0 bg-gradient-to-t from-[#020617] to-transparent" />

      {/* ===== LAYER 3: Aurora + Particles + Grid ===== */}
      <AuroraBackground />
      <FloatingParticles />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 z-0 pointer-events-none" />
      <motion.div style={{ background: spotlight }} className="absolute inset-0 z-0 pointer-events-none" />

      {/* ===== LAYER 4: MAIN CONTENT (Centered, properly sized) ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 lg:px-8 pt-20 pb-4">
        
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
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white text-xs md:text-sm font-bold mb-6 shadow-2xl group cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {slide.badge}
              <ArrowRight className="h-3.5 w-3.5 text-white/60 group-hover:translate-x-1 transition-all" />
            </motion.div>

            {/* ===== MASSIVE TYPOGRAPHY - Scaled for viewport ===== */}
            <h1 
              className="font-black text-white leading-[0.95] tracking-tighter font-display mb-5 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] w-full"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              <RevealWords 
                words={slide.titleWords} 
                delay={0.3}
                className="text-white/95"
              />
              
              <motion.span 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="gradient-text block my-1 md:my-2"
              >
                {slide.highlight}
              </motion.span>
              
              <RevealWords 
                words={slide.titleWords2} 
                delay={0.9}
                className="text-white/95"
              />
            </h1>

            {/* Subtitle - also clamped */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="text-white/80 font-medium leading-relaxed mb-8 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-2xl"
              style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.15rem)" }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-3 mb-6 w-full sm:w-auto justify-center"
            >
              <Link href={slide.ctaLink} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="relative w-full sm:w-auto h-13 px-8 text-base font-bold rounded-xl group bg-white text-black hover:bg-gray-100 shadow-[0_0_30px_-8px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_-8px_rgba(255,255,255,0.6)] hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {slide.ctaText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-13 px-8 text-base font-bold border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-md rounded-xl group"
                >
                  <PlayCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Tour
                </Button>
              </Link>
            </motion.div>

            {/* Live Visitors */}
            <LiveVisitors />

          </motion.div>
        </AnimatePresence>

      </div>

      {/* ===== LAYER 5: INLINE TRUST BAR (Always visible at bottom) ===== */}
      <div className="relative z-20 border-t border-white/10 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Social Proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[11, 12, 13, 14].map((n) => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-[var(--bg-soft)] overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${n}`} alt="Parent" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-[var(--primary)] text-white grid place-items-center text-[10px] font-black">
                  +1K
                </div>
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-[10px] font-bold text-white/70">
                  Trusted by <span className="text-white font-black">1,200+</span> Parents
                </p>
              </div>
            </div>

            {/* Right: Inline Stats */}
            <div className="flex items-center gap-5 sm:gap-8">
              <div className="text-center">
                <p className="text-lg sm:text-xl font-black text-white leading-none tracking-tight">
                  <AnimatedCounter value={1250} suffix="+" />
                </p>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Students</p>
              </div>
              
              <div className="w-px h-7 bg-white/10" />
              
              <div className="text-center">
                <p className="text-lg sm:text-xl font-black text-white leading-none tracking-tight">
                  <AnimatedCounter value={150} suffix="+" />
                </p>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Awards</p>
              </div>
              
              <div className="w-px h-7 bg-white/10 hidden sm:block" />
              
              <div className="text-center hidden sm:block">
                <p className="text-lg sm:text-xl font-black text-white leading-none tracking-tight">
                  <AnimatedCounter value={21} suffix="+" />
                </p>
                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Years</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===== LAYER 6: Slide Navigation ===== */}
      <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`relative h-1 rounded-full transition-all duration-500 overflow-hidden ${
              currentSlide === idx ? "w-12 bg-white/30" : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          >
            {currentSlide === idx && (
              <motion.div 
                key={currentSlide}
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 9, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-amber-400"
              />
            )}
          </button>
        ))}
      </div>

      {/* ===== LAYER 7: Scroll Indicator (FIXED) ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-[100px] right-6 hidden xl:flex flex-col items-center gap-2 z-20"
      >
        <span 
          className="text-[9px] font-bold text-white/40 uppercase tracking-widest"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-0.5 h-1.5 rounded-full bg-white/60"
          />
        </div>
      </motion.div>

    </section>
  );
}