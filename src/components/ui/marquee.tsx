"use client";

import { cn } from "@/lib/utils";
import { Fragment, ReactNode, useEffect, useState } from "react";

// =========================================
// 1. TYPES
// =========================================
type Speed = "slow" | "normal" | "fast";
type Direction = "left" | "right";

// =========================================
// 2. DURATIONS (Optimized for readability)
// =========================================
const DURATIONS: Record<Speed, string> = {
  slow: "60s",
  normal: "40s",
  fast: "24s",
};

// =========================================
// 3. COMPONENT INTERFACE
// =========================================
export interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: Speed;
  direction?: Direction;
  /** Pause animation when user hovers or focuses inside */
  pauseOnHover?: boolean;
  /** Render children N times per copy (useful for narrow content) */
  repeat?: number;
  /** Disable the edge fade mask */
  noFade?: boolean;
}

// =========================================
// 4. MAIN COMPONENT
// =========================================
export function Marquee({
  children,
  className,
  speed = "normal",
  direction = "left",
  pauseOnHover = true,
  repeat = 1,
  noFade = false,
}: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // =========================================
  // RESPECT PREFERS-REDUCED-MOTION
  // =========================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isPaused = paused || reducedMotion;
  const repeatCount = Math.max(1, Math.floor(repeat));

  // Build the repeated content
  const content = (
    <>
      {Array.from({ length: repeatCount }).map((_, i) => (
        <Fragment key={i}>{children}</Fragment>
      ))}
    </>
  );

  return (
    <div
      className={cn(
        "overflow-hidden relative group",
        !noFade && "mask-fade-edges",
        className
      )}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      onFocus={() => pauseOnHover && setPaused(true)}
      onBlur={() => pauseOnHover && setPaused(false)}
    >
      <div
        className="flex animate-marquee will-change-transform"
        style={{
          animationDuration: DURATIONS[speed],
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <div className="flex shrink-0">{content}</div>
        <div className="flex shrink-0" aria-hidden="true">{content}</div>
      </div>
    </div>
  );
}