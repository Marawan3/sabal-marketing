/**
 * The founder section on /about, under the beliefs (owner, 2026-10-13): a
 * name, a photo and four sentences, all the owner's. Until every [OWNER]
 * below is replaced, the section renders nothing.
 *
 * The photo goes in public/about/ (a real photo of the founder, the one
 * exception to "built visuals only" besides the hero's dish), with its
 * pixel size, so the page doesn't shift while it loads.
 */
export const OWNER = "[OWNER]";

export type Founder = {
  name: string;
  /** Path under public/, e.g. "/about/founder.webp". */
  photo: string;
  photoWidth: number;
  photoHeight: number;
  /** Four sentences. */
  sentences: [string, string, string, string];
};

export const founder: Founder = {
  name: OWNER,
  photo: OWNER,
  photoWidth: 0,
  photoHeight: 0,
  sentences: [OWNER, OWNER, OWNER, OWNER],
};

/** The founder to show, or null while anything is still a placeholder. */
export function publishedFounder(f: Founder = founder): Founder | null {
  const texts = [f.name, f.photo, ...f.sentences];
  if (texts.some((t) => !t.trim() || t.includes(OWNER))) return null;
  if (!f.photo.startsWith("/") || f.photoWidth <= 0 || f.photoHeight <= 0) return null;
  return f;
}
