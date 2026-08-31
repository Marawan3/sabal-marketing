import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Simple pricing, no order commissions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Simple pricing, no order commissions.", "Pricing");
}
