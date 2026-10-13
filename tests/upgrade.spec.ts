import { expect, test } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { builtProducts, bySlug, productHref, solutionHref, solutions } from "../src/lib/catalog";
import { copy } from "../src/lib/copy";
import { contactEmailText, readContact } from "../src/lib/contact";
import { companyLinks, legalNav } from "../src/lib/site";
import { OWNER, publishedFounder } from "../src/lib/founder";
import { customerStories, storiesFor } from "../src/lib/stories";
import { yearlyRange } from "../src/components/savings-calculator";

/**
 * The competitive upgrade (owner, 2026-10-13): two greys and a warm band, the
 * hero's trust line and $0 card, the savings calculator, the product-page
 * template, the new pages, the navigation, the proof slots and the final band.
 */

const solutionPaths = solutions.map((s) => solutionHref(s.slug));
const productPaths = builtProducts.map((slug) => `/${slug}`);
const allPages = ["/", "/how-it-works", "/pricing", ...productPaths, ...solutionPaths, "/about", "/contact"];

test("two greys: ink and ink-muted, a warm band, and no framework greys left in the CSS", async ({ page }) => {
  const read = (file: string) => readFileSync(join(process.cwd(), file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const globals = read("src/app/globals.css");
  expect(globals).toContain("--ink: #1d1d1b;");
  expect(globals).toMatch(/--ink-muted: #6e6e6d;/);
  expect(globals).toContain("--warm: #faf7f2;");
  // Tailwind's zinc, gray, stone and neutral greys, and the old near-blacks.
  const framework =
    /#(fafafa|f4f4f5|e4e4e7|d4d4d8|a1a1aa|71717a|52525b|3f3f46|27272a|18181b|09090b|f9fafb|f3f4f6|e5e7eb|d1d5db|9ca3af|6b7280|4b5563|374151|1f2937|111827|f5f5f4|e7e5e4|78716c|57534e|f5f5f5|e5e5e5|a3a3a3|737373|525252|404040|262626|171717|111111|0b0b0c|646b78|767676|202124|4d5156|70757a|dfe1e5|ebebeb)\b/i;
  for (const file of ["src/app/globals.css", "src/components/hero-order-demo.module.css", "src/components/visuals/visuals.module.css"]) {
    expect(read(file).match(framework)?.[0], file).toBeUndefined();
  }
  // No Tailwind grey utilities and no ink opacities in the components.
  const { execSync } = await import("node:child_process");
  const hits = execSync("grep -rhoE '(text|bg|border|fill|stroke)-(gray|zinc|slate|stone|neutral)-[0-9]+|(text|border|bg)-ink/[0-9]+' src || true", { encoding: "utf8" }).trim();
  expect(hits).toBe("");
  // Warm on at most two sections a page; ink-muted text on paper or warm, never on saffron.
  for (const path of allPages) {
    await page.goto(path);
    const warm = await page.locator("main > section").evaluateAll((els) => els.filter((el) => getComputedStyle(el).backgroundColor === "rgb(250, 247, 242)").length);
    expect(warm, path).toBeLessThanOrEqual(2);
  }
});

test("hero: the trust line above the headline, and the $0 card under the name field", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#top");
  const trust = hero.getByText(copy.hero.trust);
  await expect(trust).toBeVisible();
  expect(copy.hero.trust).toBe("$0 for the restaurant · No lock-in · Your customers, your data");
  // Each fact stays on one line: "No lock-in" never breaks at its hyphen.
  const whole = await trust.locator(".whitespace-nowrap").allTextContents();
  expect(whole).toEqual(["$0 for the restaurant ·", "No lock-in ·", "Your customers, your data"]);
  // A saffron dot, then the text.
  const dot = await trust.locator("span[aria-hidden]").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(dot).toBe("rgb(244, 168, 58)");
  const card = hero.getByText(copy.hero.price.lead).locator("..");
  await expect(card).toHaveText(`${copy.hero.price.lead} ${copy.hero.price.rest}`);
  expect(`${copy.hero.price.lead} ${copy.hero.price.rest}`).toBe("$0/month for the restaurant. Customers pay 5% at checkout.");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const y = async (loc: ReturnType<typeof page.locator>) => (await loc.boundingBox())!.y;
    expect(await y(trust)).toBeLessThan(await y(hero.locator("h1")));
    expect(await y(hero.getByLabel(copy.hero.inputLabel))).toBeLessThan(await y(card));
  }
  // The full pricing section stays lower down.
  await expect(page.locator("#pricing")).toContainText(copy.pricing.stat);
});

test("calculator: between products and how it works; empty until both numbers are in, then the 15–30% range", async ({ page }) => {
  expect(yearlyRange(100, 30)).toEqual([23_400, 46_800]);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
    expect(ids.indexOf("savings")).toBe(ids.indexOf("products") + 1);
    expect(ids.indexOf("how-it-works")).toBe(ids.indexOf("savings") + 1);
    const calc = page.locator("#savings [data-calculator]");
    const orders = calc.getByLabel(copy.savings.orders);
    const value = calc.getByLabel(copy.savings.value);
    // No pre-filled averages.
    await expect(orders).toHaveValue("");
    await expect(value).toHaveValue("");
    await expect(calc.locator("[data-result]")).toHaveText(copy.savings.empty);
    await orders.fill("100");
    await expect(calc.locator("[data-result]")).toHaveText(copy.savings.empty);
    await value.fill("30");
    await expect(calc.locator("[data-result]")).toHaveText("Between $23,400 and $46,800");
    await value.fill("$28.50");
    await expect(calc.locator("[data-result]")).toHaveText("Between $22,230 and $44,460");
    await expect(calc).toContainText(copy.savings.assumption);
    expect(copy.savings.assumption).toBe("Third-party apps charge 15–30% commission; we charge the restaurant $0.");
    const box = (await calc.boundingBox())!;
    expect(box.x + box.width, `fits at ${width}`).toBeLessThanOrEqual(width);
  }
  // Real text, no library: the calculator is this repo's own component.
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  expect(Object.keys(pkg.dependencies).sort()).toEqual(["next", "react", "react-dom"]);
});

test("product pages: hero visual, how it works, what's included in two columns, works with, FAQ, call to action", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of builtProducts) {
      await page.goto(`/${slug}`);
      const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
      expect(ids, slug).toEqual(["", "how", "included", "works-with", "faq", "cta"]);
      // A built visual in the hero (except /integrations, whose one visual is its steps) and in how it works.
      const heroVisuals = await page.locator("main > section").first().locator("[data-demo]").count();
      expect(heroVisuals, slug).toBe(slug === "integrations" ? 0 : 1);
      expect(await page.locator("#how [data-demo]").count(), slug).toBeGreaterThanOrEqual(1);
      const steps = bySlug[slug].flow!.steps;
      expect(steps.length, slug).toBeGreaterThanOrEqual(3);
      expect(steps.length, slug).toBeLessThanOrEqual(6);
      for (const step of steps) await expect(page.locator("#how"), slug).toContainText(step);
      // Two columns from 640px.
      const cols = await page.locator("#included ul").first().evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
      expect(cols, slug).toBe(width >= 640 ? 2 : 1);
    }
  }
});

test("proof slots: every product page reads the stories list and renders nothing while it is empty", async ({ request }) => {
  expect(customerStories).toEqual([]);
  const story = { restaurant: "R", owner: "O", result: "X", products: ["delivery"] };
  expect(storiesFor("delivery", [story])).toEqual([story]);
  expect(storiesFor("catering", [story])).toEqual([]);
  for (const path of [...productPaths, ...solutionPaths, "/"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).not.toContain('id="proof"');
    expect(html, path).not.toContain('id="stories"');
    expect(html, path).not.toContain(copy.stories.heading);
  }
});

test("/integrations: payment and delivery live, the POS line, no names, one built visual", async ({ page }) => {
  await page.goto("/integrations");
  const included = page.locator("#included");
  await expect(included).toContainText("Payments: live.");
  await expect(included).toContainText("Delivery: live.");
  await expect(included).toContainText("POS: connects to your POS where supported; if not, a kitchen printer");
  expect(await page.locator("main [data-demo]").count()).toBe(1);
  await expect(page.locator('main [data-visual="flow-integrations"]')).toBeVisible();
  expect(await page.locator("main img").count()).toBe(0);
});

test("solution pages: four product pages each, with their own one line", async ({ page }) => {
  for (const solution of solutions) {
    await page.goto(solutionHref(solution.slug));
    await expect(page.locator("h1")).toHaveText(solution.headline);
    expect(solution.picks).toHaveLength(4);
    for (const slug of solution.picks) {
      expect(productHref(slug), slug).not.toBeNull();
      const link = page.locator(`#included a[href="/${slug}"]`);
      await expect(link).toHaveText(bySlug[slug].name);
      await expect(link.locator("..")).toContainText(bySlug[slug].blurb);
    }
    const faq = page.locator("#faq summary");
    expect(await faq.allTextContents()).toEqual(solution.faq);
    expect(await page.locator("main [data-demo], main [aria-label='One organization running several locations']").count()).toBeGreaterThanOrEqual(1);
  }
});

test("/about: the beliefs, who it's for, and the hello@ address; the founder waits for the owner", async ({ page }) => {
  const response = await page.goto("/about");
  expect(response!.status()).toBe(200);
  expect(response!.url()).toMatch(/\/about$/);
  await expect(page.locator("#beliefs")).toContainText(copy.beliefs.heading);
  await expect(page.locator("#beliefs h3")).toHaveCount(3);
  // The founder section renders nothing while src/lib/founder.ts holds [OWNER].
  expect(publishedFounder()).toBeNull();
  await expect(page.locator("#founder")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(OWNER);
  const filled = { name: "A Founder", photo: "/about/founder.webp", photoWidth: 640, photoHeight: 800, sentences: ["One.", "Two.", "Three.", "Four."] as [string, string, string, string] };
  expect(publishedFounder(filled)).toEqual(filled);
  expect(publishedFounder({ ...filled, sentences: ["One.", "Two.", "Three.", OWNER] })).toBeNull();
  expect(publishedFounder({ ...filled, photo: OWNER })).toBeNull();
  for (const s of solutions) await expect(page.locator(`#for a[href="${solutionHref(s.slug)}"]`)).toBeVisible();
  await expect(page.locator('main a[href="mailto:hello@wuntab.com"]')).toBeVisible();
});

test.describe("contact", () => {
  test.describe.configure({ mode: "serial" });
  let server: Server;
  const received: Record<string, unknown>[] = [];
  test.beforeAll(async () => {
    server = createServer((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        received.push({ auth: req.headers.authorization, url: req.url, ...JSON.parse(body) });
        res.writeHead(200, { "Content-Type": "application/json" }).end('{"id":"test"}');
      });
    });
    await new Promise<void>((resolve) => server.listen(3998, "127.0.0.1", resolve));
  });
  test.afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  test("the form emails hello@ and says when we reply", async ({ page }) => {
    for (const width of [390, 1440]) {
      received.length = 0;
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/contact");
      const f = copy.contact.fields;
      await page.getByLabel(f.name).fill("Test Owner");
      await page.getByLabel(f.restaurant).fill("Test Kitchen");
      await page.getByLabel(f.phone).fill("(305) 555-0100");
      await page.getByLabel(f.email).fill("owner@example.com");
      await page.getByLabel(f.message).fill("This is a test message from the contact form test.");
      await page.getByRole("button", { name: copy.contact.send }).click();
      await expect(page.locator("[data-sent]")).toHaveText(copy.contact.sent);
      await expect(page.locator("[data-sent]")).toContainText("We reply within one business day");
      expect(received).toHaveLength(1);
      expect(received[0]).toMatchObject({
        auth: "Bearer test-key",
        url: "/emails",
        to: ["hello@wuntab.com"],
        reply_to: "owner@example.com",
        subject: "Website message: Test Owner, Test Kitchen",
      });
      expect(received[0].text).toContain("Restaurant: Test Kitchen");
      expect(received[0].text).toContain("Phone: (305) 555-0100");
    }
  });

  test("the handler refuses bad input, other sites and bots, and sends nothing", async ({ request }) => {
    received.length = 0;
    const ok = { name: "A", restaurant: "B", phone: "", email: "a@b.co", message: "Hi" };
    expect((await request.post("/api/contact", { data: { ...ok, email: "not-an-email" } })).status()).toBe(400);
    expect((await request.post("/api/contact", { data: { ...ok, message: "" } })).status()).toBe(400);
    expect((await request.post("/api/contact", { data: { ...ok, message: "x".repeat(4001) } })).status()).toBe(400);
    expect((await request.post("/api/contact", { data: ok, headers: { origin: "https://elsewhere.example" } })).status()).toBe(403);
    expect((await request.post("/api/contact", { data: { ...ok, website: "spam" } })).status()).toBe(200);
    expect(received).toHaveLength(0);
    expect((await request.get("/api/contact")).status()).toBe(405);
  });

  test("the message is checked and written as plain text", () => {
    const r = readContact({ name: " A ", restaurant: "B", email: "a@b.co", message: "Hi", phone: "" });
    expect(r).toEqual({ ok: true, message: { name: "A", restaurant: "B", phone: "", email: "a@b.co", message: "Hi" } });
    expect(readContact({ name: "A" })).toEqual({ ok: false, field: "restaurant" });
    if (r.ok) expect(contactEmailText(r.message)).toContain("Phone: (not given)");
  });
});

test("final band: the line under the button and Or send a message; the footer links too", async ({ page }) => {
  for (const path of ["/", "/delivery", "/integrations", solutionPaths[0]]) {
    await page.goto(path);
    const cta = page.locator("#cta");
    await expect(cta).toContainText(copy.finalCta.after);
    expect(copy.finalCta.after).toBe("20-minute call. We show WunTab on your own menu. No pressure.");
    // The line sits under the button.
    const button = (await cta.getByRole("link", { name: copy.cta.primary }).boundingBox())!;
    const line = (await cta.getByText(copy.finalCta.after).boundingBox())!;
    expect(line.y).toBeGreaterThan(button.y + button.height - 1);
    await expect(cta.getByRole("link", { name: copy.finalCta.message })).toHaveAttribute("href", "/contact");
    await expect(page.locator("footer").getByRole("link", { name: copy.finalCta.message })).toHaveAttribute("href", "/contact");
    // Get Started still books a call.
    expect(await cta.getByRole("link", { name: copy.cta.primary }).getAttribute("href")).not.toBe("/contact");
  }
});

test("navigation: Product, Solutions, How it works, Pricing, Company; the footer's four columns", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.locator('header nav[aria-label="Primary"]');
  const labels = (await nav.locator(":scope > div > button, :scope > div > div > button, :scope > div > a").allTextContents()).map((t) => t.trim());
  expect(labels).toEqual(["Product", "Solutions", "How it works", "Pricing", "Company"]);
  await nav.getByRole("button", { name: "Solutions" }).hover();
  for (const s of solutions) await expect(nav.locator(`a[href="${solutionHref(s.slug)}"]`)).toBeVisible();
  await nav.getByRole("button", { name: "Company" }).hover();
  for (const l of companyLinks) await expect(nav.locator(`a[href="${l.href}"]`)).toBeVisible();
  const footer = page.locator("footer");
  const titles = await footer.locator("p.font-medium").allTextContents();
  expect(titles).toEqual(["Product", "Solutions", "Company", "Legal"]);
  for (const href of [...productPaths, ...solutionPaths, ...companyLinks.map((l) => l.href), ...legalNav.map((l) => l.href)]) {
    await expect(footer.locator(`a[href="${href}"]`).first()).toBeAttached();
  }
  // Phones: Solutions and Company sit in the menu as accordions.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("header summary", { hasText: "Menu" }).click();
  await page.locator("header summary", { hasText: "Solutions" }).click();
  await expect(page.locator(`header nav[aria-label="Mobile"] a[href="${solutionPaths[0]}"]`)).toBeVisible();
  await page.locator("header summary", { hasText: "Company" }).click();
  await expect(page.locator('header nav[aria-label="Mobile"] a[href="/contact"]')).toBeVisible();
});
