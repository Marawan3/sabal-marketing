import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "How Sabal Works";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("How Sabal works.", "Product");
}
