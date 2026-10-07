/**
 * WunTab mark. Geometry is locked (wuntab-rebrand-spec.md §2): rounded-square
 * tile, one-stroke W with the raised center peak, WUNTAB wordmark in caps at
 * weight 500 with wide tracking (outlined below). Colors are recolored for this palette:
 *   light surfaces: ink tile, saffron stroke, ink wordmark
 *   dark surfaces:  saffron tile, ink stroke, paper wordmark
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

/**
 * The WUNTAB wordmark as outlines, so it no longer depends on the page font.
 * Drawn from Bricolage Grotesque at weight 500, 18px, 3px tracking, shaped
 * with its kerning: exactly what the live text rendered before the switch to
 * Archivo (2026-10-07). The box is the old text box: 94.5 × 27.9 at logo size 28.
 */
const WORDMARK_PATH =
  "M3.43 19 0.56 7.12H2.68L4.85 17.27H5.01L7.35 7.12H9.94L12.25 17.27H12.41L14.63 7.12H16.68L13.73 19H10.94L8.71 8.88H8.55L6.25 19Z M26.8 19.23Q25.78 19.23 24.96 19.02Q24.15 18.81 23.54 18.4Q22.93 17.99 22.52 17.41Q22.12 16.82 21.91 16.07Q21.7 15.33 21.7 14.44V7.12H23.67V14.37Q23.67 15.39 24.02 16.08Q24.38 16.78 25.07 17.12Q25.76 17.46 26.79 17.46Q27.83 17.46 28.52 17.12Q29.21 16.79 29.55 16.09Q29.9 15.39 29.9 14.37V7.12H31.86V14.44Q31.86 16.72 30.57 17.98Q29.28 19.23 26.8 19.23Z M37.71 19V7.12H40.3L46.27 16.38H46.43L46.29 7.12H48.2V19H45.85L39.66 9.45H39.51L39.62 19Z M56.66 19V7.12H58.63V19ZM53.1 8.8V7.12H62.23V8.8Z M64.9 19 69.04 7.12H71.9L76.05 19H73.92L70.59 8.72H70.36L67.03 19ZM66.99 16.44V15.01H74.23V16.44Z M80.98 19V7.12H85.53Q86.56 7.12 87.4 7.3Q88.23 7.48 88.83 7.86Q89.42 8.24 89.74 8.83Q90.05 9.42 90.05 10.25Q90.05 10.95 89.77 11.46Q89.49 11.98 88.9 12.31Q88.31 12.64 87.33 12.79V13.02Q89 13.16 89.76 13.9Q90.53 14.64 90.53 15.87Q90.53 16.89 90.03 17.58Q89.54 18.27 88.53 18.64Q87.52 19 85.97 19ZM82.88 17.37H86.06Q87.35 17.37 87.98 16.95Q88.6 16.52 88.6 15.64Q88.6 14.63 87.76 14.12Q86.92 13.61 85.22 13.61H82.88ZM82.88 12.26H84.87Q86.52 12.26 87.32 11.81Q88.12 11.37 88.12 10.47Q88.12 9.59 87.42 9.16Q86.72 8.73 85.31 8.73H82.88Z";
const WORDMARK_W = 94.5;
const WORDMARK_H = 27.9;

/** Horizontal lockup: tile + 14px gap + wordmark, vertically centered (§2d). */
export function Logo({
  tone = "light",
  size = 32,
  className = "",
}: {
  tone?: LogoTone;
  size?: number;
  className?: string;
}) {
  const wordmark = tone === "light" ? "text-navy" : "text-paper";
  const scale = size / 28;
  return (
    <span data-logo className={`inline-flex items-center gap-[14px] ${className}`}>
      <TileMark size={size} tone={tone} />
      <svg
        viewBox={`0 0 ${WORDMARK_W} ${WORDMARK_H}`}
        width={WORDMARK_W * scale}
        height={WORDMARK_H * scale}
        role="img"
        aria-label="WunTab"
        className={wordmark}
      >
        <path d={WORDMARK_PATH} fill="currentColor" />
      </svg>
    </span>
  );
}
