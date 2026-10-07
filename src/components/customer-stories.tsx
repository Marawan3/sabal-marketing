import { ScreenFrame } from "./screen-frame";
import { Panel, Section } from "./section";
import { copy } from "@/lib/copy";
import { customerStories } from "@/lib/stories";

/**
 * A swipeable row of real customers: photo, real result, owner's name.
 * Renders nothing while src/lib/stories.ts is empty.
 */
export function CustomerStories() {
  if (!customerStories.length) return null;
  return (
    <Section id="stories">
      <h2 className="max-w-[18ch] text-h2">{copy.stories.heading}</h2>
      <div className="snap-row mt-10 lg:grid lg:grid-cols-3 lg:gap-6">
        {customerStories.map((story) => (
          <Panel key={story.restaurant} className="overflow-hidden p-3">
            <ScreenFrame shot={story.photo} caption={false} fill />
            <div className="p-3">
              <p className="text-h3">{story.result}</p>
              <p className="mt-2 text-small text-ink/70">
                {story.owner}, {story.restaurant}
              </p>
            </div>
          </Panel>
        ))}
      </div>
    </Section>
  );
}
