import { Section } from "./section";
import { copy } from "@/lib/copy";
import { customerStories, storiesFor, type CustomerStory } from "@/lib/stories";

function Row({ stories }: { stories: CustomerStory[] }) {
  return (
    <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {stories.map((story) => (
        <div key={story.restaurant} className="border-t border-rule pt-4">
          <p className="text-h3">{story.result}</p>
          <p className="mt-2 text-small text-ink-muted">
            {story.owner}, {story.restaurant}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * A row of real customers (stacked on phones): the real result and the
 * owner's name. Renders nothing while src/lib/stories.ts is empty.
 */
export function CustomerStories() {
  if (!customerStories.length) return null;
  return (
    <Section id="stories">
      <h2 className="max-w-[18ch] text-h2">{copy.stories.heading}</h2>
      <Row stories={customerStories} />
    </Section>
  );
}

/**
 * A product page's proof slot: the same list, the stories tagged with this
 * product. Empty stays empty: no demo fallback, nothing rendered.
 */
export function ProofSlot({ slug }: { slug: string }) {
  const stories = storiesFor(slug);
  if (!stories.length) return null;
  return (
    <Section id="proof">
      <h2 className="max-w-[18ch] text-h2">{copy.stories.heading}</h2>
      <Row stories={stories} />
    </Section>
  );
}
