import Image from "next/image";
import type { CSSProperties } from "react";
import { phoneCrops, type Crop, type Shot } from "@/lib/catalog";
import { findShot, rightGutter, showPlaceholders, shotSize } from "@/lib/shot-files";

export { isShotVisible, visibleShots } from "@/lib/shot-files";

/** The caption under every frame whose shot shows demo sales figures. */
export const DEMO_CAPTION = "Demo restaurant";

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
  sizes = "(min-width: 1024px) 560px, 92vw",
  phoneVw = 92,
  crop,
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
  /**
   * How wide the frame renders, so the browser picks a small enough file
   * (next/image serves AVIF or WebP from the PNG, and the PNG where neither
   * is supported). Everything but the hero (priority) loads lazily.
   */
  sizes?: string;
  /** About how much of a phone's width the frame takes, in vw (for the phone crop's file size). */
  phoneVw?: number;
  /**
   * Show this part of the file at every width (a small product-row crop).
   * Without it, phones get the shot's focal crop from phoneCrops and wider
   * screens the whole frame. Pass full `sizes` yourself when you set it.
   */
  crop?: Crop;
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

  const gutter = rightGutter(src);
  const full: Crop = { x: 0, y: 0, w: size.width - gutter, h: size.height };
  const wide = crop ?? full;
  const narrow = crop ?? phoneCrops[shot.key]?.crop ?? full;
  // Each view: the box's aspect, and the image's width and offset within it.
  const view = (r: Crop) => ({
    ar: `${r.w} / ${r.h}`,
    w: `${(size.width / r.w) * 100}%`,
    l: `${(-r.x / r.w) * 100}%`,
    t: `${(-r.y / r.h) * 100}%`,
  });
  const [v, p] = [view(wide), view(narrow)];
  const style = {
    "--shot-ar": v.ar, "--shot-w": v.w, "--shot-l": v.l, "--shot-t": v.t,
    "--shot-ar-sm": p.ar, "--shot-w-sm": p.w, "--shot-l-sm": p.l, "--shot-t-sm": p.t,
  } as CSSProperties;
  const phoneSize = `(max-width: 767px) ${Math.round((phoneVw * size.width) / narrow.w)}vw`;
  return (
    <figure className={`${wrap} ${className}`}>
      <div className={`overflow-hidden border bg-paper ${size.radius} ${dark ? "border-paper/20" : "border-ink/10"}`}>
        {/*
          One image, two views: the whole frame (less any right gutter) from
          768px up, the shot's focal crop below. globals.css .shot-view.
        */}
        <div className="shot-view" style={style}>
          <Image
            src={src}
            alt={shot.label}
            width={size.width}
            height={size.height}
            sizes={crop ? sizes : `${phoneSize}, ${sizes}`}
            // Next 16 deprecates `priority`: the hero loads eagerly at high priority, the rest lazily.
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
          />
        </div>
      </div>
      {caption || shot.demoFigures ? (
        <figcaption className={`mt-3 text-small ${dark ? "text-paper/75" : "text-ink/70"}`}>
          {/* Sales numbers in the shot are the demo restaurant's, never WunTab's results. */}
          {shot.demoFigures ? DEMO_CAPTION : shot.label}
        </figcaption>
      ) : null}
    </figure>
  );
}
