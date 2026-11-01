"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// =========================================
// 1. TYPES
// =========================================
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  /** Optional size variant */
  size?: "sm" | "md" | "lg";
  /** Optional total items count for "Showing X of Y" display */
  totalItems?: number;
  /** Optional items per page (used with totalItems) */
  itemsPerPage?: number;
  className?: string;
}

// =========================================
// 2. SMART PAGE CALCULATION
// =========================================
function getPaginationRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];
  const leftSibling = Math.max(2, current - 1);
  const rightSibling = Math.min(total - 1, current + 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  pages.push(1);
  if (showLeftEllipsis) pages.push("...");
  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
  if (showRightEllipsis) pages.push("...");
  pages.push(total);

  return pages;
}

// =========================================
// 3. SIZE CONFIGURATION
// =========================================
const SIZE_CONFIG = {
  sm: { btn: "h-8 min-w-8 text-xs", nav: "h-8 w-8", gap: "gap-0.5", icon: "h-3.5 w-3.5" },
  md: { btn: "h-10 min-w-10 text-sm", nav: "h-10 w-10", gap: "gap-1", icon: "h-4 w-4" },
  lg: { btn: "h-12 min-w-12 text-base", nav: "h-12 w-12", gap: "gap-1.5", icon: "h-5 w-5" },
};

// =========================================
// 4. MAIN COMPONENT
// =========================================
export function Pagination({
  page,
  totalPages,
  onPageChange,
  size = "md",
  totalItems,
  itemsPerPage,
  className,
}: PaginationProps) {
  // Don't render if only 1 page
  if (totalPages <= 1) return null;

  const config = SIZE_CONFIG[size];
  const pages = getPaginationRange(page, totalPages);

  // Calculate "Showing X-Y of Z"
  const showingRange = () => {
    if (!totalItems || !itemsPerPage) return null;
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalItems);
    return { start, end, total: totalItems };
  };

  const range = showingRange();

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      
      {/* ================= PAGINATION NAV ================= */}
      <nav 
        className={cn(
          "relative inline-flex items-center bg-[var(--card)]/70 backdrop-blur-xl",
          "border border-[var(--border)] rounded-2xl px-2 py-2",
          "shadow-lg shadow-black/5",
          config.gap
        )}
        aria-label="Pagination navigation"
      >
        
        {/* ================= PREVIOUS BUTTON ================= */}
        <button
          onClick={handlePrev}
          disabled={page === 1}
          aria-label="Previous page"
          className={cn(
            "flex items-center justify-center rounded-xl",
            "text-[var(--fg-muted)] bg-transparent",
            "border border-transparent",
            "hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] hover:border-[var(--border)]",
            "disabled:opacity-30 disabled:pointer-events-none",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            config.nav
          )}
        >
          <ChevronLeft className={config.icon} strokeWidth={2.5} />
        </button>

        {/* ================= PAGE NUMBERS ================= */}
        {pages.map((p, i) => {
          // Ellipsis
          if (p === "...") {
            return (
              <span 
                key={`ellipsis-${i}`} 
                className={cn(
                  "flex items-center justify-center text-[var(--fg-muted)] select-none",
                  "hidden sm:flex", // Hide ellipsis on very small screens
                  config.btn
                )}
              >
                <MoreHorizontal className={config.icon} />
              </span>
            );
          }

          const isActive = p === page;
          
          // On mobile, hide non-adjacent pages (keep first, last, current, and neighbors)
          const isMobileHidden = 
            typeof p === "number" && 
            p !== 1 && 
            p !== totalPages && 
            Math.abs(p - page) > 1;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Go to page ${p}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center justify-center rounded-xl font-bold",
                "transition-colors duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                isActive 
                  ? "text-white" 
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)]",
                isMobileHidden && "hidden md:flex",
                config.btn
              )}
            >
              {/* Animated Active Background */}
              {isActive && (
                <motion.div
                  layoutId="pagination-active"
                  className="absolute inset-0 gradient-brand rounded-xl shadow-lg shadow-[var(--primary)]/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <span className="relative z-10">{p}</span>
            </button>
          );
        })}

        {/* ================= NEXT BUTTON ================= */}
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          aria-label="Next page"
          className={cn(
            "flex items-center justify-center rounded-xl",
            "text-[var(--fg-muted)] bg-transparent",
            "border border-transparent",
            "hover:bg-[var(--bg-soft)] hover:text-[var(--fg)] hover:border-[var(--border)]",
            "disabled:opacity-30 disabled:pointer-events-none",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            config.nav
          )}
        >
          <ChevronRight className={config.icon} strokeWidth={2.5} />
        </button>
      </nav>

      {/* ================= SHOWING RANGE ================= */}
      {range && (
        <p className="text-xs font-semibold text-[var(--fg-muted)]">
          Showing <span className="text-[var(--fg)] font-bold">{range.start}–{range.end}</span> of <span className="text-[var(--fg)] font-bold">{range.total.toLocaleString()}</span> results
        </p>
      )}
    </div>
  );
}