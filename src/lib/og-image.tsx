import { ImageResponse } from "next/og";
import { brand } from "./brand";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function createOgImage(title: string, kicker = "Wuntab") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: brand.cream,
          color: brand.charcoal,
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: brand.brick,
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {kicker}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 42 ? 52 : 64,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 980,
            fontWeight: 500,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
