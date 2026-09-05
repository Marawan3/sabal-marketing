import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/demo", destination: "/contact", permanent: true },
      { source: "/platform-terms", destination: "/terms", permanent: true },
      { source: "/dpa", destination: "/privacy", permanent: true },
      { source: "/accessibility", destination: "/privacy", permanent: true },
      { source: "/grader", destination: "/menu-check", permanent: true },
      { source: "/solutions", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
