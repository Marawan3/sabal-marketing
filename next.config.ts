import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tests build a preview copy into .next-preview (playwright.config.ts).
  // Unset everywhere else, including Vercel, so the default .next applies.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 serves only listed qualities and coerces anything else to the
    // nearest one. 75 is the default (photos); screenshots use 90, because
    // their text edges blur at 75 (src/lib/shot-files.ts SCREENSHOT_QUALITY).
    qualities: [75, 90],
    // The defaults stop at 3840. A small crop of a 3x capture (the dish photo
    // in the homepage's online-ordering row) needs the whole 4320px file on a
    // 3x phone, so 4320 is allowed too. The optimizer never upscales.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 4320],
  },
  async redirects() {
    // /how-it-works, /pricing, /online-ordering and /restaurant-seo used to
    // redirect to the one-page site; they are real pages now (phase 1).
    return [
      { source: "/demo", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/dpa", destination: "/privacy", permanent: true },
      // Legal aliases. 301 exactly (not Next's default 308) for older clients
      // and for app-store reviewers that follow only classic permanent redirects.
      { source: "/privacy-policy", destination: "/privacy", statusCode: 301 },
      { source: "/platform-terms", destination: "/terms", statusCode: 301 },
      { source: "/terms-of-service", destination: "/terms", statusCode: 301 },
    ];
  },
};

export default nextConfig;
