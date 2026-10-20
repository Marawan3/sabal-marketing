import { DemoImg } from "./demo-img";
import { copy } from "@/lib/copy";
import { demoOrder, photoOf } from "@/lib/demo-order";
import { demoStorefront } from "@/lib/site";

const tones = {
  light: { link: "text-ink decoration-ink-muted hover:decoration-ink", tag: "text-ink-muted" },
  dark: { link: "text-paper decoration-paper/40 hover:decoration-paper", tag: "text-paper/75" },
  // On the saffron band muted grey doesn't read, so the tag stays ink.
  saffron: { link: "text-ink decoration-ink/50 hover:decoration-ink", tag: "text-ink" },
} as const;

/** The new-tab icon beside a link to the demo restaurant. */
export function ExternalIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 2.5H2.5v9h9v-3M8 2.5h3.5V6M11.5 2.5L6.5 7.5" />
    </svg>
  );
}

/**
 * "See a live restaurant": the demo restaurant's own website
 * (demo.wuntab.com, live 2026-10-19), in a new tab. "Demo restaurant" and the
 * new-tab icon sit beside it, so nobody takes it for a customer's site.
 * Renders nothing while NEXT_PUBLIC_SHOW_DEMO_LINK is "false" (site.ts).
 */
export function DemoLink({ tone = "light", className = "" }: { tone?: keyof typeof tones; className?: string }) {
  if (!demoStorefront.on) return null;
  const t = tones[tone];
  return (
    <a
      href={demoStorefront.href}
      target="_blank"
      rel="noopener"
      data-demo-link
      className={`inline-flex min-h-11 flex-wrap items-center justify-center gap-x-2 font-medium ${className}`}
    >
      <span className={`underline underline-offset-4 transition-colors duration-150 ${t.link}`}>{demoStorefront.label}</span>
      <ExternalIcon />
      <span className={`text-small font-normal ${t.tag}`}>{demoStorefront.tag}</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * The Product menu's demo card (owner, 2026-10-20): the demo restaurant's
 * pepperoni pizza, "Demo restaurant", its name, what it is, and "See a live
 * restaurant", in a new tab like the other demo links. The photo loads only
 * once the menu opens. Nothing while the demo link is off.
 */
export function DemoCard() {
  if (!demoStorefront.on) return null;
  return (
    <a
      href={demoStorefront.href}
      target="_blank"
      rel="noopener"
      data-demo-link
      data-demo-card
      className="group/card flex flex-col self-start overflow-hidden rounded-[16px] bg-panel"
    >
      <DemoImg src={photoOf("pepperoni-pizza", 900)} width={300} height={150} className="aspect-[2/1] h-auto w-full object-cover" />
      <span className="flex flex-col gap-1 p-4">
        <span className="text-small text-ink-muted">{demoStorefront.tag}</span>
        <span className="text-body font-[650] tracking-[-0.01em]">{demoOrder.restaurant}</span>
        <span className="mb-2 text-small">{copy.nav.demoCard}</span>
        <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline underline-offset-4 group-hover/card:decoration-2">
          {demoStorefront.label}
          <ExternalIcon />
        </span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * The phone menu's compact demo row (owner, 2026-10-20): an 88px thumbnail,
 * "Demo restaurant · Palm&Stone Pizza" and the link. That first line is 241px
 * in the small size, so it's one line from a 394px screen; narrower, it's two
 * lines with the dot hidden, so it never breaks inside the name or ends a
 * line on the dot.
 */
export function DemoRow({ className = "" }: { className?: string }) {
  if (!demoStorefront.on) return null;
  return (
    <a
      href={demoStorefront.href}
      target="_blank"
      rel="noopener"
      data-demo-link
      className={`flex min-h-[88px] items-center gap-3.5 overflow-hidden rounded-[14px] bg-panel pr-3 ${className}`}
    >
      <DemoImg src={photoOf("pepperoni-pizza")} width={88} height={88} className="h-[88px] w-[88px] shrink-0 object-cover" />
      <span className="@container flex min-w-0 flex-1 flex-col gap-0.5">
        <span data-demo-names className="text-small text-ink-muted">
          <span className="whitespace-nowrap">{demoStorefront.tag}</span>
          <span data-sep className="@max-[248px]:hidden">{" · "}</span>
          <br className="@min-[248px]:hidden" />
          <span className="whitespace-nowrap">{demoOrder.restaurant}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-body font-semibold underline underline-offset-4">
          {demoStorefront.label}
          <ExternalIcon />
        </span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
