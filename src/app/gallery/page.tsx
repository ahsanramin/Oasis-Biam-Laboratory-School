"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { X, ChevronLeft, ChevronRight, ImageIcon, Maximize2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api, extractArray } from "@/lib/api";

// Type matching your backend gallery schema
type GalleryImage = {
  _id: string;
  title: string;
  image: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // ================= DATA FETCHING =================
  useEffect(() => {
    async function fetchImages() {
      try {
        // 🔧 FIX: Added ?limit=500 so ALL images are returned (backend was defaulting to 8)
        const r = await api.get<any>("/api/gallery?limit=500");
        const all = extractArray<GalleryImage>(r);
        setImages(all); // No slicing — show every image returned
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchImages();
  }, []);

  // ================= KEYBOARD NAVIGATION =================
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (previewIndex === null) return;

      if (e.key === "Escape") setPreviewIndex(null);
      if (e.key === "ArrowRight") setPreviewIndex((prev) => (prev! + 1) % images.length);
      if (e.key === "ArrowLeft") setPreviewIndex((prev) => (prev! - 1 + images.length) % images.length);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, images.length]);

  // ================= HELPERS =================
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev! + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev! - 1 + images.length) % images.length);
  };

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Glimpses into life at Oasis BIAM"
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 overflow-hidden">

        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-brand-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-24 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ================= GALLERY GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`relative rounded-2xl sm:rounded-[1.5rem] overflow-hidden bg-[var(--card)]/60 backdrop-blur-md border border-[var(--border)] ${
                  i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <Skeleton className="absolute inset-0 rounded-none" />
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative text-center py-32 border border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--card)]/40 backdrop-blur-md overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Layered medallion icon */}
            <div className="relative inline-flex mb-7">
              <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                  <ImageIcon className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 tracking-tight">No photos yet</h3>
            <p className="text-sm text-[var(--fg-muted)] max-w-md mx-auto font-medium leading-relaxed">
              We are currently updating our gallery. Check back soon to see the vibrant life at Oasis BIAM!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px]">
            {images.map((img, i) => {
              // Premium Bento/Masonry — every 5th image is featured (2×2)
              const isFeatured = i % 5 === 0;

              return (
                <motion.button
                  key={img._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (i % 8) * 0.05, duration: 0.6, ease: EASE }}
                  onClick={() => setPreviewIndex(i)}
                  className={`
                    relative rounded-2xl sm:rounded-[1.5rem] overflow-hidden group
                    bg-[var(--card)] border border-[var(--border)]
                    ring-1 ring-inset ring-white/[0.04]
                    hover:border-[var(--primary)]/40
                    hover:shadow-2xl hover:shadow-black/[0.15]
                    transition-all duration-500
                    ${isFeatured ? "md:col-span-2 md:row-span-2" : ""}
                  `}
                >
                  {/* Outer hover aura */}
                  <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-br from-brand-500/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                  <Image
                    src={img.image}
                    alt={img.title || "Gallery image"}
                    fill
                    className="object-cover group-hover:scale-[1.08] transition-transform duration-[900ms] ease-out"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized
                  />

                  {/* Always-on subtle darkening at bottom for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Premium hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 sm:p-5 text-left">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 ring-1 ring-inset ring-white/20 grid place-items-center mb-3 shadow-lg shadow-black/20">
                        <Maximize2 className="h-4 w-4 text-white" strokeWidth={2.5} />
                      </div>
                      <p className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-lg tracking-tight">
                        {img.title || "Untitled"}
                      </p>
                    </div>
                  </div>

                  {/* Top-left index badge (subtle, always visible on featured) */}
                  <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.16em] border border-white/15">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= PREMIUM LIGHTBOX ================= */}
      <AnimatePresence>
        {previewIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden"
            onClick={() => setPreviewIndex(null)}
          >
            {/* Radial depth overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            {/* Ambient glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-brand-500/[0.08] rounded-full blur-[120px] pointer-events-none" />

            {/* ===== Top Bar (Counter + Close) ===== */}
            <div className="relative flex items-center justify-between p-4 sm:p-6 absolute top-0 inset-x-0 z-50">
              {/* Counter pill */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 ring-1 ring-inset ring-white/[0.05]">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
                <span className="text-white/80 font-black tracking-[0.18em] text-[11px] uppercase">
                  {previewIndex + 1} <span className="text-white/40">/</span> {images.length}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setPreviewIndex(null)}
                className="group/close w-12 h-12 rounded-full bg-white/[0.06] hover:bg-red-500/90 backdrop-blur-xl text-white grid place-items-center transition-all duration-300 border border-white/10 hover:border-red-400/50 hover:scale-110 ring-1 ring-inset ring-white/[0.05]"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5 group-hover/close:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
              </button>
            </div>

            {/* ===== Navigation Arrows ===== */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="group/nav absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.06] hover:bg-white/20 backdrop-blur-xl text-white grid place-items-center transition-all duration-300 z-50 border border-white/10 hover:border-white/25 hover:scale-110 ring-1 ring-inset ring-white/[0.05] shadow-lg shadow-black/30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 group-hover/nav:-translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
                </button>
                <button
                  onClick={nextImage}
                  className="group/nav absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.06] hover:bg-white/20 backdrop-blur-xl text-white grid place-items-center transition-all duration-300 z-50 border border-white/10 hover:border-white/25 hover:scale-110 ring-1 ring-inset ring-white/[0.05] shadow-lg shadow-black/30"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 group-hover/nav:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
                </button>
              </>
            )}

            {/* ===== Main Image Area ===== */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-16 relative z-10">
              <motion.div
                key={previewIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative w-full max-w-6xl aspect-video sm:aspect-auto sm:h-[78vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[previewIndex].image}
                  alt={images[previewIndex].title || "Preview"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </motion.div>
            </div>

            {/* ===== Bottom Title Bar ===== */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center z-40 pointer-events-none">
              <motion.div
                key={`title-${previewIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
              >
                <h3 className="text-white text-lg sm:text-2xl font-bold drop-shadow-2xl tracking-tight">
                  {images[previewIndex].title || "Untitled"}
                </h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em] mt-2">
                  Use ← → to navigate · Esc to close
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}