import { copy } from "@/lib/copy";
import { demoOrders as d } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 #1925 is picked, 2 its order drawer slides open. */
const STEPS = [0, 1000, 1400, 2400];

const nav = ["Overview", "Orders", "Menu", "Customers", "Analytics", "Team"];

/**
 * The dashboard's Orders screen, desktop-shaped, after batch 1's captures:
 * the sidebar, the status tabs with counts, the order list (placed time,
 * customer, items, prep time, status, total), then the order drawer for
 * #1925 with its items, add-ons, totals and Mark ready. The orders are the
 * kitchen board's, so the two agree (demo-data.ts).
 *
 * Narrower than about 900px the sidebar goes; narrower than 600px (phones,
 * and the small homepage row) it is a focal crop of the order list.
 */
const words = o.restaurant.split(" ");
const initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();

export function OrdersDashboard({ still = false }: { still?: boolean }) {
  return (
    <Visual name="orders" steps={STEPS} description={copy.visuals.orders} still={still}>
      <div className={v.od}>
        <div className={v.odFrame}>
          <aside className={v.odSide}>
            <div className={v.odBrand}>
              <span className={v.odTile}>W</span>
              <span>
                <b>WUNTAB</b>
                <span className={v.odDim}>Restaurant OS</span>
              </span>
            </div>
            {nav.map((item) => (
              <div key={item} className={item === "Orders" ? `${v.odNav} ${v.odNavOn}` : v.odNav}>
                {item}
              </div>
            ))}
            <div className={v.odOrg}>
              {/* The account's initials: the first and last word of its name. */}
              <span className={v.odAvatar}>{initials}</span>
              <span>
                <b>{o.restaurant}</b>
                <span className={v.odDim}>{d.location}</span>
              </span>
            </div>
          </aside>
          <div className={v.odMain}>
            <div className={v.odTop}>
              <b>Orders</b>
              <span className={v.odDim}>Signed in as Owner</span>
            </div>
            <div className={v.odPage}>
              <div className={v.odH1}>Orders</div>
              <div className={v.odDim}>Track and manage live orders at this location.</div>
              <div className={v.odTabs}>
                {d.tabs.map((tab, i) => (
                  <span key={tab.label} className={i === 0 ? `${v.odTab} ${v.odTabOn}` : v.odTab}>
                    {tab.label}
                    <span className={v.odCount}>{tab.count}</span>
                  </span>
                ))}
              </div>
              <div className={v.odNarrow}>
                <span className={v.odDim}>Narrow:</span>
                {d.narrow.map((n) => (
                  <span key={n.label} className={v.odChip}>
                    {n.label} <span className={v.odDim}>{n.count}</span>
                  </span>
                ))}
              </div>
              <div className={v.odList}>
                {d.rows.map((row) => (
                  <div key={row.number} className={v.odRow} data-row={row.number}>
                    <span className={v.odDot} data-status={row.status} />
                    <span>
                      <b>#{row.number}</b>
                      <span className={v.odDim}>{row.placed}</span>
                    </span>
                    <span>
                      <b>{row.who}</b>
                      <span className={v.odDim}>{row.items}</span>
                    </span>
                    <span className={v.odPrep}>{row.prep}</span>
                    <span className={v.odStatus} data-status={row.status}>
                      {row.status}
                    </span>
                    <b className={v.odTotal}>{row.total}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={v.odShade} />
          <div className={v.odDrawer}>
            <div className={v.odDrawerHead}>
              <span>
                <b>Order #{d.open.number}</b>
                <span className={v.odDim}>Pickup</span>
              </span>
              <span className={v.odDim}>×</span>
            </div>
            <div className={v.odDrawerBody}>
              <div>
                <span className={v.odStatus} data-status="Preparing">
                  Preparing
                </span>{" "}
                <span className={v.odDim}>{d.open.placed}</span>
              </div>
              <div>
                <div className={v.odLabel}>Customer</div>
                <div>{d.open.who}</div>
                <div className={v.odDim}>Pickup</div>
              </div>
              <div>
                <div className={v.odLabel}>Items</div>
                {d.open.items.map((item) => (
                  <div key={item.name} className={v.odLine}>
                    <span>
                      {item.qty}× {item.name}
                      {item.mods ? <span className={v.odDim}>{item.mods}</span> : null}
                    </span>
                    <span>{item.price}</span>
                  </div>
                ))}
              </div>
              <div className={v.odTotals}>
                {[
                  ["Subtotal", d.open.subtotal],
                  [o.checkout.feeLabel, d.open.fee],
                  ["Tax", d.open.tax],
                  ["Tip", d.open.tip],
                ].map(([label, value]) => (
                  <div key={label} className={v.odLine}>
                    <span className={v.odDim}>{label}</span>
                    <span className={v.odDim}>{value}</span>
                  </div>
                ))}
                <div className={`${v.odLine} ${v.odGrand}`}>
                  <b>Total</b>
                  <b>{d.open.total}</b>
                </div>
              </div>
            </div>
            <div className={v.odActions}>
              <span className={v.odPrimary}>Mark ready</span>
              <span className={v.odButtons}>
                <span className={v.odSecondary}>Print receipt</span>
                <span className={`${v.odSecondary} ${v.odDanger}`}>Cancel order</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Visual>
  );
}
