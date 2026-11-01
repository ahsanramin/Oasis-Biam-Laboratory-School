"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// =========================================
// 1. TYPE DEFINITIONS
// =========================================
type Size = "sm" | "md" | "lg" | "xl" | "full";

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
};

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: Size;
  hideClose?: boolean;
}

// =========================================
// 2. ANIMATION VARIANTS
// =========================================
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  },
};

// =========================================
// 3. MAIN COMPONENT
// =========================================
export function Dialog({ 
  open, 
  onClose, 
  title, 
  description,
  children, 
  footer,
  className,
  size,
  hideClose = false,
}: DialogProps) {
  // Portal mount state (prevents SSR hydration errors)
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================
  // BODY SCROLL LOCK
  // =========================================
  React.useEffect(() => {
    if (!open) return;
    
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // =========================================
  // ESCAPE KEY HANDLER
  // =========================================
  React.useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Don't render on server
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          
          {/* ================= BACKDROP ================= */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* ================= DIALOG PANEL ================= */}
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full flex flex-col",
              "bg-[var(--card)]/95 backdrop-blur-2xl",
              "border border-[var(--border)]",
              "rounded-[2rem] shadow-2xl shadow-black/20",
              "overflow-hidden max-h-[90vh]",
              size ? SIZES[size] : "max-w-lg",
              className
            )}
          >
            
            {/* ================= TOP GRADIENT ACCENT ================= */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-80" />

            {/* ================= HEADER ================= */}
            <div className="relative flex items-start justify-between gap-4 p-6 sm:p-7 border-b border-[var(--border)]/50 bg-[var(--card)]/50 shrink-0">
              <div className="flex-1 min-w-0">
                <h3 
                  id="dialog-title"
                  className="font-black text-xl text-[var(--fg)] tracking-tight leading-tight break-words"
                >
                  {title}
                </h3>
                {description && (
                  <p 
                    id="dialog-description"
                    className="text-sm text-[var(--fg-muted)] mt-1.5 leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* Premium Close Button */}
              {!hideClose && (
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className={cn(
                    "shrink-0 w-10 h-10 rounded-xl",
                    "grid place-items-center",
                    "bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--fg-muted)]",
                    "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 hover:rotate-90",
                    "transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  )}
                >
                  <X className="h-4.5 w-4.5" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* ================= CONTENT BODY ================= */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 scrollbar-thin">
              {children}
            </div>

            {/* ================= OPTIONAL FOOTER ================= */}
            {footer && (
              <div className="shrink-0 p-5 sm:p-6 border-t border-[var(--border)] bg-[var(--bg-soft)]/50">
                {footer}
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}