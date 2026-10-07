import Image from "next/image";
import type { Shot } from "@/lib/catalog";
import { findShot, showPlaceholders, shotSize } from "@/lib/shot-files";

export { isShotVisible, visibleShots } from "@/lib/shot-files";

/**
 * A product screen. Renders the real image when public/shots/<key>.* exists.
 *
 * When the file is missing:
 * - production renders nothing at all: no box, no label, no reserved space
 *   (owner instruction, 2026-10-07);
 * - preview deployments render a dashed placeholder with the words
 *   "Screenshot placeholder", what the shot will show, and its file name and
 *   size, so the owner can see where each missing shot goes.
 *
 * The switch is Vercel's own environment (see showPlaceholders()). Callers
 * use isShotVisible()/visibleShots() so a column or gallery disappears with
 * its frame. The placeholder never imitates a real screen: no device chrome,
 * no drawn UI.
 */
export function ScreenFrame({
  shot,
  className = "",
  priority = false,
  dark = false,
  caption = true,
  fill = false,
}: {
  shot: Shot;
  className?: string;
  priority?: boolean;
  /** On an ink band: lighter caption and frame edge. */
  dark?: boolean;
  /** The one line under the frame. Off where the panel carries its own headline. */
  caption?: boolean;
  /** Fill the parent's width instead of the kind's default width (the parent sizes it). */
  fill?: boolean;
}) {
  const src = findShot(shot.key);
  const size = shotSize(shot);
  const wrap = fill ? "w-full" : size.wrap;

  if (!src) {
    if (!showPlaceholders()) return null;
    return (
      <figure className={`${wrap} ${className}`} data-placeholder={shot.key}>
        <div
          className={`flex ${size.aspect} w-full flex-col items-center justify-center gap-2 border-2 border-dashed p-4 text-center ${size.radius} ${
            dark ? "border-paper/35 text-paper/80" : "border-ink/25 bg-paper/60 text-ink/70"
          }`}
        >
          <span className="text-small font-medium">Screenshot placeholder</span>
          <span className={`max-w-[30ch] text-small font-medium ${dark ? "text-paper" : "text-ink"}`}>{shot.label}</span>
          <span className="font-mono text-small">
            {`${shot.key}.webp · ${size.width}×${size.height}`}
          </span>
        </div>
      </figure>
    );
  }

  return (
    <figure className={`${wrap} ${className}`}>
      <div
        className={`overflow-hidden border bg-paper ${shot.kind === "scene" ? "" : "shadow-lift"} ${size.radius} ${
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
      {caption ? (
        <figcaption className={`mt-3 text-small ${dark ? "text-paper/75" : "text-ink/70"}`}>{shot.label}</figcaption>
      ) : null}
    </figure>
  );
}
