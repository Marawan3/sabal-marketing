import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { VisualPlayer } from "../visual-player";
import v from "./visuals.module.css";

/**
 * The shell every built visual sits in: the shared player (plays once from
 * mount, paused while off screen, a pause button past five seconds), one
 * sentence for screen readers, and the shared look.
 */
export function Visual({
  name,
  steps,
  description,
  className = "",
  children,
}: {
  name: string;
  steps: readonly number[];
  description: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <VisualPlayer
      name={name}
      steps={steps}
      className={`${v.vis} ${className}`.trim()}
      stageClassName={`${v.stage} ${v.sys}`}
      buttonClassName={v.btn}
      description={description}
      pauseLabel={copy.hero.demo.pause}
      playLabel={copy.hero.demo.play}
    >
      {children}
    </VisualPlayer>
  );
}

/** A tap at (x, y) in a phone screen's own pixels, shown while step `step` is the current one. */
export function Tap({ step, x, y }: { step: number; x: number; y: number }) {
  return <span className={v.tapRing} data-tap={step} style={{ left: `calc(var(--k) * ${x})`, top: `calc(var(--k) * ${y})` }} />;
}
