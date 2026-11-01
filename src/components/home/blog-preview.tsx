"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export function BlogPreview({ articles }: { articles: any[] }) {
  if (!articles || !articles.length) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[var(--bg)]">
      
      {/* ================= AMBIENT BACKGROUND ================= */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Latest Insights
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-display leading-[1.1]">
              Educational <br className="hidden sm:block" />
              <span className="gradient-text">Tips &amp; Articles.</span>
            </h2>
            <p className="mt-4 text-[var(--fg-muted)] text-lg font-medium">
              Stay updated with the latest news, parenting tips, and academic resources from our expert educators.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/blog">
              <Button variant="outline" size="lg" className="rounded-xl font-bold group bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                View All Articles 
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/blog/${a.slug}`} className="group block h-full">
                <div className="relative rounded-[2rem] overflow-hidden bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-[var(--primary)]/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative aspect-[16/10] bg-[var(--bg-soft)] overflow-hidden">
                    {a.coverImage ? (
                      <Image 
                        src={a.coverImage} 
                        alt={a.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-brand grid place-items-center text-white">
                        <BookOpen className="h-12 w-12 opacity-50" />
                      </div>
                    )}
                    
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <Badge 
                      className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white border-white/30 shadow-lg px-3 py-1 font-bold" 
                    >
                      {a.category || "Education"}
                    </Badge>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col relative">
                    
                    {/* Title */}
                    <h3 className="font-bold text-xl leading-snug mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-[var(--fg-muted)] mb-6 line-clamp-3 flex-1 leading-relaxed">
                      {a.excerpt || "Click to read the full article and discover more insights."}
                    </p>
                    
                    {/* Meta Info Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-[var(--border)] mt-auto">
                      <div className="flex items-center gap-4 text-xs font-bold text-[var(--fg-muted)]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" />
                          {formatDate(a.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--primary)]" />
                          {a.readTime || 3} min
                        </span>
                      </div>
                      
                      {/* Read More Indicator */}
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 grid place-items-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}