import { existsSync } from "node:fs";
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

export const SHOT_SIZES = {
  desktop: { width: 1440, height: 900, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[16px]" },
  phone: { width: 390, height: 844, aspect: "aspect-[390/844]", wrap: "mx-auto w-full max-w-[280px]", radius: "rounded-[24px]" },
  tablet: { width: 1180, height: 820, aspect: "aspect-[1180/820]", wrap: "w-full", radius: "rounded-[20px]" },
  photo: { width: 1200, height: 1600, aspect: "aspect-[3/4]", wrap: "mx-auto w-full max-w-[320px]", radius: "rounded-[16px]" },
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
