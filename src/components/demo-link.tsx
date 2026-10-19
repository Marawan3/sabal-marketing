import { demoStorefront } from "@/lib/site";

const tones = {
  light: { link: "text-ink decoration-ink-muted hover:decoration-ink", tag: "text-ink-muted" },
  dark: { link: "text-paper decoration-paper/40 hover:decoration-paper", tag: "text-paper/80" },
  // On the saffron band muted grey doesn't read, so the tag stays ink.
  saffron: { link: "text-ink decoration-ink/50 hover:decoration-ink", tag: "text-ink" },
} as const;

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
      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 2.5H2.5v9h9v-3M8 2.5h3.5V6M11.5 2.5L6.5 7.5" />
      </svg>
      <span className={`text-small font-normal ${t.tag}`}>{demoStorefront.tag}</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
