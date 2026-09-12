import { legalDocs } from "@/lib/legal";
import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = legalDocs.privacy.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage(legalDocs.privacy.title);
}
