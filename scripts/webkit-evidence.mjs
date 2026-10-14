// WebKit on an iPhone profile: what the visuals actually do, for the record.
//
//   node scripts/webkit-evidence.mjs <base URL> <out dir> [live URL]
//
// Needs Playwright's WebKit (npx playwright install --with-deps webkit) and,
// for the GIFs, ffmpeg. Writes into <out dir>:
//   report.json            per visual on the homepage: animations running,
//                          the clock's currentTime 3s after it is scrolled into
//                          view, every IntersectionObserver report; console
//                          errors on load; whether React hydrated (pause
//                          button, calculator, mobile menu)
//   debug-panel-393x852.png        ?debug=motion on <base URL>
//   debug-panel-live-393x852.png   ?debug=motion on [live URL], if given
//   hero-393x852.gif, storefront-393x852.gif, kitchen-board-393x852.gif
//
// docs/marketing-site/evidence/webkit-iphone/ came from it, run on a GitHub
// Actions runner before and after the fix of 2026-10-14.

import { webkit } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base, out, live] = process.argv.slice(2);
if (!base || !out) throw new Error("usage: node scripts/webkit-evidence.mjs <base URL> <out dir> [live URL]");
mkdirSync(out, { recursive: true });

// iPhone 17 Pro in Safari: 393×852 CSS px at 3x, touch. iOS 26 Safari freezes the OS in its UA at 18_6.
const iphone = {
  viewport: { width: 393, height: 852 },
  screen: { width: 393, height: 852 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
  timezoneId: "America/New_York",
};

// Log every IntersectionObserver report on the element it is about.
const watchObservers = () => {
  const Native = window.IntersectionObserver;
  window.IntersectionObserver = class extends Native {
    constructor(cb, opts) {
      super((entries, obs) => {
        for (const e of entries) {
          (e.target.__io ??= []).push({ at: Math.round(performance.now()), isIntersecting: e.isIntersecting, ratio: e.intersectionRatio });
        }
        return cb(entries, obs);
      }, opts);
    }
  };
};

const browser = await webkit.launch();
const report = { browser: `WebKit ${browser.version()}`, base, live: live ?? null, visuals: [], console: [], pageErrors: [], hydration: {} };

async function page(extra = {}) {
  const context = await browser.newContext({ ...iphone, ...extra });
  await context.addInitScript(watchObservers);
  const p = await context.newPage();
  return { context, p };
}

// 1. The homepage: console on load, every visual, hydration.
{
  const { context, p } = await page();
  p.on("console", (m) => (m.type() === "error" || m.type() === "warning") && report.console.push({ type: m.type(), text: m.text() }));
  p.on("pageerror", (e) => report.pageErrors.push(String(e.stack ?? e)));
  await p.goto(base + "/", { waitUntil: "load" });
  await p.waitForTimeout(3000);
  report.userAgent = await p.evaluate(() => navigator.userAgent);

  // Some visuals appear twice (one hidden on phones), so they go by index.
  const names = await p.$$eval("[data-visual]", (els) => els.map((el) => el.getAttribute("data-visual")));
  const read = (i) =>
    p.evaluate((n) => {
      const el = document.querySelectorAll("[data-visual]")[n];
      const anims = el.getAnimations({ subtree: true });
      const clock = el.getAnimations().find((a) => a.animationName === "vis-clock");
      const r = el.getBoundingClientRect();
      return {
        dataRun: el.hasAttribute("data-run"),
        displayed: r.width > 0,
        onScreen: r.bottom > 0 && r.top < innerHeight && r.width > 0,
        animations: anims.length,
        running: anims.filter((a) => a.playState === "running").length,
        clock: clock ? { currentTime: Math.round(Number(clock.currentTime)), playState: clock.playState } : null,
        playStateCss: getComputedStyle(el).animationPlayState,
      };
    }, i);

  // At load + 3s, without scrolling (only what's on the first screen should run).
  const atLoad = [];
  for (const i of names.keys()) atLoad[i] = await read(i);
  // Then each one scrolled into view, 3s later (hidden ones can't be).
  for (const [i, name] of names.entries()) {
    if (atLoad[i].displayed) {
      await p.evaluate((n) => document.querySelectorAll("[data-visual]")[n].scrollIntoView({ block: "center", behavior: "instant" }), i);
      await p.waitForTimeout(3000);
    }
    const inView = atLoad[i].displayed ? await read(i) : "not displayed at this width";
    const io = await p.evaluate((n) => document.querySelectorAll("[data-visual]")[n].__io ?? [], i);
    report.visuals.push({ name, atLoadPlus3s: atLoad[i], scrolledIntoViewPlus3s: inView, observer: { reports: io.length, everIntersecting: io.some((e) => e.isIntersecting), log: io } });
  }

  // Hydration: React-only behaviour.
  await p.evaluate(() => scrollTo(0, 0));
  const hero = p.locator('[data-visual="hero"]');
  const btn = hero.getByRole("button");
  const before = await btn.getAttribute("aria-label").catch(() => null);
  await btn.click({ timeout: 5000 }).catch((e) => (report.hydration.pauseClickError = String(e)));
  await p.waitForTimeout(300);
  report.hydration.pauseButton = { before, after: await btn.getAttribute("aria-label").catch(() => null), dataHold: await hero.evaluate((el) => el.hasAttribute("data-hold")) };
  report.hydration.pauseButton.works = report.hydration.pauseButton.before !== report.hydration.pauseButton.after && report.hydration.pauseButton.dataHold;

  const calc = p.locator("[data-calculator]");
  await calc.scrollIntoViewIfNeeded();
  const inputs = calc.locator("input");
  await inputs.nth(0).fill("100").catch((e) => (report.hydration.calcError = String(e)));
  await inputs.nth(1).fill("30").catch((e) => (report.hydration.calcError = String(e)));
  await p.waitForTimeout(300);
  report.hydration.calculator = { result: (await calc.locator("[data-result]").innerText()).trim() };
  report.hydration.calculator.works = /Between \$/.test(report.hydration.calculator.result);

  // The mobile menu is a native <details>: it opens without React, so it says nothing about hydration.
  await p.evaluate(() => scrollTo(0, 0));
  const menu = p.locator("details.mobile-nav");
  await menu.locator("summary").first().tap({ timeout: 5000 }).catch((e) => (report.hydration.menuError = String(e)));
  await p.waitForTimeout(300);
  report.hydration.mobileMenu = { opens: await menu.evaluate((d) => d.open), note: "native <details>; opens with or without React" };
  await context.close();
}

// 2. The debug panel.
async function panel(url, file) {
  const { context, p } = await page();
  await p.goto(url, { waitUntil: "load" });
  await p.waitForTimeout(3000);
  const has = await p.locator("[data-motion-debug]").count();
  if (has) report[file] = await p.locator("[data-motion-debug]").innerText();
  else report[file] = "no panel on the page";
  await p.screenshot({ path: join(out, file) });
  await context.close();
}
await panel(base + "/?debug=motion", "debug-panel-393x852.png");
if (live) await panel(live.replace(/\/$/, "") + "/?debug=motion", "debug-panel-live-393x852.png");

// 3. Real-time recordings at 393×852.
const recordings = [
  ["hero", "/", "hero-393x852.gif", 14000],
  ["storefront", "/restaurant-websites", "storefront-393x852.gif", 10000],
  ["kitchen", "/order-management", "kitchen-board-393x852.gif", 10000],
];
for (const [name, path, gif, ms] of recordings) {
  const dir = join(out, `.video-${name}`);
  // Video records CSS pixels; DPR 1 keeps WebKit's recorder at real time.
  const { context, p } = await page({ deviceScaleFactor: 1, recordVideo: { dir, size: iphone.viewport } });
  // Into view before it mounts, so the recording starts at the story's start.
  await p.goto(base + path, { waitUntil: "commit" });
  await p.waitForSelector(`[data-visual="${name}"]`);
  await p.evaluate((n) => document.querySelector(`main [data-visual="${n}"], [data-visual="${n}"]`).scrollIntoView({ block: "center", behavior: "instant" }), name);
  await p.waitForTimeout(ms);
  await context.close();
  const webm = join(dir, readdirSync(dir).find((f) => f.endsWith(".webm")));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", webm, "-vf", "fps=12,scale=393:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer", join(out, gif)]);
  rmSync(dir, { recursive: true, force: true });
}

await browser.close();
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
