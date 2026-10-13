"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The one script behind every built visual (the hero phone and the visuals in
 * src/components/visuals). Each visual is server-rendered HTML and CSS; this
 * only moves the step words in data-s ("0 1 2 ...") along a clock. The CSS
 * does the rest, with transform and opacity only.
 *
 * - The clock runs only while the visual is on screen, the tab is visible and
 *   nobody pressed pause.
 * - One thing moves at a time: a visual has to hold the page's one motion
 *   slot to advance, so a second visual in view waits for the first.
 * - `loop` (the hero) plays round; anything else plays once and holds its
 *   last step.
 * - With reduced motion nothing runs. The CSS shows the last step as a still.
 * - It fills in the visitor's times ([data-clock]) and ticket timers
 *   ([data-timer]).
 */

/** The page's motion slot: the id of the visual that may move, or null. */
let slot: symbol | null = null;

const time = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const day = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function fill(el: HTMLElement) {
  const now = Date.now();
  el.querySelectorAll<HTMLElement>("[data-clock]").forEach((n) => {
    const kind = n.dataset.clock!;
    // Minutes to add: "ready" is the storefront's now + 20; others say so in data-add.
    const add = Number(n.dataset.add ?? (kind === "ready" ? 20 : 0));
    const d = new Date(now + add * 60000);
    n.textContent =
      kind === "status" ? time(d).replace(/\s?[AP]M$/, "") : kind === "day" ? day(d) : kind === "date" ? d.toLocaleDateString("en-US") : kind === "placed" ? d.toLocaleString("en-US") : time(d);
  });
}

export function VisualPlayer({
  name,
  steps,
  loop,
  className,
  stageClassName,
  buttonClassName,
  description,
  pauseLabel,
  playLabel,
  children,
}: {
  /** The visual's name, for tests and evidence (data-visual). */
  name: string;
  /** When each step starts, in ms from the top. Step 0 is the first paint. */
  steps: readonly number[];
  /** The hero's loop length in ms. Without it the visual plays once. */
  loop?: number;
  className: string;
  stageClassName: string;
  buttonClassName: string;
  description: string;
  pauseLabel: string;
  playLabel: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const [paused, setPaused] = useState(false);
  const end = steps[steps.length - 1];
  // Anything that moves for more than five seconds gets a pause button.
  const pausable = loop !== undefined || end > 5000;

  useEffect(() => {
    const el = root.current!;
    fill(el);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const me = Symbol();
    const timers = [...el.querySelectorAll<HTMLElement>("[data-timer]")];
    let t = 0;
    let step = 0;
    let last = performance.now();
    let seen = false;
    const io = new IntersectionObserver(([entry]) => (seen = entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);

    const tick = () => {
      const now = performance.now();
      const free = slot === null || slot === me;
      if (seen && !document.hidden && !held.current && free) {
        slot = me;
        t += now - last;
        if (loop && t >= loop) {
          // Snap back to the start under the hero's white cover, then lift it.
          t %= loop;
          step = 0;
          el.dataset.reset = "";
          el.dataset.s = `0 ${steps.length - 1}`;
          void el.offsetWidth;
          delete el.dataset.reset;
          fill(el);
        }
        let n = 0;
        while (n + 1 < steps.length && t >= steps[n + 1]) n++;
        if (n !== step || el.dataset.s === `0 ${steps.length - 1}`) {
          step = n;
          el.dataset.s = steps.slice(0, n + 1).map((_, i) => i).join(" ");
        }
        for (const timer of timers) {
          const secs = Number(timer.dataset.timer) + Math.max(0, Math.floor((t - Number(timer.dataset.from)) / 1000));
          const text = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
          if (timer.textContent !== text) timer.textContent = text;
        }
        if (!loop && t >= end) {
          // Played once: hold the last step and hand the slot on.
          el.dataset.done = "";
          slot = null;
          clearInterval(id);
          io.disconnect();
        }
      } else if (slot === me) {
        slot = null;
      }
      last = now;
    };
    const id = setInterval(tick, 100);
    return () => {
      clearInterval(id);
      io.disconnect();
      if (slot === me) slot = null;
    };
  }, [steps, loop, end]);

  return (
    <div ref={root} className={className} data-demo data-visual={name} data-s="0" data-pausable={pausable ? "" : undefined}>
      <p className="sr-only">{description}</p>
      <div aria-hidden="true" className={stageClassName}>
        {children}
      </div>
      {pausable ? (
        <button
          type="button"
          className={buttonClassName}
          aria-label={paused ? playLabel : pauseLabel}
          onClick={() => {
            held.current = !paused;
            setPaused(!paused);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M8 5v14l11-7L8 5Z" /> : <path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" />}
          </svg>
        </button>
      ) : null}
    </div>
  );
}
