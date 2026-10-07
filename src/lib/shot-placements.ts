import { builtProducts, bySlug, lifecycle, products, type Product, type Shot } from "./catalog";
import { copy } from "./copy";

/**
 * Which screenshot goes where. The pages read their shots from here, and
 * docs/marketing-site/SHOTS.md is generated from here (scripts/shots-doc.mjs),
 * so the shot list can't drift from what the site renders.
 */

/** Homepage sections and their shots, in page order. */
export const homeShots = {
  hero: { section: "Hero", shots: [...copy.hero.screens] as Shot[] },
  sell: { section: copy.sell.heading, shots: [bySlug["online-ordering"].shots[0]] },
  discovery: { section: copy.discovery.heading, shots: [bySlug["restaurant-websites"].shots[0]] },
  delivery: { section: copy.delivery.heading, shots: bySlug.delivery.shots },
  catering: { section: copy.catering.heading, shots: bySlug.catering.shots },
  growth: { section: copy.growth.heading, shots: [bySlug["restaurant-marketing"].shots[0]] },
  operations: {
    section: copy.operations.heading,
    shots: [bySlug["order-management"].shots[0], bySlug["menu-management"].shots[0]],
  },
  analytics: { section: copy.analytics.heading, shots: [bySlug.analytics.shots[0]] },
} satisfies Record<string, { section: string; shots: (Shot | undefined)[] }>;

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
