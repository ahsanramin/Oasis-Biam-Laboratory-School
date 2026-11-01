"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/page-header";
import { X, ChevronLeft, ChevronRight, ImageIcon, Maximize2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api, extractArray } from "@/lib/api";

// Type matching your backend gallery schema
type GalleryImage = {
  _id: string;
  title: string;
  image: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // ================= DATA FETCHING =================
  useEffect(() => {
    async function fetchImages() {
      try {
        // 🔧 FIX: Fetch from your actual backend instead of static array
        const r = await api.get<any>("/api/gallery");
        setImages(extractArray<GalleryImage>(r));
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
      
      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* ================= GALLERY GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton 
                key={i} 
                // Create a masonry feel by making some skeletons taller
                className={`rounded-2xl w-full h-full ${i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} 
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-[var(--border)] rounded-[3rem] bg-[var(--bg-soft)]">
            <div className="w-20 h-20 rounded-2xl bg-[var(--card)] border border-[var(--border)] grid place-items-center mx-auto mb-6">
              <ImageIcon className="h-10 w-10 text-[var(--fg-muted)] opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No photos yet</h3>
            <p className="text-[var(--fg-muted)] max-w-md mx-auto">
              We are currently updating our gallery. Check back soon to see the vibrant life at Oasis BIAM!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px]">
            {images.map((img, i) => {
              // Create a premium Bento/Masonry look by making every 5th item larger
              const isFeatured = i % 5 === 0;
              
              return (
                <motion.button 
                  key={img._id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05, duration: 0.4 }} 
                  onClick={() => setPreviewIndex(i)} 
                  className={`
                    relative rounded-2xl sm:rounded-[1.5rem] overflow-hidden group bg-[var(--card)] border border-[var(--border)]
                    ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
                  `}
                >
                  <Image 
                    src={img.image} 
                    alt={img.title || "Gallery image"} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    unoptimized 
                  />
                  
                  {/* Premium Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md grid place-items-center mb-3">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-white font-bold text-lg leading-tight line-clamp-2">
                        {img.title || "Untitled"}
                      </p>
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
            onClick={() => setPreviewIndex(null)}
          >
            {/* Top Bar (Close & Counter) */}
            <div className="flex items-center justify-between p-6 absolute top-0 inset-x-0 z-50">
              <span className="text-white/60 font-medium tracking-widest text-sm">
                {previewIndex + 1} / {images.length}
              </span>
              <button 
                onClick={() => setPreviewIndex(null)} 
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center transition-colors"
                aria-label="Close gallery"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 text-white grid place-items-center transition-all z-50 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 hover:bg-white/20 text-white grid place-items-center transition-all z-50 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-12 relative">
              <motion.div 
                key={previewIndex} // Trigger animation on index change
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-6xl aspect-video sm:aspect-auto sm:h-[80vh]"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
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

            {/* Bottom Title Bar */}
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-center z-40 pointer-events-none">
              <h3 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                {images[previewIndex].title || "Untitled"}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}