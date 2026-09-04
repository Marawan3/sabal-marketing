import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Sabal pricing — flat monthly, no cut of the order";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("A flat monthly fee. No cut of the order.", "Pricing");
}
