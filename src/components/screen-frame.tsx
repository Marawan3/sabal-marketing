import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { Shot } from "@/lib/catalog";

const SHOTS_DIR = join(process.cwd(), "public", "shots");
const EXTENSIONS = ["webp", "png", "jpg"] as const;

/** Resolve a real screenshot at build time, or null if it has not been dropped in yet. */
export function findShot(key: string) {
  for (const ext of EXTENSIONS) {
    if (existsSync(join(SHOTS_DIR, `${key}.${ext}`))) return `/shots/${key}.${ext}`;
  }
  return null;
}

const SIZES = {
  desktop: { width: 1440, height: 900, aspect: "aspect-[16/10]", wrap: "w-full", radius: "rounded-[16px]" },
  phone: { width: 390, height: 844, aspect: "aspect-[390/844]", wrap: "mx-auto w-full max-w-[280px]", radius: "rounded-[24px]" },
  tablet: { width: 1180, height: 820, aspect: "aspect-[1180/820]", wrap: "w-full", radius: "rounded-[20px]" },
  photo: { width: 1200, height: 1600, aspect: "aspect-[3/4]", wrap: "mx-auto w-full max-w-[320px]", radius: "rounded-[16px]" },
} as const;

/** True when the shot has a real file in public/shots/. Missing or undefined is false. */
export function hasShot(shot: Shot | undefined | null): shot is Shot {
  return Boolean(shot && findShot(shot.key));
}

/** Only the shots that have a real file, in their original order. */
export function availableShots(shots: readonly Shot[]): Shot[] {
  return shots.filter((shot) => hasShot(shot));
}

/**
 * A product screen. Renders the real image when public/shots/<key>.* exists,
 * and nothing at all when it does not: no box, no label, no reserved space
 * (owner instruction, 2026-10-07, after placeholder boxes went live). Callers
 * use hasShot()/availableShots() to drop the column or gallery around a
 * missing shot, so the section keeps its text and loses only the visual.
 */
export function ScreenFrame({
  shot,
  className = "",
  priority = false,
  dark = false,
}: {
  shot: Shot;
  className?: string;
  priority?: boolean;
  /** On an ink band: lighter caption and frame edge. */
  dark?: boolean;
}) {
  const src = findShot(shot.key);
  const size = SIZES[shot.kind ?? "desktop"];

  if (!src) return null;

  return (
    <figure className={`${size.wrap} ${className}`}>
      <div
        className={`overflow-hidden border bg-paper shadow-lift ${size.radius} ${
          dark ? "border-paper/20" : "border-ink/10"
        }`}
      >
        <div className={size.aspect}>
          <Image
            src={src}
            alt={shot.label}
            width={size.width}
            height={size.height}
            priority={priority}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
      <figcaption className={`mt-3 text-small ${dark ? "text-paper/75" : "text-ink/72"}`}>
        {shot.label}
      </figcaption>
    </figure>
  );
}
