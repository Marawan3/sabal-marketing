import { defineConfig, devices } from "@playwright/test";

const port = 3002;
const baseURL = `http://127.0.0.1:${port}`;

/**
 * A second build, as a Vercel preview deployment would make it
 * (VERCEL_ENV=preview), in its own folder so it can't overwrite the
 * production build in .next. tests/preview-*.spec.ts run against it.
 */
const previewPort = 3003;
const previewURL = `http://127.0.0.1:${previewPort}`;
const previewDist = ".next-preview";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  use: { baseURL, trace: "off" },
  webServer: [
    {
      command: `npm run start -- --port ${port}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `NEXT_DIST_DIR=${previewDist} VERCEL_ENV=preview npx next build && NEXT_DIST_DIR=${previewDist} npx next start --port ${previewPort}`,
      url: previewURL,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      testIgnore: /preview-.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        // Set PLAYWRIGHT_CHANNEL=chrome to drive installed Chrome when the
        // bundled browser download is unavailable.
        channel: process.env.PLAYWRIGHT_CHANNEL,
      },
    },
    {
      name: "preview",
      testMatch: /preview-.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: previewURL,
        channel: process.env.PLAYWRIGHT_CHANNEL,
      },
    },
  ],
});
