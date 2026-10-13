import { copy } from "@/lib/copy";
import { demoSite as site } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { Plus } from "../hero-order-demo";
import { Phone, SiteHeader } from "./phone";
import { Tap, Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 scroll to the featured dishes, 2 tap Order online, 3 the menu opens. */
const STEPS = [0, 1100, 2600, 2900, 3900];

/**
 * The demo restaurant's own website (the clean theme): its home page with
 * the hero and the dishes it features, then a tap on Order online, which
 * opens the ordering menu. The site's own words (demo-data.ts).
 */
export function StorefrontPhone({ cut = false, width }: { cut?: boolean; width?: string }) {
  return (
    <Visual name="storefront" steps={STEPS} description={copy.visuals.storefront} className={v.storefront}>
      <Phone cut={cut} width={width}>
        <div className={v.layer}>
          <SiteHeader tap={<Tap step={2} x={60} y={22} />} />
          <div className={v.scrollA}>
            <div className={v.siteHero}>
              <div className={h.meta}>{site.eyebrow}</div>
              <div className={v.siteH1}>{site.heading}</div>
              <div>{site.sub}</div>
              <span className={`${v.siteButton} ${v.pillAction}`}>Order online</span>
            </div>
            <div className={v.sectionHead}>
              <span className={h.title}>Featured</span>
              <span className={v.textLink}>View menu</span>
            </div>
            <div className={v.rail}>
              {site.featured.map((dish) => (
                <div key={dish.name} className={v.railCard}>
                  <span className={h.name}>{dish.name}</span>
                  <span className={h.price}>{dish.price}</span>
                </div>
              ))}
            </div>
            <div className={v.band}>
              <div className={h.title}>{site.intro}</div>
            </div>
          </div>
        </div>
        <div className={`${v.layer} ${v.slideB}`}>
          <div className={h.bar}>
            <span className={h.brand}>{o.restaurant}</span>
          </div>
          <div className={v.pad}>
            <div className={h.stack}>
              <div className={h.title}>{o.restaurant} · Miami</div>
              <span className={`${h.meta} ${v.open}`}>
                <i />
                Open now
              </span>
            </div>
            <div className={h.pills}>
              <span className={`${h.pill} ${h.pillOn}`}>Pickup</span>
            </div>
            <div className={h.stack} style={{ gap: "calc(var(--k) * 8)" }}>
              <span className={v.selector}>48 Coral Lantern Way, Miami</span>
              <span className={v.selector}>{o.pickupTime}</span>
            </div>
            <div className={h.tabs} style={{ padding: 0 }}>
              {o.tabs.map((tab) => (
                <span key={tab} className={`${h.pill} ${tab === o.category ? h.pillOn : ""}`}>
                  {tab}
                </span>
              ))}
            </div>
            <div>
              <div className={h.title}>{o.category}</div>
              {o.rows.slice(0, 3).map((row) => (
                <div key={row.name} className={h.row}>
                  <div className={h.rowText}>
                    <span className={h.name}>{row.name}</span>
                    <span className={h.price}>{row.price}</span>
                    <span className={`${h.meta} ${h.clamp}`}>{row.description}</span>
                  </div>
                  <span className={h.add}>
                    <Plus />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    </Visual>
  );
}
