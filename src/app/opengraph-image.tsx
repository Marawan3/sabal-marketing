import { copy } from "@/lib/copy";
import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = copy.hero.headline;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage(copy.hero.headline);
}
