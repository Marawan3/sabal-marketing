import type { ReactNode } from "react";
import v from "./visuals.module.css";

/**
 * The ground a visual sits on: a mist panel with 20px corners, full width on
 * phones. `bleed` lets a cut phone run off the panel's bottom edge.
 */
export function Ground({ bleed = false, children }: { bleed?: boolean; children: ReactNode }) {
  return (
    <div className={v.ground} data-bleed={bleed ? "" : undefined}>
      {children}
    </div>
  );
}
