import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "About Sabal — built in Orlando for independents";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("Built in Orlando for independent restaurants.", "About");
}
