"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * The phone menu's <details> (owner, 2026-10-21: it stayed open over the new
 * page). The header stays mounted across client-side navigation, so the menu
 * shuts itself, with any group left open:
 * - when a link inside it is chosen: another page, the page you're on, a
 *   #hash, or the demo restaurant in a new tab;
 * - when the route changes, which covers the browser's back and forward;
 * - on Escape, which hands focus back to the menu button, as the desktop
 *   menus do.
 * Shut, the page scrolls again at once (globals.css locks it while the menu
 * is open). It stays a native <details>, so the menu works without script.
 */
export function MobileMenu({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const shown = useRef(pathname);

  const close = useCallback(() => {
    const menu = ref.current;
    if (!menu) return;
    for (const group of menu.querySelectorAll<HTMLDetailsElement>("details[open]")) group.open = false;
    menu.open = false;
  }, []);

  useEffect(() => {
    if (shown.current === pathname) return;
    shown.current = pathname;
    close();
  }, [pathname, close]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const menu = ref.current;
      if (event.key !== "Escape" || !menu?.open) return;
      close();
      menu.querySelector("summary")?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <details
      ref={ref}
      className={className}
      onClick={(event) => {
        if ((event.target as Element).closest("a")) close();
      }}
    >
      {children}
    </details>
  );
}
