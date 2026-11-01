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
  ImagePlus, Loader2,
} from "lucide-react";

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
      // 🔧 FIX: Removed <any> — api.upload doesn't accept generic parameters
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-500/10 via-transparent to-transparent p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-500 uppercase tracking-widest">
              <FileText className="h-3.5 w-3.5" /> Content Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              News & <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-sm text-[var(--fg-muted)] mt-2 max-w-xl">
              Publish articles, updates, and educational insights for the Oasis BIAM community.
            </p>
          </div>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setOpen(true);
            }}
            size="lg"
            className="shadow-lg shadow-brand-500/20"
          >
            <Plus className="h-4 w-4" /> Write Article
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--fg-muted)] pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles by title or category…"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-sm outline-none transition focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--border)] transition"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-[var(--fg-muted)]" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--card)] animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--card)]/50">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-500/10 grid place-items-center text-brand-500 mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-1">No articles published</h3>
          <p className="text-sm text-[var(--fg-muted)] mb-6 max-w-sm mx-auto">
            Share your first news update, announcement, or educational article.
          </p>
          <Button onClick={() => setOpen(true)}>Write First Article</Button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-12 text-center text-[var(--fg-muted)]">
          <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="font-semibold mb-1">No matches for "{search}"</p>
          <button onClick={() => setSearch("")} className="text-brand-500 text-sm hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredArticles.map((a, i) => (
              <motion.div
                key={a._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-brand-500/40 hover:shadow-md transition-all duration-300"
              >
                <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden shrink-0 bg-[var(--border)]">
                  <img
                    src={a.coverImage || "https://i.ibb.co.com/7NzsPGvc/logo.jpg"}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0 py-2">
                  <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {a.category}
                  </span>
                  <h3 className="text-lg font-bold line-clamp-1">{a.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] mt-1 line-clamp-3">
                    {a.excerpt || a.content?.substring(0, 120)}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-end shrink-0 gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(a._id)}
                    disabled={deleting === a._id}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    aria-label="Delete article"
                  >
                    {deleting === a._id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => {
          if (saving || uploading) return;
          setOpen(false);
        }}
        title="Write Article"
        className="max-w-3xl"
      >
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">
              Article Title <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter a compelling title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={uploading || saving}
              className="text-lg font-medium py-6"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Category</label>
            <Input
              placeholder="e.g. Education, News, Science"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              disabled={uploading || saving}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">Cover Image</label>
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
              className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
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
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4" /> Replace
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ ...form, coverImage: "" })}
                      disabled={uploading}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-[21/9] flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)] hover:text-brand-500 transition-colors disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-9 w-9 animate-spin text-brand-500" />
                  ) : (
                    <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 mb-1">
                      <ImagePlus className="h-7 w-7" />
                    </div>
                  )}
                  <p className="text-sm font-semibold">
                    {uploading ? "Uploading…" : "Drop a cover image here, or click to browse"}
                  </p>
                  <p className="text-xs">JPG · PNG · WebP — up to 5 MB</p>
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

          <div>
            <label className="text-sm font-semibold mb-1.5 block">
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Write the main body of your article here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={10}
              className="min-h-[300px] resize-y text-base leading-relaxed"
              disabled={uploading || saving}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving || uploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              loading={saving}
              disabled={uploading || !form.title.trim() || !form.content.trim()}
              className="flex-1"
            >
              {saving ? "Publishing…" : "Publish Article"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}