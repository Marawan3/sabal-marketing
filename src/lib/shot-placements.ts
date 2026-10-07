import { builtProducts, bySlug, lifecycle, photos, products, type Product, type Shot } from "./catalog";
import { copy } from "./copy";
import { customerStories } from "./stories";

/**
 * Which screenshot goes where. The pages read their shots from here, and
 * docs/marketing-site/SHOTS.md is generated from here (scripts/shots-doc.mjs),
 * so the shot list can't drift from what the site renders.
 */

const shotOf = (slug: string, key: string): Shot => {
  const shot = bySlug[slug].shots.find((s) => s.key === key);
  if (!shot) throw new Error(`${slug} has no shot ${key}`);
  return shot;
};

/** Homepage sections and their shots, in page order. */
export const homeShots = {
  /** The storefront on a phone, next to the orders board. */
  hero: { section: "Hero", shots: [shotOf("online-ordering", "site-menu"), shotOf("order-management", "orders-board")] },
  outcomes: {
    section: copy.outcomes.heading,
    shots: [
      shotOf("restaurant-websites", "site-home"),
      shotOf("restaurant-marketing", "marketing-campaign"),
      shotOf("order-management", "ordering-settings"),
    ],
  },
  products: {
    section: copy.products.heading,
    shots: [photos.orderingInHand, photos.deliveryHandoff, photos.cateringSpread, photos.kitchenScreen] as Shot[],
  },
  stories: { section: copy.stories.heading, shots: customerStories.map((story) => story.photo) as Shot[] },
} satisfies Record<string, { section: string; shots: (Shot | undefined)[] }>;

/** The outcome tab and its one shot, in the order the tabs show. */
export function outcomeTabs() {
  return copy.outcomes.items.map((item, index) => ({ ...item, shot: homeShots.outcomes.shots[index] }));
}

/** The four homepage product panels: product, photo. */
export function productPanels() {
  return copy.products.slugs.map((slug, index) => ({ product: bySlug[slug], shot: homeShots.products.shots[index] }));
}

/** A product page: the first shot is the hero, the rest go under "In the product". */
export function productPageShots(product: Product): { hero: Shot | undefined; rest: Shot[] } {
  const [hero, ...rest] = product.shots;
  return { hero, rest };
}

/** /how-it-works: each stage shows its first product's first shot. */
export function howItWorksShot(stage: (typeof lifecycle)[number]): Shot | undefined {
  return bySlug[stage.products[0]].shots[0];
}

export type Placement = { page: string; section: string };
export type ShotRow = { shot: Shot; labels: string[]; placements: Placement[] };

/** Every shot the site can show, one row per file key, in order of first appearance. */
export function shotRows(): ShotRow[] {
  const rows = new Map<string, ShotRow>();
  const add = (shot: Shot | undefined, page: string, section: string) => {
    if (!shot) return;
    let row = rows.get(shot.key);
    if (!row) {
      row = { shot, labels: [], placements: [] };
      rows.set(shot.key, row);
    }
    if (!row.labels.includes(shot.label)) row.labels.push(shot.label);
    if (!row.placements.some((p) => p.page === page && p.section === section)) {
      row.placements.push({ page, section });
    }
  };

  for (const { section, shots } of Object.values(homeShots)) {
    for (const shot of shots) add(shot, "/", section);
  }
  for (const stage of lifecycle) add(howItWorksShot(stage), "/how-it-works", stage.name);
  for (const slug of builtProducts) {
    const { hero, rest } = productPageShots(bySlug[slug]);
    add(hero, `/${slug}`, "Hero");
    for (const shot of rest) add(shot, `/${slug}`, "In the product");
  }
  // Shots in the catalog that no page renders yet still get a row.
  for (const product of products) for (const shot of product.shots) if (!rows.has(shot.key)) add(shot, "", "");
  for (const row of rows.values()) row.placements = row.placements.filter((p) => p.page);
  return [...rows.values()];
}
