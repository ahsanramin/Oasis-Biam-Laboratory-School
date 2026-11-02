"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Mail, Phone, BookOpen,
  Award, User, Briefcase, Sparkles, UserX, Star
} from "lucide-react";
import { motion } from "framer-motion";

// Safe helper for initials in case it's not imported properly
function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacher() {
      try {
        // 🔧 FIX: Correct API unwrapping
        const r = await api.get<any>(`/api/teachers/${id}`);
        const data = r?.data || r;

        if (data && data.name) {
          setTeacher(data);
        }
      } catch (err) {
        console.error("Failed to load teacher:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) void loadTeacher();
  }, [id]);

  // ================= LOADING SKELETON =================
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[var(--bg)] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/[0.06] rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-2">
              <Skeleton className="aspect-[4/5] rounded-[2rem]" />
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-2.5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-2.5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 space-y-6 pt-4">
            <Skeleton className="h-7 w-40 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-8 w-1/2 rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-32 rounded-[1.5rem]" />
              <Skeleton className="h-32 rounded-[1.5rem]" />
              <Skeleton className="h-32 rounded-[1.5rem]" />
            </div>
            <Skeleton className="h-44 rounded-[2rem] mt-6" />
          </div>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND STATE =================
  if (!teacher) {
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
                <UserX className="h-9 w-9 text-red-500" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            Teacher <span className="gradient-text">Not Found</span>
          </h1>
          <p className="text-[var(--fg-muted)] mb-8 max-w-sm mx-auto leading-relaxed font-medium">
            The faculty member you are looking for does not exist, or their profile may have been removed.
          </p>

          <Button
            onClick={() => router.push("/teachers")}
            size="lg"
            className="rounded-xl gradient-brand shadow-glow group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to Faculty
          </Button>
        </motion.div>
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <div className="relative min-h-screen pb-24 bg-[var(--bg)] overflow-hidden">

      {/* ===== Layered ambient background ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 -right-24 w-[600px] h-[600px] bg-brand-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-24 w-[480px] h-[480px] bg-amber-500/[0.05] rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[520px] h-[520px] bg-blue-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link
            href="/teachers"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-black text-[var(--fg-muted)] hover:text-[var(--primary)] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] px-4 py-2 rounded-full transition-all duration-300 mb-10 group hover:-translate-x-0.5 hover:border-[var(--primary)]/30"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
            Back to Faculty
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-10 lg:gap-16">

          {/* ================= LEFT COLUMN: IMAGE & CONTACT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="md:col-span-5 lg:col-span-4"
          >
            {/* Image Card */}
            <div className="relative group">

              {/* Outer hover aura */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-brand-500/15 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 -z-10 pointer-events-none" />

              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl shadow-black/[0.08]">

                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-20 pointer-events-none" />

                {teacher.image ? (
                  <Image
                    src={teacher.image}
                    alt={teacher.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-[900ms] ease-out"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-8xl font-black tracking-tight">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
                    <span className="relative drop-shadow-lg">{getInitials(teacher.name)}</span>
                  </div>
                )}

                {/* Overlay gradient (bottom-heavy) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Role Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10">
                  <Badge className="bg-white/15 backdrop-blur-xl text-white border border-white/25 shadow-lg shadow-black/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] ring-1 ring-inset ring-white/20 rounded-full">
                    <Sparkles className="h-3 w-3 mr-1.5" strokeWidth={2.5} />
                    {teacher.role === "teacher" ? "Faculty Member" : teacher.role.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="mt-6 space-y-3">
              {teacher.email && (
                <a
                  href={`mailto:${teacher.email}`}
                  className="relative flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-xl hover:shadow-brand-500/[0.05] transition-all duration-500 group overflow-hidden"
                >
                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

                  {/* Hover aura */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-500/[0.08] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative w-11 h-11 rounded-xl bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/20 text-[var(--primary)] grid place-items-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                    <Mail className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-0.5">Email</p>
                    <p className="text-sm font-bold text-[var(--fg)] truncate group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight">
                      {teacher.email}
                    </p>
                  </div>
                </a>
              )}

              {teacher.phone && (
                <a
                  href={`tel:${teacher.phone}`}
                  className="relative flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-xl hover:shadow-brand-500/[0.05] transition-all duration-500 group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/[0.08] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative w-11 h-11 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-500 grid place-items-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                    <Phone className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-0.5">Phone</p>
                    <p className="text-sm font-bold text-[var(--fg)] truncate group-hover:text-[var(--primary)] transition-colors duration-300 tracking-tight">
                      {teacher.phone}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: INFO & BIO ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="md:col-span-7 lg:col-span-8 pt-4"
          >

            {/* Header */}
            <div className="relative mb-10">
              {/* Ghost number watermark */}
              <div className="absolute -top-6 right-0 text-[140px] font-black leading-none text-[var(--fg)]/[0.025] select-none pointer-events-none tracking-tighter">
                01
              </div>

              {/* Eyebrow badge */}
              <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)]/60 backdrop-blur-md border border-[var(--primary)]/25 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-5">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} /> Meet the Faculty
              </div>

              <h1 className="relative text-4xl sm:text-5xl lg:text-[56px] font-black font-display leading-[1.05] mb-3 break-words tracking-tight">
                {teacher.name}
              </h1>
              <p className="relative text-xl sm:text-2xl text-[var(--fg-muted)] font-medium tracking-tight">
                {teacher.designation || "Teacher"}
              </p>

              {/* Divider */}
              <div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent" />
            </div>

            {/* Bento Grid for Details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {teacher.subject && (
                <div className="relative p-6 rounded-[1.5rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500 group overflow-hidden">
                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />
                  {/* Corner glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative w-12 h-12 rounded-2xl bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] text-[var(--primary)] grid place-items-center mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-brand-500/10 group-hover:ring-brand-500/25 transition-all duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                    <BookOpen className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-1.5">Subject</p>
                  <p className="relative text-lg font-bold text-[var(--fg)] tracking-tight">{teacher.subject}</p>

                  {/* Base accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/50 transition-all duration-500" />
                </div>
              )}

              {teacher.qualification && (
                <div className="relative p-6 rounded-[1.5rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-amber-500/40 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500 group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative w-12 h-12 rounded-2xl bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] text-amber-500 grid place-items-center mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-amber-500/10 group-hover:ring-amber-500/25 transition-all duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                    <Award className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-1.5">Qualification</p>
                  <p className="relative text-lg font-bold text-[var(--fg)] tracking-tight">{teacher.qualification}</p>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/50 transition-all duration-500" />
                </div>
              )}

              {teacher.experience && (
                <div className="relative p-6 rounded-[1.5rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] hover:border-emerald-500/40 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-500 group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative w-12 h-12 rounded-2xl bg-[var(--bg-soft)]/80 ring-1 ring-inset ring-[var(--border)] text-emerald-500 grid place-items-center mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-emerald-500/10 group-hover:ring-emerald-500/25 transition-all duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
                    <Briefcase className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-1.5">Experience</p>
                  <p className="relative text-lg font-bold text-[var(--fg)] tracking-tight">{teacher.experience}</p>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/50 transition-all duration-500" />
                </div>
              )}
            </div>

            {/* Biography Section */}
            {teacher.bio && (
              <div className="relative p-8 lg:p-10 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.04] overflow-hidden">
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />

                {/* Corner glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />

                {/* Ghost watermark */}
                <User className="absolute -bottom-10 -right-10 w-56 h-56 text-[var(--fg)]/[0.02] pointer-events-none rotate-12" strokeWidth={1} />

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-5">
                  <div className="relative w-11 h-11 rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500 grid place-items-center shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                    <User className="h-5 w-5 relative" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)] mb-0.5">Biography</p>
                    <h2 className="text-xl font-bold tracking-tight">
                      About {teacher.name.split(" ")[0]}
                    </h2>
                  </div>
                </div>

                <p className="relative text-[15px] sm:text-base text-[var(--fg-muted)] leading-[1.85] whitespace-pre-wrap font-medium">
                  {teacher.bio}
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}