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
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <Skeleton className="aspect-[4/5] rounded-[2rem]" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-2 gap-4 pt-6">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-40 rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  // ================= NOT FOUND STATE =================
  if (!teacher) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-red-500/10 rounded-full grid place-items-center mb-6">
          <UserX className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-3">Teacher Not Found</h1>
        <p className="text-[var(--fg-muted)] mb-8 max-w-sm">
          The faculty member you are looking for does not exist, or their profile may have been removed.
        </p>
        <Button onClick={() => router.push("/teachers")} size="lg" className="rounded-xl shadow-glow">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Faculty
        </Button>
      </div>
    );
  }

  // ================= MAIN PAGE =================
  return (
    <div className="relative min-h-screen pb-24 bg-[var(--bg)] overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/teachers" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--fg-muted)] hover:text-[var(--primary)] bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-full transition-colors mb-10 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Faculty
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-10 lg:gap-16">
          
          {/* ================= LEFT COLUMN: IMAGE & CONTACT ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-5 lg:col-span-4"
          >
            {/* Image Card */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl shadow-black/5 group">
              {teacher.image ? (
                <Image 
                  src={teacher.image} 
                  alt={teacher.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  unoptimized 
                />
              ) : (
                <div className="absolute inset-0 gradient-brand grid place-items-center text-white text-8xl font-black">
                  {getInitials(teacher.name)}
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Floating Role Badge inside Image */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 shadow-lg px-4 py-1.5 text-xs font-black uppercase tracking-widest">
                  {teacher.role === "teacher" ? "Faculty Member" : teacher.role.replace("-", " ")}
                </Badge>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="mt-6 space-y-3">
              {teacher.email && (
                <a href={`mailto:${teacher.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-soft)] hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-0.5">Email</p>
                    <p className="text-sm font-bold text-[var(--fg)] truncate">{teacher.email}</p>
                  </div>
                </a>
              )}
              
              {teacher.phone && (
                <a href={`tel:${teacher.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-soft)] hover:shadow-lg transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] grid place-items-center group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-0.5">Phone</p>
                    <p className="text-sm font-bold text-[var(--fg)] truncate">{teacher.phone}</p>
                  </div>
                </a>
              )}
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: INFO & BIO ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-7 lg:col-span-8 pt-4"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-xs font-bold text-[var(--primary)] uppercase tracking-widest mb-4">
                <Sparkles className="h-4 w-4" /> Meet the Faculty
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.1] mb-3 break-words">
                {teacher.name}
              </h1>
              <p className="text-xl sm:text-2xl text-[var(--fg-muted)] font-medium">
                {teacher.designation || "Teacher"}
              </p>
            </div>

            {/* Bento Grid for Details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {teacher.subject && (
                <div className="p-6 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] text-[var(--primary)] grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-1">Subject</p>
                  <p className="text-lg font-bold text-[var(--fg)]">{teacher.subject}</p>
                </div>
              )}
              
              {teacher.qualification && (
                <div className="p-6 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] text-[var(--primary)] grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-1">Qualification</p>
                  <p className="text-lg font-bold text-[var(--fg)]">{teacher.qualification}</p>
                </div>
              )}
              
              {teacher.experience && (
                <div className="p-6 rounded-[1.5rem] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] text-[var(--primary)] grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)] mb-1">Experience</p>
                  <p className="text-lg font-bold text-[var(--fg)]">{teacher.experience}</p>
                </div>
              )}
            </div>

            {/* Biography Section */}
            {teacher.bio && (
              <div className="relative p-8 rounded-[2rem] bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-sm overflow-hidden">
                {/* Decorative background icon */}
                <User className="absolute -bottom-8 -right-8 w-48 h-48 text-[var(--primary)] opacity-[0.03] pointer-events-none" />
                
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-6 bg-[var(--primary)] rounded-full" />
                  About {teacher.name.split(" ")[0]}
                </h2>
                <p className="text-[var(--fg-muted)] leading-loose whitespace-pre-wrap text-lg relative z-10">
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