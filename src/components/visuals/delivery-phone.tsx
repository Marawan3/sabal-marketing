import { copy } from "@/lib/copy";
import { demoDelivery as d } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { RestaurantMark } from "../demo-img";
import { Chevron } from "../hero-order-demo";
import { Field, Phone } from "./phone";
import { Tap, Visual } from "./visual";
import v from "./visuals.module.css";

/**
 * Steps: 1 scroll to the delivery quote and Pay, 2 tap Pay, 3 the
 * confirmation, 4 tap Track your order, 5 the tracking page (restaurant
 * preparing), 6 driver assigned, 7 on the way: the driver's dot crosses the
 * map (7700 to 9500 ms), then holds.
 */
const STEPS = [0, 1500, 3000, 3600, 4800, 5100, 6400, 7700, 10000];

/**
 * A delivery order on the demo restaurant's website, in the order the
 * storefront shows it: the delivery checkout (address, the delivery quote and
 * its fee), the confirmation, then the tracking page with the driver's status.
 */
export function DeliveryPhone({ cut = false, width }: { cut?: boolean; width?: string }) {
  return (
    <Visual name="delivery" steps={STEPS} description={copy.visuals.delivery} className={v.delivery}>
      <Phone cut={cut} width={width}>
        <Checkout />
        <Confirmation />
        <Tracking />
      </Phone>
    </Visual>
  );
}

function Checkout() {
  return (
    <div className={v.layer}>
      <div className={`${v.pad} ${v.scrollA}`}>
        <div className={h.pageHead}>
          <div>
            <span className={h.back44}>
              <Chevron back />
            </span>
            <span className={h.title}>Checkout</span>
          </div>
          <span className={h.meta} style={{ color: "var(--sf-ink)" }}>
            {o.restaurant}
          </span>
        </div>
        <div className={h.card}>
          <div className={h.withIcon}>
            <svg className={h.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7" cy="17.5" r="1.6" />
              <circle cx="17" cy="17.5" r="1.6" />
            </svg>
            <span>
              Deliver to <b>{d.address}</b>
            </span>
          </div>
          <div className={h.withIcon}>
            <svg className={h.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </svg>
            <span>
              Delivery time <b>{d.time}</b>
            </span>
          </div>
          <div className={`${h.line} ${h.rule}`}>
            <span>{d.count}</span>
            <span className={h.withIcon} style={{ gap: "calc(var(--k) * 4)" }}>
              {d.subtotal}
              <Chevron />
            </span>
          </div>
          <div className={h.line}>
            <span>{o.checkout.feeLabel}</span>
            <span>{d.serviceFee}</span>
          </div>
          <div className={h.line}>
            <span>Taxes and fees ⓘ</span>
            <span>{d.taxesAndFees}</span>
          </div>
          <div className={h.line}>
            <span>Tip</span>
            <span>{d.tip}</span>
          </div>
          <div className={`${h.line} ${h.rule} ${h.total}`}>
            <span>Total</span>
            <span>{d.total}</span>
          </div>
        </div>
        <div className={v.grid2}>
          <Field label="Name" value={o.checkout.name} />
          <Field label="Phone number" value={o.checkout.phone} />
        </div>
        <Field label="Street address" value="300 Lantern Bay Dr" />
        <div className={v.grid2}>
          <Field label="City" value="Miami" />
          <Field label="State" value="FL" />
        </div>
        <div className={v.quote}>
          <b>Delivery available</b>
          <span>
            Estimated arrival <span data-clock="time" data-add="45" />
          </span>
          <span>Delivery {d.deliveryFee}</span>
        </div>
        <div className={h.payBar}>
          <div className={h.action}>
            <span className={v.swap2}>
              <span>Pay</span>
              <span>Placing your order…</span>
            </span>
            <span className={v.swap2}>
              <span>{d.total}</span>
              <span />
            </span>
            <Tap step={2} x={160} y={28} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Confirmation() {
  return (
    <div className={`${v.layer} ${v.slideB}`}>
      <div className={h.done}>
        <div className={h.doneHead}>
          <div className={h.meta}>Order received</div>
          <div className={h.title}>#{d.number}</div>
          <div>We&apos;re making it.</div>
        </div>
        <div className={h.card}>
          <div className={h.line}>
            <span className={h.meta}>Estimated arrival</span>
            <span data-clock="time" data-add="45" />
          </div>
          <div className={`${h.line} ${h.rule}`}>
            <span className={h.meta}>Deliver to</span>
            <span className={h.link}>{d.address}</span>
          </div>
        </div>
        <div className={h.card}>
          {d.items.map((item) => (
            <div key={item.name} className={h.line}>
              <span>
                {item.qty}× {item.name}
                {item.mods.length ? (
                  <span className={h.meta} style={{ display: "block" }}>
                    {item.mods.join(", ")}
                  </span>
                ) : null}
              </span>
              <span>{item.price}</span>
            </div>
          ))}
          <div className={`${h.line} ${h.rule}`}>
            <span>Total</span>
            <b>{d.total}</b>
          </div>
        </div>
        <div className={h.meta} style={{ textAlign: "center", position: "relative" }}>
          <span style={{ color: "var(--sf-ink)", textDecoration: "underline" }}>Track your order</span> · Updates go to{" "}
          {o.checkout.phone}
          <Tap step={4} x={70} y={10} />
        </div>
      </div>
    </div>
  );
}

/** The tracking page. Stage dots light as they are reached; "Current" marks where the order is. */
function Tracking() {
  // When each delivery stage is reached (story step) and while it is the current one.
  const reach = [0, 0, 6, 7, 7, 99];
  const current = ["", "5-6", "6-7", "", "7", ""];
  return (
    <div className={`${v.layer} ${v.slideC}`}>
      <div className={v.trackBar}>
        <RestaurantMark className={v.badge} />
        <b>{o.restaurant}</b>
      </div>
      <div className={`${v.pad} ${v.scrollB}`}>
        <div className={h.stack}>
          <span className={h.meta}>{o.location}</span>
          <span className={h.title}>Order #{d.number}</span>
          <span className={h.meta}>
            Placed <span data-clock="placed" />
          </span>
        </div>
        <div className={h.card}>
          <span className={v.cardHead}>Kitchen</span>
          {d.kitchenStages.map((stage, i) => (
            <Stage key={stage} label={stage} reach={i < 3 ? 0 : i === 3 ? 7 : 99} current={i === 2 ? "5-7" : i === 3 ? "7" : ""} />
          ))}
        </div>
        <div className={h.card}>
          <span className={v.cardHead}>Delivery</span>
          <RouteMap />
          {d.deliveryStages.map((stage, i) => (
            <Stage key={stage} label={stage} reach={reach[i]} current={current[i]} />
          ))}
          <span className={h.meta}>
            Estimated arrival <span data-clock="time" data-add="45" />
          </span>
          <span className={v.textLink}>Track delivery</span>
        </div>
      </div>
    </div>
  );
}

/**
 * The route on a small drawn map (no map provider, no real streets): streets
 * in light grey, the route in the action colour, the restaurant's pin and the
 * delivery address's. On the way, the driver's dot goes along the route in
 * three equal legs (motion-spec.mjs: along the street, up, along again), and
 * stops short of the address. With reduced motion it never slides: a dot
 * fades in at the end of each leg in turn. Points are in the map's own units
 * (320 by 140); the dot's legs are 80 units, 25% of the width or 57.14% of the
 * height.
 */
const ROUTE = [
  [60, 112],
  [140, 112],
  [140, 32],
  [220, 32],
  [276, 32],
];
const at = ([x, y]: number[]) => ({ left: `${(x / 320) * 100}%`, top: `${(y / 140) * 100}%` });

function RouteMap() {
  const [start, , , , home] = ROUTE;
  return (
    <div className={v.map} data-map>
      <svg viewBox="0 0 320 140" preserveAspectRatio="none">
        <rect width="320" height="140" className={v.mapGround} />
        <g className={v.mapStreets}>
          <path d="M0 32H320M0 112H320M60 0V140M140 0V140M220 0V140M290 0V140M0 72H60M220 80H320" />
          <path d="M140 72L220 0" />
        </g>
        <path d={`M${ROUTE.map((p) => p.join(" ")).join("L")}`} className={v.mapRoute} />
      </svg>
      <span className={v.mapPin} data-pin="restaurant" style={at(start)} />
      <span className={v.mapHome} data-pin="address" style={at(home)} />
      {/* With motion: one dot that travels. With reduced motion: a still dot at the end of each leg. */}
      <span className={v.mapLeg}>
        <span className={v.driver} data-driver style={at(start)} />
      </span>
      {ROUTE.slice(1, 4).map((p, i) => (
        <span key={i} className={v.driverAt} data-driver-at={i + 1} style={at(p)} />
      ))}
    </div>
  );
}

/**
 * A stage row. `reach`: the story step at which its dot lights (0 lit from the
 * start, 99 never). `current`: the steps while it says "Current", "from-to",
 * or "from" for the stage that stays current at the end.
 */
function Stage({ label, reach, current }: { label: string; reach: number; current: string }) {
  return (
    <div className={v.stage2}>
      <span className={v.dot}>{reach < 99 ? <i data-reach={reach} /> : null}</span>
      <span>{label}</span>
      {current ? (
        <span className={`${h.meta} ${v.current}`} data-cur={current}>
          Current
        </span>
      ) : null}
    </div>
  );
}
