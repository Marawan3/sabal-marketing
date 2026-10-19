import type { CSSProperties, ReactNode } from "react";
import { copy } from "@/lib/copy";
import { demoOrder as o } from "@/lib/demo-order";
import { LOOP, NARROW_LOOP, NARROW_STEPS, STEPS } from "@/lib/hero-demo-timeline";
import { DishImg, RestaurantMark } from "./demo-img";
import { VisualPlayer } from "./visual-player";
import s from "./hero-order-demo.module.css";

/**
 * The hero: a diner orders on the demo restaurant's storefront, and the order
 * lands on the kitchen display. Drawn in HTML and CSS from the real layouts
 * (the storefront's clean theme and the kitchen display), with the demo
 * restaurant's menu and prices (src/lib/demo-order.ts). The pictures are the
 * dish photos and the restaurant's mark, loaded at once. The module CSS runs
 * the story; visual-player.tsx pauses it off screen.
 *
 * Desktop: the phone, and the kitchen display beside it, where the order's
 * ticket lands. Phones: the phone alone; it holds on the confirmation and
 * starts again (2026-10-19: a phone that turned over to the kitchen display
 * read as if the display ran on a phone, and the kitchen band below shows it).
 */
const NARROW = { steps: NARROW_STEPS, loop: NARROW_LOOP };

export function HeroOrderDemo() {
  return (
    <VisualPlayer
      name="hero"
      steps={STEPS}
      loop={LOOP}
      narrow={NARROW}
      className={s.wrap}
      stageClassName={`${s.stage} ${s.sys}`}
      buttonClassName={s.playPause}
      description={copy.hero.demo.description}
      pauseLabel={copy.hero.demo.pause}
      playLabel={copy.hero.demo.play}
    >
      <div className={s.phoneBox} data-phone>
        <div className={s.face}>
          <div className={s.screen}>
            <StatusBar />
            <MenuScreen />
            <CheckoutScreen />
            <ConfirmScreen />
            <div className={s.cover} data-cover />
          </div>
        </div>
      </div>

      <div className={s.boardBox} data-board>
        <div className={s.board}>
          <KitchenHead sound />
          <div className={s.kCols}>
            <Column title="New" before={o.kitchen.new.length} after={o.kitchen.new.length + 1}>
              {o.kitchen.new.map((t) => (
                <Ticket key={t.number} ticket={t} />
              ))}
              <div className={s.arrive} data-arrive>
                <Ticket ticket={o.ticket} />
              </div>
            </Column>
            <Column title="Preparing" before={o.kitchen.preparing.length}>
              {o.kitchen.preparing.map((t) => (
                <Ticket key={t.number} ticket={t} />
              ))}
            </Column>
            <Column title="Ready" before={o.kitchen.ready.length}>
              {o.kitchen.ready.map((t) => (
                <Ticket key={t.number} ticket={t} />
              ))}
            </Column>
          </div>
        </div>
      </div>
    </VisualPlayer>
  );
}

/** A tap at (x, y) in the screen's own pixels, shown on story step `step`. */
function Tap({ step, x, y }: { step: number; x: number; y: number }) {
  const at = { left: `calc(var(--k) * ${x})`, top: `calc(var(--k) * ${y})` } as CSSProperties;
  return <span className={s.tap} data-tap={step} style={at} />;
}

/** The phone's notch and status bar, with the visitor's time. Shared with the visuals in ./visuals. */
export function StatusBar() {
  return (
    <>
      <div className={s.island} />
      <div className={s.status}>
        <span className={s.statusTime} data-clock="status">
          9:41
        </span>
        <span className={s.statusIcons}>
          <svg viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.8" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
            <rect x="10" y="3" width="3" height="9" rx="0.8" />
            <rect x="15" y="0" width="3" height="12" rx="0.8" />
          </svg>
          <svg viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.2A9.8 9.8 0 0 0 8 .9 9.8 9.8 0 0 0 1.1 3.6l1.2 1.2A8.2 8.2 0 0 1 8 2.6Zm0 3.3c1.3 0 2.5.5 3.4 1.3l1.2-1.2A6.6 6.6 0 0 0 8 4.2c-1.8 0-3.4.7-4.6 1.8l1.2 1.2c.9-.8 2.1-1.3 3.4-1.3Zm0 3.3c.5 0 .9.2 1.2.5L8 11 6.8 9.7c.3-.3.7-.5 1.2-.5Z" />
          </svg>
          <svg viewBox="0 0 27 12" fill="none">
            <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4" />
            <rect x="2" y="2" width="17" height="8" rx="1.6" fill="currentColor" />
            <path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.4" />
          </svg>
        </span>
      </div>
    </>
  );
}

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Tick = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Chevron = ({ back = false }: { back?: boolean }) => (
  <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

/** The restaurant's name in a bar, after its mark. Shared with the visuals in ./visuals. */
export function Brand({ eager = false }: { eager?: boolean }) {
  return (
    <span className={s.brand}>
      <RestaurantMark eager={eager} />
      <span>{o.restaurant}</span>
    </span>
  );
}

/**
 * The menu page's head, under the bar (the clean theme's): the location, open
 * now, pickup, the address and time. Shared with the storefront visual.
 */
export function MenuHead() {
  return (
    <div className={s.menuHead}>
      <div className={s.stack}>
        <div className={s.title}>{o.restaurant} · Miami</div>
        <span className={`${s.meta} ${s.open}`}>
          <i />
          Open now
        </span>
      </div>
      <div className={s.pills}>
        <span className={`${s.pill} ${s.pillOn}`}>Pickup</span>
      </div>
      <div className={s.stack} style={{ gap: "calc(var(--k) * 8)" }}>
        <span className={s.selector}>48 Coral Lantern Way, Miami</span>
        <span className={s.selector}>{o.pickupTime}</span>
      </div>
    </div>
  );
}

/**
 * A menu row: name, price and description, its photo on the right with the
 * add button on the photo's corner. `children` go inside the add button (the
 * cart count); `eager` for the hero.
 */
export function MenuRow({ row, eager = false, children }: { row: (typeof o.rows)[number]; eager?: boolean; children?: ReactNode }) {
  return (
    <>
      <div className={s.rowText}>
        <span className={s.name}>{row.name}</span>
        <span className={s.price}>{row.price}</span>
        <span className={`${s.meta} ${s.clamp}`}>{row.description}</span>
      </div>
      <div className={s.thumb}>
        <DishImg src={row.photo!} eager={eager} />
        <span className={s.add}>
          <Plus />
          {children}
        </span>
      </div>
    </>
  );
}

/** Steam off a hot dish: three soft wisps on their own loop, none with reduced motion. Shared with the upsell visual. */
export function Steam() {
  return (
    <span className={s.steam} data-steam>
      <i />
      <i />
      <i />
    </span>
  );
}

function MenuScreen() {
  return (
    <div className={s.layer} data-screen="menu">
      <div className={s.bar}>
        <Brand eager />
      </div>
      <div className={s.menuPage}>
        <div className={s.scroll} data-scroll>
          <MenuHead />
          <div className={s.tabs}>
            <span className={s.round}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" />
              </svg>
            </span>
            {o.tabs.map((tab) => (
              <span key={tab} className={`${s.pill} ${tab === o.category ? s.pillOn : ""}`}>
                {tab}
              </span>
            ))}
          </div>
          <div className={s.h2}>{o.category}</div>
          <div className={s.rows}>
            {o.rows.map((row) => (
              <div key={row.name} className={s.row}>
                <MenuRow row={row} eager>
                  {row.name === o.dish.name ? <span className={s.inCart}>1</span> : null}
                </MenuRow>
                {row.name === o.dish.name ? <Tap step={2} x={150} y={60} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.cartBar} data-cart>
        <div className={s.action}>
          <span>{o.cartLabel}</span>
          <span>{o.cartAmount}</span>
          <Tap step={8} x={160} y={28} />
        </div>
      </div>

      <div className={s.backdrop} />
      <ItemSheet />
    </div>
  );
}

function ItemSheet() {
  return (
    <div className={s.sheet} data-sheet>
      <div className={s.grabber}>
        <span />
      </div>
      <span className={s.close}>
        <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>
      <div className={s.photo}>
        <DishImg src={o.dish.photo} eager />
        <Steam />
      </div>
      <div className={s.sheetBody}>
        <div className={s.stack}>
          <div className={s.title}>{o.dish.name}</div>
          <span className={s.price}>{o.dish.price}</span>
          <span>{o.dish.description}</span>
        </div>
        {o.dish.groups.map((group) => (
          <div key={group.name} className={s.group}>
            <div className={s.groupHead}>
              <span className={s.name}>{group.name}</span>
              <span className={s.meta}>{group.instruction}</span>
            </div>
            {group.options.map((option) => {
              // The diner's taps: story step 4 (the size), then 5 (the extra).
              const pick = o.picks.findIndex((p) => p.option === option.name && p.group === group.name);
              const step = pick + 4;
              return (
                <div key={option.name} className={s.option}>
                  <span className={group.single ? s.radio : s.check}>{pick < 0 ? null : <i>{group.single ? null : <Tick />}</i>}</span>
                  {pick < 0 ? (
                    <span>{option.name}</span>
                  ) : (
                    <span className={s.swap} data-pick={step}>
                      <span>{option.name}</span>
                      <span className={s.name}>{option.name}</span>
                    </span>
                  )}
                  {option.delta ? <span className={`${s.meta} ${s.delta}`}>{option.delta}</span> : null}
                  {pick < 0 ? null : <Tap step={step} x={30} y={22} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className={s.sheetFoot}>
        <span className={s.stepper}>
          <span>−</span>
          <span>1</span>
          <span>+</span>
        </span>
        <div className={s.action}>
          <span>{o.addLabel}</span>
          {/* The price follows the choices: the 12-inch, then 16-inch, then with the drizzle. */}
          <span className={s.swap} data-add-price>
            <span>{o.dish.price}</span>
            {o.picks.map((p) => (
              <span key={p.option}>{p.price}</span>
            ))}
          </span>
          <Tap step={6} x={100} y={28} />
        </div>
      </div>
    </div>
  );
}

function CheckoutScreen() {
  const c = o.checkout;
  return (
    <div className={`${s.layer} ${s.checkout}`} data-screen="checkout">
      <div className={s.page}>
        <div className={s.pageHead}>
          <div>
            <span className={s.back44}>
              <Chevron back />
            </span>
            <span className={s.title}>Checkout</span>
          </div>
          <span className={s.meta} style={{ color: "var(--sf-ink)" }}>
            {o.restaurant}
          </span>
        </div>
        <div className={s.card}>
          <div className={s.withIcon}>
            <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span>
              Pick up from <b>{o.address}</b>
            </span>
          </div>
          <div className={s.withIcon}>
            <svg className={s.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7.5V12l3 2" />
            </svg>
            <span>
              Pickup time <b>{o.pickupTime}</b>
            </span>
          </div>
          <div className={`${s.line} ${s.rule}`}>
            <span>Add coupon</span>
            <Chevron />
          </div>
          <div className={`${s.line} ${s.rule}`}>
            <span>{c.items}</span>
            <span className={s.withIcon} style={{ gap: "calc(var(--k) * 4)" }}>
              {c.subtotal}
              <Chevron />
            </span>
          </div>
          <div className={s.line}>
            <span>{c.feeLabel}</span>
            <span>{c.fee}</span>
          </div>
          <div className={s.line}>
            <span>Taxes and fees ⓘ</span>
            <span>{c.tax}</span>
          </div>
          <div className={s.line}>
            <span>Tip</span>
            <span>{c.tip}</span>
          </div>
          <div className={s.pills}>
            {c.tipOptions.map((tip) => (
              <span key={tip} className={`${s.pill} ${tip === c.tipChosen ? s.pillRingOn : s.pillRing}`}>
                {tip}
              </span>
            ))}
          </div>
          <div className={`${s.line} ${s.rule} ${s.total}`}>
            <span>Total</span>
            <span>{o.total}</span>
          </div>
        </div>
        <div className={s.stack} style={{ gap: "calc(var(--k) * 12)" }}>
          <Field label="Name" value={c.name} />
          <Field label="Phone number" value={c.phone} />
        </div>
        <div>
          <div className={s.pills}>
            <span className={s.pill}>Apple Pay</span>
            <span className={`${s.pill} ${s.pillOn}`}>Card</span>
          </div>
          <div className={s.cardFields}>
            <span className={s.input}>Card number</span>
            <span className={s.input}>MM / YY</span>
            <span className={s.input}>CVC</span>
          </div>
        </div>
        <div>
          <span className={s.name}>Get offers from {o.restaurant}</span>
          <span className={s.box}>
            <span className={s.check} />
            Email
          </span>
          <span className={s.box}>
            <span className={s.check} />
            Text
          </span>
        </div>
        <div className={s.payBar}>
          <div className={s.action}>
            <span className={s.swap} data-paying>
              <span>Pay</span>
              <span>Placing your order…</span>
            </span>
            <span className={s.swap} data-paying>
              <span>{o.total}</span>
              <span />
            </span>
            <Tap step={11} x={160} y={28} />
          </div>
        </div>
        <span className={s.meta}>{c.smallPrint}</span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.field}>
      <span className={s.meta}>{label}</span>
      <span className={s.input}>{value}</span>
    </div>
  );
}

function ConfirmScreen() {
  return (
    <div className={`${s.layer} ${s.confirm}`} data-screen="confirm">
      <div className={s.done}>
        <div className={s.doneHead}>
          <div className={s.meta}>Order received</div>
          <div className={s.title}>#{o.ticket.number}</div>
          <div>We&apos;re making it.</div>
        </div>
        <div className={s.card}>
          <div className={s.line}>
            <span className={s.meta}>Ready by</span>
            <span className={s.ready} data-clock="ready" />
          </div>
          <div className={`${s.line} ${s.rule}`}>
            <span className={s.meta}>Pick up from</span>
            <span className={s.link}>{o.address}</span>
          </div>
        </div>
        <div className={s.card}>
          <div className={s.line}>
            <span>
              1× {o.dish.name}
              <span className={s.meta} style={{ display: "block" }}>
                {o.mods.join(", ")}
              </span>
            </span>
            <span>{o.linePrice}</span>
          </div>
          <div className={`${s.line} ${s.rule}`}>
            <span>Total</span>
            <b>{o.total}</b>
          </div>
        </div>
        <div className={s.doneCta}>
          <div className={s.action}>
            <span>Order again</span>
          </div>
        </div>
        <div className={s.meta} style={{ textAlign: "center" }}>
          <span style={{ color: "var(--sf-ink)", textDecoration: "underline" }}>Track your order</span> · Updates go to{" "}
          {o.checkout.phone}
        </div>
      </div>
    </div>
  );
}

function KitchenHead({ sound = false }: { sound?: boolean }) {
  const active = o.kitchen.new.length + o.kitchen.preparing.length + o.kitchen.ready.length;
  return (
    <div className={s.kHead}>
      <div>
        <span className={s.kPlace}>{o.location}</span>
        <span className={`${s.kMeta} ${s.kActive}`}>
          <span>{active} active</span>
          <span>{active + 1} active</span>
        </span>
      </div>
      <div>
        {sound ? (
          <span className={s.kSound}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a6 6 0 0 0-6 6v4.5L4 16v1h16v-1l-2-3.5V8a6 6 0 0 0-6-6Zm0 20a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Z" />
            </svg>
            Sound on
          </span>
        ) : null}
        <span className={`${s.kMeta} ${s.kLive}`}>
          <i />
          Live
        </span>
        {sound ? <span className={`${s.kMeta} ${s.kClock}`} data-clock="kitchen" /> : null}
      </div>
    </div>
  );
}

function Column({ title, before, after, children }: { title: string; before: number; after?: number; children: ReactNode }) {
  return (
    <div className={s.kCol}>
      <div className={s.kColHead}>
        {title}
        <span className={s.kCount}>
          <span>{before}</span>
          <span>{after ?? before}</span>
        </span>
      </div>
      <div className={s.kTickets}>{children}</div>
    </div>
  );
}

export type TicketData = (typeof o.kitchen.new)[number];

/** A kitchen display ticket. Shared with the kitchen board visual; `from` is when its timer starts, in ms. */
export function Ticket({
  ticket,
  from,
  action,
  className = "",
  part,
}: {
  ticket: TicketData;
  from?: number;
  action?: string;
  className?: string;
  /** A name for tests (data-part). */
  part?: string;
}) {
  const base = ticket.seconds;
  return (
    <div className={[s.ticket, className].filter(Boolean).join(" ")} data-part={part}>
      <div className={s.tHead}>
        <span>#{ticket.number}</span>
        <span data-timer={base} data-from={from ?? (ticket === o.ticket ? o.arrivesAt : 0)}>
          {`${Math.floor(base / 60)}:${String(base % 60).padStart(2, "0")}`}
        </span>
      </div>
      <div className={s.tWho}>Pickup · {ticket.who}</div>
      <div className={s.tItems}>
        {ticket.items.map((item) => (
          <div key={item.name}>
            <div className={s.tItem}>
              <span>{item.qty}×</span>
              <span>{item.name}</span>
            </div>
            {item.mods.map((mod) => (
              <div key={mod} className={s.tMod}>
                + {mod}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={s.tGo}>{action ?? ticket.action}</div>
    </div>
  );
}
