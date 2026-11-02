"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateAdmissionPDF } from "@/lib/admission-pdf";
import {
  ArrowLeft,
  Check,
  Ban,
  Trash2,
  User,
  Users,
  Calendar,
  Droplet,
  School,
  Phone,
  Mail,
  MapPin,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Download,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
 * Types
 * ============================================================ */

type AdmissionStatus = "pending" | "approved" | "rejected";

type Admission = {
  _id: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  bloodGroup: string;
  classApplyingFor: string;
  previousClass: string;
  phone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  birthCertificateImage?: string;
  previousSchoolCertificateImage?: string;
  passportPhotosImage?: string;
  parentNidImage?: string;
  status: AdmissionStatus;
  createdAt?: string;
  updatedAt?: string;
};

/* ============================================================
 * Helpers
 * ============================================================ */

function formatDate(d?: string, withTime = false) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

/* ============================================================
 * Main Component
 * ============================================================ */

export default function AdmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<Admission | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* ----- Load single admission ----- */
  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    try {
      const res = await api.get<any>(`/api/admissions/${id}`);
      const doc: Admission = res?.data ?? res;
      
      if (!doc || !doc._id) throw new Error("Invalid response format");
      setData(doc);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load application");
      setData(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  /* ----- Uploaded documents list (for lightbox navigation) ----- */
  const uploadedDocs = useMemo(() => {
    if (!data) return [];
    return [
      { key: "birthCertificateImage", label: "Birth Certificate", url: data.birthCertificateImage },
      { key: "previousSchoolCertificateImage", label: "Previous School Certificate", url: data.previousSchoolCertificateImage },
      { key: "passportPhotosImage", label: "Passport Size Photo", url: data.passportPhotosImage },
      { key: "parentNidImage", label: "Parent's NID Copy", url: data.parentNidImage },
    ].filter((d) => !!d.url);
  }, [data]);

  /* ----- Keyboard navigation for lightbox ----- */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" && uploadedDocs.length > 0) {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % uploadedDocs.length));
      }
      if (e.key === "ArrowLeft" && uploadedDocs.length > 0) {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + uploadedDocs.length) % uploadedDocs.length));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, uploadedDocs.length]);

  /* ----- Update status ----- */
  async function updateStatus(status: AdmissionStatus) {
    if (!data) return;
    setBusy(status);
    try {
      await api.patch(`/api/admissions/${data._id}`, { status });
      setData({ ...data, status, updatedAt: new Date().toISOString() });
      toast.success(`Application ${status}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    } finally {
      setBusy(null);
    }
  }

  /* ----- Delete ----- */
  async function handleDelete() {
    if (!data) return;
    if (!confirm("Are you sure you want to permanently delete this application? This action cannot be undone.")) return;

    setBusy("delete");
    try {
      await api.delete(`/api/admissions/${data._id}`);
      toast.success("Application deleted");
      router.push("/dashboard/admin/admissions");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
      setBusy(null);
    }
  }

  /* ----- Download PDF ----- */
  async function handleDownloadPDF() {
    if (!data) return;
    setBusy("pdf");
    try {
      await generateAdmissionPDF(data);
      toast.success("PDF downloaded");
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate PDF");
    } finally {
      setBusy(null);
    }
  }

  /* ============================================================
   * Loading state
   * ============================================================ */

  if (loading) {
    return (
      <div className="relative max-w-5xl mx-auto space-y-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="h-40 rounded-[2.5rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="h-20 rounded-2xl bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="h-48 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="h-48 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
        <div className="h-72 rounded-[2rem] bg-[var(--card)]/60 backdrop-blur-md animate-pulse border border-[var(--border)]" />
      </div>
    );
  }

  /* ============================================================
   * Not found state
   * ============================================================ */

  if (notFound || !data) {
    return (
      <div className="relative max-w-3xl mx-auto py-24 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20 grid place-items-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-amber-500" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">Application not found</h2>
          <p className="text-sm font-medium text-[var(--fg-muted)] mb-8 max-w-sm mx-auto">
            This application may have been deleted or the link is invalid.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/dashboard/admin/admissions">
              <Button variant="outline" className="h-11 px-6 rounded-xl font-bold hover:bg-[var(--bg-soft)]">
                <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={2.5} /> Back to Admissions
              </Button>
            </Link>
            <Button variant="outline" onClick={() => load()} className="h-11 px-6 rounded-xl font-bold hover:bg-[var(--bg-soft)]">
              <RefreshCw className="h-4 w-4 mr-2" strokeWidth={2.5} /> Retry
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ============================================================
   * Main render
   * ============================================================ */

  const initials = data.studentName?.charAt(0).toUpperCase() || "?";

  const documentCards = [
    { key: "birthCertificateImage", label: "Birth Certificate", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/20", url: data.birthCertificateImage },
    { key: "previousSchoolCertificateImage", label: "Previous School Certificate", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", ring: "ring-purple-500/20", url: data.previousSchoolCertificateImage },
    { key: "passportPhotosImage", label: "Passport Size Photo", icon: ImageIcon, color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20", url: data.passportPhotosImage },
    { key: "parentNidImage", label: "Parent's NID Copy", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", url: data.parentNidImage },
  ];

  return (
    <>
      <div className="relative max-w-5xl mx-auto space-y-8 pb-20 overflow-hidden">
        
        {/* ===== Ambient Background Glows ===== */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        </div>

        {/* ----- Back link ----- */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/dashboard/admin/admissions"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-black text-[var(--fg-muted)] hover:text-[var(--primary)] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04] px-4 py-2 rounded-full transition-all duration-300 group hover:-translate-x-0.5 hover:border-[var(--primary)]/30"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} /> Back to Admissions
          </Link>
        </motion.div>

        {/* ----- Hero ----- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
        >
          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
          {/* Corner glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 -m-1 rounded-2xl bg-emerald-500/25 blur-md opacity-70" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl grid place-items-center text-2xl sm:text-3xl font-black bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg border border-white/20 ring-1 ring-inset ring-white/20">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.2] via-transparent to-transparent pointer-events-none" />
                  <span className="relative drop-shadow-md">{initials}</span>
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight truncate">
                  {data.studentName}
                </h1>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400 mt-2">
                  Applying for {data.classApplyingFor || "N/A"}
                </p>
              </div>
            </div>
            <StatusBadgeLarge status={data.status} />
          </div>
        </motion.div>

        {/* ----- Action bar ----- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="flex flex-wrap gap-3 p-2 rounded-2xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-sm"
        >
          <Button
            className="flex-1 min-w-[120px] h-12 rounded-xl text-purple-600 bg-purple-500/[0.04] border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold ring-1 ring-inset ring-white/[0.04]"
            variant="outline"
            onClick={handleDownloadPDF}
            loading={busy === "pdf"}
            disabled={busy !== null && busy !== "pdf"}
          >
            {busy !== "pdf" && <Download className="h-4 w-4 mr-2" strokeWidth={2.5} />}
            PDF
          </Button>
          <Button
            className="flex-1 min-w-[120px] h-12 rounded-xl text-emerald-600 bg-emerald-500/[0.04] border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold ring-1 ring-inset ring-white/[0.04]"
            variant="outline"
            onClick={() => updateStatus("approved")}
            disabled={busy !== null || data.status === "approved"}
            loading={busy === "approved"}
          >
            <Check className="h-4 w-4 mr-2" strokeWidth={2.5} /> Approve
          </Button>
          <Button
            className="flex-1 min-w-[120px] h-12 rounded-xl text-red-600 bg-red-500/[0.04] border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold ring-1 ring-inset ring-white/[0.04]"
            variant="outline"
            onClick={() => updateStatus("rejected")}
            disabled={busy !== null || data.status === "rejected"}
            loading={busy === "rejected"}
          >
            <Ban className="h-4 w-4 mr-2" strokeWidth={2.5} /> Reject
          </Button>
          <Button
            className="flex-1 min-w-[120px] h-12 rounded-xl text-rose-600 bg-rose-500/[0.04] border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 font-bold ring-1 ring-inset ring-white/[0.04]"
            variant="outline"
            onClick={handleDelete}
            disabled={busy !== null}
            loading={busy === "delete"}
          >
            {busy !== "delete" && <Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} />}
            Delete
          </Button>
        </motion.div>

        {/* ----- Sections ----- */}
        <div className="space-y-6">
          <SectionCard icon={User} title="Student Information" color="text-blue-500" bg="bg-blue-500/10" ring="ring-blue-500/20">
            <Field label="Full Name" value={data.studentName} full />
            <Field label="Date of Birth" value={formatDate(data.birthDate)} />
            <Field label="Blood Group" value={data.bloodGroup || "—"} />
          </SectionCard>

          <SectionCard icon={Users} title="Parent / Guardian" color="text-purple-500" bg="bg-purple-500/10" ring="ring-purple-500/20">
            <Field label="Father's Name" value={data.fatherName} />
            <Field label="Mother's Name" value={data.motherName} />
          </SectionCard>

          <SectionCard icon={School} title="Academic Information" color="text-amber-500" bg="bg-amber-500/10" ring="ring-amber-500/20">
            <Field label="Applying For" value={data.classApplyingFor} />
            <Field label="Previous Class Passed" value={data.previousClass || "—"} />
          </SectionCard>

          <SectionCard icon={MapPin} title="Contact & Address" color="text-emerald-500" bg="bg-emerald-500/10" ring="ring-emerald-500/20">
            <Field label="Phone" value={data.phone} />
            <Field label="Email" value={data.email || "—"} />
            <Field label="Current Address" value={data.currentAddress || "—"} full />
            <Field label="Permanent Address" value={data.permanentAddress || "—"} full />
          </SectionCard>

          {/* ----- Documents ----- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden"
          >
            {/* Top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent pointer-events-none" />

            <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
              <div className="p-2.5 rounded-xl bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-500">
                <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold tracking-tight">Uploaded Documents</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] mt-1">
                  Click any document to view in full screen
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.14em] px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 whitespace-nowrap">
                {uploadedDocs.length}/{documentCards.length}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {documentCards.map((docItem) => {
                const Icon = docItem.icon;
                const uploadedIndex = docItem.url
                  ? uploadedDocs.findIndex((d) => d.key === docItem.key)
                  : -1;

                return (
                  <div
                    key={docItem.key}
                    className={`group rounded-[1.5rem] border overflow-hidden transition-all duration-500 ${
                      docItem.url
                        ? "border-[var(--border)] bg-[var(--card)]/50 hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-black/[0.04]"
                        : "border-dashed border-[var(--border)] bg-[var(--card)]/30"
                    }`}
                  >
                    {docItem.url ? (
                      <>
                        <div
                          className="relative aspect-[4/3] bg-[var(--bg-soft)] cursor-pointer overflow-hidden"
                          onClick={() => setLightboxIndex(uploadedIndex >= 0 ? uploadedIndex : 0)}
                        >
                          <img
                            src={docItem.url}
                            alt={docItem.label}
                            className="w-full h-full object-contain transition-transform duration-[900ms] group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 grid place-items-center backdrop-blur-[2px]">
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 p-3 rounded-full bg-white/20 border border-white/30 shadow-2xl">
                              <Maximize2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                        <div className="p-3.5 bg-[var(--bg)]/50 border-t border-[var(--border)] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg ${docItem.bg} ${docItem.ring} ${docItem.color} shrink-0 ring-1 ring-inset`}>
                              <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg)] truncate">{docItem.label}</p>
                          </div>
                          <button
                            onClick={() => setLightboxIndex(uploadedIndex >= 0 ? uploadedIndex : 0)}
                            className="shrink-0 p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 ring-1 ring-inset ring-[var(--primary)]/20 hover:ring-[var(--primary)]"
                            title="View full screen"
                          >
                            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="aspect-[4/3] bg-[var(--bg-soft)]/30 grid place-items-center p-4">
                        <div className="text-center">
                          <div className={`mx-auto w-12 h-12 rounded-xl ${docItem.bg} ${docItem.ring} ${docItem.color} grid place-items-center mb-3 ring-1 ring-inset`}>
                            <Icon className="h-6 w-6 opacity-60" strokeWidth={2} />
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)]">{docItem.label}</p>
                          <p className="text-[10px] font-medium text-[var(--fg-muted)] mt-1.5">Not uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ----- Metadata ----- */}
          <SectionCard icon={ShieldCheck} title="Application Metadata" color="text-slate-500" bg="bg-slate-500/10" ring="ring-slate-500/20">
            <Field label="Application ID" value={data._id} mono />
            <Field label="Current Status" value={data.status.toUpperCase()} />
            <Field label="Submitted" value={formatDate(data.createdAt, true)} />
            <Field label="Last Updated" value={formatDate(data.updatedAt, true)} />
          </SectionCard>
        </div>
      </div>

      {/* ============================================================
       * Fullscreen Lightbox
       * ============================================================ */}
      <AnimatePresence>
        {lightboxIndex !== null && uploadedDocs[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20 ring-1 ring-inset ring-white/10 hover:scale-110"
              aria-label="Close"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>

            {uploadedDocs.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) =>
                      i === null ? null : (i - 1 + uploadedDocs.length) % uploadedDocs.length
                    );
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20 ring-1 ring-inset ring-white/10 hover:scale-110"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) =>
                      i === null ? null : (i + 1) % uploadedDocs.length
                    );
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 border border-white/20 ring-1 ring-inset ring-white/10 hover:scale-110"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                </button>
              </>
            )}

            <motion.img
              key={uploadedDocs[lightboxIndex].url}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              src={uploadedDocs[lightboxIndex].url}
              alt={uploadedDocs[lightboxIndex].label}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none rounded-2xl shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            <div
              className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-center flex flex-col items-center gap-2 pointer-events-none"
            >
              <p className="font-black uppercase tracking-[0.2em] text-lg text-white drop-shadow-lg">{uploadedDocs[lightboxIndex].label}</p>
              <p className="text-[11px] font-bold text-white/50 tracking-wide">
                {lightboxIndex + 1} / {uploadedDocs.length} · Press{" "}
                <kbd className="px-1.5 py-0.5 rounded-md border border-white/20 bg-white/10 text-white font-mono text-[10px]">ESC</kbd>{" "}
                to close
                {uploadedDocs.length > 1 && (
                  <>
                    {" · "}
                    <kbd className="px-1.5 py-0.5 rounded-md border border-white/20 bg-white/10 text-white font-mono text-[10px]">←</kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded-md border border-white/20 bg-white/10 text-white font-mono text-[10px]">→</kbd>{" "}
                    to navigate
                  </>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
 * Sub-components
 * ============================================================ */

function SectionCard({
  icon: Icon,
  title,
  color,
  bg,
  ring,
  children,
}: {
  icon: any;
  title: string;
  color: string;
  bg: string;
  ring: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative p-6 sm:p-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-xl shadow-black/[0.02] overflow-hidden"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

      <div className="relative flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
        <div className={`p-2.5 rounded-xl ${bg} ${ring} ${color} ring-1 ring-inset shadow-sm`}>
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      </div>
      <div className="relative grid sm:grid-cols-2 gap-x-8 gap-y-6">{children}</div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  full,
  mono,
}: {
  label: string;
  value?: string;
  full?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--fg-muted)] mb-2">
        {label}
      </p>
      <p
        className={`text-sm font-semibold text-[var(--fg)] break-words ${
          mono ? "font-mono text-xs bg-[var(--bg-soft)]/70 ring-1 ring-inset ring-[var(--border)] px-2.5 py-1.5 rounded-lg inline-block" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadgeLarge({ status }: { status: AdmissionStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-[0.16em] ring-1 ring-inset ring-emerald-500/20 shadow-sm shadow-emerald-500/10 shrink-0">
        <CheckCircle className="h-4 w-4" strokeWidth={2.5} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-[0.16em] ring-1 ring-inset ring-red-500/20 shadow-sm shadow-red-500/10 shrink-0">
        <XCircle className="h-4 w-4" strokeWidth={2.5} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-[0.16em] ring-1 ring-inset ring-amber-500/20 shadow-sm shadow-amber-500/10 shrink-0">
      <Clock className="h-4 w-4" strokeWidth={2.5} /> Pending
    </span>
  );
}