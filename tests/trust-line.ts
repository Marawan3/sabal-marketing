import { expect, type Locator, type Page } from "@playwright/test";

/**
 * The hero's trust line at every width from 320 to 1280 (owner, 2026-10-20): each fact whole on one line, and a
 * separator never starts or ends a line. One line from 520px (the whole line is 452px); below, "$0 for the
 * restaurant" alone, then "Customers pay 5% at checkout · No lock-in"; below 340px, a fact a line. Run by the
 * trust-line test (upgrade.spec.ts) and by phone.spec.ts, so WebKit on an iPhone profile checks it too.
 */
export async function expectTrustLineBreaks(page: Page, trust: Locator) {
  const widths = [...Array.from({ length: 97 }, (_, i) => 320 + i * 10), 339, 340, 479, 480, 519, 520, 1280];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });
    const layout = await trust.evaluate((p) => {
      const lineHeight = parseFloat(getComputedStyle(p).lineHeight);
      const rect = (el: Element) => el.getBoundingClientRect();
      const facts = [...p.querySelectorAll("[data-fact]")].map((el) => ({ top: Math.round(rect(el).top), height: rect(el).height }));
      // A separator that shows sits on the same line as the facts either side of it.
      const seps = [...p.querySelectorAll("[data-sep]")].map((el, i) => {
        const shown = rect(el).width > 0;
        const top = Math.round(rect(el).top);
        return { shown, between: shown ? facts[i].top === top && facts[i + 1].top === top : true };
      });
      return { lineHeight, facts, seps, lines: new Set(facts.map((f) => f.top)).size, overflow: p.scrollWidth > p.clientWidth + 1 };
    });
    expect(layout.facts.length).toBe(3);
    for (const f of layout.facts) expect(f.height, `a fact wraps at ${width}`).toBeLessThanOrEqual(layout.lineHeight + 1);
    for (const s of layout.seps) expect(s.between, `a separator at a line's start or end at ${width}`).toBe(true);
    expect(layout.overflow, `overflow at ${width}`).toBe(false);
    expect(layout.lines, `lines at ${width}`).toBe(width < 340 ? 3 : width < 520 ? 2 : 1);
    if (width >= 340 && width < 520) {
      // "$0 for the restaurant" alone, its separator hidden; the other two together.
      expect(layout.seps.map((s) => s.shown), `${width}`).toEqual([false, true]);
      expect(layout.facts[1].top).toBe(layout.facts[2].top);
    }
  }
}
