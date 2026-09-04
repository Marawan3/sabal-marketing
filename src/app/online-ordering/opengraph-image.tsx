import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Online ordering on your own domain";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Orders that stay on your site.", "Ordering");
}
