import { defineConfig, devices, webkit } from "@playwright/test";
import { existsSync } from "node:fs";

const port = 3002;
const baseURL = `http://127.0.0.1:${port}`;

/**
 * WebKit on an iPhone profile runs the visuals' tests wherever its browser is
 * installed (npx playwright install webkit). It downloads from
 * cdn.playwright.dev and playwright.download.prss.microsoft.com; where those
 * are blocked it is left out rather than failing.
 */
const withWebKit = existsSync(webkit.executablePath());

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
      // The contact handler sends to a stand-in email API that tests/upgrade.spec.ts runs on 3998.
      env: {
        ...(process.env as Record<string, string>),
        CONTACT_EMAIL_API_KEY: "test-key",
        CONTACT_EMAIL_ENDPOINT: "http://127.0.0.1:3998/emails",
      },
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
    // The visuals again with reduced motion on, as many iPhones have it (2026-10-14).
    {
      name: "chromium-reduced-motion",
      testMatch: /visuals\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL, reducedMotion: "reduce" },
    },
    ...(withWebKit
      ? [
          {
            name: "webkit-iphone",
            testMatch: /(hero-demo|visuals|motion)\.spec\.ts/,
            use: { ...devices["iPhone 15"], viewport: { width: 393, height: 852 } },
          },
          {
            name: "webkit-iphone-reduced-motion",
            testMatch: /visuals\.spec\.ts/,
            use: { ...devices["iPhone 15"], viewport: { width: 393, height: 852 }, reducedMotion: "reduce" as const },
          },
        ]
      : []),
  ],
});
