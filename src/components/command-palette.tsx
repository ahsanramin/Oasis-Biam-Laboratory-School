"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, FileText, Bell, Users, Home, 
  BookOpen, X, Building2, Loader2, CornerDownLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, extractArray } from "@/lib/api";
import { cn } from "@/lib/utils";

// =========================================
// 1. STATIC QUICK LINKS
// =========================================
const QUICK_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "About Us", href: "/about", icon: BookOpen },
  { label: "Teachers & Faculty", href: "/teachers", icon: Users },
  { label: "Blog & Articles", href: "/blog", icon: FileText },
  { label: "Notice Board", href: "/notices", icon: Bell },
  { label: "Gallery", href: "/gallery", icon: BookOpen },
  { label: "Events Calendar", href: "/events", icon: Bell },
  { label: "Achievements", href: "/achievements", icon: BookOpen },
  { label: "Admission", href: "/admission", icon: Building2 },
  { label: "Contact Us", href: "/contact", icon: Home },
];

// =========================================
// 2. FLAT ITEM TYPE
// =========================================
type CommandItem = {
  id: string;
  label: string;
  href: string;
  icon: any;
  group: string;
};

// =========================================
// 3. MAIN COMPONENT
// =========================================
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dbResults, setDbResults] = useState<{ teachers: any[]; articles: any[]; notices: any[] }>({
    teachers: [],
    articles: [],
    notices: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // =========================================
  // 4. FETCH DYNAMIC RESULTS
  // =========================================
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setDbResults({ teachers: [], articles: [], notices: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    const timer = setTimeout(async () => {
      try {
        const r = await api.get<any>(`/api/search?q=${encodeURIComponent(q)}`);
        const data = r?.data || r;
        
        setDbResults({
          teachers: data?.teachers || [],
          articles: data?.articles || [],
          notices: data?.notices || [],
        });
      } catch (err) {
        console.error("Command palette search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  // =========================================
  // 5. BUILD UNIFIED FLAT LIST (For keyboard nav)
  // =========================================
  const flatItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];
    
    // 1. Filter static links
    const filteredQuick = QUICK_LINKS.filter((l) =>
      l.label.toLowerCase().includes(query.toLowerCase())
    );
    
    filteredQuick.forEach((l) => {
      items.push({
        id: `page-${l.href}`,
        label: l.label,
        href: l.href,
        icon: l.icon,
        group: "Pages",
      });
    });

    // 2. Add DB results (only if there is a query)
    if (query.trim()) {
      dbResults.teachers.forEach((t) => {
        items.push({
          id: `teacher-${t._id}`,
          label: t.name,
          href: `/teachers/${t._id}`,
          icon: Users,
          group: "Faculty",
        });
      });
      
      dbResults.articles.forEach((a) => {
        items.push({
          id: `article-${a._id}`,
          label: a.title,
          href: `/blog/${a.slug}`,
          icon: FileText,
          group: "Articles",
        });
      });
      
      dbResults.notices.forEach((n) => {
        items.push({
          id: `notice-${n._id}`,
          label: n.title,
          href: `/notices/${n._id}`,
          icon: Bell,
          group: "Notices",
        });
      });
    }

    return items;
  }, [query, dbResults]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length]);

  // =========================================
  // 6. KEYBOARD NAVIGATION
  // =========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatItems[selectedIndex];
        if (selected) {
          router.push(selected.href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flatItems, selectedIndex, router, onClose]);

  // =========================================
  // 7. SCROLL ACTIVE ITEM INTO VIEW
  // =========================================
  useEffect(() => {
    const activeEl = document.getElementById(`cmd-item-${selectedIndex}`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // =========================================
  // 8. RENDER HELPERS
  // =========================================
  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 font-sans">
      
      {/* ================= BACKDROP ================= */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />

      {/* ================= MAIN DIALOG ================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-xl rounded-[1.5rem] bg-[var(--card)]/90 backdrop-blur-2xl border border-[var(--border)] shadow-2xl shadow-black/40 overflow-hidden"
      >
        {/* Top Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)]/50 to-transparent" />

        {/* ================= SEARCH INPUT ================= */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]/50">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-[var(--primary)] animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-[var(--fg-muted)] shrink-0" />
          )}
          
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, teachers, articles, notices..."
            className="flex-1 bg-transparent outline-none text-base text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 font-medium"
          />
          
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ================= RESULTS LIST ================= */}
        <div 
          ref={listRef}
          className="max-h-[60vh] min-h-[300px] overflow-y-auto scrollbar-thin p-2"
        >
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="w-16 h-16 bg-[var(--bg-soft)] rounded-full grid place-items-center mb-4">
                <Search className="h-8 w-8 text-[var(--fg-muted)] opacity-50" />
              </div>
              <h3 className="font-bold text-lg text-[var(--fg)] mb-1">No results found</h3>
              <p className="text-sm text-[var(--fg-muted)]">Try searching for something else.</p>
            </div>
          ) : (
            flatItems.map((item, index) => {
              const Icon = item.icon;
              const showGroupHeader = item.group !== lastGroup;
              if (showGroupHeader) lastGroup = item.group;
              
              const isSelected = index === selectedIndex;

              return (
                <div key={item.id}>
                  {/* Group Header */}
                  {showGroupHeader && (
                    <div className="px-3 pt-4 pb-1 text-[10px] font-black uppercase tracking-widest text-[var(--fg-muted)]">
                      {item.group}
                    </div>
                  )}
                  
                  {/* Item */}
                  <button
                    id={`cmd-item-${index}`}
                    onClick={() => { router.push(item.href); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors group",
                      isSelected ? "text-[var(--primary)]" : "text-[var(--fg)]"
                    )}
                  >
                    {/* Active Background */}
                    {isSelected && (
                      <motion.div
                        layoutId="cmd-active"
                        className="absolute inset-0 bg-[var(--primary)]/10 rounded-xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "relative z-10 w-8 h-8 rounded-lg grid place-items-center shrink-0 transition-colors",
                      isSelected ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30" : "bg-[var(--bg-soft)] text-[var(--fg-muted)]"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Label */}
                    <span className="relative z-10 flex-1 text-sm font-semibold truncate">
                      {item.label}
                    </span>

                    {/* Enter Hint (Only for active item) */}
                    {isSelected && (
                      <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-[var(--primary)]/70 uppercase tracking-wider">
                        Enter <CornerDownLeft className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-[var(--border)]/50 px-4 py-3 flex items-center justify-between text-[11px] font-bold text-[var(--fg-muted)] bg-[var(--bg-soft)]/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--card)] font-mono text-[10px]">ESC</kbd>
            Close
          </span>
        </div>

      </motion.div>
    </div>
  );
}