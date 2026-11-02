"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  User,
  Users,
  Calendar,
  Droplet,
  School,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  FileText,
  Home,
  GraduationCap,
  ShieldCheck,
  Upload,
  X,
  Image as ImageIcon,
  CreditCard,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================
 * Constants
 * ============================================================ */

const CLASSES = ["Play", "Nursery", "KG", "Class I", "Class II", "Class III", "Class IV", "Class V", "Class VI", "Class VII"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const INITIAL_FORM = {
  studentName: "",
  fatherName: "",
  motherName: "",
  birthDate: "",
  bloodGroup: "",
  classApplyingFor: "",
  previousClass: "",
  phone: "",
  email: "",
  currentAddress: "",
  permanentAddress: "",
};

/* ============================================================
 * Document Types
 * ============================================================ */

type DocumentKey =
  | "birthCertificate"
  | "previousSchoolCertificate"
  | "passportPhotos"
  | "parentNid";

type Documents = Record<DocumentKey, string>;

const INITIAL_DOCUMENTS: Documents = {
  birthCertificate: "",
  previousSchoolCertificate: "",
  passportPhotos: "",
  parentNid: "",
};

const INITIAL_UPLOADING: Record<DocumentKey, boolean> = {
  birthCertificate: false,
  previousSchoolCertificate: false,
  passportPhotos: false,
  parentNid: false,
};

const DOCUMENT_FIELDS: {
  key: DocumentKey;
  label: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  ring: string;
}[] = [
  {
    key: "birthCertificate",
    label: "Birth Certificate",
    description: "Clear photo or scan of the student's birth certificate",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    key: "previousSchoolCertificate",
    label: "Previous School Certificate",
    description: "Transfer certificate or last school report card",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    ring: "ring-purple-500/20",
  },
  {
    key: "passportPhotos",
    label: "Passport Size Photos",
    description: "Recent photo with white background",
    icon: ImageIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  {
    key: "parentNid",
    label: "Parent's NID Copy",
    description: "Father's or mother's national ID card",
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
 * Reusable premium section header
 * ============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color,
  bg,
  ring,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  color: string;
  bg: string;
  ring: string;
}) {
  return (
    <div className="flex items-center gap-4 mb-7 pb-4 border-b border-[var(--border)] relative">
      <div className={`relative w-12 h-12 rounded-2xl ${bg} ring-1 ${ring} grid place-items-center shrink-0 ${color}`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
        <Icon className="h-5 w-5 relative" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-[var(--fg)] tracking-tight leading-tight">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--fg-muted)] mt-1 font-medium leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Main Component
 * ============================================================ */

export default function AdmissionPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [documents, setDocuments] = useState<Documents>(INITIAL_DOCUMENTS);
  const [uploading, setUploading] =
    useState<Record<DocumentKey, boolean>>(INITIAL_UPLOADING);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const uploadedCount = DOCUMENT_FIELDS.filter((d) => documents[d.key]).length;

  /* ----------------------------------------------------------
   * Upload handler
   * ---------------------------------------------------------- */
  async function handleUpload(key: DocumentKey, file: File) {
    /* --- Client-side validation --- */
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, or WebP images are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be smaller than 5MB");
      return;
    }

    setUploading((prev) => ({ ...prev, [key]: true }));

    try {
      const fd = new FormData();
      fd.append("image", file);

      const API_BASE = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/+$/, "");

      const uploadEndpoint = `${API_BASE}/api/upload/public`;

      console.log("📤 Uploading image:", file.name);
      console.log("🌐 Upload endpoint:", uploadEndpoint);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: fd,
        // Do not manually set Content-Type.
        // Browser automatically sets multipart boundary.
      });

      const responseText = await response.text();

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. HTTP ${response.status}: ` +
            responseText.slice(0, 250)
        );
      }

      console.log("📥 Upload API Response:", {
        status: response.status,
        body: result,
      });

      if (!response.ok) {
        throw new Error(
          result?.message || `Upload failed. HTTP ${response.status}`
        );
      }

      const imageUrl = result?.data?.url || result?.url;

      if (
        typeof imageUrl !== "string" ||
        !/^https?:\/\//i.test(imageUrl)
      ) {
        throw new Error(
          "Server returned success but image URL is missing. " +
            "Actual response: " +
            JSON.stringify(result).slice(0, 500)
        );
      }

      setDocuments((prev) => ({ ...prev, [key]: imageUrl }));
      console.log("✅ Image uploaded successfully:", imageUrl);

      toast.success(
        `${DOCUMENT_FIELDS.find((d) => d.key === key)?.label} uploaded successfully`
      );
    } catch (error: unknown) {
      console.error("❌ UPLOAD ERROR:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  }

  /* ----------------------------------------------------------
   * Remove handler
   * ---------------------------------------------------------- */
  function handleRemove(key: DocumentKey) {
    setDocuments((prev) => ({ ...prev, [key]: "" }));
  }

  /* ----------------------------------------------------------
   * Submit handler
   * ---------------------------------------------------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const missing = DOCUMENT_FIELDS.filter((d) => !documents[d.key]);
    if (missing.length > 0) {
      toast.error(`Please upload: ${missing.map((d) => d.label).join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/admissions", {
        ...form,
        birthCertificateImage: documents.birthCertificate,
        previousSchoolCertificateImage: documents.previousSchoolCertificate,
        passportPhotosImage: documents.passportPhotos,
        parentNidImage: documents.parentNid,
      });

      toast.success("Application submitted successfully!");
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setDocuments(INITIAL_DOCUMENTS);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------------
   * Success screen
   * ---------------------------------------------------------- */
  if (submitted) {
    return (
      <>
        <PageHeader
          title="Admission 2027"
          subtitle="Join a community of learners where excellence is a tradition."
          breadcrumbs={[{ label: "Admission" }]}
        />
        <section className="relative max-w-3xl mx-auto px-4 py-32 text-center overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.08] rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-500/[0.06] rounded-full blur-3xl -z-10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative p-10 sm:p-14 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.06] overflow-hidden"
          >
            {/* Top gradient hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
            {/* Corner glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Icon medallion */}
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 -m-3 bg-emerald-500/20 rounded-full blur-2xl" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-500/30 grid place-items-center shadow-lg shadow-emerald-500/10">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 grid place-items-center">
                  <CheckCircle2 className="h-9 w-9 text-emerald-500" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
              Application <span className="gradient-text">Received!</span>
            </h2>
            <p className="text-[var(--fg-muted)] text-lg mb-10 leading-relaxed max-w-xl mx-auto font-medium">
              Thank you for choosing Oasis BIAM Laboratory School. Our admissions
              team will review your application and documents, and contact you
              within 2-3 business days.
            </p>

            <Button
              onClick={() => {
                setSubmitted(false);
                setForm(INITIAL_FORM);
                setDocuments(INITIAL_DOCUMENTS);
              }}
              size="lg"
              className="gradient-brand shadow-glow rounded-xl px-8 group"
            >
              Submit Another Application
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </section>
      </>
    );
  }

  /* ----------------------------------------------------------
   * Form screen
   * ---------------------------------------------------------- */
  return (
    <>
      <PageHeader
        title="Admission 2027"
        subtitle="Join a community of learners where excellence is a tradition."
        breadcrumbs={[{ label: "Admission" }]}
      />

      <section className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ===== Ambient background layers ===== */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="absolute top-0 -right-24 w-[560px] h-[560px] bg-brand-500/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-blue-500/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] bg-amber-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Process Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative p-8 rounded-[2rem] bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] shadow-xl shadow-black/[0.03] overflow-hidden group"
          >
            {/* Corner sheen */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-bl from-brand-500/[0.08] to-transparent rounded-full blur-2xl pointer-events-none" />

            <h3 className="relative text-lg font-bold mb-7 flex items-center gap-3 tracking-tight">
              <div className="relative p-2.5 rounded-xl bg-brand-500/10 ring-1 ring-brand-500/20 text-brand-500">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                <FileText className="h-4.5 w-4.5 relative" strokeWidth={2.5} />
              </div>
              Admission Process
            </h3>

            <div className="relative space-y-6">
              {[
                { step: "1", title: "Submit Application", desc: "Fill out the online form accurately." },
                { step: "2", title: "Upload Documents", desc: "Attach the 4 required documents." },
                { step: "3", title: "Assessment", desc: "Your child will be called for a brief assessment." },
                { step: "4", title: "Interview", desc: "A short meeting with the principal and parents." },
                { step: "5", title: "Enrollment", desc: "Complete the formalities upon selection." },
              ].map((s, i, arr) => (
                <div key={i} className="relative pl-12 group/step">
                  {i !== arr.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-gradient-to-b from-brand-500/40 via-[var(--border)] to-[var(--border)]" />
                  )}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full gradient-brand text-white text-xs font-black grid place-items-center shadow-lg shadow-brand-500/25 ring-1 ring-white/20 group-hover/step:scale-110 transition-transform duration-300">
                    {s.step}
                  </div>
                  <h4 className="font-bold text-[var(--fg)] text-sm tracking-tight">{s.title}</h4>
                  <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="relative p-8 rounded-[2rem] bg-[var(--bg-soft)]/60 backdrop-blur-md border border-[var(--border)] shadow-lg shadow-black/[0.02] overflow-hidden"
          >
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/[0.06] rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center justify-between mb-5">
              <h3 className="text-base font-bold flex items-center gap-2.5 tracking-tight">
                <ShieldCheck className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
                Required Documents
              </h3>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg whitespace-nowrap ring-1 ${
                uploadedCount === DOCUMENT_FIELDS.length
                  ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                  : "bg-[var(--card)] text-[var(--fg-muted)] ring-[var(--border)]"
              }`}>
                {uploadedCount}/{DOCUMENT_FIELDS.length}
              </span>
            </div>

            <ul className="relative space-y-3">
              {DOCUMENT_FIELDS.map((doc) => {
                const isUploaded = !!documents[doc.key];
                return (
                  <li key={doc.key} className="flex items-center gap-3 text-sm font-semibold group/item">
                    <div className={`p-1 rounded-full shrink-0 transition-all duration-300 ${
                      isUploaded
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                        : "bg-[var(--border)] text-[var(--fg-muted)]"
                    }`}>
                      {isUploaded ? <CheckCircle2 className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    <span className={`transition-colors duration-300 ${isUploaded ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                      {doc.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="relative text-[11px] text-[var(--fg-muted)] mt-5 pt-5 border-t border-[var(--border)] leading-relaxed font-medium">
              💡 All four documents must be uploaded before you can submit the application. Accepted formats: JPG, PNG, WebP · Max 5MB each.
            </p>
          </motion.div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative p-6 sm:p-10 rounded-[2.5rem] bg-[var(--card)]/70 backdrop-blur-xl border border-[var(--border)] shadow-2xl shadow-black/[0.05] overflow-hidden"
          >
            {/* Top gradient hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
            {/* Corner glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/[0.07] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-10">
                <h2 className="text-3xl font-black font-display mb-2 tracking-tight">
                  Online <span className="gradient-text">Application</span>
                </h2>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed font-medium">
                  Please fill out all required fields and upload the required documents to ensure a smooth admission process.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Section 1: Student Information */}
                <div>
                  <SectionHeader
                    icon={User}
                    title="Student Information"
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                    ring="ring-blue-500/20"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        Student's Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Enter full name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <Droplet className="h-3.5 w-3.5 text-red-500" strokeWidth={2.5} />Blood Group
                      </label>
                      <Select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300">
                        <option value="">Select Blood Group</option>
                        {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Parent Information */}
                <div>
                  <SectionHeader
                    icon={Users}
                    title="Parent Information"
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                    ring="ring-purple-500/20"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        Father's Name <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Enter father's name" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        Mother's Name <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Enter mother's name" value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Information */}
                <div>
                  <SectionHeader
                    icon={School}
                    title="Academic Information"
                    color="text-amber-500"
                    bg="bg-amber-500/10"
                    ring="ring-amber-500/20"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                        Class Applying For <span className="text-red-500">*</span>
                      </label>
                      <Select value={form.classApplyingFor} onChange={(e) => setForm({ ...form, classApplyingFor: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300">
                        <option value="">Select Target Class</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.5} />Previous Class Passed
                      </label>
                      <Input placeholder="e.g., Class II" value={form.previousClass} onChange={(e) => setForm({ ...form, previousClass: e.target.value })} className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact & Address */}
                <div>
                  <SectionHeader
                    icon={MapPin}
                    title="Contact & Address"
                    color="text-emerald-500"
                    bg="bg-emerald-500/10"
                    ring="ring-emerald-500/20"
                  />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" strokeWidth={2.5} />Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="017XX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" strokeWidth={2.5} />Email Address
                      </label>
                      <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />Current Address <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Where do you currently live?" value={form.currentAddress} onChange={(e) => setForm({ ...form, currentAddress: e.target.value })} required className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fg-muted)] flex items-center gap-2">
                        <Home className="h-3.5 w-3.5" strokeWidth={2.5} />Permanent Address
                      </label>
                      <Input placeholder="Permanent home address" value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} className="h-12 bg-[var(--bg-soft)] border-transparent hover:border-[var(--border)] focus:bg-[var(--bg)] focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Required Documents */}
                <div>
                  <div className="flex items-center gap-4 mb-7 pb-4 border-b border-[var(--border)]">
                    <div className="relative w-12 h-12 rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20 grid place-items-center shrink-0 text-rose-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                      <ShieldCheck className="h-5 w-5 relative" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-[var(--fg)] tracking-tight leading-tight">Required Documents</h3>
                      <p className="text-xs text-[var(--fg-muted)] mt-1 font-medium">All 4 documents are required · JPG, PNG, WebP · Max 5MB</p>
                    </div>
                    <span className={`text-[11px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap ring-1 ${
                      uploadedCount === DOCUMENT_FIELDS.length
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                    }`}>
                      {uploadedCount}/{DOCUMENT_FIELDS.length}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {DOCUMENT_FIELDS.map((field) => (
                      <DocumentUploader key={field.key} field={field} url={documents[field.key]} uploading={uploading[field.key]} onUpload={handleUpload} onRemove={handleRemove} />
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="relative w-full h-16 text-base font-bold shadow-glow group rounded-2xl overflow-hidden"
                    loading={loading}
                    disabled={loading || Object.values(uploading).some(Boolean)}
                  >
                    <span className="relative z-10 inline-flex items-center">
                      Submit Application
                      {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />}
                    </span>
                    {/* Sheen sweep */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Button>

                  {uploadedCount < DOCUMENT_FIELDS.length && (
                    <p className="text-center text-xs font-semibold text-amber-600 mt-4 px-4 py-2 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 inline-flex items-center gap-2 w-full justify-center">
                      ⚠ Please upload all {DOCUMENT_FIELDS.length} documents before submitting
                    </p>
                  )}

                  <p className="text-center text-[11px] font-medium text-[var(--fg-muted)] mt-5 tracking-wide">
                    By submitting, you agree to our <span className="text-[var(--fg)] font-bold">Terms of Service</span> and <span className="text-[var(--fg)] font-bold">Privacy Policy</span>.
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
 * Document Uploader Sub-component
 * ============================================================ */

function DocumentUploader({
  field,
  url,
  uploading,
  onUpload,
  onRemove,
}: {
  field: { key: DocumentKey; label: string; description: string; icon: any; color: string; bg: string; ring: string };
  url: string;
  uploading: boolean;
  onUpload: (key: DocumentKey, file: File) => void;
  onRemove: (key: DocumentKey) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = field.icon;

  return (
    <div className={`relative p-4 rounded-2xl border transition-all duration-500 group ${
      url
        ? "border-emerald-500/30 bg-emerald-500/[0.04] shadow-lg shadow-emerald-500/[0.06]"
        : "border-dashed border-[var(--border)] bg-[var(--bg-soft)]/60 hover:border-brand-500/40 hover:bg-[var(--bg-soft)] hover:shadow-lg hover:shadow-brand-500/[0.04]"
    }`}>
      {/* Hover aura */}
      {!url && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(field.key, f);
          e.target.value = "";
        }}
        disabled={uploading}
      />

      {url ? (
        <div className="space-y-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] group/img">
            <img src={url} alt={field.label} className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
            <button
              type="button"
              onClick={() => onRemove(field.key)}
              className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 transition-all duration-300 shadow-lg shadow-red-500/30 ring-1 ring-white/20 hover:scale-110"
              disabled={uploading}
              aria-label="Remove document"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold truncate flex-1 tracking-tight">{field.label}</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider ring-1 ring-emerald-500/20 whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3" strokeWidth={3} /> Uploaded
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className={`relative p-3 rounded-xl border border-[var(--border)] shrink-0 transition-all duration-300 ${
            uploading ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : `${field.bg} ring-1 ${field.ring}`
          }`}>
            {uploading ? (
              <Loader2 className={`h-5 w-5 animate-spin ${field.color}`} strokeWidth={2.5} />
            ) : (
              <Icon className={`h-5 w-5 ${field.color}`} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate tracking-tight">{field.label}</p>
            <p className="text-[11px] text-[var(--fg-muted)] line-clamp-2 mt-0.5 font-medium leading-relaxed">
              {uploading ? "Uploading..." : field.description}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="shrink-0 h-9 px-3 rounded-lg font-bold text-xs hover:border-brand-500/40 hover:text-brand-500 transition-all duration-300"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
                Upload
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}