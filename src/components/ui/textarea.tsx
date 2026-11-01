"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// =========================================
// 1. TYPES
// =========================================
type Size = "sm" | "md" | "lg";
type State = "default" | "error" | "success";

const SIZES: Record<Size, string> = {
  sm: "min-h-[80px] px-3.5 py-2.5 text-sm rounded-lg",
  md: "min-h-[120px] px-4 py-3 text-sm rounded-xl",
  lg: "min-h-[160px] px-5 py-4 text-base rounded-2xl",
};

// =========================================
// 2. COMPONENT INTERFACE
// =========================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual state of the textarea */
  state?: State;
  /** Optional helper text displayed below */
  helperText?: string;
  /** Textarea size */
  textareaSize?: Size;
  /** Show character counter (requires maxLength) */
  showCounter?: boolean;
  /** Auto-resize as user types */
  autoResize?: boolean;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    state = "default",
    helperText,
    textareaSize = "md",
    showCounter = false,
    autoResize = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    ...props 
  }, ref) => {
    
    // =========================================
    // INTERNAL REF + AUTO-RESIZE LOGIC
    // =========================================
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    // Track character count
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 
      typeof defaultValue === "string" ? defaultValue.length : 0
    );

    // Handle auto-resize on mount and when value changes externally
    React.useEffect(() => {
      if (!autoResize || !internalRef.current) return;
      const el = internalRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [value, autoResize]);

    // Unified handler — handles both char count AND resize
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      
      if (autoResize && internalRef.current) {
        const el = internalRef.current;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      }
      
      onChange?.(e);
    };

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

    // Character count color
    const getCounterColor = () => {
      if (!maxLength) return "text-[var(--fg-muted)]";
      const ratio = charCount / maxLength;
      if (ratio > 0.9) return "text-red-500 font-bold";
      if (ratio > 0.7) return "text-amber-500 font-bold";
      return "text-[var(--fg-muted)]";
    };

    return (
      <div className="w-full">
        <div className="relative group">
          
          <textarea
            ref={mergedRef}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            maxLength={maxLength}
            className={cn(
              // Base
              "w-full bg-[var(--bg-soft)] text-[var(--fg)] font-medium",
              "placeholder:text-[var(--fg-muted)] placeholder:font-normal",
              "border-2 outline-none transition-all duration-300",
              "hover:bg-[var(--card)]",
              "focus:bg-[var(--card)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              
              // Resize behavior
              autoResize 
                ? "resize-none overflow-hidden" 
                : "resize-y scrollbar-thin",
              
              // Apply size
              SIZES[textareaSize],
              
              // Apply state
              stateStyles[state],
              
              // Extra right padding for status icon
              state !== "default" && "pr-12",
              
              className
            )}
            {...props}
          />

          {/* STATUS ICON */}
          {state !== "default" && (
            <div className="absolute right-4 top-4 pointer-events-none">
              {state === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          )}

        </div>

        {/* FOOTER (Helper + Counter) */}
        {(helperText || (showCounter && maxLength)) && (
          <div className="flex items-start justify-between gap-4 mt-1.5 px-1">
            {helperText ? (
              <p className={cn(
                "text-xs font-medium flex-1",
                state === "error" ? "text-red-500" : 
                state === "success" ? "text-emerald-500" : 
                "text-[var(--fg-muted)]"
              )}>
                {helperText}
              </p>
            ) : (
              <span />
            )}
            
            {showCounter && maxLength && (
              <span className={cn("text-xs font-medium tabular-nums shrink-0", getCounterColor())}>
                {charCount.toLocaleString()} / {maxLength.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";