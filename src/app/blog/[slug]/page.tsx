"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, ArrowLeft, Eye, Share2, 
  Link as LinkIcon, CheckCircle2, FileQuestion 
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get<any>(`/api/articles/slug/${slug}`);
        const data = r?.data || r;
        
        if (data && data.title) {
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Failed to fetch article", err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) void load();
  }, [slug]);

  function shareCopy() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-3xl mt-8" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-red-500/10 rounded-full grid place-items-center mx-auto mb-6">
          <FileQuestion className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-4">Article not found</h1>
        <p className="text-[var(--fg-muted)] mb-8 max-w-md">
          The article you are looking for doesn't exist, or the URL slug is incorrect.
        </p>
        <Button onClick={() => router.push("/blog")} size="lg" className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
        </Button>
      </div>
    );
  }

  return (
    // 🔧 FIX: Added bg-[var(--bg)] to prevent background bleed-through
    <article className="pb-24 relative bg-[var(--bg)] min-h-screen">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full min-h-[50vh] flex flex-col justify-end pb-12 overflow-hidden pt-32">
        {/* Cover Image or Fallback Gradient */}
        {article.coverImage ? (
          <>
            <Image 
              src={article.coverImage} 
              alt={article.title} 
              fill 
              className="object-cover" 
              priority
            />
            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-brand">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--fg)] hover:text-[var(--primary)] mb-8 bg-[var(--bg)]/50 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border)] transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to articles
            </Link>
            
            {/* Category Badge */}
            <div className="mb-6">
              <Badge variant="brand" className="px-4 py-1.5 text-sm shadow-xl shadow-[var(--primary)]/20 max-w-full truncate">
                {article.category || "General"}
              </Badge>
            </div>

            {/* 🔧 FIX: Added break-words to prevent horizontal overflow on long titles */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-display leading-[1.15] mb-8 text-[var(--fg)] drop-shadow-lg break-words line-clamp-4">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-[var(--fg-muted)]">
              <span className="flex items-center gap-2 bg-[var(--bg)]/50 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-[var(--border)]">
                <div className="w-6 h-6 rounded-full gradient-brand text-white grid place-items-center text-xs">
                  {article.authorName?.charAt(0) || "A"}
                </div>
                {article.authorName || "Admin"}
              </span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(article.createdAt)}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{article.readTime || 4} min read</span>
              <span className="flex items-center gap-2"><Eye className="h-4 w-4" />{article.views || 0} views</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-12 relative">
        
        {/* Floating Share Button */}
        <div className="absolute right-0 top-0 translate-x-20 hidden xl:block">
          <div className="sticky top-32 flex flex-col gap-3">
            <button 
              onClick={shareCopy} 
              className="w-12 h-12 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg grid place-items-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all duration-300 group"
              title="Copy Link"
            >
              {copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500 group-hover:text-white" /> : <Share2 className="h-5 w-5 text-[var(--fg-muted)] group-hover:text-white" />}
            </button>
          </div>
        </div>

        {/* Article Body */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          // 🔧 FIX: Added break-words to handle long strings in the content
          className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--fg)]
            prose-p:text-[var(--fg-muted)] prose-p:leading-loose
            prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-xl
            whitespace-pre-wrap break-words"
        >
          {article.content}
        </motion.div>

        {/* Bottom Actions */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {article.tags?.length > 0 && article.tags.map((t: string) => (
              <Badge key={t} variant="secondary" className="px-3 py-1 bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)]">
                #{t}
              </Badge>
            ))}
          </div>
          
          <Button onClick={shareCopy} variant="outline" className="rounded-xl w-full sm:w-auto">
            {copied ? <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> : <LinkIcon className="h-4 w-4 mr-2" />}
            {copied ? "Copied!" : "Share Article"}
          </Button>
        </div>
      </div>
    </article>
  );
}