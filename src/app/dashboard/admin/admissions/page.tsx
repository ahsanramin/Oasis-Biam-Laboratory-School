"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateAdmissionPDF } from "@/lib/admission-pdf";
import {
  CheckCircle,
  XCircle,
  Search,
  GraduationCap,
  Phone,
  User,
  Clock,
  Check,
  Ban,
  FileText,
  Eye,
  Droplet,
  Calendar,
  Mail,
  MapPin,
  Home,
  Users,
  School,
  RefreshCw,
  Inbox,
  Download,
  Trash2, // <-- NEW
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

function formatDate(d?: string) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
 * Main Component
 * ============================================================ */

export default function AdminAdmissions() {
  const [items, setItems] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | AdmissionStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pdfBusyId, setPdfBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // <-- NEW

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const r = await api.get<any>("/api/admissions");
      setItems(extractArray<Admission>(r));
    } catch (e: any) {
      toast.error(e?.message || "Failed to load applications");
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* ----- Derived stats ----- */
  const stats = useMemo(
    () => ({
      total: items.length,
      pending: items.filter((i) => i.status === "pending").length,
      approved: items.filter((i) => i.status === "approved").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    }),
    [items]
  );

  /* ----- Filtered list ----- */
  const filtered = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter((i) => i.status === filter);

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (i) =>
          i.studentName?.toLowerCase().includes(q) ||
          i.fatherName?.toLowerCase().includes(q) ||
          i.motherName?.toLowerCase().includes(q) ||
          i.phone?.includes(q) ||
          i.email?.toLowerCase().includes(q) ||
          i.classApplyingFor?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filter, search]);

  /* ----- Update status ----- */
  async function updateStatus(id: string, status: AdmissionStatus) {
    setUpdatingId(id);
    try {
      await api.patch(`/api/admissions/${id}`, { status });
      toast.success(`Application ${status}`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status, updatedAt: new Date().toISOString() }
            : item
        )
      );
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  }

  /* ----- Quick PDF download ----- */
  async function handleQuickPDF(item: Admission) {
    setPdfBusyId(item._id);
    try {
      await generateAdmissionPDF(item);
      toast.success("PDF downloaded");
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate PDF");
    } finally {
      setPdfBusyId(null);
    }
  }

  /* ----- Delete application (NEW) ----- */
  async function handleDelete(item: Admission) {
    const confirmed = window.confirm(
      `Permanently delete the application for "${item.studentName}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(item._id);
    try {
      await api.delete(`/api/admissions/${item._id}`);
      toast.success("Application deleted");
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete application");
    } finally {
      setDeletingId(null);
    }
  }

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ---------- Header ---------- */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              <GraduationCap className="h-3.5 w-3.5" /> Admissions
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Student Applications
            </h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">
              Review, approve, or reject incoming applications. Click{" "}
              <strong className="text-[var(--fg)]">Details</strong> to view the
              full application and download a PDF.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => load(true)}
            loading={refreshing}
            disabled={refreshing}
            className="shrink-0"
          >
            {!refreshing && <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={stats.total} icon={FileText} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="text-red-500" bg="bg-red-500/10" />
      </div>

      {/* ---------- Filters + Search ---------- */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex p-1 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                filter === tab
                  ? "bg-[var(--bg)] shadow-sm"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ---------- Content ---------- */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[420px] rounded-2xl bg-[var(--card)] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
          <Inbox className="h-14 w-14 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold mb-1">
            {items.length === 0
              ? "No applications yet"
              : "No applications match your filters"}
          </h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6">
            {items.length === 0
              ? "Applications submitted from the public admission page will appear here."
              : "Try clearing your search or switching tabs."}
          </p>
          {(search || filter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((a) => {
              const isUpdating = updatingId === a._id;
              const isPdfBusy = pdfBusyId === a._id;
              const isDeleting = deletingId === a._id;
              const isBusy = isUpdating || isPdfBusy || isDeleting;

              return (
                <motion.div
                  key={a._id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:shadow-lg hover:border-emerald-500/30 transition-all"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold truncate">{a.studentName}</h3>
                      <p className="text-sm font-semibold text-emerald-500 truncate">
                        Applying for: {a.classApplyingFor || "N/A"}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>

                  {/* Full info grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-4 text-sm">
                    <InfoLine icon={User} label="Father" value={a.fatherName} />
                    <InfoLine icon={Users} label="Mother" value={a.motherName} />
                    <InfoLine icon={Phone} label="Phone" value={a.phone} />
                    <InfoLine icon={Mail} label="Email" value={a.email || "—"} />
                    <InfoLine icon={Calendar} label="DOB" value={formatDate(a.birthDate)} />
                    <InfoLine icon={Droplet} label="Blood" value={a.bloodGroup || "—"} />
                    <InfoLine icon={School} label="Prev. Class" value={a.previousClass || "—"} />
                    <InfoLine icon={Clock} label="Applied" value={formatDate(a.createdAt)} />
                  </div>

                  {/* Addresses */}
                  <div className="space-y-2 mb-4 text-xs text-[var(--fg-muted)]">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
                      <span className="line-clamp-2">
                        <b className="text-[var(--fg)]">Current:</b>{" "}
                        {a.currentAddress || "—"}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Home className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-500" />
                      <span className="line-clamp-2">
                        <b className="text-[var(--fg)]">Permanent:</b>{" "}
                        {a.permanentAddress || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Actions — 2 rows */}
                  <div className="pt-4 border-t border-[var(--border)] mt-auto space-y-2">
                    {/* Row 1: Details · PDF · Delete */}
                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/admissions/${a._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full text-blue-600 border-blue-200 hover:bg-blue-500/5"
                          disabled={isDeleting}
                        >
                          <Eye className="h-4 w-4 mr-1.5" /> Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleQuickPDF(a)}
                        loading={isPdfBusy}
                        disabled={isBusy && !isPdfBusy}
                        title="Download PDF"
                        className="px-3 shrink-0 text-purple-600 border-purple-200 hover:bg-purple-500/5"
                      >
                        {!isPdfBusy && <Download className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(a)}
                        loading={isDeleting}
                        disabled={isBusy && !isDeleting}
                        title="Delete application"
                        className="px-3 shrink-0 text-rose-600 border-rose-200 hover:bg-rose-500/5"
                      >
                        {!isDeleting && <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Row 2: Approve · Reject */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-500/5"
                        onClick={() => updateStatus(a._id, "approved")}
                        disabled={isBusy || a.status === "approved"}
                        loading={isUpdating && a.status !== "approved"}
                      >
                        <Check className="h-4 w-4 mr-1.5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-500/5"
                        onClick={() => updateStatus(a._id, "rejected")}
                        disabled={isBusy || a.status === "rejected"}
                        loading={isUpdating && a.status !== "rejected"}
                      >
                        <Ban className="h-4 w-4 mr-1.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Sub-components (unchanged)
 * ============================================================ */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none">{value}</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1 font-medium truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-1.5 min-w-0">
      <Icon className="h-3.5 w-3.5 mt-0.5 text-[var(--fg-muted)] shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold text-[var(--fg-muted)] leading-none mb-0.5">
          {label}
        </p>
        <p className="text-xs font-medium truncate" title={value || "—"}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdmissionStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase whitespace-nowrap">
        <CheckCircle className="h-3.5 w-3.5" /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 text-xs font-bold uppercase whitespace-nowrap">
        <XCircle className="h-3.5 w-3.5" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold uppercase whitespace-nowrap">
      <Clock className="h-3.5 w-3.5" /> Pending
    </span>
  );
}