"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setVisible(scrollTop > 600);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SVG Circle properties
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 group"
        >
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full gradient-brand blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

          {/* Main Button Container */}
          <div className="relative w-14 h-14 rounded-full bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-[var(--primary)]/20 grid place-items-center overflow-hidden">
            
            {/* Inner Glow Gradient */}
            <div className="absolute inset-0 gradient-brand opacity-10 group-hover:opacity-20 transition-opacity duration-300" />

            {/* Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 56 56"
            >
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="transparent"
                stroke="var(--border)"
                strokeWidth="2.5"
                className="opacity-30"
              />
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                fill="transparent"
                stroke="url(#scrollGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--grad-from)" />
                  <stop offset="100%" stopColor="var(--grad-to)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Arrow Icon */}
            <div className="relative z-10 w-9 h-9 rounded-full gradient-brand text-white grid place-items-center shadow-lg shadow-[var(--primary)]/30 group-hover:shadow-[var(--primary)]/50 transition-shadow duration-300">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              </motion.div>
            </div>

          </div>

          {/* Tooltip (Desktop) */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs font-bold text-[var(--fg)] whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none hidden md:block">
            Back to top
            <div className="absolute top-full right-4 w-2 h-2 bg-[var(--card)] border-r border-b border-[var(--border)] rotate-45 -translate-y-1" />
          </div>

        </motion.button>
      )}
    </AnimatePresence>
  );
}