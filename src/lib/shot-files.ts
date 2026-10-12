import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { phoneCrops, type Crop, type Shot } from "./catalog";
import { imageSize } from "./image-size";

/**
 * Where product screenshots live, how big each kind is, and whether a missing
 * one shows a placeholder. Shared by the frames (`components/screen-frame.tsx`)
 * and the SHOTS.md generator (`scripts/shots-doc.mjs`), so the two can't disagree.
 */

export const SHOTS_DIR = join(process.cwd(), "public", "shots");
const EXTENSIONS = ["webp", "png", "jpg"] as const;

/** The public path of a real screenshot, or null if it hasn't been dropped in yet. */
export function findShot(key: string): string | null {
  for (const ext of EXTENSIONS) {
    if (existsSync(join(SHOTS_DIR, `${key}.${ext}`))) return `/shots/${key}.${ext}`;
  }
  return null;
}

/**
 * Captures delivered with a white scrollbar gutter down the right edge, by
 * file content (first 16 hex of SHA-256) and gutter width in source pixels.
 * The frame hides the gutter; the file stays exactly as delivered (owner:
 * "don't re-edit them", 2026-10-10). Keyed by content, so a retake without
 * the gutter gets no trim.
 */
const RIGHT_GUTTER: Record<string, number> = {
  "2cc2af15f4aa48c9": 15, // dash-overview.png, batch 1
  "a32122034e7c650a": 15, // orders-board.png, batch 1
  "74bba9580ecaaf65": 15, // order-drawer.png, batch 1
  "ddad96b8aff2630f": 15, // kds.png, batch 1
  "73b6ca88185acbd1": 15, // menu-editor.png, batch 1
  "7f350fcfc5ef07f6": 15, // ordering-settings.png, batch 1
  "a5c112075a348277": 15, // promotions.png, batch 1
  "f525368101251097": 15, // menu-editor-options.png, batch 1
};

/** Source pixels to hide on the right of a shot file (its public path). */
export function rightGutter(src: string): number {
  const file = join(process.cwd(), "public", src);
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 16);
  return RIGHT_GUTTER[hash] ?? 0;
}

export const SHOT_SIZES = {
  desktop: { width: 1440, height: 900, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[20px]" },
  phone: { width: 390, height: 844, aspect: "aspect-[390/844]", wrap: "mx-auto w-full max-w-[280px]", radius: "rounded-[20px]" },
  tablet: { width: 1180, height: 820, aspect: "aspect-[1180/820]", wrap: "w-full", radius: "rounded-[20px]" },
  photo: { width: 1200, height: 1600, aspect: "aspect-[3/4]", wrap: "mx-auto w-full max-w-[320px]", radius: "rounded-[20px]" },
  scene: { width: 1600, height: 1000, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[20px]" },
} as const;

/** Media frames are 20px; buttons and inputs 12px; list rows square (layout pass, 2026-10-11). */
export function shotSize(shot: Shot) {
  return SHOT_SIZES[shot.kind ?? "desktop"];
}

/**
 * Preview deployments show a placeholder box (file name and size) where a
 * shot is missing, so the owner can see where each one goes. Production never
 * does (owner instruction, 2026-10-07). Keyed on Vercel's own environment,
 * not a flag someone has to remember: VERCEL_ENV is "production" on
 * wuntab.com, "preview" on branch deployments, and unset locally, where the
 * production behaviour applies.
 */
export function showPlaceholders(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

/**
 * How wide a frame renders, in CSS px: at 390 (a phone) and at 1440 (a
 * desktop). Upper bounds, declared per placement in shot-placements.ts
 * (FITS). phone: 0 means the frame doesn't show on phones.
 */
export type FrameFit = { phone: number; desktop: number };

/** The widest a frame gets anywhere: the full phone column, the full desktop container. */
export const DEFAULT_FIT: FrameFit = { phone: 358, desktop: 1024 };

/** The resolution check's two viewports (PR #20): a 3x phone and a 2x desktop. */
export const CHECKED_VIEWPORTS = { phone: { width: 390, dpr: 3 }, desktop: { width: 1440, dpr: 2 } } as const;

/**
 * The resolution check: the file's pixels behind the frame's visible area,
 * divided by the device pixels it's drawn at (rendered CSS width × DPR), at
 * 390 (3x) and 1440 (2x). Below 1 at either, the screenshot is stretched and
 * reads as blur. Phones show the focal crop (or a fixed crop); desktops the
 * whole frame less any gutter. All in layout pixels, so a 3x file scores 3x.
 */
export function resolutionRatios(shot: Shot, src: string, fit: FrameFit = DEFAULT_FIT, crop?: Crop) {
  const layout = shotSize(shot).width;
  const density = imageSize(join(process.cwd(), "public", src)).width / layout;
  const full = layout - rightGutter(src);
  const narrow = crop?.w ?? phoneCrops[shot.key]?.crop.w ?? full;
  const wide = crop?.w ?? full;
  const { phone, desktop } = CHECKED_VIEWPORTS;
  return {
    phone: fit.phone ? (narrow * density) / (fit.phone * phone.dpr) : Infinity,
    desktop: (wide * density) / (fit.desktop * desktop.dpr),
  };
}

export function passesResolution(shot: Shot, src: string, fit: FrameFit = DEFAULT_FIT, crop?: Crop): boolean {
  const r = resolutionRatios(shot, src, fit, crop);
  return r.phone >= 1 && r.desktop >= 1;
}

/**
 * Renders here. On preview deployments: always (a real file, or the
 * placeholder). On production (and locally): only when the file exists and
 * passes the resolution check for this placement. A 1x capture is held back
 * until its 3x retake replaces it, then comes back on its own, with no flag
 * (owner, 2026-10-12). Callers pass the same fit (and crop) as the frame.
 */
export function isShotVisible(shot: Shot | null | undefined, fit?: FrameFit, crop?: Crop): shot is Shot {
  if (!shot) return false;
  if (showPlaceholders()) return true;
  const src = findShot(shot.key);
  return src !== null && passesResolution(shot, src, fit, crop);
}

/** The shots that render with this fit, in their original order. */
export function visibleShots(shots: readonly (Shot | null | undefined)[], fit?: FrameFit): Shot[] {
  return shots.filter((shot): shot is Shot => isShotVisible(shot, fit));
}

/** A file that exists but fails the check at the widest fit: held for a retake (SHOTS.md). */
export function isHeld(shot: Shot): boolean {
  const src = findShot(shot.key);
  return src !== null && !passesResolution(shot, src);
}
