"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type OutcomeTab = {
  key: string;
  label: string;
  lines: readonly string[];
  /** The tab's screenshot, rendered on the server. Null when it doesn't render. */
  visual: ReactNode;
};

/**
 * From lg up: text tabs, the active one underlined, switching one panel with
 * the lines on the left and the screenshot on the right. No card behind it.
 * Below lg there are no tabs and no swipe row: each outcome is stacked as
 * its label, its lines, then its screenshot (the phone crop).
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
      <div role="tablist" aria-label="Outcomes" className="hidden gap-10 border-b border-mist lg:flex">
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

      <div className="divide-y divide-mist lg:mt-12 lg:divide-y-0">
        {tabs.map((tab, index) => (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${baseId}-${tab.key}`}
            aria-labelledby={`${baseId}-${tab.key}-tab`}
            className={`py-8 first:pt-0 last:pb-0 lg:py-0 ${index === active ? "" : "lg:hidden"} ${
              tab.visual ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""
            }`}
          >
            <div className={tab.visual ? "lg:col-span-5" : ""}>
              {/* Phones have no tab strip, so each outcome is titled. */}
              <h3 className="text-h3 lg:hidden">{tab.label}</h3>
              {/* No screenshot yet: on desktop the lines spread across the width instead of leaving half of it empty. */}
              <ul className={`mt-3 lg:mt-0 ${tab.visual ? "" : "lg:grid lg:grid-cols-3 lg:gap-10"}`}>
                {tab.lines.map((line) => (
                  <li
                    key={line}
                    className={`border-t border-mist py-3 text-body text-ink/85 first:border-t-0 first:pt-0 ${
                      tab.visual ? "" : "lg:border-t-0 lg:border-l lg:py-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                    }`}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            {tab.visual ? <div className="mt-6 lg:col-span-7 lg:mt-0">{tab.visual}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
