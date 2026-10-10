import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Shot } from "./catalog";

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
  desktop: { width: 1440, height: 900, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[14px]" },
  phone: { width: 390, height: 844, aspect: "aspect-[390/844]", wrap: "mx-auto w-full max-w-[280px]", radius: "rounded-[24px]" },
  tablet: { width: 1180, height: 820, aspect: "aspect-[1180/820]", wrap: "w-full", radius: "rounded-[20px]" },
  photo: { width: 1200, height: 1600, aspect: "aspect-[3/4]", wrap: "mx-auto w-full max-w-[320px]", radius: "rounded-[16px]" },
  scene: { width: 1600, height: 1000, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[20px] lg:rounded-[24px]" },
} as const;

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

/** Renders: a real file exists, or this is a preview deployment. */
export function isShotVisible(shot: Shot | null | undefined): shot is Shot {
  return Boolean(shot) && (findShot(shot!.key) !== null || showPlaceholders());
}

/** The shots that render, in their original order. */
export function visibleShots(shots: readonly (Shot | null | undefined)[]): Shot[] {
  return shots.filter(isShotVisible);
}
