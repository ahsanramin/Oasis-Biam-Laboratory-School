"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";

// =========================================
// 1. TYPES
// =========================================
type Size = "sm" | "md" | "lg";
type State = "default" | "error" | "success";

const SIZES: Record<Size, string> = {
  sm: "h-9 text-sm rounded-lg",
  md: "h-11 text-sm rounded-xl",
  lg: "h-14 text-base rounded-2xl",
};

// =========================================
// 2. COMPONENT INTERFACE
// =========================================
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Visual state of the select */
  state?: State;
  /** Optional helper text displayed below */
  helperText?: string;
  /** Select size */
  selectSize?: Size;
  /** Optional icon shown on the left */
  leftIcon?: React.ReactNode;
  /** Optional placeholder option text */
  placeholder?: string;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    children, 
    state = "default",
    helperText,
    selectSize = "md",
    leftIcon,
    placeholder,
    disabled,
    ...props 
  }, ref) => {
    
    const hasLeftIcon = Boolean(leftIcon);

    // =========================================
    // STATE STYLES
    // =========================================
    const stateStyles: Record<State, string> = {
      default: `
        border-[var(--border)]
        focus:border-[var(--primary)]/60 
        focus:ring-4 focus:ring-[var(--primary)]/10
      `,
      error: `
        border-red-500/50 
        focus:border-red-500 
        focus:ring-4 focus:ring-red-500/10
        text-red-500
      `,
      success: `
        border-emerald-500/50 
        focus:border-emerald-500 
        focus:ring-4 focus:ring-emerald-500/10
      `,
    };

    return (
      <div className="w-full">
        <div className={cn("relative group", disabled && "opacity-50 cursor-not-allowed")}>
          
          {/* ================= LEFT ICON ================= */}
          {hasLeftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 pointer-events-none flex items-center z-10">
              <span className="[&>svg]:w-4 [&>svg]:h-4">
                {leftIcon}
              </span>
            </div>
          )}

          {/* ================= NATIVE SELECT ================= */}
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base
              "w-full bg-[var(--bg-soft)] text-[var(--fg)] font-medium",
              "border-2 outline-none transition-all duration-300",
              "hover:bg-[var(--card)]",
              "focus:bg-[var(--card)]",
              "cursor-pointer appearance-none", // hides native arrow
              "disabled:cursor-not-allowed",
              
              // Custom arrow spacing (right padding)
              selectSize === "lg" ? "pl-5 pr-14" : "pl-4 pr-11",
              hasLeftIcon && (selectSize === "lg" ? "pl-12" : "pl-10"),
              
              // Apply size
              SIZES[selectSize],
              
              // Apply state
              stateStyles[state],
              
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          {/* ================= CUSTOM CHEVRON ================= */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
            {/* Status indicator (error/success) */}
            {state === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
            {state === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            
            {/* Animated Chevron */}
            <div className={cn(
              "grid place-items-center rounded-md transition-all duration-300",
              "text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] group-focus-within:rotate-180"
            )}>
              <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
            </div>
          </div>

        </div>

        {/* ================= HELPER TEXT ================= */}
        {helperText && (
          <p className={cn(
            "mt-1.5 text-xs font-medium px-1",
            state === "error" ? "text-red-500" : 
            state === "success" ? "text-emerald-500" : 
            "text-[var(--fg-muted)]"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";