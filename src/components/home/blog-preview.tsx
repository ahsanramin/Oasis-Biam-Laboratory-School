"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function BlogPreview({ articles }: { articles: any[] }) {
  if (!articles || !articles.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND ================= */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 65% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">

        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/70 backdrop-blur-md border border-[var(--primary)]/25 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-5">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Latest Insights
            </div>

            <h2 className="text-3xl lg:text-5xl font-black font-display leading-[1.05] tracking-tight">
              Educational <br className="hidden sm:block" />
              <span className="gradient-text">Tips &amp; Articles.</span>
            </h2>

            <p className="mt-4 text-base lg:text-lg text-[var(--fg-muted)] font-medium leading-relaxed">
              Stay updated with the latest news, parenting tips, and academic resources from our expert educators.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link href="/blog">
              <Button
                variant="outline"
                size="lg"
                className="relative rounded-xl font-bold group bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] overflow-hidden text-[12px] uppercase tracking-[0.14em]"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                {/* Hover aura */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="relative">View All Articles</span>
                <ArrowRight
                  className="relative h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= ARTICLES GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {articles.slice(0, 3).map((a, i) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              className="relative group"
            >
              {/* Outer hover aura */}
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.12] via-transparent to-amber-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

              <Link href={`/blog/${a.slug}`} className="block h-full">
                <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-500 h-full flex flex-col">

                  {/* Top hairline edge-light */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />

                  {/* Image Section */}
                  <div className="relative aspect-[16/10] bg-[var(--bg-soft)] overflow-hidden">
                    {a.coverImage ? (
                      <Image
                        src={a.coverImage}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-brand grid place-items-center text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                        <BookOpen className="h-12 w-12 opacity-50 relative" strokeWidth={2} />
                      </div>
                    )}

                    {/* Gradient overlay (bottom-heavy, always visible) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Ghost index */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/15 text-white text-[10px] font-black uppercase tracking-[0.16em] ring-1 ring-inset ring-white/10">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <Badge
                      className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-white/20 rounded-full z-10"
                    >
                      {a.category || "Education"}
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col relative">

                    {/* Title */}
                    <h3 className="font-bold text-lg sm:text-xl leading-snug mb-3 group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2 tracking-tight">
                      {a.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[var(--fg-muted)] mb-6 line-clamp-3 flex-1 leading-relaxed font-medium">
                      {a.excerpt || "Click to read the full article and discover more insights."}
                    </p>

                    {/* Meta Info Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-[var(--border)] mt-auto">

                      {/* Meta chips */}
                      <div className="flex items-center gap-3.5 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                          {formatDate(a.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={2.5} />
                          {a.readTime || 3} min
                        </span>
                      </div>

                      {/* Read More Indicator */}
                      <div className="relative w-9 h-9 rounded-full bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]/20 grid place-items-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white group-hover:ring-[var(--primary)] group-hover:shadow-lg group-hover:shadow-brand-500/30 group-hover:scale-110 transition-all duration-500">
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  {/* Animated base accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}