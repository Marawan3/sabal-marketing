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
 * A framed product screen with light device chrome: a slim browser bar on
 * desktop frames, a slim status bar on phone frames. Renders the real image
 * when public/shots/<key>.* exists. Until then a `must` slot renders a
 * captioned empty frame and a `helpful` slot renders nothing at all.
 * Never a fake dashboard.
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
  if (!src && shot.priority === "helpful") return null;

  const phone = shot.kind === "phone";
  const width = phone ? 390 : 1280;
  const height = phone ? 844 : 800;
  const edge = dark ? "border-paper/20" : "border-ink/10";

  return (
    <figure className={`${phone ? "mx-auto w-full max-w-[280px]" : "w-full"} ${className}`}>
      <div
        className={`overflow-hidden border bg-paper shadow-lift ${edge} ${
          phone ? "rounded-[24px]" : "rounded-[16px]"
        }`}
      >
        {phone ? (
          <div className="flex h-5 items-center justify-center bg-paper">
            <span className="h-1.5 w-12 rounded-full bg-ink/80" aria-hidden />
          </div>
        ) : (
          <div className="flex h-7 items-center gap-1.5 border-b border-ink/10 bg-ticket px-3" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-ink/15" />
            <span className="h-2 w-2 rounded-full bg-ink/15" />
            <span className="h-2 w-2 rounded-full bg-ink/15" />
            <span className="ml-3 h-3.5 flex-1 max-w-[220px] rounded-full bg-paper" />
          </div>
        )}
        <div className={phone ? "aspect-[390/820]" : "aspect-[16/10]"}>
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
      </div>
      {src ? (
        <figcaption className={`mt-3 text-small ${dark ? "text-paper/75" : "text-ink/72"}`}>
          {shot.label}
        </figcaption>
      ) : null}
    </figure>
  );
}
