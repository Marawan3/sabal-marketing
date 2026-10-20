import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "./brand";
import { WORDMARK } from "./wordmark";

/**
 * The title's face: Archivo at the H1's weight (750) and width (110%), a
 * static TTF instanced from the site's own Archivo file by
 * scripts/og-font.py (owner, 2026-10-20). The renderer reads TTF, not the
 * site's WOFF2. Read once, at module scope, as the next/og docs advise.
 */
const archivo = await readFile(join(process.cwd(), "assets/og/archivo-750-110.ttf"));

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function createOgImage(title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.paper,
          color: brand.ink,
          padding: "72px",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg viewBox="0 0 56 56" width={56} height={56}>
            <rect x="0" y="0" width="56" height="56" rx="14" fill={brand.navy} />
            <polyline
              points="11,22 18,39 28,12 38,39 45,22"
              fill="none"
              stroke={brand.saffron}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* The wordmark's outlines, at the tile's size: the same lockup as the header (logo.tsx). */}
          <svg viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`} width={(WORDMARK.width * 56) / WORDMARK.height} height={56}>
            <path d={WORDMARK.d} fill={brand.ink} />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 120,
              height: 12,
              borderRadius: 4,
              background: brand.saffron,
            }}
          />
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              // The H1's tracking, -0.025em.
              letterSpacing: -1.6,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      // The one face, registered as 700: the file itself is the 750 instance at 110% width.
      fonts: [{ name: "Archivo", data: archivo, weight: 700, style: "normal" }],
    },
  );
}
