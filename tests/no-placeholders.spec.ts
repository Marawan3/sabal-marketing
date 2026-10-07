import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { allRoutes } from "../src/lib/site";

/**
 * A screenshot frame with no real file in public/shots/ renders nothing.
 * Placeholder boxes went live on wuntab.com on 2026-10-07; this keeps them off.
 */
const PHRASE = "Screenshot placeholder";

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

test("no built page contains a screenshot placeholder", async () => {
  const files = htmlFiles(join(process.cwd(), ".next", "server", "app"));
  expect(files.length, "the build wrote prerendered pages").toBeGreaterThan(10);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    expect(html, file).not.toContain(PHRASE);
    expect(html, file).not.toContain("data-placeholder");
  }
});

test("no served page contains a screenshot placeholder", async ({ request }) => {
  for (const path of [...allRoutes, "/terms", "/privacy"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).not.toContain(PHRASE);
    expect(html, path).not.toContain("data-placeholder");
  }
});

test("docs/marketing-site/SHOTS.md matches the shot catalog", () => {
  const result = spawnSync(process.execPath, ["scripts/shots-doc.mjs", "--check"], { encoding: "utf8" });
  expect(result.status, result.stderr || result.stdout).toBe(0);
});
