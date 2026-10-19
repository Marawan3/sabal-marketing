import { copy } from "@/lib/copy";
import { demoSite as site } from "@/lib/demo-data";
import { demoOrder as o, dish } from "@/lib/demo-order";
import { RestaurantMark } from "../demo-img";
import { Visual } from "./visual";
import v from "./visuals.module.css";

/** Steps: 1 the result, 2 to 5 its dish lines. */
const STEPS = [0, 300, 800, 1100, 1400, 1700, 2200];

/** Dishes from the demo menu, with their prices, as the menu page lists them. */
const dishes = ["Pepperoni Pizza", "Margherita", "Garlic Knots", "Buffalo Wings"].map(dish);

/**
 * A search result for the demo restaurant's menu page, in the usual style
 * (no search engine's logo or name): the site with the restaurant's mark, its address, the page's own
 * title and description, and dish lines with prices. An illustration of what
 * a readable menu page can show, captioned so, with no promise of placement.
 */
export function SearchResult() {
  return (
    <Visual name="search" steps={STEPS} description={copy.visuals.search} className={v.search}>
      <div className={v.serp}>
        <div className={v.query}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" />
          </svg>
          {o.restaurant.toLowerCase()} menu
        </div>
        <div className={v.result} data-line="1">
          <div className={v.site}>
            <RestaurantMark className={v.fav} />
            <span>
              <span className={v.siteName}>{o.restaurant}</span>
              <span className={v.url}>
                https://{site.host} › {site.menuPath.join(" › ")}
              </span>
            </span>
          </div>
          <div className={v.resultTitle}>{site.menuTitle}</div>
          <div className={v.resultText}>{site.menuDescription}</div>
          <div className={v.dishes}>
            {dishes.map(({ name, price }, i) => (
              <div key={name} className={v.dish} data-line={i + 2}>
                <span>{name}</span>
                <span>{price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={v.caption}>{copy.visuals.searchCaption}</div>
      </div>
    </Visual>
  );
}
