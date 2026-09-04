import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Book a Sabal demo";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Book a demo.", "Demo");
}
