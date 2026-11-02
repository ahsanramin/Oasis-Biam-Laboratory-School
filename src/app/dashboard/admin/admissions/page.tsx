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
  Trash2,
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  /* ----- Delete application ----- */
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
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ---------- Header ---------- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />
        {/* Corner glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.5} /> Admissions
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Student Applications
            </h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Review, approve, or reject incoming applications. Click <strong className="text-[var(--fg)]">Details</strong> to view the full application and download a PDF.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => load(true)}
            loading={refreshing}
            disabled={refreshing}
            className="relative shrink-0 h-12 px-6 rounded-xl font-bold bg-[var(--card)]/70 backdrop-blur-md border-[var(--border)] ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:bg-[var(--card)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
          >
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent pointer-events-none" />
            {!refreshing && <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} />}
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={stats.total} icon={FileText} color="text-blue-500" bg="bg-blue-500/10" ring="ring-blue-500/20" />
        <StatCard label="Pending Review" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" ring="ring-amber-500/20" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" ring="ring-emerald-500/20" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="text-red-500" bg="bg-red-500/10" ring="ring-red-500/20" />
      </div>

      {/* ---------- Filters + Search ---------- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        {/* Filter Tabs */}
        <div className="flex p-1.5 rounded-2xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] ring-1 ring-inset ring-white/[0.04]">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`relative px-4 sm:px-5 py-2 text-[11px] font-black uppercase tracking-[0.14em] rounded-xl capitalize transition-all duration-300 overflow-hidden ${
                filter === tab
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {filter === tab && (
                <motion.div
                  layoutId="active-filter-tab"
                  className="absolute inset-0 bg-[var(--card)] rounded-xl shadow-sm ring-1 ring-inset ring-white/[0.08] -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-emerald-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email..."
              className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <XCircle className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ---------- Content ---------- */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[480px] rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/15 to-transparent ring-1 ring-emerald-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <Inbox className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">
            {items.length === 0
              ? "No applications yet"
              : "No applications match your filters"}
          </h3>
          <p className="text-sm font-medium text-[var(--fg-muted)] mb-6 max-w-sm mx-auto">
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
              className="h-11 px-6 rounded-xl font-bold bg-[var(--card)] hover:bg-[var(--bg-soft)] hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
            >
              Clear Filters
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const isUpdating = updatingId === a._id;
              const isPdfBusy = pdfBusyId === a._id;
              const isDeleting = deletingId === a._id;
              const isBusy = isUpdating || isPdfBusy || isDeleting;

              return (
                <motion.div
                  key={a._id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.05, ease: EASE }}
                  className="group relative flex flex-col p-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                >
                  {/* Top hairline */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                  
                  {/* Outer hover aura */}
                  <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.08] via-transparent to-emerald-500/[0.06] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                  {/* Card header */}
                  <div className="relative flex items-start justify-between gap-3 mb-5">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold truncate tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                        {a.studentName}
                      </h3>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400 truncate mt-1">
                        Applying for: {a.classApplyingFor || "N/A"}
                      </p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>

                  {/* Full info grid */}
                  <div className="relative grid grid-cols-2 gap-x-3 gap-y-4 mb-5">
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
                  <div className="relative space-y-3 mb-5 p-4 rounded-2xl bg-[var(--bg-soft)]/50 border border-[var(--border)] ring-1 ring-inset ring-white/[0.02]">
                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                      <span className="line-clamp-2 leading-relaxed">
                        <b className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] block mb-0.5">Current Address</b>
                        <span className="text-[var(--fg)] font-medium">{a.currentAddress || "—"}</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500 shrink-0 mt-0.5">
                        <Home className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                      <span className="line-clamp-2 leading-relaxed">
                        <b className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] block mb-0.5">Permanent Address</b>
                        <span className="text-[var(--fg)] font-medium">{a.permanentAddress || "—"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions — 2 rows */}
                  <div className="relative pt-5 border-t border-[var(--border)] mt-auto space-y-2.5">
                    {/* Row 1: Details · PDF · Delete */}
                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/admissions/${a._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="relative w-full h-10 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] text-blue-600 bg-blue-500/[0.04] border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] group/btn overflow-hidden"
                          disabled={isDeleting}
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          <Eye className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} /> Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleQuickPDF(a)}
                        loading={isPdfBusy}
                        disabled={isBusy && !isPdfBusy}
                        title="Download PDF"
                        className="h-10 px-3 shrink-0 rounded-xl text-purple-600 bg-purple-500/[0.04] border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                      >
                        {!isPdfBusy && <Download className="h-4 w-4" strokeWidth={2.5} />}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(a)}
                        loading={isDeleting}
                        disabled={isBusy && !isDeleting}
                        title="Delete application"
                        className="h-10 px-3 shrink-0 rounded-xl text-rose-600 bg-rose-500/[0.04] border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                      >
                        {!isDeleting && <Trash2 className="h-4 w-4" strokeWidth={2.5} />}
                      </Button>
                    </div>

                    {/* Row 2: Approve · Reject */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="relative flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] text-emerald-600 bg-emerald-500/[0.04] border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] group/btn overflow-hidden"
                        onClick={() => updateStatus(a._id, "approved")}
                        disabled={isBusy || a.status === "approved"}
                        loading={isUpdating && a.status !== "approved"}
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <Check className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="relative flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] text-red-600 bg-red-500/[0.04] border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04] group/btn overflow-hidden"
                        onClick={() => updateStatus(a._id, "rejected")}
                        disabled={isBusy || a.status === "rejected"}
                        loading={isUpdating && a.status !== "rejected"}
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <Ban className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} /> Reject
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
 * Sub-components
 * ============================================================ */

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  ring,
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
  ring: string;
}) {
  return (
    <div className="relative flex items-center gap-4 p-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 overflow-hidden group">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      
      <div className={`relative shrink-0 w-12 h-12 rounded-2xl grid place-items-center ring-1 ring-inset ${bg} ${ring} ${color} group-hover:scale-110 transition-transform duration-500`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
        <Icon className="h-5 w-5 relative" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl sm:text-3xl font-black leading-none tabular-nums tracking-tight">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] mt-1.5 truncate">
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
    <div className="flex items-start gap-2 min-w-0">
      <div className="p-1 rounded-md bg-[var(--bg-soft)] border border-[var(--border)] shrink-0 mt-0.5">
        <Icon className="h-3 w-3 text-[var(--fg-muted)]" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--fg-muted)] leading-none mb-1">
          {label}
        </p>
        <p className="text-[11px] font-bold text-[var(--fg)] truncate tracking-tight" title={value || "—"}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdmissionStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-emerald-500/20 shadow-sm shadow-emerald-500/10 whitespace-nowrap shrink-0">
        <CheckCircle className="h-3 w-3" strokeWidth={2.5} /> Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-red-500/20 shadow-sm shadow-red-500/10 whitespace-nowrap shrink-0">
        <XCircle className="h-3 w-3" strokeWidth={2.5} /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-[0.14em] ring-1 ring-inset ring-amber-500/20 shadow-sm shadow-amber-500/10 whitespace-nowrap shrink-0">
      <Clock className="h-3 w-3" strokeWidth={2.5} /> Pending
    </span>
  );
}