import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Sabal — your menu on Google, your orders on your site";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Get found on Google. Keep the order. Keep the margin.");
}
