import { defineConfig, devices } from "@playwright/test";

const port = 3002;
const baseURL = `http://127.0.0.1:${port}`;

/**
 * One production build, served on 3002. (A second, preview build used to
 * check the screenshot placeholders; the screenshots and their placeholders
 * went on 2026-10-13, so there is nothing preview-only left to test.)
 */
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
  ],
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Set PLAYWRIGHT_CHANNEL=chrome to drive installed Chrome when the
        // bundled browser download is unavailable.
        channel: process.env.PLAYWRIGHT_CHANNEL,
      },
    },
  ],
});
