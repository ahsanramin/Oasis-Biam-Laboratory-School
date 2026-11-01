"use client";

import { useSyncExternalStore, useCallback, useEffect, useState } from "react";

// =========================================
// 1. SHARED SCROLL TRACKER (Singleton)
// =========================================
class ScrollTracker {
  private listeners = new Set<() => void>();
  private rafId: number | null = null;
  private snapshot = {
    progress: 0,
    scrollY: 0,
    direction: "up" as "up" | "down",
    isAtTop: true,
    isAtBottom: false,
  };
  private lastScrollY = 0;
  private resizeObserver: ResizeObserver | null = null;
  private initialized = false;

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    if (!this.initialized) this.init();
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot = () => this.snapshot;

  private emit() {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.listeners.forEach((listener) => listener());
    });
  }

  private update = () => {
    if (typeof window === "undefined") return;

    const docEl = document.documentElement;
    const scrollTop = window.scrollY || docEl.scrollTop || 0;
    const scrollHeight = docEl.scrollHeight || 0;
    const clientHeight = window.innerHeight || docEl.clientHeight || 0;
    const maxScroll = Math.max(1, scrollHeight - clientHeight);

    const rawProgress = (scrollTop / maxScroll) * 100;
    const progress = Math.min(100, Math.max(0, rawProgress));

    let direction = this.snapshot.direction;
    if (Math.abs(scrollTop - this.lastScrollY) > 5) {
      direction = scrollTop > this.lastScrollY ? "down" : "up";
    }

    const isAtTop = scrollTop < 10;
    const isAtBottom = progress >= 99.5;

    this.lastScrollY = scrollTop;

    const next = { progress, scrollY: scrollTop, direction, isAtTop, isAtBottom };
    const prev = this.snapshot;
    if (
      prev.progress !== next.progress ||
      prev.direction !== next.direction ||
      prev.isAtTop !== next.isAtTop ||
      prev.isAtBottom !== next.isAtBottom
    ) {
      this.snapshot = next;
      this.emit();
    }
  };

  private init() {
    if (typeof window === "undefined" || this.initialized) return;
    this.initialized = true;

    window.addEventListener("scroll", this.update, { passive: true });
    window.addEventListener("resize", this.update, { passive: true });

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(this.update);
      this.resizeObserver.observe(document.documentElement);
    }

    this.update();
  }
}

const tracker = new ScrollTracker();

// =========================================
// 2. MAIN HOOK — SCROLL PROGRESS
// =========================================
export function useScrollProgress(): number {
  const progress = useSyncExternalStore(
    (cb) => tracker.subscribe(cb),
    () => tracker.getSnapshot().progress,
    () => 0
  );
  return progress;
}

// =========================================
// 3. COMPANION — SCROLL DIRECTION
// =========================================
export function useScrollDirection(): "up" | "down" {
  return useSyncExternalStore(
    (cb) => tracker.subscribe(cb),
    () => tracker.getSnapshot().direction,
    () => "up" as const
  );
}

// =========================================
// 4. COMPANION — SCROLL POSITION
// =========================================
export function useScrollPosition() {
  return useSyncExternalStore(
    (cb) => tracker.subscribe(cb),
    () => tracker.getSnapshot(),
    () => ({
      progress: 0,
      scrollY: 0,
      direction: "up" as const,
      isAtTop: true,
      isAtBottom: false,
    })
  );
}

// =========================================
// 5. COMPANION — SCROLLED PAST THRESHOLD
// =========================================
export function useScrolledPast(threshold: number = 100): boolean {
  const subscribe = useCallback((cb: () => void) => {
    const handler = () => cb();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > threshold;
  }, [threshold]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// =========================================
// 6. COMPANION — SCROLL-TO-TOP
// =========================================
export function useScrollToTop() {
  const { isAtTop } = useScrollPosition();

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  return { scrollToTop, isAtTop };
}

// =========================================
// 7. CUSTOM SCROLL CONTAINER HOOK
// =========================================
export function useContainerScrollProgress(
  ref: React.RefObject<HTMLElement | null>
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const update = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        const maxScroll = Math.max(1, scrollHeight - clientHeight);
        const p = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        setProgress(p);
      });
    };

    el.addEventListener("scroll", update, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      observer.observe(el);
    }

    update();

    return () => {
      el.removeEventListener("scroll", update);
      observer?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return progress;
}