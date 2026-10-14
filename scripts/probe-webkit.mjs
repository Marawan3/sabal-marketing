// Temporary probe (removed before merge): what WebKit reports for a visual's clock after a CSS pause.
import { webkit } from "@playwright/test";
const base = process.argv[2];
const browser = await webkit.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const sample = (sel) =>
  p.evaluate(async (s) => {
    const el = document.querySelector(s);
    const a = el.getAnimations().find((x) => x.animationName === "vis-clock");
    const out = [];
    const t0 = performance.now();
    for (let i = 0; i < 14; i++) {
      out.push({ ms: Math.round(performance.now() - t0), t: Math.round(a.currentTime), state: a.playState, pending: a.pending, timeline: Math.round(document.timeline.currentTime), run: el.hasAttribute("data-run"), hold: el.hasAttribute("data-hold") });
      await new Promise((r) => setTimeout(r, i < 6 ? 20 : 150));
    }
    return out;
  }, sel);
const log = (label, rows) => { console.log(`--- ${label}`); for (const r of rows) console.log(JSON.stringify(r)); };

await p.goto(base + "/");
await p.waitForTimeout(1500);
await p.locator('#top [data-demo]').getByRole("button").click();
log("hero: pause button", await sample("#top [data-demo]"));
await p.locator('#top [data-demo]').getByRole("button").click();
await p.waitForTimeout(800);
await p.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await p.waitForFunction(() => !document.querySelector("#top [data-demo]").hasAttribute("data-run"));
log("hero: scrolled fully off screen", await sample("#top [data-demo]"));

await p.goto(base + "/delivery");
log("delivery flow: below the fold from load", await sample('main [data-visual="flow"]'));
await browser.close();
