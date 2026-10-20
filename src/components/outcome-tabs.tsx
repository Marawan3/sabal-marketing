"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type OutcomeTab = {
  key: string;
  label: string;
  lines: readonly string[];
  /** The tab's built visual, rendered on the server. */
  visual: ReactNode;
};

/**
 * Text tabs at every width, the active one underlined, switching one panel.
 * From lg up the panel has the lines on the left and the visual on the right.
 * On phones (since 2026-10-13) the three tabs share the width, labels
 * wrapping onto two lines; tap to switch, no swiping, and the panel is the
 * lines over the visual. No card behind it.
 */
export function OutcomeTabs({ tabs }: { tabs: OutcomeTab[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Outcomes" className="grid grid-cols-3 gap-3 border-b border-rule lg:flex lg:gap-10">
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
              className={`-mb-px min-h-12 shrink-0 border-b-2 pb-2 text-left text-small leading-tight font-medium transition-colors duration-150 lg:pb-0 lg:text-body ${
                selected ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 lg:mt-12">
        {tabs.map((tab, index) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${baseId}-${tab.key}`}
            aria-labelledby={`${baseId}-${tab.key}-tab`}
            // Only the active panel shows; the desktop grid goes on it alone, or it would undo "hidden".
            className={index !== active ? "hidden" : tab.visual ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""}
          >
            <div className={tab.visual ? "lg:col-span-5" : ""}>
              {/* No visual: on desktop the lines spread across the width instead of leaving half of it empty. */}
              <ul className={`${tab.visual ? "" : "lg:grid lg:grid-cols-3 lg:gap-10"}`}>
                {tab.lines.map((line) => (
                  <li
                    key={line}
                    className={`border-t border-rule py-3 text-body text-ink-muted first:border-t-0 first:pt-0 ${
                      tab.visual ? "" : "lg:border-t-0 lg:border-l lg:py-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                    }`}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            {/* Phones: the visual under the text, at most 60% of the screen's height. */}
            {tab.visual ? <div className="mt-6 max-h-[60svh] overflow-hidden rounded-[20px] lg:col-span-7 lg:mt-0 lg:max-h-none">{tab.visual}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
