/**
 * "What we believe" on /about: three short beliefs, each a bold line and up
 * to two short paragraphs, in the owner's words (written 2026-10-13). The
 * section renders nothing while any of them holds a placeholder.
 */
export const OWNER_TO_WRITE = "[OWNER TO WRITE]";

export type Belief = { title: string; body: string[] };

export const beliefs: Belief[] = [
  {
    title: "Your customers should be yours.",
    body: [
      "When someone orders from your restaurant, you should know who they are and be able to reach them again. Marketplaces keep that relationship for themselves. We hand it to you.",
    ],
  },
  {
    title: "A restaurant shouldn't pay to sell its own food.",
    body: [
      "We charge the restaurant nothing. Customers pay a small fee at checkout, so we only earn when you sell. If you don't grow, neither do we.",
    ],
  },
  {
    title: "Software should arrive finished.",
    body: [
      "Most restaurant software is a login and a manual. We build your site, load your menu and connect your kitchen before you touch anything. You get something that works on day one.",
    ],
  },
];

/** The beliefs to show: all of them once written, none while any placeholder is left. */
export function publishedBeliefs(list: Belief[] = beliefs): Belief[] {
  const unwritten = list.some((b) => [b.title, ...b.body].some((t) => !t.trim() || t.includes(OWNER_TO_WRITE)));
  return unwritten ? [] : list;
}
