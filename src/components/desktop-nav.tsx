"use client";

import { SmartLink } from "./smart-link";
import { NavIcon, type IconName } from "./nav-icon";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

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

export type NavItem = { href: string; name: string; blurb?: string; icon?: IconName };
export type NavGroup = { title?: string; items: NavItem[] };
export type NavMenu = {
  key: string;
  label: string;
  width: "product" | "solutions" | "narrow";
  groups: NavGroup[];
  /** The Product menu's card, right of its columns (the demo restaurant; null when the demo link is off). */
  card?: ReactNode;
  /** A muted lead and links under a hairline at the bottom ("New to WunTab?"). */
  more?: { lead: string; links: readonly { href: string; label: string }[] };
};

const CLOSE_DELAY_MS = 160;

const widths = {
  product: "w-[min(1200px,calc(100vw-2rem))]",
  solutions: "w-[min(400px,calc(100vw-2rem))]",
  narrow: "w-[min(320px,calc(100vw-2rem))]",
} as const;

/**
 * The Product menu's columns (owner, 2026-10-20): one per group, each at
 * least as wide as its longest name so no name wraps, then the card, 300px
 * from 1200px and 240px below (1024 to 1199), where 300 would leave the
 * columns too narrow. --groups is the group count.
 */
const PRODUCT_COLS = {
  card: "grid-cols-[repeat(var(--groups),minmax(max-content,1fr))_240px] min-[1200px]:grid-cols-[repeat(var(--groups),minmax(max-content,1fr))_300px]",
  bare: "grid-cols-[repeat(var(--groups),minmax(max-content,1fr))]",
} as const;

/** "→" after the links under the Product menu, drawn. */
function ArrowIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** A row with an icon (owner, 2026-10-20): icon 20px, 12px gap, the name at 15px weight 500; under it, its line if it has one. */
function IconRow({ item }: { item: NavItem & { icon: IconName } }) {
  return (
    <SmartLink
      href={item.href}
      className={`flex gap-3 rounded-[12px] px-3 transition-colors duration-150 hover:bg-panel focus-visible:bg-panel ${
        item.blurb ? "items-start py-2.5" : "min-h-11 items-center"
      }`}
    >
      <span className={item.blurb ? "mt-px" : undefined}>
        <NavIcon name={item.icon} size={20} />
      </span>
      <span>
        <span data-name className="block text-[15px] font-medium">
          {item.name}
        </span>
        {item.blurb ? <span className="mt-0.5 block text-small text-ink-muted">{item.blurb}</span> : null}
      </span>
    </SmartLink>
  );
}

function PlainRow({ item }: { item: NavItem }) {
  return (
    <SmartLink href={item.href} className="block px-3 py-2.5 transition-colors duration-150 hover:bg-panel focus-visible:bg-panel">
      <span className="block text-small font-medium">{item.name}</span>
      {item.blurb ? <span className="mt-0.5 block text-small text-ink-muted">{item.blurb}</span> : null}
    </SmartLink>
  );
}

function Row({ item }: { item: NavItem }) {
  return item.icon ? <IconRow item={{ ...item, icon: item.icon }} /> : <PlainRow item={item} />;
}

/** The Product menu (owner, 2026-10-20: option A): its groups as columns under 13px headings, the card, then "New to WunTab?". */
function ProductPanel({ menu }: { menu: NavMenu }) {
  return (
    <div className="px-7 pt-7">
      <div
        className={`grid gap-x-6 ${menu.card ? PRODUCT_COLS.card : PRODUCT_COLS.bare}`}
        style={{ "--groups": menu.groups.length } as CSSProperties}
      >
        {menu.groups.map((group, groupIndex) => (
          <div key={group.title ?? groupIndex} data-menu-group>
            {group.title ? <p className="mb-2 pl-3 text-[13px] font-semibold text-ink-muted">{group.title}</p> : null}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Row item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {menu.card}
      </div>
      {menu.more ? (
        <div data-menu-more className="mt-5 flex items-center gap-6 border-t border-rule px-3 py-2 text-small">
          <span className="text-ink-muted">{menu.more.lead}</span>
          {menu.more.links.map((link) => (
            <SmartLink
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
            >
              {link.label}
              <ArrowIcon />
            </SmartLink>
          ))}
        </div>
      ) : (
        <div className="pb-7" />
      )}
    </div>
  );
}

const triggerClass =
  "flex min-h-11 items-center gap-1.5 rounded-[12px] px-3 text-small font-medium transition-colors duration-150";

export function DesktopNav({
  menus,
  links,
  after = [],
}: {
  menus: NavMenu[];
  /** Plain links after the menus (How it works, Pricing). */
  links: readonly { href: string; label: string }[];
  /** Menus after the links (Company). */
  after?: NavMenu[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  /** How the last interaction started, so focus and click can tell each other apart. */
  const inputKind = useRef<"mouse" | "touch" | "keyboard">("keyboard");
  /** Set while Escape hands focus back to a trigger, so that focus doesn't open the menu again. */
  const returningFocus = useRef(false);
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
      returningFocus.current = true;
      triggers.current[key]?.focus();
      returningFocus.current = false;
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

  const renderMenu = (menu: NavMenu) => {
        const isOpen = open === menu.key;
        const panelId = `${baseId}-${menu.key}`;
        return (
          <div key={menu.key} className="contents">
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
                isOpen ? "bg-panel text-ink" : "text-ink hover:text-ink-muted"
              }`}
              onPointerEnter={(event) => {
                if (isHoverPointer(event)) openNow(menu.key);
              }}
              onFocus={() => {
                if (inputKind.current !== "touch" && !returningFocus.current) openNow(menu.key);
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
              <div className="rounded-[20px] border border-rule bg-paper shadow-lift">
                {menu.width === "product" ? (
                  <ProductPanel menu={menu} />
                ) : (
                  <ul className="p-3">
                    {menu.groups.flatMap((group) => group.items).map((item) => (
                      <li key={item.href}>
                        <Row item={item} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
  };

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
      {menus.map(renderMenu)}
      {links.map((link) => (
        <SmartLink
          key={link.href}
          href={link.href}
          className={`${triggerClass} text-ink hover:text-ink-muted`}
          onPointerEnter={(event) => {
            if (isHoverPointer(event)) closeNow();
          }}
          onFocus={closeNow}
        >
          {link.label}
        </SmartLink>
      ))}
      {after.map(renderMenu)}
    </div>
  );
}
