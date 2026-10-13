import Image from "next/image";
import { Section } from "./section";
import { publishedFounder } from "@/lib/founder";

/** The founder on /about: photo, name and four sentences. Nothing until the owner fills src/lib/founder.ts. */
export function Founder() {
  const f = publishedFounder();
  if (!f) return null;
  return (
    <Section id="founder">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <Image
          src={f.photo}
          alt={f.name}
          width={f.photoWidth}
          height={f.photoHeight}
          className="h-auto w-full max-w-[320px] rounded-[20px] lg:col-span-4"
        />
        <div className="lg:col-span-8">
          <h2 className="text-h2">{f.name}</h2>
          <p className="mt-4 max-w-[60ch] text-body text-ink-muted">{f.sentences.join(" ")}</p>
        </div>
      </div>
    </Section>
  );
}
