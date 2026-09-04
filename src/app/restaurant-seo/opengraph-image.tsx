import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Restaurant SEO that's built in, not bolted on";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Restaurant SEO that's built in, not bolted on.", "Flagship");
}
