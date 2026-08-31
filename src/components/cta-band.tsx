import Link from "next/link";
import { Container } from "./container";

export function CtaBand({
  title = "See Sabal on your menu.",
  body = "We set the site up with you. No self-serve signup, on purpose.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="border-t border-line bg-palm-deep text-on-brand">
      <Container className="flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-on-brand/80">{body}</p>
        </div>
        <Link
          href="/demo"
          className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink hover:bg-zinc-800"
        >
          Book a demo
        </Link>
      </Container>
    </section>
  );
}
