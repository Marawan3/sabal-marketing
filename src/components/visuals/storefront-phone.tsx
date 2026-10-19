import { copy } from "@/lib/copy";
import { demoSite as site } from "@/lib/demo-data";
import { demoOrder as o } from "@/lib/demo-order";
import h from "../hero-order-demo.module.css";
import { DemoImg, DishImg } from "../demo-img";
import { Brand, MenuHead, MenuRow } from "../hero-order-demo";
import { Phone, SiteHeader } from "./phone";
import { Tap, Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 scroll to the featured dishes, 2 tap Order online, 3 the menu opens. */
const STEPS = [0, 1100, 2600, 2900, 3900];

/**
 * The demo restaurant's own website (the clean theme): its home page with
 * the hero photo, the heading and the dishes it features, each with its
 * photo, then a tap on Order online, which opens the ordering menu. The
 * site's own words (demo-data.ts). Its bands and cards are the restaurant's
 * sand, not grey.
 */
export function StorefrontPhone({ cut = false, width, still = false }: { cut?: boolean; width?: string; still?: boolean }) {
  return (
    <Visual name="storefront" steps={STEPS} description={copy.visuals.storefront} className={v.storefront} still={still}>
      <Phone cut={cut} width={width}>
        <div className={v.layer}>
          <SiteHeader tap={<Tap step={2} x={60} y={22} />} />
          <div className={v.scrollA}>
            <DemoImg src={site.photo} width={900} height={600} className={v.siteHeroImg} />
            <div className={v.siteHero}>
              <div className={`${h.meta} ${v.eyebrow}`}>{site.eyebrow}</div>
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
                  <DishImg src={dish.photo!} />
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
            <Brand />
          </div>
          <MenuHead />
          <div className={h.tabs}>
            {o.tabs.map((tab) => (
              <span key={tab} className={`${h.pill} ${tab === o.category ? h.pillOn : ""}`}>
                {tab}
              </span>
            ))}
          </div>
          <div className={h.h2}>{o.category}</div>
          <div className={h.rows}>
            {o.rows.slice(0, 3).map((row) => (
              <div key={row.name} className={h.row}>
                <MenuRow row={row} />
              </div>
            ))}
          </div>
        </div>
      </Phone>
    </Visual>
  );
}
