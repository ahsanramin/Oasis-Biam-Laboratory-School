"use client";

import { useSyncExternalStore, useCallback } from "react";

// =========================================
// 1. TYPE DEFINITIONS
// =========================================
interface MediaQueryOptions {
  /** Value to return during SSR (default: false) */
  defaultValue?: boolean;
  /** Use legacy addListener API (auto-detects if needed) */
  legacy?: boolean;
}

// =========================================
// 2. BREAKPOINT CONSTANTS (Tailwind-matched)
// =========================================
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// =========================================
// 3. SAFE MEDIA QUERY SUBSCRIPTION
// =========================================
/**
 * Subscribe to a media query using the officially recommended
 * React pattern (`useSyncExternalStore`).
 *
 * Why this is "premium":
 * - **SSR-safe**: Returns `false` (or your `defaultValue`) on the server,
 *   then syncs to the real value on the client without a hydration mismatch.
 * - **No flash of wrong content**: Unlike `useState + useEffect`, this
 *   renders with the correct value on the very first client paint.
 * - **Memory-safe**: Unsubscribes cleanly on unmount.
 * - **Cross-browser**: Falls back to the legacy `.addListener` API for
 *   Safari < 14 / older Edge. Auto-detects at runtime.
 * - **Zero dependencies**: No third-party libraries required.
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(
  query: string,
  options: MediaQueryOptions = {}
): boolean {
  const { defaultValue = false, legacy } = options;

  // Memoize subscribe/unsubscribe functions
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }

      const mql = window.matchMedia(query);

      // Detect legacy API (Safari < 14)
      const useLegacy =
        legacy === true ||
        (legacy === undefined && typeof mql.addEventListener !== "function");

      if (useLegacy) {
        mql.addListener(callback);
        return () => mql.removeListener(callback);
      }

      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query, legacy]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// =========================================
// 4. PRE-BUILT CONVENIENCE HOOKS
// =========================================

/** Returns `true` when the viewport is at least `sm` (≥640px) */
export function useIsSm() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
}

/** Returns `true` when the viewport is at least `md` (≥768px) */
export function useIsMd() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}

/** Returns `true` when the viewport is at least `lg` (≥1024px) */
export function useIsLg() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/** Returns `true` when the viewport is at least `xl` (≥1280px) */
export function useIsXl() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
}

/** Returns `true` when the viewport is at least `2xl` (≥1536px) */
export function useIs2xl() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);
}

/**
 * Returns `true` when the viewport is considered "mobile"
 * (below `md` = 768px, matching Tailwind's `md:` breakpoint).
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Returns `true` when the viewport is considered "tablet"
 * (between `md` and `lg`).
 */
export function useIsTablet() {
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  return isMd && !isLg;
}

/**
 * Returns `true` when the viewport is considered "desktop"
 * (`lg` and above, ≥1024px).
 */
export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * Returns `true` when the user's OS is set to dark mode.
 * Note: This is the OS preference. For the app's actual theme
 * (which may be forced), use `useTheme().resolvedTheme` from `next-themes`.
 */
export function usePrefersDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

/**
 * Returns `true` when the user has "reduce motion" enabled
 * in their OS. Use this to disable heavy animations for
 * users with vestibular disorders (WCAG 2.1 compliance).
 *
 * @example
 * const reducedMotion = usePrefersReducedMotion();
 * if (reducedMotion) return null; // skip heavy animation
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Returns `true` when the device supports hover interactions
 * (i.e., has a mouse / trackpad). Use this to conditionally
 * apply hover states ONLY on hover-capable devices — avoiding
 * the "sticky hover" bug on touchscreens.
 *
 * @example
 * const canHover = useCanHover();
 * className={canHover ? "hover:bg-red-500" : ""}
 */
export function useCanHover() {
  return useMediaQuery("(hover: hover)");
}

/**
 * Returns `true` when the user prefers high-contrast mode
 * (Windows High Contrast mode, etc.).
 */
export function usePrefersHighContrast() {
  return useMediaQuery("(prefers-contrast: more)");
}

// =========================================
// 5. MULTI-QUERY HOOK
// =========================================
/**
 * Subscribe to multiple media queries at once.
 * Returns an object mapping each query to its boolean result.
 *
 * @example
 * const matches = useMediaQueries({
 *   isMobile: "(max-width: 767px)",
 *   isDark: "(prefers-color-scheme: dark)",
 *   isPrint: "print",
 * });
 * // matches.isMobile, matches.isDark, matches.isPrint
 */
export function useMediaQueries<T extends Record<string, string>>(
  queries: T
): Record<keyof T, boolean> {
  const keys = Object.keys(queries) as (keyof T)[];

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const cleanups = keys.map((key) => {
        const mql = window.matchMedia(queries[key]);
        if (typeof mql.addEventListener === "function") {
          mql.addEventListener("change", callback);
          return () => mql.removeEventListener("change", callback);
        }
        mql.addListener(callback);
        return () => mql.removeListener(callback);
      });
      return () => cleanups.forEach((c) => c());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(queries)]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return JSON.stringify(keys.map(() => false));
    }
    return JSON.stringify(
      keys.map((key) => window.matchMedia(queries[key]).matches)
    );
  }, [keys, queries]);

  const cacheString = useSyncExternalStore(subscribe, getSnapshot, () => getSnapshot());

  const cache = JSON.parse(cacheString) as boolean[];

  return keys.reduce(
    (acc, key, i) => ({ ...acc, [key]: cache[i] }),
    {} as Record<keyof T, boolean>
  );
}