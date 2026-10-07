import type { MetadataRoute } from "next";
import { absoluteUrl, allRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/privacy" || path === "/terms" ? 0.3 : 0.7,
  }));
}
