"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Desktop navigation: hover-intent mega-menus with keyboard parity.
 *
 * Open on hover (mouse/pen) or focus; click toggles for touch and keyboard.
 * Moving from a trigger into its panel keeps it open; leaving both closes it
 * after a short delay so the gap under the header is never a dead zone.
 * Hovering another trigger switches immediately. Escape closes and returns
 * focus to the trigger. Panels are always in the DOM (hidden when closed)
 * so aria-controls stays valid.
 */

export type NavItem = { href: string; name: string; blurb?: string };
export type NavGroup = { title?: string; items: NavItem[] };
export type NavMenu = {
  key: string;
  label: string;
  width: "wide" | "medium" | "narrow";
  groups: NavGroup[];
};

const CLOSE_DELAY_MS = 160;

const widths = {
  wide: "w-[min(1180px,calc(100vw-2rem))]",
  medium: "w-[min(720px,calc(100vw-2rem))]",
  narrow: "w-[min(320px,calc(100vw-2rem))]",
} as const;

const triggerClass =
  "flex items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[0.9375rem] font-medium transition-colors duration-150";

export function DesktopNav({
  menus,
  pricing,
}: {
  menus: NavMenu[];
  pricing: { href: string; label: string };
}) {
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  /** How the last interaction started, so focus and click can tell each other apart. */
  const inputKind = useRef<"mouse" | "touch" | "keyboard">("keyboard");
  const baseId = useId();

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(null);
  }, [cancelClose]);

  const openNow = useCallback(
    (key: string) => {
      cancelClose();
      setOpen(key);
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const key = open;
      closeNow();
      triggers.current[key]?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  const isHoverPointer = (event: React.PointerEvent) =>
    event.pointerType === "mouse" || event.pointerType === "pen";

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-1"
      onPointerEnter={(event) => {
        if (isHoverPointer(event)) cancelClose();
      }}
      onPointerLeave={(event) => {
        if (isHoverPointer(event)) scheduleClose();
      }}
      onPointerDown={(event) => {
        inputKind.current = event.pointerType === "touch" ? "touch" : "mouse";
      }}
      onKeyDown={() => {
        inputKind.current = "keyboard";
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) closeNow();
      }}
    >
      {menus.map((menu, index) => {
        const isOpen = open === menu.key;
        const panelId = `${baseId}-${menu.key}`;
        return (
          <div key={menu.key} className="contents">
            {index === 2 ? (
              <a
                href={pricing.href}
                className={`${triggerClass} text-ink hover:text-ink/70`}
                onPointerEnter={(event) => {
                  if (isHoverPointer(event)) closeNow();
                }}
                onFocus={closeNow}
              >
                {pricing.label}
              </a>
            ) : null}
            <button
              type="button"
              ref={(el) => {
                triggers.current[menu.key] = el;
              }}
              id={`${panelId}-trigger`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-haspopup="true"
              className={`${triggerClass} ${
                isOpen ? "bg-ticket text-ink" : "text-ink hover:text-ink/70"
              }`}
              onPointerEnter={(event) => {
                if (isHoverPointer(event)) openNow(menu.key);
              }}
              onFocus={() => {
                if (inputKind.current !== "touch") openNow(menu.key);
              }}
              onClick={() => {
                if (inputKind.current === "mouse") openNow(menu.key);
                else if (isOpen) closeNow();
                else openNow(menu.key);
              }}
            >
              {menu.label}
              <svg
                aria-hidden
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4.5l3.5 3.5 3.5-3.5" />
              </svg>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={`${panelId}-trigger`}
              hidden={!isOpen}
              className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${widths[menu.width]}`}
            >
              <div className="rounded-[12px] border border-mist bg-paper shadow-lift">
                <div
                  className={`grid gap-6 ${
                    menu.width === "wide"
                      ? "grid-cols-4 p-8"
                      : menu.width === "medium"
                        ? "grid-cols-2 p-6"
                        : "grid-cols-1 p-3"
                  }`}
                >
                  {menu.groups.map((group, groupIndex) => (
                    <div key={group.title ?? groupIndex}>
                      {group.title ? (
                        <p className="px-3 pb-2 text-small font-medium text-ink/72">{group.title}</p>
                      ) : null}
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              className="block rounded-[6px] px-3 py-2 transition-colors duration-150 hover:bg-ticket focus-visible:bg-ticket"
                            >
                              <span className="block text-[0.9375rem] font-medium leading-snug">
                                {item.name}
                              </span>
                              {item.blurb ? (
                                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink/72">
                                  {item.blurb}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
