import { copy } from "@/lib/copy";
import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = copy.legal.privacyTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage(copy.legal.privacyTitle);
}
