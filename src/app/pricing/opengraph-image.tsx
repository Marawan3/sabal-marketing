import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Five percent of the order";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Five percent of the order.", "Pricing");
}
