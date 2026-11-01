"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

// =========================================
// 1. TYPES
// =========================================
type Size = "sm" | "md" | "lg";
type State = "default" | "error" | "success";

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-14 px-5 text-base rounded-2xl",
};

// =========================================
// 2. COMPONENT INTERFACE
// =========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual state of the input (shows error/success styling) */
  state?: State;
  /** Optional icon on the left */
  leftIcon?: React.ReactNode;
  /** Optional icon on the right (ignored if type="password") */
  rightIcon?: React.ReactNode;
  /** Optional helper text displayed below the input */
  helperText?: string;
  /** Input size */
  inputSize?: Size;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    state = "default", 
    leftIcon,
    rightIcon,
    helperText,
    inputSize = "md",
    type,
    ...props 
  }, ref) => {
    
    // Password visibility toggle
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const hasLeftIcon = Boolean(leftIcon);
    const hasRightElement = Boolean(rightIcon) || isPassword || Boolean(helperText);

    // =========================================
    // DYNAMIC STATE STYLES
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
        <div className="relative group">
          
          {/* ================= LEFT ICON ================= */}
          {hasLeftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 pointer-events-none flex items-center">
              <span className="[&>svg]:w-4 [&>svg]:h-4">
                {leftIcon}
              </span>
            </div>
          )}

          {/* ================= INPUT FIELD ================= */}
          <input
            ref={ref}
            type={actualType}
            className={cn(
              // Base styles
              "w-full bg-[var(--bg-soft)] text-[var(--fg)] font-medium",
              "placeholder:text-[var(--fg-muted)] placeholder:font-normal",
              "border-2 outline-none transition-all duration-300",
              "hover:bg-[var(--card)]",
              "focus:bg-[var(--card)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              
              // Apply size
              SIZES[inputSize],
              
              // Apply state
              stateStyles[state],
              
              // Adjust padding if icons exist
              hasLeftIcon && (inputSize === "lg" ? "pl-12" : "pl-10"),
              hasRightElement && (isPassword ? (inputSize === "lg" ? "pr-12" : "pr-10") : (inputSize === "lg" ? "pr-12" : "pr-10")),
              
              className
            )}
            {...props}
          />

          {/* ================= RIGHT SIDE: Password Toggle ================= */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--border)] transition-colors duration-200"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {/* ================= RIGHT SIDE: Icon or State Indicator ================= */}
          {!isPassword && (rightIcon || state !== "default") && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] flex items-center pointer-events-none">
              {state === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : state === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="[&>svg]:w-4 [&>svg]:h-4">
                  {rightIcon}
                </span>
              )}
            </div>
          )}

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

Input.displayName = "Input";