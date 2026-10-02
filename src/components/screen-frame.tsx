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

/**
 * A product screen. Renders the real image when public/shots/<key>.* exists.
 *
 * Until then it renders a placeholder that cannot be mistaken for the
 * product: a dashed frame, the words "Screenshot placeholder", what the shot
 * will show, and its file key. No device chrome, no drawn UI, nothing that
 * imitates a real screen (owner instruction, 2026-10-02).
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

  if (!src) {
    return (
      <figure className={`${size.wrap} ${className}`} data-placeholder={shot.key}>
        <div
          className={`flex ${size.aspect} w-full flex-col items-center justify-center gap-2 border-2 border-dashed p-5 text-center ${size.radius} ${
            dark ? "border-paper/35 text-paper/80" : "border-ink/25 bg-paper/60 text-ink/72"
          }`}
        >
          <span className="text-small font-medium">Screenshot placeholder</span>
          <span className={`max-w-[28ch] text-body font-medium ${dark ? "text-paper" : "text-ink"}`}>{shot.label}</span>
          <span className="font-mono text-[0.8125rem]">
            {shot.key} · {size.width}×{size.height}
          </span>
        </div>
      </figure>
    );
  }

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
