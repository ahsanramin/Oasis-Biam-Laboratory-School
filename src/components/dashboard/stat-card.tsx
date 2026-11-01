"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// =========================================
// PREMIUM TINT SYSTEM
// =========================================
const TINTS = {
  brand: {
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "group-hover:border-blue-500/40",
    orb: "bg-blue-500",
  },
  success: {
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "group-hover:border-emerald-500/40",
    orb: "bg-emerald-500",
  },
  warning: {
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "group-hover:border-amber-500/40",
    orb: "bg-amber-500",
  },
  danger: {
    gradient: "from-red-500 to-rose-500",
    glow: "shadow-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "group-hover:border-red-500/40",
    orb: "bg-red-500",
  },
  violet: {
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/30",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
    border: "group-hover:border-violet-500/40",
    orb: "bg-violet-500",
  },
};

type Tint = keyof typeof TINTS;
type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tint?: Tint;
  trend?: Trend;
  trendValue?: string;
  delay?: number;
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  tint = "brand",
  trend,
  trendValue,
  delay = 0
}: StatCardProps) {
  const theme = TINTS[tint];

  // Trend configuration
  const trendConfig = trend === "up" 
    ? { Icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    : trend === "down"
    ? { Icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" }
    : { Icon: Minus, color: "text-[var(--fg-muted)]", bg: "bg-[var(--bg-soft)]" };

  const TrendIcon = trendConfig.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card 
        className={cn(
          "group relative overflow-hidden rounded-[1.75rem] p-6 cursor-default",
          "bg-[var(--card)]/70 backdrop-blur-xl border-[var(--border)]",
          "hover:shadow-2xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1",
          "transition-all duration-300",
          theme.border
        )}
      >
        {/* ================= BACKGROUND ORB ================= */}
        <div 
          className={cn(
            "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none",
            "group-hover:opacity-40 group-hover:scale-125 transition-all duration-500",
            theme.orb
          )} 
        />

        {/* ================= HEADER ROW ================= */}
        <div className="relative flex items-start justify-between mb-5 z-10">
          {/* Icon */}
          <div 
            className={cn(
              "w-12 h-12 rounded-2xl bg-gradient-to-br grid place-items-center text-white shadow-lg shrink-0",
              "group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300",
              theme.gradient,
              theme.glow
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* Trend Pill */}
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold",
              trendConfig.bg,
              trendConfig.color
            )}>
              <TrendIcon className="h-3 w-3" />
              {trendValue}
            </div>
          )}
        </div>

        {/* ================= VALUE & LABEL ================= */}
        <div className="relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[var(--fg-muted)] mb-1.5">
            {label}
          </p>
          <h3 className="text-3xl font-black text-[var(--fg)] tracking-tight leading-none">
            {value}
          </h3>
        </div>

        {/* ================= ANIMATED PROGRESS BAR ================= */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]/50 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
            className={cn("h-full bg-gradient-to-r rounded-r-full", theme.gradient)}
          />
        </div>
      </Card>
    </motion.div>
  );
}