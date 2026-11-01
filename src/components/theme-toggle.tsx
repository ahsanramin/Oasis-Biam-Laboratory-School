"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useHasMounted, THEMES } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// =========================================
// 1. SIZE CONFIGURATION
// =========================================
const SIZES = {
  sm: { button: "w-8 h-8", icon: "h-3.5 w-3.5", glow: "blur-sm" },
  md: { button: "w-9 h-9", icon: "h-4 w-4", glow: "blur-md" },
  lg: { button: "w-11 h-11", icon: "h-5 w-5", glow: "blur-lg" },
};

export interface ThemeToggleProps {
  className?: string;
  size?: keyof typeof SIZES;
}

// =========================================
// 2. MAIN COMPONENT
// =========================================
export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  const config = SIZES[size];
  const isDark = resolvedTheme === THEMES.DARK;

  // =========================================
  // HYDRATION-SAFE PLACEHOLDER
  // =========================================
  if (!mounted) {
    return (
      <div
        className={cn(
          config.button,
          "rounded-full border border-[var(--border)] bg-[var(--card)]",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? THEMES.LIGHT : THEMES.DARK)}
      className={cn(
        "group relative grid place-items-center rounded-full overflow-hidden",
        "bg-[var(--card)] border border-[var(--border)]",
        "transition-all duration-300 ease-out",
        // Hover
        "hover:bg-[var(--bg-soft)] hover:border-[var(--primary)]/40",
        "hover:scale-110",
        "hover:shadow-lg hover:shadow-[var(--primary)]/20",
        // Active
        "active:scale-95",
        // Focus (accessibility)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        config.button,
        className
      )}
    >
      
      {/* ================= AMBIENT GLOW (behind the icon) ================= */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          config.glow,
          isDark ? "bg-indigo-500/40" : "bg-amber-500/40"
        )}
        aria-hidden="true"
      />

      {/* ================= ANIMATED ICON SWAP ================= */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
          >
            <Moon
              className={cn(config.icon, "text-indigo-400 drop-shadow-[0_0_4px_rgba(129,140,248,0.5)]")}
              fill="currentColor"
              strokeWidth={1.5}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
          >
            <Sun
              className={cn(config.icon, "text-amber-500 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]")}
              fill="currentColor"
              strokeWidth={1.5}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </button>
  );
}