import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Sabal — restaurant websites that rank, and ordering you own";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Your restaurant's website should be your best salesperson.");
}
