"use client";

import Link from "next/link";
import { Megaphone, ArrowRight, Star } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";

export function NewsTicker({ notices }: { notices: any[] }) {
  if (!notices || !notices.length) return null;

  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl overflow-hidden shadow-sm shadow-black/[0.03]">

      {/* ================= TOP HAIRLINE EDGE-LIGHT ================= */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none z-20" />

      {/* ================= AMBIENT GLOWS ================= */}
      <div className="absolute top-0 left-1/4 w-64 h-full bg-red-500/[0.08] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-full bg-[var(--primary)]/[0.1] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-full bg-brand-500/[0.04] blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center">

        {/* ================= LEFT LABEL ================= */}
        <div className="relative flex items-center gap-2.5 shrink-0 px-4 lg:px-6 py-4 bg-[var(--card)] border-r border-[var(--border)] shadow-[8px_0_20px_-12px_rgba(0,0,0,0.1)] z-10">

          {/* Pulsing Live Indicator */}
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>

          <Megaphone className="h-4 w-4 text-[var(--primary)] hidden sm:block" strokeWidth={2.5} />

          <span className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--fg)] hidden sm:block whitespace-nowrap">
            Latest
          </span>
        </div>

        {/* ================= MARQUEE ================= */}
        <div className="flex-1 overflow-hidden mask-fade-edges min-w-0">
          <Marquee speed="slow">
            {notices.map((n) => (
              <Link
                key={n._id}
                href={`/notices/${n._id}`}
                className="group/item flex items-center gap-3 px-6 py-3 mx-1 rounded-xl hover:bg-[var(--bg-soft)]/80 transition-all duration-300"
              >
                {/* Featured Badge or Dot */}
                {n.featured ? (
                  <Badge
                    variant="warning"
                    className="shrink-0 shadow-sm shadow-amber-500/20 border-amber-500/30 text-[9px] font-black uppercase tracking-[0.14em] py-0 h-5 ring-1 ring-inset ring-white/20 backdrop-blur-md"
                  >
                    <Star className="w-2.5 h-2.5 mr-1 fill-current" strokeWidth={2.5} /> Featured
                  </Badge>
                ) : (
                  <span className="relative w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 shrink-0 group-hover/item:bg-[var(--primary)] group-hover/item:scale-150 transition-all duration-300">
                    {/* Glow on hover */}
                    <span className="absolute inset-0 rounded-full bg-[var(--primary)] blur-sm opacity-0 group-hover/item:opacity-60 transition-opacity duration-300" />
                  </span>
                )}

                {/* Notice Title */}
                <span className="font-semibold text-sm text-[var(--fg)] group-hover/item:text-[var(--primary)] transition-colors duration-300 line-clamp-1 whitespace-nowrap tracking-tight">
                  {n.title}
                </span>

                {/* Animated Arrow */}
                <ArrowRight
                  className="h-3.5 w-3.5 text-[var(--primary)] opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 shrink-0"
                  strokeWidth={2.5}
                />

                {/* Divider Dot */}
                <span className="ml-3 text-[var(--border)] text-lg leading-none select-none">•</span>
              </Link>
            ))}
          </Marquee>
        </div>

        {/* ================= RIGHT CTA ================= */}
        <div className="hidden lg:flex shrink-0 px-4 lg:px-6 py-3 bg-[var(--card)] border-l border-[var(--border)] z-10">
          <Link
            href="/notices"
            className="group/all relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.16em] text-[var(--primary)] hover:text-[var(--primary-hover)] hover:bg-[var(--primary)]/[0.08] ring-1 ring-inset ring-transparent hover:ring-[var(--primary)]/20 transition-all duration-300"
          >
            <span>View All</span>
            <ArrowRight
              className="h-3.5 w-3.5 group-hover/all:translate-x-1 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </Link>
        </div>

      </div>
    </section>
  );
}