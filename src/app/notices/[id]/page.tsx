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

const EASE = [0.22, 1, 0.36, 1] as const;

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
      <div className="relative max-w-4xl mx-auto px-4 py-20 space-y-6 bg-[var(--bg)] min-h-screen overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/[0.06] rounded-full blur-[120px] pointer-events-none -z-10" />

        <Skeleton className="h-7 w-40 rounded-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-3/4 rounded-2xl" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-8 w-48 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <Skeleton className="h-72 w-full rounded-[2rem] mt-8" />
      </div>
    );
  }

  // ================= NOT FOUND STATE =================
  if (!notice) {
    return (
      <div className="relative max-w-3xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh] bg-[var(--bg)] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/[0.06] rounded-full blur-3xl pointer-events-none -z-10" />

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
                <AlertCircle className="h-9 w-9 text-red-500" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            Notice <span className="gradient-text">Not Found</span>
          </h1>
          <p className="text-[var(--fg-muted)] mb-8 max-w-sm mx-auto leading-relaxed font-medium">
            The notice you are looking for does not exist, or it may have been removed by the administration.
          </p>

          <Button
            onClick={() => router.push("/notices")}
            size="lg"
            className="rounded-xl gradient-brand shadow-glow group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to Notices
          </Button>
        </motion.div>
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <article className="relative min-h-screen pb-24 bg-[var(--bg)] overflow-hidden">

      {/* ===== Layered ambient background ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-24 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-black text-[var(--fg-muted)] hover:text-[var(--primary)] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] px-4 py-2 rounded-full transition-all duration-300 mb-8 group hover:-translate-x-0.5 hover:border-[var(--primary)]/30"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
            Back to notices
          </Link>
        </motion.div>

        {/* ================= HEADER SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mb-12"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <Badge
              variant="brand"
              className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full shadow-md shadow-brand-500/20 ring-1 ring-inset ring-white/20"
            >
              {notice.category || "General"}
            </Badge>
            {notice.featured && (
              <Badge
                variant="warning"
                className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] rounded-full shadow-md shadow-amber-500/20 ring-1 ring-inset ring-white/20 flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3" strokeWidth={2.5} /> Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-black font-display leading-[1.08] mb-8 break-words tracking-tight">
            {notice.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] uppercase tracking-[0.14em] font-black text-[var(--fg-muted)] pb-8 border-b border-[var(--border)]">

            {/* Author chip */}
            <div className="flex items-center gap-2.5 bg-[var(--card)]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border)] ring-1 ring-inset ring-white/[0.04]">
              <div className="w-7 h-7 rounded-full gradient-brand text-white grid place-items-center text-[10px] font-black shadow-md shadow-brand-500/25 ring-1 ring-white/20">
                {(notice.authorName || "A").charAt(0).toUpperCase()}
              </div>
              <span className="normal-case tracking-tight text-[var(--fg)] font-bold text-xs">
                {notice.authorName || "Administration"}
              </span>
            </div>

            {/* Date chip */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 text-[var(--primary)] grid place-items-center">
                <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
              <span className="normal-case tracking-tight text-[var(--fg)] font-bold text-xs">
                {formatDate(notice.publishDate || notice.createdAt)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ================= CONTENT CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="relative rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-black/[0.05] overflow-hidden"
        >
          {/* Top hairline edge-light */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent pointer-events-none" />

          {/* Corner glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

          {/* Ghost watermark icon */}
          <FileText className="absolute -bottom-10 -right-10 w-64 h-64 text-[var(--fg)]/[0.025] pointer-events-none rotate-12" strokeWidth={1} />

          {/* Ghost number watermark */}
          <div className="absolute top-6 right-8 text-[120px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter">
            01
          </div>

          {/* Main Text */}
          <div className="relative z-10 text-[15px] sm:text-base leading-[1.85] whitespace-pre-wrap text-[var(--fg-muted)] break-words font-medium">
            {notice.content}
          </div>

          {/* Attachment Section */}
          {notice.attachmentUrl && (
            <div className="relative z-10 mt-12 pt-8 border-t border-[var(--border)]">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-500 grid place-items-center">
                  <FileText className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)]">
                  Attachments
                </p>
              </div>

              <a
                href={notice.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-4 px-5 py-4 rounded-2xl bg-[var(--bg-soft)]/70 backdrop-blur-md hover:bg-[var(--bg-soft)] border border-[var(--border)] hover:border-[var(--primary)]/40 text-[var(--fg)] font-bold transition-all duration-500 group w-full sm:w-auto overflow-hidden hover:shadow-xl hover:shadow-brand-500/[0.06]"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />

                {/* Hover aura */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/[0.08] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative w-12 h-12 rounded-xl gradient-brand text-white grid place-items-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <Download className="h-5 w-5 relative" strokeWidth={2.5} />
                </div>

                <div className="relative flex flex-col text-left min-w-0">
                  <span className="text-sm font-bold tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                    View Attachment
                  </span>
                  <span className="text-[11px] text-[var(--fg-muted)] font-medium mt-0.5">
                    Click to download file
                  </span>
                </div>

                {/* Base accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/50 transition-all duration-500" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </article>
  );
}