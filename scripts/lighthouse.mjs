import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const url = process.argv[2] ?? "http://127.0.0.1:3001";
const outDir = process.argv[3] ?? "/opt/cursor/artifacts/lighthouse";
mkdirSync(outDir, { recursive: true });

const widths = [
  {
    name: "390",
    extra: [
      "--form-factor=mobile",
      "--screenEmulation.mobile=true",
      "--screenEmulation.width=390",
      "--screenEmulation.height=844",
      "--screenEmulation.deviceScaleFactor=2",
    ],
  },
  {
    name: "1440",
    extra: [
      "--preset=desktop",
      "--screenEmulation.width=1440",
      "--screenEmulation.height=900",
      "--screenEmulation.deviceScaleFactor=1",
      "--screenEmulation.mobile=false",
    ],
  },
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
    ...preset.extra,
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
