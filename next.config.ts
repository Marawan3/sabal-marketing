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
      // Legal aliases. 301 exactly (not Next's default 308) for older clients
      // and for app-store reviewers that follow only classic permanent redirects.
      { source: "/privacy-policy", destination: "/privacy", statusCode: 301 },
      { source: "/terms-of-service", destination: "/terms", statusCode: 301 },
    ];
  },
};

export default nextConfig;
