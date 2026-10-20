import { WORDMARK } from "@/lib/wordmark";

/**
 * WunTab mark. The tile's geometry is locked (wuntab-rebrand-spec.md §2):
 * rounded-square tile, one-stroke W with the raised center peak. The
 * wordmark is "WunTab" in Archivo, outlined (src/lib/wordmark.ts, owner
 * 2026-10-20; it replaced WUNTAB in Bricolage caps). Colors:
 *   light surfaces: navy tile, saffron stroke, ink wordmark
 *   dark surfaces:  saffron tile, navy stroke, white wordmark
 */
export type LogoTone = "light" | "dark";

/** Spec §2b: stroke 6 at or below 24px, 5 at or below 40px, else 4.5. */
export function tileStrokeWidth(size: number) {
  if (size <= 24) return 6;
  if (size <= 40) return 5;
  return 4.5;
}

export const TILE_POINTS = "11,22 18,39 28,12 38,39 45,22";

export function TileMark({
  size = 32,
  tone = "light",
  className = "",
  title,
}: {
  size?: number;
  tone?: LogoTone;
  className?: string;
  title?: string;
}) {
  const fill = tone === "light" ? "var(--navy)" : "var(--saffron)";
  const stroke = tone === "light" ? "var(--saffron)" : "var(--navy)";
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      <rect x="0" y="0" width="56" height="56" rx="14" fill={fill} />
      <polyline
        points={TILE_POINTS}
        fill="none"
        stroke={stroke}
        strokeWidth={tileStrokeWidth(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Horizontal lockup: tile + 14px gap + wordmark. The wordmark's box is as tall as the tile, so its capitals line up with the W inside it. */
export function Logo({
  tone = "light",
  size = 32,
  className = "",
}: {
  tone?: LogoTone;
  size?: number;
  className?: string;
}) {
  const wordmark = tone === "light" ? "text-ink" : "text-paper";
  const scale = size / WORDMARK.height;
  return (
    <span data-logo className={`inline-flex items-center gap-[14px] ${className}`}>
      <TileMark size={size} tone={tone} />
      <svg
        viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
        width={WORDMARK.width * scale}
        height={WORDMARK.height * scale}
        role="img"
        aria-label="WunTab"
        className={wordmark}
      >
        <path d={WORDMARK.d} fill="currentColor" />
      </svg>
    </span>
  );
}
