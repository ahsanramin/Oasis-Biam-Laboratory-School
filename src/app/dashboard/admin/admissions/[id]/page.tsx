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
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-10 w-40 rounded-xl bg-[var(--card)] animate-pulse" />
        <div className="h-40 rounded-3xl bg-[var(--card)] animate-pulse" />
        <div className="h-20 rounded-2xl bg-[var(--card)] animate-pulse" />
        <div className="h-48 rounded-2xl bg-[var(--card)] animate-pulse" />
        <div className="h-48 rounded-2xl bg-[var(--card)] animate-pulse" />
        <div className="h-72 rounded-2xl bg-[var(--card)] animate-pulse" />
      </div>
    );
  }

  /* ============================================================
   * Not found state
   * ============================================================ */

  if (notFound || !data) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <AlertTriangle className="h-14 w-14 mx-auto mb-4 text-amber-500 opacity-60" />
        <h2 className="text-2xl font-bold mb-2">Application not found</h2>
        <p className="text-sm text-[var(--fg-muted)] mb-8">
          This application may have been deleted or the link is invalid.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/dashboard/admin/admissions">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admissions
            </Button>
          </Link>
          <Button variant="outline" onClick={() => load()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  /* ============================================================
   * Main render
   * ============================================================ */

  const initials = data.studentName?.charAt(0).toUpperCase() || "?";

  const documentCards = [
    { key: "birthCertificateImage", label: "Birth Certificate", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", url: data.birthCertificateImage },
    { key: "previousSchoolCertificateImage", label: "Previous School Certificate", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10", url: data.previousSchoolCertificateImage },
    { key: "passportPhotosImage", label: "Passport Size Photo", icon: ImageIcon, color: "text-amber-500", bg: "bg-amber-500/10", url: data.passportPhotosImage },
    { key: "parentNidImage", label: "Parent's NID Copy", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10", url: data.parentNidImage },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ----- Back link ----- */}
        <Link
          href="/dashboard/admin/admissions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Admissions
        </Link>

        {/* ----- Hero ----- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 shrink-0 rounded-2xl grid place-items-center text-2xl font-black bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
                  {data.studentName}
                </h1>
                <p className="text-sm font-semibold text-emerald-500 mt-1">
                  Applying for {data.classApplyingFor || "N/A"}
                </p>
              </div>
            </div>
            <StatusBadgeLarge status={data.status} />
          </div>
        </motion.div>

        {/* ----- Action bar ----- */}
        <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <Button
            className="flex-1 min-w-[120px] text-purple-600 border-purple-200 hover:bg-purple-500/5"
            variant="outline"
            onClick={handleDownloadPDF}
            loading={busy === "pdf"}
            disabled={busy !== null && busy !== "pdf"}
          >
            {busy !== "pdf" && <Download className="h-4 w-4 mr-1.5" />}
            PDF
          </Button>
          <Button
            className="flex-1 min-w-[120px] text-emerald-600 border-emerald-200 hover:bg-emerald-500/5"
            variant="outline"
            onClick={() => updateStatus("approved")}
            disabled={busy !== null || data.status === "approved"}
            loading={busy === "approved"}
          >
            <Check className="h-4 w-4 mr-1.5" /> Approve
          </Button>
          <Button
            className="flex-1 min-w-[120px] text-red-600 border-red-200 hover:bg-red-500/5"
            variant="outline"
            onClick={() => updateStatus("rejected")}
            disabled={busy !== null || data.status === "rejected"}
            loading={busy === "rejected"}
          >
            <Ban className="h-4 w-4 mr-1.5" /> Reject
          </Button>
          <Button
            className="flex-1 min-w-[120px] text-rose-600 border-rose-200 hover:bg-rose-500/5"
            variant="outline"
            onClick={handleDelete}
            disabled={busy !== null}
            loading={busy === "delete"}
          >
            {busy !== "delete" && <Trash2 className="h-4 w-4 mr-1.5" />}
            Delete
          </Button>
        </div>

        {/* ----- Sections ----- */}

        <SectionCard icon={User} title="Student Information" color="text-blue-500" bg="bg-blue-500/10">
          <Field label="Full Name" value={data.studentName} full />
          <Field label="Date of Birth" value={formatDate(data.birthDate)} />
          <Field label="Blood Group" value={data.bloodGroup || "—"} />
        </SectionCard>

        <SectionCard icon={Users} title="Parent / Guardian" color="text-purple-500" bg="bg-purple-500/10">
          <Field label="Father's Name" value={data.fatherName} />
          <Field label="Mother's Name" value={data.motherName} />
        </SectionCard>

        <SectionCard icon={School} title="Academic Information" color="text-amber-500" bg="bg-amber-500/10">
          <Field label="Applying For" value={data.classApplyingFor} />
          <Field label="Previous Class Passed" value={data.previousClass || "—"} />
        </SectionCard>

        <SectionCard icon={MapPin} title="Contact & Address" color="text-emerald-500" bg="bg-emerald-500/10">
          <Field label="Phone" value={data.phone} />
          <Field label="Email" value={data.email || "—"} />
          <Field label="Current Address" value={data.currentAddress || "—"} full />
          <Field label="Permanent Address" value={data.permanentAddress || "—"} full />
        </SectionCard>

        {/* ----- Documents ----- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold">Uploaded Documents</h2>
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                Click any document to view in full screen
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 whitespace-nowrap">
              {uploadedDocs.length}/{documentCards.length}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {documentCards.map((docItem) => {
              const Icon = docItem.icon;
              const uploadedIndex = docItem.url
                ? uploadedDocs.findIndex((d) => d.key === docItem.key)
                : -1;

              return (
                <div
                  key={docItem.key}
                  className={`rounded-2xl border-2 overflow-hidden transition-all ${
                    docItem.url
                      ? "border-[var(--border)] hover:border-emerald-500/40"
                      : "border-dashed border-[var(--border)]"
                  }`}
                >
                  {docItem.url ? (
                    <>
                      <div
                        className="relative aspect-[4/3] bg-[var(--bg-soft)] cursor-pointer group"
                        onClick={() => setLightboxIndex(uploadedIndex >= 0 ? uploadedIndex : 0)}
                      >
                        <img
                          src={docItem.url}
                          alt={docItem.label}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors grid place-items-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-white/90 shadow-lg">
                            <Maximize2 className="h-5 w-5 text-gray-900" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-[var(--bg)] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-md ${docItem.bg} ${docItem.color} shrink-0`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-xs font-bold truncate">{docItem.label}</p>
                        </div>
                        <button
                          onClick={() => setLightboxIndex(uploadedIndex >= 0 ? uploadedIndex : 0)}
                          className="shrink-0 p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          title="View full screen"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-[4/3] bg-[var(--bg-soft)] grid place-items-center p-4">
                      <div className="text-center">
                        <div className={`mx-auto w-12 h-12 rounded-xl ${docItem.bg} ${docItem.color} grid place-items-center mb-3`}>
                          <Icon className="h-6 w-6 opacity-50" />
                        </div>
                        <p className="text-xs font-bold text-[var(--fg-muted)]">{docItem.label}</p>
                        <p className="text-[10px] text-[var(--fg-muted)] mt-1">Not uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ----- Metadata ----- */}
        <SectionCard icon={ShieldCheck} title="Application Metadata" color="text-slate-500" bg="bg-slate-500/10">
          <Field label="Application ID" value={data._id} mono />
          <Field label="Current Status" value={data.status.toUpperCase()} />
          <Field label="Submitted" value={formatDate(data.createdAt, true)} />
          <Field label="Last Updated" value={formatDate(data.updatedAt, true)} />
        </SectionCard>
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
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) =>
                      i === null ? null : (i + 1) % uploadedDocs.length
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.img
              key={uploadedDocs[lightboxIndex].url}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={uploadedDocs[lightboxIndex].url}
              alt={uploadedDocs[lightboxIndex].label}
              className="w-[95vw] h-[85vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            <div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-bold text-base">{uploadedDocs[lightboxIndex].label}</p>
              <p className="text-xs text-white/60 mt-1">
                {lightboxIndex + 1} / {uploadedDocs.length} · Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">ESC</kbd>{" "}
                to close
                {uploadedDocs.length > 1 && (
                  <>
                    {" · "}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">←</kbd>{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">→</kbd>{" "}
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
  children,
}: {
  icon: any;
  title: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--border)]">
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-base font-bold">{title}</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">{children}</div>
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
      <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--fg-muted)] mb-1.5">
        {label}
      </p>
      <p
        className={`text-sm font-medium break-words ${
          mono ? "font-mono text-xs bg-[var(--bg-soft)] px-2 py-1 rounded inline-block" : ""
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
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-bold uppercase shrink-0">
        <CheckCircle className="h-4 w-4" /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-600 text-sm font-bold uppercase shrink-0">
        <XCircle className="h-4 w-4" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 text-sm font-bold uppercase shrink-0">
      <Clock className="h-4 w-4" /> Pending
    </span>
  );
}