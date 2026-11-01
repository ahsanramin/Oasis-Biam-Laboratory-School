import * as React from "react";
import { cn } from "@/lib/utils";

// =========================================
// 1. TYPES
// =========================================
type Variant = "default" | "text" | "circular" | "rect" | "line";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual shape of the skeleton */
  variant?: Variant;
  /** Number of lines (only applies when variant="text") */
  lines?: number;
  /** Use a subtle pulse instead of shimmer (for low-motion preference) */
  pulse?: boolean;
}

// =========================================
// 2. VARIANT STYLES
// =========================================
const VARIANTS: Record<Variant, string> = {
  default: "rounded-lg",
  text: "rounded-md h-4",
  circular: "rounded-full aspect-square",
  rect: "rounded-none",
  line: "rounded-full h-1.5",
};

// =========================================
// 3. BASE ANIMATION
// =========================================
const ANIMATION = cn(
  // Shimmer in normal mode
  "motion-safe:animate-shimmer",
  // Pulse fallback for users with reduced-motion preference
  "motion-reduce:animate-pulse motion-reduce:bg-[var(--bg-soft)]"
);

// =========================================
// 4. MAIN SKELETON COMPONENT
// =========================================
export function Skeleton({
  className,
  variant = "default",
  lines = 1,
  pulse = false,
  ...props
}: SkeletonProps) {
  const base = pulse ? "animate-pulse bg-[var(--bg-soft)]" : ANIMATION;

  // Multi-line text mode
  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("w-full space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              base,
              VARIANTS.text,
              // Last line shorter → mimics real paragraph endings
              i === lines - 1 ? "w-4/5" : i === 0 ? "w-full" : "w-[92%]"
            )}
          />
        ))}
      </div>
    );
  }

  return <div className={cn(base, VARIANTS[variant], className)} {...props} />;
}

// =========================================
// 5. COMPANION: SkeletonText
// =========================================
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded-md",
            ANIMATION,
            i === 0 ? "w-full" : i === lines - 1 ? "w-3/5" : "w-[90%]"
          )}
        />
      ))}
    </div>
  );
}

// =========================================
// 6. COMPANION: SkeletonAvatar
// =========================================
export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  return (
    <div
      className={cn("shrink-0 rounded-full", ANIMATION, sizes[size], className)}
    />
  );
}

// =========================================
// 7. COMPANION: SkeletonCard
// =========================================
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6",
        className
      )}
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <div className={cn("h-3 w-1/3 rounded-md", ANIMATION)} />
          <div className={cn("h-2 w-1/2 rounded-md", ANIMATION)} />
        </div>
      </div>

      {/* Body text */}
      <SkeletonText lines={2} />

      {/* Featured image */}
      <div className={cn("aspect-video rounded-xl", ANIMATION)} />
    </div>
  );
}