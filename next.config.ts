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
    ];
  },
};

export default nextConfig;
