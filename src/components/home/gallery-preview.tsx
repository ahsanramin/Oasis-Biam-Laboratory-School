"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Maximize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, extractArray } from "@/lib/api";

type GalleryImage = {
  _id: string;
  title: string;
  image: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH LIVE DATA FROM BACKEND
  // =========================================
  useEffect(() => {
    async function loadGallery() {
      try {
        // 🔧 FIX: Added ?limit=500 so enough images are returned (was defaulting to 8)
        const r = await api.get<any>("/api/gallery?limit=500");
        setImages(extractArray<GalleryImage>(r));
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadGallery();
  }, []);

  // =========================================
  // LOADING STATE
  // =========================================
  if (loading) {
    return (
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <Skeleton className="h-7 w-40 rounded-full mb-6" />
            <Skeleton className="h-14 w-2/3 max-w-2xl rounded-xl mb-4" />
            <Skeleton className="h-5 w-1/2 max-w-lg rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] gap-4 lg:gap-6">
            {/* Matches the real 10-image bento layout */}
            <div className="col-span-2 row-span-2 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`a-${i}`} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            ))}
            <div className="col-span-2 row-span-2 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`b-${i}`} className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================
  // EMPTY STATE - HIDE COMPLETELY
  // =========================================
  if (!images || images.length === 0) {
    return null; // Hides the whole section if no images exist
  }

  // =========================================
  // MAIN RENDER
  // =========================================
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">

      {/* ================= AMBIENT BACKGROUND GLOWS ================= */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[520px] h-[520px] bg-[var(--primary)]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[520px] h-[520px] bg-amber-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Radial dot grid */}
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

        {/* ================= HEADER ================= */}
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
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Our Moments
            </div>

            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.05]">
              Life at <br className="hidden sm:block" />
              <span className="gradient-text">Oasis BIAM.</span>
            </h2>

            <p className="mt-4 text-base lg:text-lg text-[var(--fg-muted)] font-medium leading-relaxed">
              Explore our vibrant campus, innovative classrooms, and the joyful moments that define our community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link href="/gallery">
              <Button
                variant="outline"
                size="lg"
                className="relative rounded-xl font-bold group bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] overflow-hidden text-[12px] uppercase tracking-[0.14em]"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                {/* Hover aura */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-500/[0.12] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <span className="relative">View Full Gallery</span>
                <ArrowRight
                  className="relative h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= BENTO GRID — 10 PHOTOS ================= */}
        {/*
          Layout (desktop, 4 columns):
            - i=0: featured 2×2 (cols 1-2, rows 1-2)
            - i=1..4: regular 1×1 (cols 3-4, rows 1-2)   → 4 photos
            - i=5: featured 2×2 (cols 1-2, rows 3-4)
            - i=6..9: regular 1×1 (cols 3-4, rows 3-4)   → 4 photos
          Total: 2 featured (2×2 each = 8 cells) + 8 regular (1×1 each = 8 cells) = 16 cells = 4 perfect rows of 4.

          Layout (mobile, 2 columns):
            - i=0: featured 2×2 → full-width rows 1-2
            - i=1..4: regular → 2 rows of 2
            - i=5: featured 2×2 → full-width rows 5-6
            - i=6..9: regular → 2 rows of 2
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] gap-4 lg:gap-6">
          {images.slice(0, 10).map((img, i) => {
            // Two features (i=0 and i=5) create a perfectly balanced bento
            const isFeatured = i === 0 || i === 5;

            return (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.04, duration: 0.6, ease: EASE }}
                className={`
                  relative rounded-[2rem] overflow-hidden group cursor-pointer
                  border border-[var(--border)] bg-[var(--card)]
                  ring-1 ring-inset ring-white/[0.04]
                  hover:border-[var(--primary)]/40
                  hover:shadow-2xl hover:shadow-black/[0.15]
                  transition-all duration-500
                  ${isFeatured ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
                `}
              >
                {/* Top hairline edge-light */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-20 pointer-events-none" />

                {/* Image */}
                <Image
                  src={img.image}
                  alt={img.title || `Gallery Preview ${i + 1}`}
                  fill
                  sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                />

                {/* Permanent bottom-heavy gradient for depth + readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />

                {/* Ghost index watermark (top-left) */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/15 text-white text-[10px] font-black uppercase tracking-[0.16em] ring-1 ring-inset ring-white/10">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Camera icon badge (top-right) */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 ring-1 ring-inset ring-white/10 grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                  <Camera className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>

                {/* Hover overlay with title + expand */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70 mb-1">
                        Campus Life
                      </p>
                      <p className="text-white font-bold text-base sm:text-lg leading-tight line-clamp-1 tracking-tight drop-shadow-lg">
                        {img.title || "Capturing the Moment"}
                      </p>
                    </div>

                    {/* Floating expand icon */}
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 ring-1 ring-inset ring-white/20 grid place-items-center shrink-0 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                      <Maximize2 className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Animated base accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500 z-10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}