import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/how-it-works", destination: "/product", permanent: true },
      { source: "/online-ordering", destination: "/product", permanent: true },
      { source: "/restaurant-seo", destination: "/product", permanent: true },
    ];
  },
};

export default nextConfig;
