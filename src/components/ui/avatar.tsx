"use client";

import Image from "next/image";
import { cn, initials } from "@/lib/utils";

// =========================================
// SIZE SYSTEM
// =========================================
const SIZES = {
  xs: { container: "w-6 h-6 text-[8px]", ring: "ring-1", dot: "w-1.5 h-1.5 border" },
  sm: { container: "w-8 h-8 text-[10px]", ring: "ring-2", dot: "w-2 h-2 border" },
  md: { container: "w-10 h-10 text-xs", ring: "ring-2", dot: "w-2.5 h-2.5 border-2" },
  lg: { container: "w-14 h-14 text-base", ring: "ring-2", dot: "w-3 h-3 border-2" },
  xl: { container: "w-20 h-20 text-xl", ring: "ring-[3px]", dot: "w-4 h-4 border-[3px]" },
} as const;

// =========================================
// STATUS CONFIGURATION
// =========================================
const STATUS_COLORS = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
} as const;

type Size = keyof typeof SIZES;
type Status = keyof typeof STATUS_COLORS;

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: Size;
  status?: Status;
  className?: string;
  /** Disable the premium gradient ring */
  plain?: boolean;
}

export function Avatar({ 
  src, 
  name, 
  size = "md", 
  status,
  className,
  plain = false,
}: AvatarProps) {
  const config = SIZES[size];
  const safeInitials = typeof initials === "function" ? initials(name) : (name?.[0] || "?");

  return (
    <div className={cn("relative inline-block shrink-0 group", className)}>
      
      {/* ================= GRADIENT RING WRAPPER ================= */}
      <div 
        className={cn(
          "relative rounded-full p-[2px] transition-all duration-300",
          !plain && "bg-gradient-to-br from-[var(--grad-from)] via-[var(--primary)] to-[var(--grad-to)]",
          "group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/30",
          "shadow-md shadow-[var(--primary)]/10"
        )}
      >
        {/* Inner Avatar Circle */}
        <div 
          className={cn(
            "relative rounded-full overflow-hidden bg-[var(--bg-soft)]",
            "border-2 border-[var(--card)]", // creates a clean gap between gradient ring and image
            config.container
          )}
        >
          {src ? (
            <Image 
              src={src} 
              alt={name} 
              fill 
              sizes="80px"
              className="object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--grad-to)] text-white grid place-items-center font-black tracking-tight">
              {safeInitials}
            </div>
          )}
        </div>
      </div>

      {/* ================= STATUS INDICATOR ================= */}
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-[var(--card)]",
            "shadow-sm",
            STATUS_COLORS[status],
            config.dot
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}