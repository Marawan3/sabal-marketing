import { testimonials } from "@/lib/copy";
import { Container } from "./container";

export function TestimonialPlaceholders({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <section>
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-palm">
          {kicker}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">{note}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.quote}
              className="rounded-3xl border border-dashed border-line bg-paper-2 p-6"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
                Placeholder — awaiting a real quote
              </p>
              <blockquote className="mt-4 text-base leading-7 text-ink-soft">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-medium text-ink">{item.name}</span>
                <span className="block text-ink-soft">{item.restaurant}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
