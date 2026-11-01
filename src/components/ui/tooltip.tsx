"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// =========================================
// 1. TYPES
// =========================================
type Side = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: Side;
  /** Delay before showing tooltip (in ms) */
  delay?: number;
  /** Optional className for the trigger wrapper */
  className?: string;
}

// =========================================
// 2. POSITION MAPS
// =========================================
const POSITIONS: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ARROW_POSITIONS: Record<Side, string> = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45 border-b border-r",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2 rotate-45 border-t border-l",
  left: "right-[-4px] top-1/2 -translate-y-1/2 rotate-45 border-t border-r",
  right: "left-[-4px] top-1/2 -translate-y-1/2 rotate-45 border-b border-l",
};

// =========================================
// 3. ANIMATION VARIANTS
// =========================================
const ANIMATIONS: Record<Side, { initial: any; animate: any; exit: any }> = {
  top: {
    initial: { opacity: 0, y: 6, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 4, scale: 0.95 },
  },
  bottom: {
    initial: { opacity: 0, y: -6, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.95 },
  },
  left: {
    initial: { opacity: 0, x: 6, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 4, scale: 0.95 },
  },
  right: {
    initial: { opacity: 0, x: -6, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -4, scale: 0.95 },
  },
};

// =========================================
// 4. MAIN COMPONENT
// =========================================
export function Tooltip({ 
  content, 
  children, 
  side = "top", 
  delay = 200,
  className 
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // =========================================
  // DELAYED SHOW HANDLER
  // =========================================
  const handleShow = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), delay);
  };

  const handleHide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className={cn("relative inline-flex", className)}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      {children}

      <AnimatePresence>
        {show && (
          <motion.div
            role="tooltip"
            initial={ANIMATIONS[side].initial}
            animate={ANIMATIONS[side].animate}
            exit={ANIMATIONS[side].exit}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute z-[100] pointer-events-none",
              // Premium design
              "px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide",
              "bg-[var(--fg)]/95 backdrop-blur-md text-[var(--bg)]",
              "shadow-2xl shadow-black/25",
              // Border for crisp edge
              "border border-white/10",
              "whitespace-nowrap",
              POSITIONS[side]
            )}
          >
            {content}
            
            {/* Arrow Pointer */}
            <div 
              className={cn(
                "absolute w-2 h-2 bg-[var(--fg)]/95",
                ARROW_POSITIONS[side]
              )} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}