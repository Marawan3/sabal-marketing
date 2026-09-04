import { createOgImage, ogContentType, ogSize } from "@/lib/og-image";

export const alt = "Sabal product — storefront, ordering, kitchen";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage("From the first search to the ticket on the line.", "Product");
}
