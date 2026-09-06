import { expect, test } from "@playwright/test";
import { products, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { demoHref } from "../src/lib/site";

const sample = [
  "/",
  "/pricing",
  "/how-it-works",
  "/menu-check",
  "/online-ordering",
  "/delivery",
  "/guest-feedback",
  "/integrations",
  "/solutions/independent-restaurants",
  "/about",
  "/contact",
  "/blog",
  "/terms",
  "/privacy",
] as const;

test("homepage first-response HTML carries the platform headline and the lifecycle", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain(copy.hero.headline);
  for (const name of ["Discover", "Order", "Fulfill", "Understand", "Bring them back"]) {
    expect(html).toContain(name);
  }
  expect(html).toContain(copy.pricing.body);
  expect(html).toContain("Coming soon");
});

test("every product and solution route returns 200 without Sabal", async ({ request }) => {
  const routes = [
    ...products.map((p) => `/${p.slug}`),
    ...solutions.map((s) => `/solutions/${s.slug}`),
  ];
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html, route).not.toMatch(/sabal/i);
  }
});

test("cut products do not exist as routes", async ({ request }) => {
  for (const route of ["/grader", "/pos", "/inventory", "/crm", "/developers", "/api-docs"]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect([301, 302, 307, 308, 404], route).toContain(response.status());
  }
});

test("menu check page carries the proof tickets", async ({ request }) => {
  const html = await (await request.get("/menu-check")).text();
  expect(html).toContain(copy.menuCheck.left.title);
  expect(html).toContain(copy.menuCheck.right.title);
  for (const dish of copy.menuCheck.right.dishes) expect(html).toContain(dish);
  expect(html).toContain(String(copy.menuCheck.right.total));
});

test("product mega-menu opens on hover, switches to Solutions, closes on Pricing", async ({
  page,
}) => {
  await page.goto("/");
  const product = page.getByRole("button", { name: "Product" });
  await product.hover();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  for (const slug of ["online-ordering", "restaurant-websites", "order-management", "multi-location"]) {
    await expect(page.locator(`header a[href="/${slug}"]`).first()).toBeVisible();
  }
  // Moving into the panel keeps it open.
  await page.locator('header a[href="/delivery"]').first().hover();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  // Hovering Solutions switches immediately.
  const solutions = page.getByRole("button", { name: "Solutions" });
  await solutions.hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  await expect(product).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator('header a[href="/solutions/quick-service"]').first()).toBeVisible();
  // Hovering Pricing closes everything.
  await page.locator('header a[href="/pricing"]').first().hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(`header a[href="${demoHref}"]`).first()).toBeVisible();
});

test("mega-menu works from the keyboard and Escape returns focus", async ({ page }) => {
  await page.goto("/");
  const product = page.getByRole("button", { name: "Product" });
  await product.focus();
  await expect(product).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator('header a[href="/online-ordering"]').first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(product).toHaveAttribute("aria-expanded", "false");
  await expect(product).toBeFocused();
  const controls = await product.getAttribute("aria-controls");
  expect(controls).toBeTruthy();
  await expect(page.locator(`[id="${controls}"]`)).toBeHidden();
});

test("center nav is centered on the viewport at 1440", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const box = await page.locator('header nav[aria-label="Primary"]').boundingBox();
  expect(box).toBeTruthy();
  const center = box!.x + box!.width / 2;
  expect(Math.abs(center - 720)).toBeLessThan(24);
});

test("the header CTA stays visible on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(`header a[href="${demoHref}"]`).first()).toBeVisible();
});

test("sample pages return 200 and never contain Sabal", async ({ request }) => {
  for (const path of sample) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).not.toMatch(/sabal/i);
  }
});

test("legal pages say coming soon", async ({ request }) => {
  for (const path of ["/terms", "/privacy"]) {
    const html = await (await request.get(path)).text();
    expect(html).toContain("coming soon");
  }
});

test("favicon and apple icon are served", async ({ request }) => {
  for (const path of ["/favicon.ico", "/apple-icon.png", "/icon.svg", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
