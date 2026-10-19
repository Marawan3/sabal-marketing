import { copy } from "@/lib/copy";
import { demoPairings, demoSms } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { DishImg } from "../demo-img";
import { Brand, MenuRow, Steam } from "../hero-order-demo";
import { Phone } from "./phone";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/**
 * The demo restaurant's online menu (the hero's menu, still): category
 * pills, then the category's dishes with price, description and photo.
 */
export function MenuPhone() {
  return (
    <Visual name="menu" steps={[0]} description={copy.visuals.menu}>
      <Phone>
        <div className={v.layer}>
          <div className={h.bar}>
            <Brand />
          </div>
          <div className={h.tabs}>
            {o.tabs.map((tab) => (
              <span key={tab} className={`${h.pill} ${tab === o.category ? h.pillOn : ""}`}>
                {tab}
              </span>
            ))}
          </div>
          <div className={h.menuBody}>
            <div className={h.h2}>{o.category}</div>
            <div className={h.rows}>
              {o.rows.map((row) => (
                <div key={row.name} className={h.row}>
                  <MenuRow row={row} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}

/** Steps: 1 "Goes well with" rises in under the dish. */
const UPSELL_STEPS = [0, 700, 1500];

/**
 * The dish sheet for Pepperoni Pizza, steam rising off its photo, with the
 * restaurant's two picks under "Goes well with" (the clean theme's own heading
 * and row shape: name, price, one line of description, the photo with its add
 * button). One thing moves in the story: the list. The steam is its own loop.
 */
export function UpsellPhone() {
  return (
    <Visual name="upsell" steps={UPSELL_STEPS} description={copy.visuals.upsell} className={v.upsell}>
      <Phone>
        <div className={v.layer}>
          <div className={v.upPhoto}>
            <DishImg src={o.dish.photo} />
            <Steam />
          </div>
          <div className={v.upBody}>
            <div className={h.stack}>
              <div className={h.title}>{o.dish.name}</div>
              <span className={h.price}>{o.dish.price}</span>
              <span>{o.dish.description}</span>
            </div>
            <div className={v.upPairs}>
              <div className={h.name}>Goes well with</div>
              {demoPairings.map((row) => (
                <div key={row.name} className={`${h.row} ${v.upRow}`}>
                  <MenuRow row={row} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}

/**
 * The customer's confirmation text on a lock screen, in the product's own
 * words (demo-data.ts). Still. The product sends this text and a
 * cancellation text; it has no "your order's ready" text.
 */
export function SmsPhone({ cut = false }: { cut?: boolean }) {
  return (
    <Visual name="sms" steps={[0]} description={copy.visuals.sms}>
      <Phone cut={cut}>
        <div className={`${v.layer} ${v.lock}`}>
          <div className={v.lockTime} data-clock="status" />
          <div className={v.lockDate} data-clock="day" />
          <div className={v.note}>
            <div className={v.noteHead}>
              <span>Messages</span>
              <span>now</span>
            </div>
            <div className={v.noteFrom}>{demoSms.from}</div>
            <div>{demoSms.confirmed}</div>
            <div>
              {demoSms.pickup} (around <span data-clock="ready" />).
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}
