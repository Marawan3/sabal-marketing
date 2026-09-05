import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const url = process.argv[2] ?? "http://127.0.0.1:3001";
const outDir = process.argv[3] ?? "/opt/cursor/artifacts/lighthouse";
mkdirSync(outDir, { recursive: true });

const widths = [
  { name: "390", form: "mobile", width: 390, height: 844, dpr: 2, mobile: true },
  { name: "1440", form: "desktop", width: 1440, height: 900, dpr: 1, mobile: false },
];

const categories = ["performance", "accessibility", "best-practices", "seo"];
const results = [];

for (const preset of widths) {
  const prefix = join(outDir, `lighthouse-${preset.name}`);
  const args = [
    "--yes",
    "lighthouse",
    url,
    "--only-categories=performance,accessibility,best-practices,seo",
    `--form-factor=${preset.form}`,
    `--screenEmulation.width=${preset.width}`,
    `--screenEmulation.height=${preset.height}`,
    `--screenEmulation.deviceScaleFactor=${preset.dpr}`,
    `--screenEmulation.mobile=${preset.mobile}`,
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
    "--output=json",
    "--output=html",
    `--output-path=${prefix}`,
  ];
  const run = spawnSync("npx", args, { encoding: "utf8", stdio: "inherit" });
  if (run.status !== 0) {
    process.exit(run.status ?? 1);
  }
  const report = JSON.parse(readFileSync(`${prefix}.report.json`, "utf8"));
  const scores = Object.fromEntries(
    categories.map((key) => [
      key,
      Math.round((report.categories[key]?.score ?? 0) * 100),
    ]),
  );
  results.push({ width: preset.name, scores });
}

writeFileSync(join(outDir, "summary.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

const failed = results.flatMap((row) =>
  Object.entries(row.scores)
    .filter(([, score]) => score < 95)
    .map(([category, score]) => `${row.width} ${category}=${score}`),
);
if (failed.length) {
  console.error("Lighthouse below 95:", failed.join(", "));
  process.exit(1);
}
