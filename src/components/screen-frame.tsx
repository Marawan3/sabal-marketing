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

/**
 * A framed product screen. Renders the real image when public/shots/<key>.*
 * exists, otherwise an honest, captioned empty frame at the right aspect
 * ratio. Never a fake dashboard.
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
  const phone = shot.kind === "phone";
  const width = phone ? 390 : 1280;
  const height = phone ? 844 : 800;
  return (
    <figure className={`${phone ? "mx-auto w-full max-w-[280px]" : "w-full"} ${className}`}>
      <div
        className={`overflow-hidden rounded-[16px] border bg-paper shadow-lift ${dark ? "border-paper/20" : "border-ink/10"} ${
          phone ? "aspect-[390/844]" : "aspect-[16/10]"
        }`}
      >
        {src ? (
          <Image
            src={src}
            alt={shot.label}
            width={width}
            height={height}
            priority={priority}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-start justify-end bg-ticket p-4">
            <span className="text-small font-medium text-ink/72">{shot.label}</span>
          </div>
        )}
      </div>
      {src ? (
        <figcaption className={`mt-3 text-small ${dark ? "text-paper/75" : "text-ink/72"}`}>
          {shot.label}
        </figcaption>
      ) : null}
    </figure>
  );
}
