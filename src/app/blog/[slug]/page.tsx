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
  Link as LinkIcon, CheckCircle2, FileQuestion,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const EASE = [0.22, 1, 0.36, 1] as const;

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
      <div className="relative max-w-5xl mx-auto px-4 py-20 space-y-8 bg-[var(--bg)] min-h-screen overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-brand-500/[0.06] rounded-full blur-3xl -z-10 pointer-events-none" />

        <Skeleton className="h-7 w-40 rounded-full" />
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
        </div>
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <Skeleton className="aspect-video w-full rounded-3xl mt-10" />
        <div className="space-y-3 pt-6">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-10/12 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-9/12 rounded" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="relative max-w-4xl mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-[60vh] bg-[var(--bg)] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/[0.06] rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative"
        >
          {/* Layered medallion icon */}
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 -m-4 bg-red-500/20 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/5 ring-1 ring-red-500/25 grid place-items-center shadow-lg shadow-red-500/10">
              <div className="w-16 h-16 rounded-full bg-red-500/10 grid place-items-center">
                <FileQuestion className="h-9 w-9 text-red-500" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
            Article <span className="gradient-text">not found</span>
          </h1>
          <p className="text-[var(--fg-muted)] mb-8 max-w-md mx-auto leading-relaxed font-medium">
            The article you are looking for doesn't exist, or the URL slug is incorrect.
          </p>
          <Button
            onClick={() => router.push("/blog")}
            size="lg"
            className="rounded-xl gradient-brand shadow-glow group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blog
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <article className="pb-24 relative bg-[var(--bg)] min-h-screen overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-end pb-14 overflow-hidden pt-32">

        {/* Cover Image or Fallback Gradient */}
        {article.coverImage ? (
          <>
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover scale-105"
              priority
            />
            {/* Layered gradient overlays for depth + readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-black/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.15),transparent_60%)]" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-brand">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            {/* Decorative grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        )}

        {/* Bottom fade into background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >

            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--fg)] hover:text-[var(--primary)] mb-8 bg-[var(--bg)]/60 backdrop-blur-xl px-4 py-2 rounded-full border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] transition-all duration-300 hover:-translate-x-0.5 group/back"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-0.5" strokeWidth={2.5} />
              Back to articles
            </Link>

            {/* Category Badge */}
            <div className="mb-6">
              <Badge
                variant="brand"
                className="px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] font-black shadow-xl shadow-[var(--primary)]/25 rounded-full backdrop-blur-md ring-1 ring-inset ring-white/20 max-w-full truncate"
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                {article.category || "General"}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black font-display leading-[1.1] mb-8 text-[var(--fg)] drop-shadow-2xl break-words tracking-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-bold text-[var(--fg-muted)]">
              {/* Author chip */}
              <span className="flex items-center gap-2.5 bg-[var(--bg)]/60 px-3 py-1.5 rounded-full backdrop-blur-xl border border-[var(--border)] ring-1 ring-inset ring-white/[0.04]">
                <div className="w-7 h-7 rounded-full gradient-brand text-white grid place-items-center text-[11px] font-black shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
                  {article.authorName?.charAt(0) || "A"}
                </div>
                <span className="tracking-tight">{article.authorName || "Admin"}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                {article.readTime || 4} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                {article.views || 0} views
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-3xl mx-auto px-4 lg:px-8 mt-16 relative">

        {/* Floating Share Rail (xl+) */}
        <div className="absolute right-0 top-0 translate-x-20 hidden xl:block">
          <div className="sticky top-32 flex flex-col gap-3">
            {/* Ambient glow behind rail */}
            <div className="absolute inset-0 -m-3 bg-brand-500/[0.08] rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={shareCopy}
              className="relative w-12 h-12 rounded-full bg-[var(--card)]/80 backdrop-blur-md border border-[var(--border)] shadow-xl shadow-black/[0.04] grid place-items-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/25 transition-all duration-300 group ring-1 ring-inset ring-white/[0.05] hover:scale-110"
              title="Copy Link"
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
              ) : (
                <Share2 className="h-5 w-5 text-[var(--fg-muted)] group-hover:text-white transition-colors" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--fg)] prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-[var(--border)]
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-[var(--fg-muted)] prose-p:leading-loose prose-p:mb-6
            prose-strong:text-[var(--fg)] prose-strong:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-[var(--primary)] prose-blockquote:bg-[var(--bg-soft)] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-[var(--fg)] prose-blockquote:font-medium
            prose-a:text-[var(--primary)] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4
            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:shadow-black/[0.08] prose-img:border prose-img:border-[var(--border)]
            prose-code:bg-[var(--bg-soft)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[var(--primary)] prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-[var(--card)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-2xl prose-pre:shadow-lg
            prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-[var(--fg-muted)]
            prose-hr:border-[var(--border)] prose-hr:my-12
            whitespace-pre-wrap break-words"
        >
          {article.content}
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-20 pt-10 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {article.tags?.length > 0 && article.tags.map((t: string) => (
              <Badge
                key={t}
                variant="secondary"
                className="px-3.5 py-1.5 bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] text-[11px] font-bold uppercase tracking-[0.1em] rounded-lg ring-1 ring-inset ring-[var(--border)] hover:ring-[var(--primary)]/30 hover:bg-[var(--primary)]/[0.06] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                #{t}
              </Badge>
            ))}
          </div>

          {/* Share Button */}
          <Button
            onClick={shareCopy}
            variant="outline"
            className="rounded-xl w-full sm:w-auto group h-11 px-5 font-bold ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/[0.06] hover:text-[var(--primary)] transition-all duration-300"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={2.5} />
            ) : (
              <LinkIcon className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" strokeWidth={2.5} />
            )}
            {copied ? "Copied!" : "Share Article"}
          </Button>
        </motion.div>
      </div>
    </article>
  );
}