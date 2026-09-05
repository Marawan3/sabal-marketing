import { ImageResponse } from "next/og";
import { brand } from "./brand";

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
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg viewBox="0 0 56 56" width={56} height={56}>
            <rect x="0" y="0" width="56" height="56" rx="14" fill={brand.ink} />
            <polyline
              points="11,22 18,39 28,12 38,39 45,22"
              fill="none"
              stroke={brand.saffron}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 500, letterSpacing: 3 }}>
            WUNTAB
          </span>
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
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
