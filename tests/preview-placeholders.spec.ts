import { expect, test } from "@playwright/test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { findShot, shotSize } from "../src/lib/shot-files";
import { shotRows } from "../src/lib/shot-placements";

/**
 * Runs against the preview build (VERCEL_ENV=preview, served on 3003, see
 * playwright.config.ts). A preview deployment shows a placeholder box, with
 * the file name and size, wherever a shot is missing from public/shots/.
 * The production build never does: tests/no-placeholders.spec.ts.
 */
const PHRASE = "Screenshot placeholder";

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const missing = shotRows().filter((r) => r.placements.length && !findShot(r.shot.key));

test("every missing shot shows a placeholder on each page it belongs to", async ({ request }) => {
  test.skip(missing.length === 0, "every placed shot has a file");
  const pages = new Map<string, string>();
  for (const { shot, placements } of missing) {
    const size = shotSize(shot);
    for (const { page } of placements) {
      if (!pages.has(page)) {
        const response = await request.get(page);
        expect(response.status(), page).toBe(200);
        pages.set(page, await response.text());
      }
      const html = pages.get(page)!;
      expect(html, page).toContain(PHRASE);
      expect(html, `${shot.key} on ${page}`).toContain(`data-placeholder="${shot.key}"`);
      expect(html, `${shot.key} on ${page}`).toContain(`${shot.key}.webp · ${size.width}×${size.height}`);
    }
  }
});

test("the preview build prerendered its placeholders", async () => {
  test.skip(missing.length === 0, "every placed shot has a file");
  const files = htmlFiles(join(process.cwd(), ".next-preview", "server", "app"));
  const withBox = files.filter((file) => readFileSync(file, "utf8").includes(PHRASE));
  expect(withBox.length, "pages with a placeholder box").toBeGreaterThan(5);
});

test("legal pages show no placeholder, even on preview", async ({ request }) => {
  for (const path of ["/terms", "/privacy"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain(PHRASE);
  }
});
