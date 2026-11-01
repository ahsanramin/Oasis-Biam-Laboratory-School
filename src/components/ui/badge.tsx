import * as React from "react";
import { cn } from "@/lib/utils";

// =========================================
// 1. TYPE DEFINITIONS
// =========================================
type Variant = 
  | "default" 
  | "secondary"  // 👈 ADDED BACK
  | "success" 
  | "warning" 
  | "danger" 
  | "brand" 
  | "info"
  | "outline"
  | "gradient"
  | "dark";

type Size = "sm" | "md" | "lg";

// =========================================
// 2. STYLE CONFIGURATION
// =========================================
const VARIANTS: Record<Variant, string> = {
  default: "bg-[var(--bg-soft)] text-[var(--fg-muted)] border-[var(--border)]",
  secondary: "bg-[var(--bg-soft)] text-[var(--fg)] border-[var(--border)]", // 👈 ADDED
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  brand: "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  outline: "bg-transparent text-[var(--fg)] border-[var(--border)] hover:border-[var(--primary)]/50",
  gradient: "gradient-brand text-white border-transparent shadow-md shadow-[var(--primary)]/25",
  dark: "bg-[var(--fg)] text-[var(--bg)] border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-0.5 text-xs gap-1.5",
  lg: "px-3.5 py-1 text-sm gap-2",
};

const DOT_COLORS: Record<Variant, string> = {
  default: "bg-[var(--fg-muted)]",
  secondary: "bg-[var(--fg-muted)]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  brand: "bg-[var(--primary)]",
  info: "bg-sky-500",
  outline: "bg-[var(--primary)]",
  gradient: "bg-white",
  dark: "bg-[var(--bg)]",
};

// =========================================
// 3. COMPONENT PROPS
// =========================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  glow?: boolean;
}

// =========================================
// 4. MAIN COMPONENT
// =========================================
export const Badge = ({ 
  className, 
  variant = "default", 
  size = "md",
  dot = false,
  pulse = false,
  icon,
  glow = false,
  children,
  ...props 
}: BadgeProps) => {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-bold border",
        "transition-all duration-300",
        "whitespace-nowrap",
        SIZES[size],
        VARIANTS[variant],
        glow && "shadow-lg shadow-[var(--primary)]/20",
        className
      )} 
      {...props}
    >
      {dot && (
        <span className="relative flex items-center justify-center shrink-0">
          {pulse && (
            <span 
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                DOT_COLORS[variant]
              )} 
            />
          )}
          <span 
            className={cn(
              "relative inline-flex rounded-full",
              size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2",
              DOT_COLORS[variant]
            )} 
          />
        </span>
      )}

      {icon && (
        <span className={cn(
          "shrink-0 flex items-center",
          size === "sm" ? "[&>svg]:w-3 [&>svg]:h-3" : size === "lg" ? "[&>svg]:w-4 [&>svg]:h-4" : "[&>svg]:w-3.5 [&>svg]:h-3.5"
        )}>
          {icon}
        </span>
      )}

      {children && <span className="truncate">{children}</span>}
    </span>
  );
};