"use client";

import { LucideIcon, Inbox, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action,
  className
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden text-center flex flex-col items-center justify-center",
        "py-20 px-6 rounded-[2.5rem]",
        "bg-[var(--card)]/70 backdrop-blur-xl",
        "border-2 border-dashed border-[var(--border)]",
        className
      )}
    >
      
      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* ================= FLOATING ICON ORB ================= */}
      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-8"
      >
        {/* Outer glowing ring */}
        <div className="absolute inset-0 gradient-brand rounded-[2rem] blur-xl opacity-30" />
        
        {/* Inner icon container */}
        <div className="relative w-20 h-20 rounded-[1.5rem] gradient-brand text-white grid place-items-center shadow-2xl shadow-[var(--primary)]/30 border border-white/20">
          <Icon className="h-10 w-10" strokeWidth={1.5} />
        </div>

        {/* Small Sparkle accent */}
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--card)] border border-[var(--border)] grid place-items-center shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
        </div>
      </motion.div>

      {/* ================= TEXT CONTENT ================= */}
      <div className="relative z-10 max-w-sm mx-auto">
        <h3 className="text-2xl font-black text-[var(--fg)] mb-2 tracking-tight">
          {title}
        </h3>
        
        {description && (
          <p className="text-[var(--fg-muted)] text-sm sm:text-base leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      {/* ================= ACTION AREA ================= */}
      {action && (
        <div className="relative z-10 mt-8">
          {action}
        </div>
      )}

    </motion.div>
  );
}