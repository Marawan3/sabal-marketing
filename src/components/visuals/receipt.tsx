import { copy } from "@/lib/copy";
import { demoOrder as o } from "@/lib/demo-order";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps 1 to 7: the receipt prints line by line. */
const STEPS = [0, 300, 650, 1000, 1350, 1700, 2050, 2400, 2900];

/**
 * One order's receipt, the hero phone's order: subtotal, the diner's
 * Service fee (5%), tax, tip and total, with the same arithmetic
 * (src/lib/demo-order.ts).
 */
export function Receipt() {
  const c = o.checkout;
  const lines: [string, string][] = [
    ["Subtotal", o.dish.price],
    [c.feeLabel, c.fee],
    ["Tax", c.tax],
    [`Tip (${c.tipChosen})`, c.tip],
  ];
  return (
    <Visual name="receipt" steps={STEPS} description={copy.visuals.receipt}>
      <div className={v.receipt}>
        <div className={v.rHead}>
          <div className={v.rName}>{o.restaurant}</div>
          <div className={v.rMeta}>{o.address}</div>
          <div className={v.rMeta}>
            Order #{o.ticket.number} · Pickup · <span data-clock="day" />
          </div>
        </div>
        <div className={v.rRule} />
        <div className={v.rLine} data-line="1">
          <span>
            1× {o.dish.name}
            <span className={v.rMeta} style={{ display: "block" }}>
              {o.pick}
            </span>
          </span>
          <span>{o.dish.price}</span>
        </div>
        <div className={v.rRule} />
        {lines.map(([label, value], i) => (
          <div key={label} className={v.rLine} data-line={i + 2}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
        <div className={v.rRule} />
        <div className={`${v.rLine} ${v.rTotal}`} data-line="6">
          <span>Total</span>
          <span>{o.total}</span>
        </div>
        <div className={`${v.rLine} ${v.rMeta}`} data-line="7" style={{ justifyContent: "center", marginTop: 8 }}>
          Paid by card
        </div>
      </div>
    </Visual>
  );
}
