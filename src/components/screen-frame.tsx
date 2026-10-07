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
}: {
  shot: Shot;
  className?: string;
  priority?: boolean;
  /** On an ink band: lighter caption and frame edge. */
  dark?: boolean;
}) {
  const src = findShot(shot.key);
  const size = shotSize(shot);

  if (!src) {
    if (!showPlaceholders()) return null;
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
            {`${shot.key}.webp · ${size.width}×${size.height}`}
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
