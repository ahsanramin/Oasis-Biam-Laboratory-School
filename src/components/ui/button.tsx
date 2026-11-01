import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// =========================================
// 1. TYPE DEFINITIONS
// =========================================
type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
type Size = "sm" | "md" | "lg" | "icon";

// =========================================
// 2. STYLE CONFIGURATION
// =========================================
const VARIANTS: Record<Variant, string> = {
  // Primary: Gradient + Soft Glow + Glass Edge
  primary: `
    gradient-brand text-white 
    shadow-lg shadow-[var(--primary)]/25 
    hover:shadow-xl hover:shadow-[var(--primary)]/40 hover:brightness-110 
    border border-white/10
  `,
  // Secondary: Solid soft background
  secondary: `
    bg-[var(--bg-soft)] text-[var(--fg)] 
    border border-[var(--border)] 
    hover:bg-[var(--card)] hover:border-[var(--primary)]/30
    shadow-sm
  `,
  // Outline: Clean border only
  outline: `
    border-2 border-[var(--border)] text-[var(--fg)] 
    hover:border-[var(--primary)]/50 hover:bg-[var(--bg-soft)] hover:text-[var(--primary)]
  `,
  // Ghost: Transparent until hover
  ghost: `
    bg-transparent text-[var(--fg-muted)] 
    hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]
  `,
  // Danger: Red gradient with glowing shadow
  danger: `
    bg-gradient-to-r from-red-500 to-rose-500 text-white 
    shadow-lg shadow-red-500/25 
    hover:shadow-xl hover:shadow-red-500/40 hover:brightness-110
    border border-white/10
  `,
  // Glass: Frosted glass effect
  glass: `
    bg-[var(--card)]/60 backdrop-blur-md text-[var(--fg)] 
    border border-[var(--border)] 
    hover:bg-[var(--card)] hover:border-[var(--primary)]/30
    shadow-sm
  `,
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-lg gap-1.5",
  md: "h-11 px-6 text-sm rounded-xl gap-2",
  lg: "h-14 px-8 text-base rounded-2xl gap-2.5",
  icon: "h-11 w-11 rounded-xl",
};

// =========================================
// 3. COMPONENT INTERFACE
// =========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

// =========================================
// 4. MAIN COMPONENT
// =========================================
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          "group relative inline-flex items-center justify-center font-bold",
          "transition-all duration-300 ease-out",
          "active:scale-95 active:translate-y-0",
          // Focus ring (accessible and premium looking)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          // Disabled state
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
          // Apply variant and size
          VARIANTS[variant],
          SIZES[size],
          // Subtle lift on hover (unless it's a loading or icon-only state)
          !loading && "hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" strokeWidth={2.5} />
        )}
        
        {/* Content Wrapper - ensures text and icons align perfectly */}
        <span className="flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";