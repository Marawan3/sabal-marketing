import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Sabal — restaurant websites Google can actually read";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Google can't read your menu. We fix that.");
}
