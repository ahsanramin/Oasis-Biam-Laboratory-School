"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function ScrollProgress() {
  const progress = useScrollProgress();

  // =========================================
  // 1. SPRING PHYSICS FOR ULTRA-SMOOTH SCROLLING
  // =========================================
  // Instead of a raw percentage, we feed the progress into a spring.
  // This makes the bar feel like it has weight and momentum.
  const springProgress = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    springProgress.set(progress);
  }, [progress, springProgress]);

  // Transform the spring value into a width percentage
  const width = useTransform(springProgress, (latest) => `${latest}%`);

  return (
    <div 
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none"
    >
      {/* ================= PROGRESS BAR TRACK ================= */}
      <motion.div
        style={{ width }}
        className="relative h-full gradient-brand shadow-[0_0_12px_var(--primary-glow)] rounded-r-full"
      >
        {/* Subtle inner shimmer on the bar for texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 mix-blend-overlay" />

        {/* ================= GLOWING TIP ================= */}
        {/* This creates a luminous "laser dot" at the end of the progress */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
        >
          {/* Outer blur glow */}
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary)] rounded-full blur-md opacity-70" />
          
          {/* Inner core dot */}
          <div className="relative w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_2px_var(--primary-glow)]" />
        </div>
      </motion.div>
    </div>
  );
}