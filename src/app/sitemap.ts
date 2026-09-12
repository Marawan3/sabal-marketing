import type { MetadataRoute } from "next";
import { finalLegalRoutes } from "@/lib/legal";
import { absoluteUrl } from "@/lib/site";

/** Legal documents join the sitemap only once their final text is published. */
const paths = ["/", ...finalLegalRoutes()];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.3,
  }));
}
