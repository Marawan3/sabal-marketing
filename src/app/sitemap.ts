import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const paths = [
  "/",
  "/product",
  "/pricing",
  "/demo",
  "/about",
  "/privacy",
  "/terms",
  "/platform-terms",
  "/dpa",
  "/accessibility",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const legal = new Set([
    "/privacy",
    "/terms",
    "/platform-terms",
    "/dpa",
    "/accessibility",
  ]);
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : legal.has(path) ? 0.3 : 0.7,
  }));
}
