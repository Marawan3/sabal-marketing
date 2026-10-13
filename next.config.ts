import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
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
