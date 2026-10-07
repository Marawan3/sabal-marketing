import { Section } from "./section";
import { publishedBeliefs } from "@/lib/beliefs";
import { copy } from "@/lib/copy";

/** "What we believe": renders nothing until the owner has written all three. */
export function Beliefs() {
  const items = publishedBeliefs();
  if (!items.length) return null;
  return (
    <Section id="beliefs">
      <h2 className="max-w-[18ch] text-h2">{copy.beliefs.heading}</h2>
      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-12">
        {items.map((belief) => (
          <div key={belief.title} className="border-t border-ink/15 pt-6">
            <h3 className="text-h3">{belief.title}</h3>
            {belief.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-body text-ink/85">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
