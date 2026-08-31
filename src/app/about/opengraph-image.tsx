import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "About Sabal";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Built by a small team obsessed with restaurant SEO.", "About");
}
