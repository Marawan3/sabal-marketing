"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one animated moment on the site. Both tickets render their finished
 * state in the first HTML. On mount (if motion is allowed) the right ticket is
 * armed, and when it scrolls into view it prints its lines top to bottom once
 * while the total counts up. Reduced motion keeps the finished state.
 */
type Ticket = {
  left: { title: string; count: string; label: string; note: string };
  right: {
    title: string;
    intro: string;
    dishes: readonly string[];
    more: string;
    total: number;
    label: string;
  };
};

const LINE_DELAY_MS = 90;
const COUNT_MS = 1400;

export function ProofTickets({ left, right }: Ticket) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [count, setCount] = useState(right.total);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    setArmed(true);
    setCount(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setPrinted(true);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(eased * right.total));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [right.total]);

  return (
    <div
      ref={rootRef}
      data-armed={armed ? "true" : "false"}
      data-printed={printed ? "true" : "false"}
      className="grid gap-8 md:grid-cols-2 md:gap-10"
    >
      <article className="ticket-shadow flex">
        <div className="ticket flex flex-1 flex-col px-6 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12">
          <p className="text-small font-medium text-ink/72">{left.title}</p>
          <div className="my-auto py-10">
            <p className="text-stat text-tomato" aria-label={`${left.count} ${left.label}`}>
              {left.count}
            </p>
            <p className="mt-2 text-lead font-medium">{left.label}</p>
          </div>
          <p className="max-w-[28ch] text-small text-ink/72">{left.note}</p>
        </div>
      </article>

      <article className="ticket-shadow flex">
        <div className="ticket flex flex-1 flex-col px-6 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12">
          <p className="text-small font-medium text-ink/72">{right.title}</p>
          <p className="mt-6 text-small text-ink/72">{right.intro}</p>
          <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
            {right.dishes.map((dish, index) => (
              <li
                key={dish}
                className="print-line flex items-center gap-3 py-1.5 text-body"
                style={{ transitionDelay: `${index * LINE_DELAY_MS}ms` }}
              >
                <svg
                  aria-hidden
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M2.5 7.5l3 3 6-7" />
                </svg>
                {dish}
              </li>
            ))}
            <li
              className="print-line py-1.5 text-small text-ink/72"
              style={{ transitionDelay: `${right.dishes.length * LINE_DELAY_MS}ms` }}
            >
              {right.more}
            </li>
          </ul>
          <p className="mt-6 text-stat" aria-label={`${right.total} ${right.label}`}>
            <span aria-hidden>{count}</span>
          </p>
          <p className="mt-2 text-lead font-medium">{right.label}</p>
        </div>
      </article>
    </div>
  );
}
