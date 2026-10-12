import { ScreenFrame } from "./screen-frame";
import { Section } from "./section";
import { copy } from "@/lib/copy";
import { FITS } from "@/lib/shot-placements";
import { customerStories } from "@/lib/stories";

/**
 * A row of real customers (stacked on phones): photo, real result, owner's name.
 * Renders nothing while src/lib/stories.ts is empty.
 */
export function CustomerStories() {
  if (!customerStories.length) return null;
  return (
    <Section id="stories">
      <h2 className="max-w-[18ch] text-h2">{copy.stories.heading}</h2>
      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {customerStories.map((story) => (
          <div key={story.restaurant}>
            <ScreenFrame shot={story.photo} fit={FITS.story} caption={false} fill sizes="(min-width: 1024px) 340px, 92vw" />
            <div className="pt-4">
              <p className="text-h3">{story.result}</p>
              <p className="mt-2 text-small text-ink/70">
                {story.owner}, {story.restaurant}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
