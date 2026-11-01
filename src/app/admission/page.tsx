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
}[] = [
  {
    key: "birthCertificate",
    label: "Birth Certificate",
    description: "Clear photo or scan of the student's birth certificate",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    key: "previousSchoolCertificate",
    label: "Previous School Certificate",
    description: "Transfer certificate or last school report card",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    key: "passportPhotos",
    label: "Passport Size Photos",
    description: "Recent photo with white background",
    icon: ImageIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    key: "parentNid",
    label: "Parent's NID Copy",
    description: "Father's or mother's national ID card",
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
        <section className="max-w-3xl mx-auto px-4 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full grid place-items-center mx-auto mb-8">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black mb-4">Application Received!</h2>
            <p className="text-[var(--fg-muted)] text-lg mb-8 leading-relaxed">
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
              className="rounded-xl px-8"
            >
              Submit Another Application
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

      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-start relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Process Card */}
          <div className="p-8 rounded-[2rem] bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                <FileText className="h-5 w-5" />
              </div>
              Admission Process
            </h3>
            <div className="space-y-6">
              {[
                { step: "1", title: "Submit Application", desc: "Fill out the online form accurately." },
                { step: "2", title: "Upload Documents", desc: "Attach the 4 required documents." },
                { step: "3", title: "Assessment", desc: "Your child will be called for a brief assessment." },
                { step: "4", title: "Interview", desc: "A short meeting with the principal and parents." },
                { step: "5", title: "Enrollment", desc: "Complete the formalities upon selection." },
              ].map((s, i, arr) => (
                <div key={i} className="relative pl-12">
                  {i !== arr.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-16px] w-0.5 bg-[var(--border)]" />
                  )}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full gradient-brand text-white text-xs font-bold grid place-items-center shadow-glow">
                    {s.step}
                  </div>
                  <h4 className="font-bold text-[var(--fg)]">{s.title}</h4>
                  <p className="text-sm text-[var(--fg-muted)] mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="p-8 rounded-[2rem] bg-[var(--bg-soft)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Required Documents
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600">
                {uploadedCount}/{DOCUMENT_FIELDS.length}
              </span>
            </div>
            <ul className="space-y-3">
              {DOCUMENT_FIELDS.map((doc) => {
                const isUploaded = !!documents[doc.key];
                return (
                  <li key={doc.key} className="flex items-center gap-3 text-sm font-semibold">
                    <div className={`p-1 rounded-full shrink-0 transition-colors ${isUploaded ? "bg-emerald-500 text-white" : "bg-[var(--border)] text-[var(--fg-muted)]"}`}>
                      {isUploaded ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </div>
                    <span className={isUploaded ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>
                      {doc.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-[var(--fg-muted)] mt-4 pt-4 border-t border-[var(--border)] leading-relaxed">
              💡 All four documents must be uploaded before you can submit the application. Accepted formats: JPG, PNG, WebP · Max 5MB each.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="mb-10">
                <h2 className="text-3xl font-black font-display mb-2">
                  Online Application
                </h2>
                <p className="text-[var(--fg-muted)]">
                  Please fill out all required fields and upload the required documents to ensure a smooth admission process.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Section 1: Student Information */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--border)]">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">Student Information</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-semibold">Student's Full Name <span className="text-red-500">*</span></label>
                      <Input placeholder="Enter full name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><Calendar className="h-4 w-4 text-[var(--fg-muted)]" />Date of Birth <span className="text-red-500">*</span></label>
                      <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><Droplet className="h-4 w-4 text-red-500" />Blood Group</label>
                      <Select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors">
                        <option value="">Select Blood Group</option>
                        {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Parent Information */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--border)]">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">Parent Information</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Father's Name <span className="text-red-500">*</span></label>
                      <Input placeholder="Enter father's name" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Mother's Name <span className="text-red-500">*</span></label>
                      <Input placeholder="Enter mother's name" value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Information */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--border)]">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <School className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">Academic Information</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Class Applying For <span className="text-red-500">*</span></label>
                      <Select value={form.classApplyingFor} onChange={(e) => setForm({ ...form, classApplyingFor: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors">
                        <option value="">Select Target Class</option>
                        {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><GraduationCap className="h-4 w-4 text-[var(--fg-muted)]" />Previous Class Passed</label>
                      <Input placeholder="e.g., Class II" value={form.previousClass} onChange={(e) => setForm({ ...form, previousClass: e.target.value })} className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact & Address */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--border)]">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--fg)]">Contact & Address</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--fg-muted)]" />Phone Number <span className="text-red-500">*</span></label>
                      <Input placeholder="017XX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--fg-muted)]" />Email Address</label>
                      <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--fg-muted)]" />Current Address <span className="text-red-500">*</span></label>
                      <Input placeholder="Where do you currently live?" value={form.currentAddress} onChange={(e) => setForm({ ...form, currentAddress: e.target.value })} required className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2"><Home className="h-4 w-4 text-[var(--fg-muted)]" />Permanent Address</label>
                      <Input placeholder="Permanent home address" value={form.permanentAddress} onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })} className="bg-[var(--bg-soft)] border-transparent focus:bg-[var(--bg)] transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Required Documents */}
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-[var(--border)]">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-[var(--fg)]">Required Documents</h3>
                      <p className="text-xs text-[var(--fg-muted)] mt-0.5">All 4 documents are required · JPG, PNG, WebP · Max 5MB</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap ${uploadedCount === DOCUMENT_FIELDS.length ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
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
                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full h-16 text-lg font-bold shadow-glow group rounded-2xl" loading={loading} disabled={loading || Object.values(uploading).some(Boolean)}>
                    Submit Application
                    {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                  </Button>

                  {uploadedCount < DOCUMENT_FIELDS.length && (
                    <p className="text-center text-xs font-medium text-amber-600 mt-3">
                      ⚠ Please upload all {DOCUMENT_FIELDS.length} documents before submitting
                    </p>
                  )}

                  <p className="text-center text-xs font-medium text-[var(--fg-muted)] mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
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
  field: { key: DocumentKey; label: string; description: string; icon: any; color: string; bg: string };
  url: string;
  uploading: boolean;
  onUpload: (key: DocumentKey, file: File) => void;
  onRemove: (key: DocumentKey) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = field.icon;

  return (
    <div className={`relative p-4 rounded-2xl border-2 transition-all ${url ? "border-emerald-500/30 bg-emerald-500/5" : "border-dashed border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--fg-muted)]"}`}>
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
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)]">
            <img src={url} alt={field.label} className="w-full h-full object-contain" />
            <button type="button" onClick={() => onRemove(field.key)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg" disabled={uploading} aria-label="Remove document">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold truncate flex-1">{field.label}</p>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-xs font-bold whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3" /> Uploaded
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl border border-[var(--border)] shrink-0 ${uploading ? "bg-emerald-500/10" : field.bg}`}>
            {uploading ? <Loader2 className={`h-5 w-5 animate-spin ${field.color}`} /> : <Icon className={`h-5 w-5 ${field.color}`} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{field.label}</p>
            <p className="text-xs text-[var(--fg-muted)] line-clamp-2 mt-0.5">
              {uploading ? "Uploading..." : field.description}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading} className="shrink-0">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Upload className="h-3.5 w-3.5 mr-1.5" />Upload</>}
          </Button>
        </div>
      )}
    </div>
  );
}