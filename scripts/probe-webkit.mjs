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

// The turn on phones: brightness of the phone after it, per candidate CSS.
const variants = {
  baseline: "",
  "front face rotateY(0)": "[data-flipper] > :first-child { transform: rotateY(0deg); }",
  "front face translateZ(0)": "[data-flipper] > :first-child { transform: translateZ(0); }",
  "front face will-change": "[data-flipper] > :first-child { will-change: transform; }",
  "prefixed backface": "[data-flipper] > * { -webkit-backface-visibility: hidden; }",
  "screen backface": "[data-flipper] > * > * { backface-visibility: hidden; }",
};
const phoneCtx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
const q = await phoneCtx.newPage();
for (const [name, css] of Object.entries(variants)) {
  await q.goto(base + "/");
  if (css) await q.addStyleTag({ content: css });
  await q.waitForSelector("#top [data-demo][data-run]");
  const at = async (t) => {
    await q.evaluate((t) => { for (const a of document.querySelector("#top [data-demo]").getAnimations({ subtree: true })) { a.pause(); a.currentTime = t; } }, t);
    await q.waitForTimeout(200);
    const png = (await q.locator("#top [data-flipper]").screenshot()).toString("base64");
    return Math.round(await q.evaluate(async (b64) => {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, img.width, img.height).data; let s = 0;
      for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 3;
      return s / (d.length / 4);
    }, png));
  };
  console.log(`--- turn: ${name}: before ${await at(9100)}, after ${await at(11800)}`);
}
await browser.close();
