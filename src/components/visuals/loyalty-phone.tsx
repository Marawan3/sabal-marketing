import { copy } from "@/lib/copy";
import { demoReward as r } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { DishImg } from "../demo-img";
import { Brand } from "../hero-order-demo";
import { Phone } from "./phone";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 the reward card rises in. */
const STEPS = [0, 700, 1500];

/**
 * The storefront's order confirmation (the hero's last screen, its own
 * labels), with a reward card for a customer who came back. One thing moves:
 * the card. Loyalty is a build commitment (REGISTER.md).
 */
export function LoyaltyPhone({ cut = false }: { cut?: boolean }) {
  return (
    <Visual name="loyalty" steps={STEPS} description={copy.visuals.loyalty} className={v.loyalty}>
      <Phone cut={cut}>
        <div className={v.layer}>
          <div className={h.bar}>
            <Brand />
          </div>
          <div className={h.done}>
            <div className={h.doneHead}>
              <div className={h.meta}>Order received</div>
              <div className={h.title}>#{o.ticket.number}</div>
              <div>We&apos;re making it.</div>
            </div>
            <div className={v.reward}>
              <div>
                <div className={v.rewardLabel}>{r.label}</div>
                <div className={v.rewardTitle}>{r.title}</div>
                <div>{r.body}</div>
              </div>
              <DishImg src={r.photo} className={v.rewardImg} />
            </div>
            <div className={h.card}>
              <div className={h.line}>
                <span className={h.meta}>Ready by</span>
                <span className={h.ready} data-clock="ready" />
              </div>
              <div className={`${h.line} ${h.rule}`}>
                <span className={h.meta}>Pick up from</span>
                <span className={h.link}>{o.address}</span>
              </div>
            </div>
            <div className={h.card}>
              <div className={h.line}>
                <span>
                  1× {o.dish.name}
                  <span className={h.meta} style={{ display: "block" }}>
                    {o.mods.join(", ")}
                  </span>
                </span>
                <span>{o.linePrice}</span>
              </div>
              <div className={`${h.line} ${h.rule}`}>
                <span>Total</span>
                <b>{o.total}</b>
              </div>
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}
