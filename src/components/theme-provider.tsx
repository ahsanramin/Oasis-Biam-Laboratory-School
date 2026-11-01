"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// =========================================
// THEME CONSTANTS
// =========================================
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const THEME_COLORS: Record<string, string> = {
  light: "#fafaf9",
  dark: "#020617",
};

// =========================================
// HYDRATION-SAFE MOUNT HOOK
// =========================================
export function useHasMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

// =========================================
// THEME COLOR SYNC — MUST BE BEFORE ThemeProvider
// =========================================
function ThemeColorSync() {
  React.useEffect(() => {
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

      let meta = document.querySelector(
        'meta[name="theme-color"]'
      ) as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }

      meta.content = color;
    };

    updateThemeColor();

    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

// =========================================
// THEME PROVIDER
// =========================================
interface ThemeProviderProps {
  children: React.ReactNode;
  forcedTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  forcedTheme,
  storageKey = "oasis-theme",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={storageKey}
      forcedTheme={forcedTheme}
      themes={["light", "dark"]}
    >
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}