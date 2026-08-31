import type { MetadataRoute } from "next";
import { absoluteUrl, shouldIndex } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const index = shouldIndex();
  return {
    rules: index
      ? { userAgent: "*", allow: "/", disallow: ["/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
