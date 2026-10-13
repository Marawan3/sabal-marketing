"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LOOP, STEPS } from "@/lib/hero-demo-timeline";

const time = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/**
 * Runs the hero's order story: moves the step words in data-s along a clock
 * that only runs while the hero is on screen, the tab is visible and nobody
 * pressed pause. Fills in the visitor's time, the ready time (20 minutes on,
 * as the storefront's confirmation computes it) and the kitchen timers.
 * With reduced motion it only fills in the times; the CSS holds the end still.
 */
export function HeroDemoPlayer({
  className,
  stageClassName,
  buttonClassName,
  description,
  pauseLabel,
  playLabel,
  children,
}: {
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

  useEffect(() => {
    const el = root.current!;
    const set = (sel: string, text: string) => el.querySelectorAll(sel).forEach((n) => (n.textContent = text));
    const clocks = () => {
      const now = new Date();
      set('[data-clock="status"]', time(now).replace(/\s?[AP]M$/, ""));
      set('[data-clock="kitchen"]', time(now));
      set('[data-clock="ready"]', time(new Date(now.getTime() + 20 * 60000)));
    };
    clocks();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = [...el.querySelectorAll<HTMLElement>("[data-timer]")];
    let t = 0;
    let step = 0;
    let last = performance.now();
    let seen = false;
    const io = new IntersectionObserver(([entry]) => (seen = entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);

    const tick = () => {
      const now = performance.now();
      if (seen && !document.hidden && !held.current) {
        t += now - last;
        if (t >= LOOP) {
          // Snap back to the menu under the white cover, then lift the cover.
          t %= LOOP;
          step = 0;
          el.dataset.reset = "";
          el.dataset.s = "0 13";
          void el.offsetWidth;
          delete el.dataset.reset;
          clocks();
        }
        let n = 0;
        while (n + 1 < STEPS.length && t >= STEPS[n + 1]) n++;
        if (n !== step || el.dataset.s === "0 13") {
          step = n;
          el.dataset.s = STEPS.slice(0, n + 1).map((_, i) => i).join(" ");
        }
        for (const timer of timers) {
          const secs = Number(timer.dataset.timer) + Math.max(0, Math.floor((t - Number(timer.dataset.from)) / 1000));
          const text = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
          if (timer.textContent !== text) timer.textContent = text;
        }
      }
      last = now;
    };
    const id = setInterval(tick, 100);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={root} className={className} data-demo data-s="0">
      <p className="sr-only">{description}</p>
      <div aria-hidden="true" className={stageClassName}>
        {children}
      </div>
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
    </div>
  );
}
