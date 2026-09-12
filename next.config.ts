import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/how-it-works", destination: "/#how-it-works", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/demo", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/online-ordering", destination: "/", permanent: true },
      { source: "/restaurant-seo", destination: "/", permanent: true },
      { source: "/platform-terms", destination: "/terms", permanent: true },
      { source: "/dpa", destination: "/privacy", permanent: true },
      { source: "/accessibility", destination: "/privacy", permanent: true },
      // Legal aliases. 301 exactly (not Next's default 308) for older clients
      // and for app-store reviewers that follow only classic permanent redirects.
      { source: "/privacy-policy", destination: "/privacy", statusCode: 301 },
      { source: "/terms-of-service", destination: "/terms", statusCode: 301 },
    ];
  },
};

export default nextConfig;
