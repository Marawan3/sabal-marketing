import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function createOgImage(title: string, kicker = "Sabal") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e3f28",
          color: "#f3eee4",
          padding: "72px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#d7e6db",
          }}
        >
          <span>{kicker}</span>
          <span>Sabal</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: title.length > 42 ? 56 : 68,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#d7e6db",
            }}
          >
            Restaurant websites that rank. Ordering you own.
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
