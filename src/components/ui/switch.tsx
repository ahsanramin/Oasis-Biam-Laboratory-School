"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// =========================================
// 1. TYPES
// =========================================
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { track: string; thumb: string; translate: string }> = {
  sm: { track: "w-9 h-5", thumb: "w-3.5 h-3.5", translate: "translate-x-4" },
  md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
  lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
};

// =========================================
// 2. INTERFACE
// =========================================
export interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  size?: Size;
  disabled?: boolean;
  className?: string;
  id?: string;
}

// =========================================
// 3. MAIN COMPONENT
// =========================================
export function Switch({
  checked,
  onChange,
  label,
  description,
  size = "md",
  disabled = false,
  className,
  id,
}: SwitchProps) {
  const config = SIZES[size];
  const autoId = React.useId();
  const switchId = id || autoId;

  const handleToggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-60 cursor-not-allowed", className)}>
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle"}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          // Base
          "relative rounded-full shrink-0 transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          "active:scale-95",
          config.track,
          
          // States
          checked 
            ? "gradient-brand shadow-lg shadow-[var(--primary)]/30" 
            : "bg-[var(--border)] hover:bg-[var(--fg-muted)]/30",
          
          // Disabled
          disabled && "cursor-not-allowed"
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md",
            "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", // Spring easing
            config.thumb,
            checked 
              ? cn("left-0.5", config.translate, "shadow-[0_2px_4px_rgba(0,0,0,0.2)]") 
              : "left-0.5"
          )}
        />
        
        {/* Subtle active glow ring */}
        {checked && (
          <span className="absolute inset-0 rounded-full gradient-brand blur-md opacity-50 -z-10" />
        )}
      </button>

      {/* Label & Description */}
      {(label || description) && (
        <div className="flex-1 select-none">
          <label
            htmlFor={switchId}
            className={cn(
              "block font-bold text-[var(--fg)] leading-tight cursor-pointer",
              size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
              disabled && "cursor-not-allowed"
            )}
          >
            {label}
          </label>
          
          {description && (
            <p className={cn(
              "text-[var(--fg-muted)] font-medium leading-relaxed mt-0.5",
              size === "sm" ? "text-[10px]" : "text-xs"
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}