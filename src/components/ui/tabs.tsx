"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

const TabContext = createContext<{ value: string; onChange: (v: string) => void } | null>(null);

export function Tabs({ defaultValue, children, className }: { defaultValue: string; children: ReactNode; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  return <TabContext.Provider value={{ value, onChange: setValue }}><div className={className}>{children}</div></TabContext.Provider>;
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)] overflow-x-auto scrollbar-none max-w-full", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("TabsTrigger must be inside Tabs");
  const active = ctx.value === value;
  return (
    <button onClick={() => ctx.onChange(value)} className={cn("px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all", active ? "gradient-brand text-white shadow-lg shadow-brand-500/25" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--card)]", className)}>{children}</button>
  );
}