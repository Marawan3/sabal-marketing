import { expect, test, type Page } from "@playwright/test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { demoMenu, demoOrder } from "../src/lib/demo-order";

/**
 * The demo restaurant is the owner's Palm&Stone Pizza (2026-10-19), with a
 * photo on every dish the visuals show (public/demo/photos, ASSETS.md), its
 * mark beside its name, steam off the hot pizza and a drawn delivery map.
 */

const root = process.cwd();

/** Every page with a built visual. */
const pages = [
  "/",
  "/how-it-works",
  "/pricing",
  "/online-ordering",
  "/delivery",
  "/catering",
  "/restaurant-websites",
  "/restaurant-seo",
  "/order-management",
  "/integrations",
  "/online-menu",
  "/upsells",
  "/loyalty",
  "/kitchen-display",
  "/menu-management",
  "/payments",
  "/solutions/independent-restaurants",
  "/solutions/quick-service",
  "/solutions/full-service",
];

/** Every picture inside the built visuals on a page, with the attributes that matter. */
function pictures(page: Page) {
  return page.locator("[data-demo] img").evaluateAll((imgs) =>
    imgs.map((img) => ({
      src: img.getAttribute("src") ?? "",
      width: img.getAttribute("width"),
      height: img.getAttribute("height"),
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
      decoding: img.getAttribute("decoding"),
      // The hero phone (hero-order-demo.tsx): the homepage's hero, and /online-ordering's.
      hero: !!img.closest('[data-visual="hero"]'),
    })),
  );
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

test("the old menu and name are gone from src/ and tests/", () => {
  // The old dishes, the old cuisine and the old name, whole words, any case.
  const old = /\b(meatballs?|mezze|falafel|halloumi|gyros?|souvlaki|shawarma|hummus|grape leaves|feta|baklava|mediterranean)\b|palm&stone kitchen/i;
  const self = join(root, "tests", "demo-restaurant.spec.ts");
  const text = /\.(ts|tsx|mjs|js|css|md|json|txt)$/;
  const found: string[] = [];
  for (const file of [...files(join(root, "src")), ...files(join(root, "tests"))]) {
    if (file === self || !text.test(file)) continue;
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (old.test(line)) found.push(`${relative(root, file)}:${i + 1}: ${line.trim()}`);
      });
  }
  expect(found).toEqual([]);
});

test("every dish a visual shows has its photo in public/demo/photos, and every picture's file exists", async ({ page }) => {
  test.setTimeout(120_000);
  const dishes = demoMenu.flatMap((c) => c.dishes);
  const seen = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    const text = (await page.locator("[data-demo]").allTextContents()).join("\n");
    for (const dish of dishes) {
      if (!text.includes(dish.name)) continue;
      seen.add(dish.name);
      expect(dish.photo, `${dish.name} on ${path}`).not.toBeNull();
      expect(existsSync(join(root, "public/demo/photos", `${dish.photo}-360.webp`)), `${dish.name}'s photo`).toBe(true);
    }
    for (const { src } of await pictures(page)) expect(existsSync(join(root, "public", src)), `${src} on ${path}`).toBe(true);
  }
  // Every pizza shows (Hot Honey Soppressata's photo came after the others, 2026-10-19), and the sides and sandwiches the visuals use.
  expect([...seen].sort()).toEqual(
    [
      "Pepperoni Pizza",
      "Margherita",
      "Hot Honey Soppressata",
      "Buffalo Chicken",
      "White Pie",
      "Garlic Knots",
      "Loaded Fries",
      "Buffalo Wings",
      "Chicken Parm Sandwich",
    ].sort(),
  );
});

test("every picture in a visual has its size set, no alt text (the visuals are aria-hidden), and only the hero's load at once", async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of pages) {
    await page.goto(path);
    let heroPictures = 0;
    for (const img of await pictures(page)) {
      const at = `${img.src} on ${path}`;
      expect(Number(img.width), at).toBeGreaterThan(0);
      expect(Number(img.height), at).toBeGreaterThan(0);
      expect(img.alt, at).toBe("");
      expect(img.decoding, at).toBe("async");
      expect(img.loading, at).toBe(img.hero ? "eager" : "lazy");
      if (img.hero) heroPictures++;
    }
    // The hero phone, where there is one: four menu rows, the dish sheet's photo and the mark.
    if (["/", "/online-ordering"].includes(path)) expect(heroPictures, path).toBe(demoOrder.rows.length + 2);
    else expect(heroPictures, path).toBe(0);
  }
});

test("the homepage's pictures weigh under 1 MB", async ({ page }) => {
  await page.goto("/");
  const srcs = new Set(await page.locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src") ?? "")));
  let bytes = 0;
  for (const src of srcs) {
    expect(src.startsWith("/"), src).toBe(true);
    bytes += statSync(join(root, "public", src)).size;
  }
  test.info().annotations.push({ type: "homepage pictures", description: `${srcs.size} files, ${bytes} bytes` });
  expect(bytes).toBeLessThan(1_000_000);
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`steam and the delivery map (${reducedMotion === "reduce" ? "reduced motion: no steam, the dot fades between three points" : "motion: steam rises, the dot travels"})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    const reduced = reducedMotion === "reduce";
    // The steam over the pepperoni photo: the hero's dish sheet and /upsells.
    for (const [path, sel] of [
      ["/", "#top [data-demo] [data-sheet]"],
      ["/upsells", 'main [data-visual="upsell"]'],
    ]) {
      await page.goto(path);
      const steam = page.locator(`${sel} [data-steam]`);
      await expect(steam).toHaveCount(1);
      const state = await steam.evaluate((el) => ({
        display: getComputedStyle(el).display,
        animations: el.getAnimations({ subtree: true }).map((a) => ({
          props: (a.effect as KeyframeEffect).getKeyframes().flatMap((k) => Object.keys(k).filter((p) => !["offset", "computedOffset", "easing", "composite"].includes(p))),
          iterations: (a.effect as KeyframeEffect).getComputedTiming().iterations,
        })),
      }));
      if (reduced) expect(state).toEqual({ display: "none", animations: [] });
      else {
        expect(state.animations.length, path).toBe(3);
        for (const a of state.animations) {
          expect(a.iterations).toBe(Infinity);
          for (const p of a.props) expect(["opacity", "transform", "animationTimingFunction"]).toContain(p);
        }
      }
    }
    // The tracking page's map: the restaurant's pin, the address's, and the driver.
    await page.goto("/delivery");
    const map = page.locator('main [data-visual="delivery"] [data-map]');
    await expect(map.locator('[data-pin="restaurant"]')).toHaveCount(1);
    await expect(map.locator('[data-pin="address"]')).toHaveCount(1);
    const moves = await map.evaluate((el) =>
      document
        .getAnimations()
        .filter((a) => {
          const target = (a.effect as KeyframeEffect | null)?.target;
          return !!target && el.contains(target);
        })
        .map((a) => ({
          target: ((a.effect as KeyframeEffect).target as Element).getAttribute("data-driver-at") ?? ((a.effect as KeyframeEffect).target as Element).className,
          transform: (a.effect as KeyframeEffect).getKeyframes().some((k) => k.transform !== undefined),
        })),
    );
    if (reduced) {
      // Nothing about the dot moves: three still dots take turns.
      expect(moves.filter((m) => m.transform)).toEqual([]);
      expect(moves.map((m) => m.target).sort()).toEqual(["1", "2", "3"]);
      await expect(map.locator("[data-driver]")).toBeHidden();
    } else {
      expect(moves.filter((m) => m.transform).length).toBe(1);
      await expect(map.locator("[data-driver]")).toBeVisible();
      for (const dot of await map.locator("[data-driver-at]").all()) expect(await dot.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    }
  });
}
