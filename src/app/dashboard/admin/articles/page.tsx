"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Plus, Trash2, Upload, FileText, Search, X,
  ImagePlus, Loader2, Sparkles,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Article = {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  createdAt?: string;
};

const emptyForm = {
  title: "",
  content: "",
  category: "Education",
  coverImage: "",
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get<any>("/api/articles");
      setArticles(extractArray<Article>(r));
    } catch (error) {
      console.error(error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [articles, search]);

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    const prevImage = form.coverImage;
    setForm((f) => ({ ...f, coverImage: tempUrl }));
    setUploading(true);

    try {
      const r = await api.upload(file);
      const url = (r as any)?.url || (r as any)?.data?.url || (r as any)?.data;

      if (url) {
        setForm((f) => ({ ...f, coverImage: url }));
        toast.success("Cover image uploaded");
      } else {
        setForm((f) => ({ ...f, coverImage: prevImage || "" }));
        toast.error("Upload failed: no URL returned");
      }
    } catch (e: any) {
      setForm((f) => ({ ...f, coverImage: prevImage || "" }));
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Article title is required");
    if (!form.content.trim()) return toast.error("Article content cannot be empty");

    setSaving(true);
    try {
      await api.post("/api/articles", form);
      toast.success("Article published successfully");
      setOpen(false);
      setForm(emptyForm);
      void load();
    } catch (e: any) {
      toast.error(e?.message || "Failed to publish article");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this article permanently?")) return;
    setDeleting(id);
    try {
      await api.del(`/api/articles/${id}`);
      toast.success("Article deleted");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 pb-20 overflow-hidden">
      
      {/* ===== Ambient Background Glows ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/[0.04]"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 ring-1 ring-inset ring-white/[0.04] text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">
              <FileText className="h-3.5 w-3.5" strokeWidth={2.5} /> Content Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              News & <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-sm font-medium text-[var(--fg-muted)] mt-2 max-w-xl leading-relaxed">
              Publish articles, updates, and educational insights for the Oasis BIAM community.
            </p>
          </div>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
            size="lg"
            className="relative gradient-brand shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold group overflow-hidden ring-1 ring-inset ring-white/20"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <Plus className="h-4 w-4 mr-2 relative" strokeWidth={2.5} /> Write Article
          </Button>
        </div>
      </motion.div>

      {/* ================= SEARCH ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="relative max-w-md group"
      >
        <div className="absolute inset-0 -m-1 rounded-xl bg-gradient-to-r from-brand-500/15 via-transparent to-purple-500/15 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] group-focus-within:text-[var(--primary)] transition-colors duration-300 z-10" strokeWidth={2.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or category…"
            className="w-full pl-11 pr-10 h-12 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md text-sm font-medium outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all duration-300"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative py-24 text-center border border-dashed border-[var(--border)] rounded-[2.5rem] bg-[var(--card)]/40 backdrop-blur-md flex flex-col items-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative mb-6">
            <div className="absolute inset-0 -m-3 bg-brand-500/10 rounded-full blur-2xl" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-500/15 to-transparent ring-1 ring-brand-500/20 grid place-items-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-soft)] ring-1 ring-[var(--border)] grid place-items-center">
                <FileText className="h-8 w-8 text-[var(--fg-muted)] opacity-60" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 tracking-tight">No articles published</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            Share your first news update, announcement, or educational article.
          </p>
          <Button 
            onClick={() => setOpen(true)}
            className="h-11 px-6 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-all duration-300 ring-1 ring-inset ring-white/20"
          >
            Write First Article
          </Button>
        </motion.div>
      ) : filteredArticles.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="py-16 text-center text-[var(--fg-muted)] bg-[var(--card)]/40 backdrop-blur-md rounded-[2rem] border border-dashed border-[var(--border)]"
        >
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40 text-brand-500" strokeWidth={1.5} />
          <p className="font-bold text-lg text-[var(--fg)] mb-1">No matches for "{search}"</p>
          <button onClick={() => setSearch("")} className="text-brand-500 text-sm font-bold hover:underline mt-2">
            Clear search
          </button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          <AnimatePresence>
            {filteredArticles.map((a, i) => (
              <motion.div
                key={a._id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.06, ease: EASE }}
                className="group relative flex flex-col sm:flex-row gap-5 p-5 rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md ring-1 ring-inset ring-white/[0.04] hover:border-[var(--primary)]/40 hover:shadow-2xl hover:shadow-black/[0.06] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Top hairline */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent z-20 pointer-events-none" />
                
                {/* Outer hover aura */}
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-brand-500/[0.1] via-transparent to-purple-500/[0.08] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 -z-10 pointer-events-none" />

                {/* Image */}
                <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-auto sm:h-full rounded-2xl overflow-hidden shrink-0 bg-[var(--border)] ring-1 ring-inset ring-white/[0.06]">
                  <img
                    src={a.coverImage || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                  <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 ring-1 ring-inset ring-brand-500/20 text-[10px] font-black uppercase tracking-[0.14em] mb-3">
                    {a.category}
                  </span>
                  <h3 className="text-lg font-bold line-clamp-1 tracking-tight group-hover:text-[var(--primary)] transition-colors duration-300">
                    {a.title}
                  </h3>
                  <p className="text-[13px] font-medium text-[var(--fg-muted)] mt-1.5 line-clamp-3 leading-relaxed">
                    {a.excerpt || a.content?.substring(0, 120)}
                  </p>
                </div>

                {/* Delete Action */}
                <div className="flex sm:flex-col items-end justify-end shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(a._id)}
                    disabled={deleting === a._id}
                    className="w-10 h-10 rounded-xl text-red-500 bg-red-500/[0.04] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-white/[0.04]"
                    aria-label="Delete article"
                  >
                    {deleting === a._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog
        open={open}
        onClose={() => {
          if (saving || uploading) return;
          setOpen(false);
        }}
        title="Write Article"
        className="max-w-3xl"
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1 pb-4 scrollbar-thin">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">
              Article Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter a compelling title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={uploading || saving}
              className="h-14 text-lg font-bold bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl tracking-tight"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Category</label>
            <Input
              placeholder="e.g. Education, News, Science"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              disabled={uploading || saving}
              className="h-12 bg-[var(--bg-soft)]/70 border-[var(--border)] focus:ring-2 focus:ring-brand-500/10 transition-all rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">Cover Image</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const f = e.dataTransfer.files?.[0];
                if (f) void handleFileUpload(f);
              }}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                dragActive
                  ? "border-brand-500 bg-brand-500/5 scale-[1.01]"
                  : form.coverImage
                  ? "border-[var(--border)]"
                  : "border-[var(--border)] hover:border-brand-500/40"
              }`}
            >
              {form.coverImage ? (
                <div className="relative aspect-[21/9] group">
                  <img
                    src={form.coverImage}
                    alt="Article preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="rounded-lg"
                    >
                      <Upload className="h-4 w-4 mr-2" strokeWidth={2.5} /> Replace
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ ...form, coverImage: "" })}
                      disabled={uploading}
                      className="rounded-lg text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" strokeWidth={2.5} /> Remove
                    </Button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-[21/9] flex flex-col items-center justify-center gap-3 text-[var(--fg-muted)] hover:text-brand-500 transition-colors disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-9 w-9 animate-spin text-brand-500" />
                  ) : (
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 mb-1 ring-1 ring-brand-500/20">
                      <ImagePlus className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                  )}
                  <p className="text-sm font-bold tracking-tight">
                    {uploading ? "Uploading…" : "Drop a cover image here, or click to browse"}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em]">JPG · PNG · WebP — up to 5 MB</p>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFileUpload(f);
                e.target.value = "";
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--fg-muted)] ml-1">
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Write the main body of your article here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="min-h-[300px] resize-y text-[15px] leading-[1.85] font-medium p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]/70 outline-none hover:border-[var(--primary)]/30 focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-brand-500/10 transition-all"
              disabled={uploading || saving}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving || uploading}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              loading={saving}
              disabled={uploading || !form.title.trim() || !form.content.trim()}
              className="flex-1 h-12 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/25 hover:scale-[1.02] transition-transform"
            >
              {saving ? "Publishing…" : "Publish Article"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}