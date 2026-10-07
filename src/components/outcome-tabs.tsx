"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type OutcomeTab = {
  key: string;
  label: string;
  lines: readonly string[];
  /** The tab's screenshot, rendered on the server. Null when it doesn't render. */
  visual: ReactNode;
};

/**
 * Text tabs over one soft panel. From lg up, the tabs switch the panel and
 * the active tab is underlined. Below lg the panels sit in a sideways row
 * that snaps panel by panel, with the next one peeking in; swiping moves the
 * underline and tapping a tab scrolls to its panel.
 */
export function OutcomeTabs({ tabs }: { tabs: OutcomeTab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const rowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const swipeable = () => window.matchMedia("(max-width: 1023.98px)").matches;

  // Below lg, follow the swipe.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!swipeable()) return;
        const panels = [...row.children] as HTMLElement[];
        const left = row.scrollLeft + row.clientWidth * 0.3;
        let index = 0;
        panels.forEach((panel, i) => {
          if (panel.offsetLeft - row.offsetLeft <= left) index = i;
        });
        setActive(index);
      });
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the active label in view in the tab strip (it scrolls sideways on phones).
  useEffect(() => {
    const tab = tabRefs.current[active];
    const list = tab?.parentElement;
    if (!tab || !list || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 16 });
  }, [active]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
    const row = rowRef.current;
    const panel = row?.children[index] as HTMLElement | undefined;
    if (row && panel && swipeable()) {
      const pad = parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollTo({ left: panel.offsetLeft - row.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Outcomes"
        className="-mx-4 flex gap-6 overflow-x-auto border-b border-mist px-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:gap-10 lg:px-0"
      >
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-${tab.key}-tab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") select((index + 1) % tabs.length, true);
                if (event.key === "ArrowLeft") select((index - 1 + tabs.length) % tabs.length, true);
              }}
              className={`-mb-px min-h-12 shrink-0 border-b-2 text-body font-medium transition-colors duration-150 ${
                selected ? "border-ink text-ink" : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div ref={rowRef} className="snap-row mt-6 lg:mt-10">
        {tabs.map((tab, index) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${baseId}-${tab.key}`}
            aria-labelledby={`${baseId}-${tab.key}-tab`}
            className={`rounded-[20px] bg-ticket p-5 sm:p-8 lg:rounded-[24px] lg:p-12 ${
              index === active ? "" : "lg:hidden"
            } ${tab.visual ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""}`}
          >
            {/* No screenshot yet: the lines spread across the panel instead of leaving its right half empty. */}
            <ul className={tab.visual ? "lg:col-span-5" : "lg:grid lg:grid-cols-3 lg:gap-10"}>
              {tab.lines.map((line) => (
                <li
                  key={line}
                  className={`border-t border-ink/10 py-3 text-body text-ink/85 first:border-t-0 first:pt-0 ${
                    tab.visual ? "" : "lg:border-t-0 lg:border-l lg:py-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                  }`}
                >
                  {line}
                </li>
              ))}
            </ul>
            {tab.visual ? <div className="mt-6 lg:col-span-7 lg:mt-0">{tab.visual}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
