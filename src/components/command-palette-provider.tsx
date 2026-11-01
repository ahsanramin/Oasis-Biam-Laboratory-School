"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/command-palette";

// =========================================
// TYPES
// =========================================
type CommandPaletteState = "closed" | "opening" | "open" | "closing";

// =========================================
// MAIN PROVIDER COMPONENT
// =========================================
export function CommandPaletteProvider() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Store the element that had focus before opening (for focus return)
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // =========================================
  // 1. MOUNT GUARD (Prevents SSR errors)
  // =========================================
  useEffect(() => {
    setMounted(true);
  }, []);

  // =========================================
  // 2. OPEN HANDLER
  // =========================================
  const handleOpen = useCallback(() => {
    // Remember what had focus (usually the search button)
    previousActiveElement.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  // =========================================
  // 3. CLOSE HANDLER (with focus return)
  // =========================================
  const handleClose = useCallback(() => {
    setOpen(false);
    // Return focus after the closing animation
    setTimeout(() => {
      previousActiveElement.current?.focus?.();
      previousActiveElement.current = null;
    }, 150);
  }, []);

  // =========================================
  // 4. KEYBOARD SHORTCUTS
  // =========================================
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Toggle with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        
        setOpen((prev) => {
          if (!prev) {
            previousActiveElement.current = document.activeElement as HTMLElement;
          }
          return !prev;
        });
        return;
      }
      
      // Close with Escape
      if (e.key === "Escape" && open) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [open, handleClose]);

  // =========================================
  // 5. CUSTOM EVENT LISTENER
  // =========================================
  useEffect(() => {
    const onCustom = () => handleOpen();
    window.addEventListener("open-command-palette", onCustom);
    return () => window.removeEventListener("open-command-palette", onCustom);
  }, [handleOpen]);

  // =========================================
  // 6. BODY SCROLL LOCK (Prevents page jump)
  // =========================================
  useEffect(() => {
    if (!open) return;
    
    // Store current scroll position
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // =========================================
  // 7. RENDER
  // =========================================
  // Don't render anything on the server
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <CommandPalette 
          key="command-palette" 
          onClose={handleClose} 
        />
      )}
    </AnimatePresence>,
    document.body
  );
}