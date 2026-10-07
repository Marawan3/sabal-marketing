/**
 * "What we believe" on the homepage: three short beliefs, each a bold line
 * and up to two short paragraphs. The owner writes these. Until every
 * placeholder below is replaced, the section renders nothing at all.
 */
export const OWNER_TO_WRITE = "[OWNER TO WRITE]";

export type Belief = { title: string; body: string[] };

export const beliefs: Belief[] = [
  { title: OWNER_TO_WRITE, body: [OWNER_TO_WRITE] },
  { title: OWNER_TO_WRITE, body: [OWNER_TO_WRITE] },
  { title: OWNER_TO_WRITE, body: [OWNER_TO_WRITE] },
];

/** The beliefs to show: all of them once written, none while any placeholder is left. */
export function publishedBeliefs(list: Belief[] = beliefs): Belief[] {
  const unwritten = list.some((b) => [b.title, ...b.body].some((t) => !t.trim() || t.includes(OWNER_TO_WRITE)));
  return unwritten ? [] : list;
}
