/**
 * Local WunTab brand tokens. Do not import from the product repo.
 * Source of truth: .claude/skills/wuntab-design/SKILL.md (palette, 2026-10-20)
 * and src/app/globals.css, which carries the same values.
 */
export const brand = {
  paper: "#FFFFFF",
  ink: "#1D1D1B",
  /** Secondary text and control borders: 64% ink on white. */
  inkMuted: "#6E6E6D",
  /** The one dark (owner, 2026-10-20): the logo tile, the kitchen band, the footer, dark-filled buttons. */
  navy: "#13213C",
  /** Hover on navy buttons. */
  navyDeep: "#0B1528",
  /** The one accent: fills buttons, the hero panel and the final band. Never text on white. */
  saffron: "#F4A83A",
  saffronDeep: "#E2962C",
  /** The one warm neutral: panels behind the visuals and the toned sections. */
  panel: "#F7F3EC",
  /** Hairlines and dividers. */
  rule: "#E8E1D5",
} as const;

/**
 * Every text color the site sets on each background it sets it on, for the
 * WCAG AA test in tests/design.spec.ts: 4.5:1 for normal text, 3:1 for large
 * text (24px+, or 18.66px+ bold). `alpha` is the text's opacity over the
 * background, as the footer's secondary text (white at 75%).
 */
export const textPairs: { text: keyof typeof brand; on: keyof typeof brand; alpha?: number; large?: boolean; where: string }[] = [
  { text: "ink", on: "paper", where: "body text on the page" },
  { text: "inkMuted", on: "paper", where: "secondary text on the page" },
  { text: "ink", on: "panel", where: "text on the panels and toned sections" },
  { text: "inkMuted", on: "panel", where: "secondary text on the panels and toned sections" },
  { text: "ink", on: "saffron", where: "saffron buttons, the hero panel, the final band" },
  { text: "paper", on: "navy", where: "the kitchen band, the footer's links, navy buttons" },
  { text: "paper", on: "navy", alpha: 0.75, where: "the footer's secondary text" },
  { text: "paper", on: "navy", alpha: 0.8, where: "the kitchen band's secondary text" },
  { text: "paper", on: "navyDeep", where: "navy buttons on hover" },
  { text: "ink", on: "saffronDeep", where: "saffron buttons on hover" },
  { text: "navy", on: "paper", where: "the step numbers' navy numerals" },
  { text: "saffron", on: "navy", where: "the focus ring on navy, and the logo's saffron tile" },
];
