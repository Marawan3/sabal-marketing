import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const paths = [
  "/",
  "/how-it-works",
  "/online-ordering",
  "/restaurant-seo",
  "/pricing",
  "/demo",
  "/about",
  "/privacy",
  "/terms",
  "/accessibility",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
