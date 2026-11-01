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

export function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH LIVE DATA FROM BACKEND
  // =========================================
  useEffect(() => {
    async function loadGallery() {
      try {
        const r = await api.get<any>("/api/gallery");
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
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-16">
            <Skeleton className="h-8 w-40 rounded-full mb-6" />
            <Skeleton className="h-16 w-2/3 max-w-2xl rounded-xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] gap-4 lg:gap-6">
            <Skeleton className="col-span-2 row-span-2 rounded-[2rem]" />
            <Skeleton className="rounded-[2rem]" />
            <Skeleton className="rounded-[2rem]" />
            <Skeleton className="rounded-[2rem]" />
            <Skeleton className="rounded-[2rem]" />
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
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--fg)]">Our Moments</span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black font-display tracking-tight leading-[1.1]">
              Life at <br className="hidden sm:block" />
              <span className="gradient-text">Oasis BIAM.</span>
            </h2>
            
            <p className="mt-4 text-lg text-[var(--fg-muted)] font-medium">
              Explore our vibrant campus, innovative classrooms, and the joyful moments that define our community.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="rounded-xl font-bold group bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                View Full Gallery 
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ================= BENTO GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] sm:auto-rows-[250px] gap-4 lg:gap-6">
          {images.slice(0, 6).map((img, i) => {
            // Create a premium Bento layout
            const isFeatured = i === 0;
            
            return (
              <motion.div 
                key={img._id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`
                  relative rounded-[2rem] overflow-hidden group cursor-pointer border border-[var(--border)] bg-[var(--card)]
                  ${isFeatured ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
                `}
              >
                {/* Image */}
                <Image 
                  src={img.image} 
                  alt={img.title || `Gallery Preview ${i + 1}`} 
                  fill 
                  sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                
                {/* Permanent Subtle Gradient for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Hover Overlay & Actions */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Campus Life</p>
                      <p className="text-white font-bold text-lg leading-tight line-clamp-1">{img.title || "Capturing the Moment"}</p>
                    </div>
                    
                    {/* Floating Expand Icon */}
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 grid place-items-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <Maximize2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Camera Icon Badge (Top Right - always visible on hover) */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm border border-white/20 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}