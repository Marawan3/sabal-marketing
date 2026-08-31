import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-4xl tracking-tight">Page not here.</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        That URL is not on this site. The menu of pages is short on purpose.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-palm-deep px-5 py-2.5 text-sm font-semibold text-on-brand"
      >
        Back home
      </Link>
    </Container>
  );
}
