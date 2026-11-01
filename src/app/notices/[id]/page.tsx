"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Calendar, User, FileText, 
  Download, AlertCircle, Sparkles, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";

// Helper to format dates nicely
function formatDate(dateInput: string | Date) {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
}

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotice() {
      try {
        // 🔧 FIX: Correct API unwrapping
        const r = await api.get<any>(`/api/notices/${id}`);
        const data = r?.data || r;
        
        if (data && data.title) {
          setNotice(data);
        }
      } catch (err) {
        console.error("Failed to load notice:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) void loadNotice();
  }, [id]);

  // ================= LOADING SKELETON =================
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6">
        <Skeleton className="h-6 w-32 rounded-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-64 w-full rounded-3xl mt-8" />
      </div>
    );
  }

  // ================= NOT FOUND STATE =================
  if (!notice) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-red-500/10 rounded-full grid place-items-center mb-6">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-3">Notice Not Found</h1>
        <p className="text-[var(--fg-muted)] mb-8 max-w-sm">
          The notice you are looking for does not exist, or it may have been removed by the administration.
        </p>
        <Button onClick={() => router.push("/notices")} size="lg" className="rounded-xl shadow-glow">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Notices
        </Button>
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <article className="relative min-h-screen pb-24 bg-[var(--bg)] overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/notices" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-full transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to notices
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="brand" className="px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-sm">
              {notice.category || "General"}
            </Badge>
            {notice.featured && (
              <Badge variant="warning" className="px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display leading-[1.15] mb-6 break-words">
            {notice.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-[var(--fg-muted)] pb-8 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center">
                <User className="h-4 w-4" />
              </div>
              <span>Posted by {notice.authorName || "Administration"}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--border)] hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--primary)]" />
              <span>{formatDate(notice.publishDate || notice.createdAt)}</span>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-[2rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] p-6 sm:p-10 shadow-2xl shadow-black/5 overflow-hidden"
        >
          {/* Top Accent Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--primary)] via-amber-400 to-[var(--primary)] opacity-80" />
          
          {/* Watermark Icon */}
          <FileText className="absolute -bottom-10 -right-10 w-64 h-64 text-[var(--primary)] opacity-[0.03] pointer-events-none rotate-12" />

          {/* Main Text */}
          <div className="relative z-10 text-lg leading-loose whitespace-pre-wrap text-[var(--fg-muted)] break-words">
            {notice.content}
          </div>

          {/* Attachment Section */}
          {notice.attachmentUrl && (
            <div className="relative z-10 mt-10 pt-8 border-t border-[var(--border)]">
              <p className="text-sm font-bold mb-4 uppercase tracking-widest text-[var(--fg-muted)]">Attachments</p>
              <a 
                href={notice.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--bg-soft)] hover:bg-[var(--border)] border border-[var(--border)] hover:border-[var(--primary)]/50 text-[var(--fg)] font-bold transition-all duration-300 group w-full sm:w-auto"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center group-hover:scale-110 transition-transform">
                  <Download className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span>View Attachment</span>
                  <span className="text-xs text-[var(--fg-muted)] font-medium">Click to download file</span>
                </div>
              </a>
            </div>
          )}
        </motion.div>

      </div>
    </article>
  );
}