import type { ReactNode } from "react";
import { copy } from "@/lib/copy";
import { demoKitchen as k } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { Ticket } from "../hero-order-demo";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 tap Start on #1929, 2 it moves to Preparing, 3 the next ticket moves up. */
const STEPS = [0, 1400, 1800, 2500, 3200];

/**
 * The kitchen display on a tablet: New, Preparing and Ready, with the demo's
 * tickets and their timers running. #1929 is started and moves from New to
 * Preparing. On a narrow screen the tablet shows New and Preparing.
 */
export function KitchenBoard() {
  const active = k.new.length + 1 + k.preparing.length + k.ready.length;
  return (
    <Visual name="kitchen" steps={STEPS} description={copy.visuals.kitchen}>
      <div className={v.tablet}>
        <div className={v.tabletBody}>
          <div className={v.tabletScreen}>
            <div className={h.kHead}>
              <div>
                <span className={h.kPlace}>{o.location}</span>
                <span className={h.kMeta}>{active} active</span>
              </div>
              <div>
                <span className={h.kSound}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a6 6 0 0 0-6 6v4.5L4 16v1h16v-1l-2-3.5V8a6 6 0 0 0-6-6Zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Z" />
                  </svg>
                  Sound on
                </span>
                <span className={`${h.kMeta} ${h.kLive}`}>
                  <i />
                  Live
                </span>
                <span className={`${h.kMeta} ${h.kClock}`} data-clock="kitchen" />
              </div>
            </div>
            <div className={v.cols}>
              <Column title="New" before={k.new.length + 1} after={k.new.length}>
                <Ticket ticket={k.moving} from={0} className={`${v.started} ${v.out}`} part="out" />
                {k.new.map((t) => (
                  <Ticket key={t.number} ticket={t} from={0} className={v.up} />
                ))}
              </Column>
              <Column title="Preparing" before={k.preparing.length} after={k.preparing.length + 1}>
                {k.preparing.map((t) => (
                  <Ticket key={t.number} ticket={t} from={0} />
                ))}
                <Ticket ticket={k.moving} from={0} action="Ready" className={v.in} part="in" />
              </Column>
              <Column title="Ready" before={k.ready.length} className={v.readyCol}>
                {k.ready.map((t) => (
                  <Ticket key={t.number} ticket={t} from={0} />
                ))}
              </Column>
            </div>
          </div>
        </div>
      </div>
    </Visual>
  );
}

function Column({
  title,
  before,
  after,
  className = "",
  children,
}: {
  title: string;
  before: number;
  after?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${v.col} ${className}`.trim()}>
      <div className={v.colHead}>
        {title}
        <span className={v.count}>
          <span>{before}</span>
          <span>{after ?? before}</span>
        </span>
      </div>
      <div className={v.tickets}>{children}</div>
    </div>
  );
}
