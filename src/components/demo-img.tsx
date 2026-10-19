import { demoOrder } from "@/lib/demo-order";

/**
 * A picture of the demo restaurant inside a visual (2026-10-19: a photo on
 * every dish). A plain img: the files are already sized (public/demo), so the
 * image loader would only add script. Width and height are set so nothing
 * shifts while it loads; alt is empty because every visual is aria-hidden
 * with one sentence for screen readers. The hero phone's pictures load at
 * once (`eager`: the homepage's hero, and /online-ordering's), the rest as
 * they come near.
 */
export function DemoImg({
  src,
  width,
  height,
  eager = false,
  className,
}: {
  src: string;
  width: number;
  height: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} className={className} />
  );
}

/** A dish photo: the square 360 for rows, cards and thumbnails, or the 900 for the dish sheet. */
export function DishImg({ src, eager = false, className }: { src: string; eager?: boolean; className?: string }) {
  const size = src.endsWith("-900.webp") ? 900 : 360;
  return <DemoImg src={src} width={size} height={size} eager={eager} className={className} />;
}

/** The restaurant's mark (Logo A), beside its name on its own screens. */
export function RestaurantMark({ eager = false, className }: { eager?: boolean; className?: string }) {
  return <DemoImg src={demoOrder.mark} width={100} height={100} eager={eager} className={className} />;
}
