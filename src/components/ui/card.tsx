import * as React from "react";
import { cn } from "@/lib/utils";

// =========================================
// 1. TYPE DEFINITIONS
// =========================================
type Variant = 
  | "default" 
  | "glass" 
  | "gradient" 
  | "interactive" 
  | "flat" 
  | "outline";

// =========================================
// 2. VARIANT STYLES
// =========================================
const VARIANTS: Record<Variant, string> = {
  // DEFAULT: Clean solid card with layered shadow
  default: `
    bg-[var(--card)] 
    border border-[var(--border)] 
    shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]
    hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)]
    hover:border-[var(--border-hover,var(--primary))]
  `,
  
  // GLASS: Frosted glassmorphism (uses global .glass-panel)
  glass: `
    bg-[var(--card)]/70 
    backdrop-blur-xl 
    border border-[var(--border)] 
    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
  `,
  
  // GRADIENT: Subtle diagonal gradient for hero cards
  gradient: `
    bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--bg-soft)]
    border border-[var(--border)] 
    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
  `,
  
  // INTERACTIVE: Full hover experience (lift + glow + border)
  interactive: `
    bg-[var(--card)] 
    border border-[var(--border)] 
    shadow-[0_1px_3px_rgba(0,0,0,0.04)]
    hover:border-[var(--primary)]/40 
    hover:shadow-2xl hover:shadow-[var(--primary)]/10 
    hover:-translate-y-1 
    cursor-pointer
  `,
  
  // FLAT: Minimal, no border (great for nested content)
  flat: `
    bg-[var(--bg-soft)] 
    border border-transparent 
    hover:bg-[var(--card)]
  `,
  
  // OUTLINE: Border only, transparent bg
  outline: `
    bg-transparent 
    border-2 border-[var(--border)] 
    hover:border-[var(--primary)]/50
  `,
};

// =========================================
// 3. COMPONENT INTERFACE
// =========================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style of the card */
  variant?: Variant;
  /** Add a branded glow shadow */
  glow?: boolean;
  /** Add a subtle primary-colored gradient shine on hover */
  shine?: boolean;
}

// =========================================
// 4. MAIN COMPONENT
// =========================================
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = "default", 
    glow = false, 
    shine = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "group relative rounded-2xl transition-all duration-300 ease-out overflow-hidden",
          
          // Variant styles
          VARIANTS[variant],
          
          // Optional branded glow
          glow && "shadow-xl shadow-[var(--primary)]/15",
          
          className
        )}
        {...props}
      >
        {/* Optional Shine Overlay - appears on hover */}
        {shine && (
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none",
              "bg-gradient-to-br from-[var(--primary)]/8 via-transparent to-transparent",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            )}
          />
        )}

        {/* Content wrapper to ensure content is above the shine overlay */}
        <div className="relative z-[1] h-full">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";