import { copy } from "@/lib/copy";
import { demoDashboard as d } from "@/lib/demo-data";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 the sales line draws, 2 the order figures come in. */
const STEPS = [0, 300, 1500, 2200];

/**
 * The dashboard's Overview card for the demo restaurant, with its seeded
 * figures and labels: net sales for the last 30 days and the sales line,
 * orders and average order. Captioned "Demo restaurant".
 */
export function DashboardCard() {
  const w = 290;
  const max = Math.max(...d.line);
  const min = Math.min(...d.line);
  const points = d.line.map((value, i) => {
    const x = (i / (d.line.length - 1)) * w;
    const y = 8 + (1 - (value - min) / (max - min)) * 84;
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <Visual name="dashboard" steps={STEPS} description={copy.visuals.dashboard}>
      <div className={v.dash}>
        {/* On top, so a short screen never cuts it off. */}
        <div className={v.captionTop}>{copy.visuals.demoCaption}</div>
        <div className={v.dashCard}>
          <div className={v.dashTop}>
            <div>
              <div className={v.dashLabel}>Net sales</div>
              <div className={v.dashBig}>{d.netSales}</div>
            </div>
            <span className={v.dashPeriod}>{d.period}</span>
          </div>
          <div className={v.dashSmall}>{d.change}</div>
          <div className={v.chart}>
            <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio="none">
              <polygon points={`0,100 ${line} ${w},100`} fill="#003e80" fillOpacity="0.08" />
              <polyline points={line} fill="none" stroke="#003e80" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className={v.reveal} />
          </div>
          <div className={v.axis}>
            <span>{d.from}</span>
            <span>{d.to}</span>
          </div>
        </div>
        <div className={v.stats}>
          <div className={v.stat}>
            <div className={v.dashLabel}>Orders</div>
            <div className={v.dashBig}>
              {d.orders}
              <span className={v.up2}>↑ {d.ordersChange}</span>
            </div>
          </div>
          <div className={v.stat}>
            <div className={v.dashLabel}>Average order</div>
            <div className={v.dashBig}>{d.averageOrder}</div>
          </div>
        </div>
      </div>
    </Visual>
  );
}
