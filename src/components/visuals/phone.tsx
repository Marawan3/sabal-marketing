import type { CSSProperties, ReactNode } from "react";
import h from "../hero-order-demo.module.css";
import { Brand, StatusBar } from "../hero-order-demo";
import v from "./visuals.module.css";

/**
 * The hero's phone, for the other visuals: the same frame, notch and status
 * bar, with the screens as children. `cut` shows only the top of the phone,
 * for the small visuals in lists.
 */
export function Phone({ cut = false, width, children }: { cut?: boolean; width?: string; children: ReactNode }) {
  return (
    <div className={v.phone} data-cut={cut ? "" : undefined} style={width ? ({ "--phone-w": width } as CSSProperties) : undefined}>
      <div className={v.phoneBody}>
        <div className={v.screen}>
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  );
}

/** The restaurant website's header (the clean theme's shell): mark and name, Order online, the menu button. */
export function SiteHeader({ tap }: { tap?: ReactNode }) {
  return (
    <div className={`${h.bar} ${v.siteBar}`}>
      <Brand />
      <span className={v.siteBarEnd}>
        <span className={`${v.sitePill} ${v.pillAction}`}>
          Order online
          {tap}
        </span>
        <span className={v.burger}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
      </span>
    </div>
  );
}

/** A labelled field as the storefront draws it: a meta label over a hairline box. */
export function Field({ label, value, tall = false }: { label: string; value: ReactNode; tall?: boolean }) {
  return (
    <div className={h.field}>
      <span className={h.meta}>{label}</span>
      <span className={`${h.input} ${tall ? v.tall : ""}`.trim()}>{value}</span>
    </div>
  );
}
