import { expect, test, type Locator, type Page } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { copy } from "../src/lib/copy";
import { contactLimits, readContact } from "../src/lib/contact";
import { demoHrefWithName } from "../src/lib/demo-href";
import { boundedText, dollarAmount, usPhone, wholeNumber } from "../src/lib/input-rules";
import { allRoutes } from "../src/lib/site";
import { yearlyRange } from "../src/components/savings-calculator";

/**
 * Every input is type-validated (owner, 2026-11-18): the box keeps only what
 * its rule allows as people type or paste, and the server checks again with
 * the same rule (src/lib/input-rules.ts). WebKit on an iPhone profile runs
 * this file on every pull request, as Chromium does locally.
 */

const f = copy.contact.fields;

test("the rules: what a keystroke or paste leaves, and what the server keeps", () => {
  // US phone: digits only, at most 10, a leading 1 is the country code.
  expect(usPhone.filter("abc305555012399")).toBe("(305) 555-0123");
  expect(usPhone.filter("+1 (305) 555-0123")).toBe("(305) 555-0123");
  expect(usPhone.filter("13055550123")).toBe("(305) 555-0123");
  expect(usPhone.filter("abc")).toBe("");
  expect(["3", "30", "305", "3055", "305555", "3055550"].map(usPhone.filter)).toEqual(["(3", "(30", "(305", "(305) 5", "(305) 555", "(305) 555-0"]);
  expect(usPhone.parse("3055550123")).toBe("3055550123");
  expect(usPhone.parse("(305) 555-0123")).toBe("3055550123");
  expect(usPhone.parse("+1 (305) 555-0123")).toBe("3055550123");
  expect(usPhone.parse("13055550123")).toBe("3055550123");
  for (const bad of ["abc1234567", "305555012", "30555501234", "305-555-0123 ext 4", "(305) 555-012", "1305555012", ""]) expect(usPhone.parse(bad), bad).toBeNull();
  expect(usPhone.format("3055550123")).toBe("(305) 555-0123");

  // Orders a week: whole, 0 to 9,999.
  const orders = wholeNumber({ min: 0, max: 9999 });
  expect(orders.filter("6a0.5e")).toBe("605");
  expect(orders.filter("-12e3")).toBe("123");
  expect(orders.filter("123456789012")).toBe("1234");
  expect(orders.filter("1,250")).toBe("1250");
  expect(orders.parse("60")).toBe(60);
  for (const bad of ["60.5", "123456789012", "10000", "-1", "1e3", "", "six"]) expect(orders.parse(bad), bad).toBeNull();

  // Average order: up to two decimals, $0 to $999.99.
  const value = dollarAmount({ min: 0, max: 999.99 });
  expect(value.filter("30.999")).toBe("30.99");
  expect(value.filter("$28.50")).toBe("28.50");
  expect(value.filter("1.2.3")).toBe("1.23");
  expect(value.filter("-5e2")).toBe("52");
  expect(value.filter("1000")).toBe("100");
  expect(value.parse("999.99")).toBe(999.99);
  expect(value.parse("30.")).toBe(30);
  expect(value.parse(".5")).toBe(0.5);
  for (const bad of ["1000", "30.999", "$30", "1.2.3", "-5", "1e2", "", "."]) expect(value.parse(bad), bad).toBeNull();

  // Bounded text: control characters out; on one line a line break or tab is a space.
  const name = boundedText({ max: 10 });
  expect(name.filter("Palm\u0000\u0007 &\tStone")).toBe("Palm & Sto");
  expect(name.filter("Palm\r\nStone")).toBe("Palm Stone");
  expect(name.parse("  Palm\u0007  ")).toBe("Palm");
  expect(name.parse("x".repeat(11))).toBeNull();
  const message = boundedText({ max: 20, multiline: true });
  expect(message.parse("Hi\r\nthere\u0000\tfriend")).toBe("Hi\nthere friend");
});

test("the contact handler's check: 10 US digits or no phone, control characters out", () => {
  const ok = { name: "A", restaurant: "B", email: "a@b.co", message: "Hi" };
  const phone = (value: string) => readContact({ ...ok, phone: value });
  expect(phone("")).toMatchObject({ ok: true, message: { phone: "" } });
  for (const good of ["3055550123", "(305) 555-0123", "+1 (305) 555-0123", "13055550123", "305.555.0123"]) {
    expect(phone(good), good).toMatchObject({ ok: true, message: { phone: "(305) 555-0123" } });
  }
  for (const bad of ["abc1234567", "305555012", "30555501234", "305-555-0123 ext 4", "1".repeat(41)]) expect(phone(bad), bad).toEqual({ ok: false, field: "phone" });
  expect(readContact({ ...ok, phone: "", name: "Te\u0007st\u0000 Owner" })).toMatchObject({ ok: true, message: { name: "Test Owner" } });
  expect(readContact({ ...ok, phone: "", restaurant: "Palm\t& Stone\r\n" })).toMatchObject({ ok: true, message: { restaurant: "Palm & Stone" } });
  expect(readContact({ ...ok, phone: "", message: "Line one\r\nLine two\u0000" })).toMatchObject({ ok: true, message: { message: "Line one\nLine two" } });
  // A name of nothing but control characters is an empty name.
  expect(readContact({ ...ok, phone: "", name: "\u0007\u0000" })).toEqual({ ok: false, field: "name" });
  // The limits still hold, counted after the control characters come out.
  expect(readContact({ ...ok, phone: "", name: "x".repeat(contactLimits.name.max + 1) })).toEqual({ ok: false, field: "name" });
  expect(readContact({ ...ok, phone: "", name: `${"x".repeat(contactLimits.name.max)}\u0007` })).toMatchObject({ ok: true });
});

test("the hero's name goes into the link without control characters, 80 at most", () => {
  expect(demoHrefWithName("/contact?intent=call", "Palm\u0000\u0007 & Stone\n")).toBe("/contact?intent=call&restaurant=Palm+%26+Stone");
  const long = new URL(demoHrefWithName("/contact?intent=call", "x".repeat(200)), "https://x.test").searchParams.get("restaurant");
  expect(long).toBe("x".repeat(80));
  expect(demoHrefWithName("/contact?intent=call", "\u0007\u0000")).toBe("/contact?intent=call");
});

/** A source file with its comments blanked out, line numbers kept. */
const withoutComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " ")).replace(/^\s*\/\/.*$/gm, "");

/** Every intrinsic <input> and <textarea> tag in a .tsx source's code, with its line. */
function formTags(code: string) {
  const tags: { text: string; line: number }[] = [];
  for (const match of code.matchAll(/<(input|textarea)\b/g)) {
    let depth = 0;
    let quote = "";
    let i = match.index + match[0].length;
    for (; i < code.length; i++) {
      const c = code[i];
      if (quote) {
        if (c === quote) quote = "";
      } else if (c === '"' || c === "'" || c === "`") quote = c;
      else if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth === 0) break;
    }
    tags.push({ text: code.slice(match.index, i + 1), line: code.slice(0, match.index).split("\n").length });
  }
  return tags;
}

/** The only boxes without a length or a rule, exempt by name: the hidden call-or-message flag, and the bot trap. */
const EXEMPT_NAMES = ["intent", "website"];
const EXEMPT_SOURCE = [/\bname="intent"/, /\bname=\{contactTrap\}/];

test("guard: every <input> and <textarea> in src/ has a maxLength or a shared rule, and none is type=number", () => {
  const src = join(process.cwd(), "src");
  const files = (readdirSync(src, { recursive: true }) as string[]).filter((file) => /\.(tsx|ts)$/.test(file)).map((file) => join(src, file));
  const missing: string[] = [];
  let seen = 0;
  for (const file of files) {
    const code = withoutComments(readFileSync(file, "utf8"));
    const where = relative(process.cwd(), file);
    if (/type=\{?["'`]number["'`]/.test(code)) missing.push(`${where}: type="number"`);
    if (!file.endsWith(".tsx")) continue;
    for (const tag of formTags(code)) {
      seen++;
      if (EXEMPT_SOURCE.some((name) => name.test(tag.text))) continue;
      if (/\bmaxLength=/.test(tag.text) || /\bdata-rule=/.test(tag.text)) continue;
      missing.push(`${where}:${tag.line} ${tag.text.replace(/\s+/g, " ").slice(0, 80)}`);
    }
  }
  expect(seen, "the guard found the forms' boxes").toBeGreaterThanOrEqual(5);
  expect(missing).toEqual([]);
});

test("guard: on every page, each box has a maxLength or a rule, and none is type=number", async ({ page }) => {
  test.setTimeout(120_000);
  const pages = [...new Set([...allRoutes, "/contact", "/contact?intent=call", "/this-page-does-not-exist"])];
  let boxes = 0;
  for (const path of pages) {
    await page.goto(path);
    const found = await page.evaluate((exempt) => {
      const all = [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")];
      return {
        count: all.length,
        bad: all
          .filter((el) => !exempt.includes(el.name))
          .filter((el) => el.type === "number" || (!el.hasAttribute("maxlength") && !el.hasAttribute("data-rule")))
          .map((el) => `${el.tagName.toLowerCase()} name="${el.name}" type="${el.type}"`),
      };
    }, EXEMPT_NAMES);
    boxes += found.count;
    expect(found.bad, path).toEqual([]);
  }
  expect(boxes).toBeGreaterThan(0);
});

const caret = (box: Locator) => box.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd]);
const putCaret = (box: Locator, at: number) =>
  box.evaluate((el: HTMLInputElement, i) => {
    el.focus();
    el.setSelectionRange(i, i);
  }, at);

/**
 * A paste: the real clipboard and Ctrl/Cmd+V where the browser lets the test
 * write the clipboard, else Playwright's insertText, which puts the whole
 * text in with one input event, as a paste does. Says which ran.
 */
async function paste(page: Page, box: Locator, text: string) {
  await box.focus();
  const wrote = await page
    .evaluate((t) => navigator.clipboard.writeText(t).then(() => true), text)
    .catch(() => false);
  if (wrote) {
    await page.keyboard.press("ControlOrMeta+V");
    if (await box.inputValue()) return "clipboard";
  }
  await page.keyboard.insertText(text);
  return "insertText";
}

/**
 * /contact's form is drawn in the browser once the page's script has read the
 * address (useSearchParams): React takes away the placeholder form the server
 * sent and draws its own. Anything typed into the placeholder goes with it, an
 * older issue raised separately on PR #69, so the tests type into React's form.
 * In WebKit, typing straight after the page loaded landed in the placeholder.
 */
async function openContact(page: Page) {
  await page.goto("/contact");
  await page.waitForFunction(() => {
    const box = document.querySelector('input[name="phone"]');
    return !!box && Object.keys(box).some((key) => key.startsWith("__reactProps"));
  });
}

test.describe("phone box on /contact", () => {
  test.beforeEach(async ({ page, context, browserName }) => {
    if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openContact(page);
  });

  test("typing keeps 10 digits and shows (305) 555-0123; letters alone leave it empty", async ({ page }) => {
    const phone = page.getByLabel(f.phone);
    await expect(phone).toHaveAttribute("type", "tel");
    await expect(phone).toHaveAttribute("inputmode", "numeric");
    await expect(phone).toHaveAttribute("autocomplete", "tel");
    await expect(phone).toHaveAttribute("maxlength", String(contactLimits.phone.max));
    await phone.pressSequentially("abc305555012399");
    await expect(phone).toHaveValue("(305) 555-0123");
    await phone.fill("");
    await phone.pressSequentially("abcdef");
    await expect(phone).toHaveValue("");
    await phone.pressSequentially("1305");
    await expect(phone).toHaveValue("(305");
  });

  test("pasting +1 (305) 555-0123 or 13055550123 shows (305) 555-0123", async ({ page }) => {
    const phone = page.getByLabel(f.phone);
    for (const text of ["+1 (305) 555-0123", "13055550123"]) {
      await phone.fill("");
      const how = await paste(page, phone, text);
      test.info().annotations.push({ type: "paste", description: `${text}: ${how}` });
      console.log(`paste ${JSON.stringify(text)} via ${how}`);
      await expect(phone, text).toHaveValue("(305) 555-0123");
    }
  });

  test("the caret stays put: typing and deleting in the middle, and over the ( ) - and space", async ({ page }) => {
    const phone = page.getByLabel(f.phone);
    await phone.pressSequentially("3055550123");
    await expect(phone).toHaveValue("(305) 555-0123");
    // After "(305) 55": Backspace takes the 5 before the caret, and the caret stays after "(305) 5".
    await putCaret(phone, 8);
    await page.keyboard.press("Backspace");
    await expect(phone).toHaveValue("(305) 550-123");
    expect(await caret(phone)).toEqual([7, 7]);
    // A digit typed there goes in there.
    await page.keyboard.type("9");
    await expect(phone).toHaveValue("(305) 595-0123");
    expect(await caret(phone)).toEqual([8, 8]);
    // Backspace just after "(305) " takes the digit before the ")" and space, not just the space.
    await putCaret(phone, 6);
    await page.keyboard.press("Backspace");
    await expect(phone).toHaveValue("(305) 950-123");
    expect(await caret(phone)).toEqual([3, 3]);
    // Delete just before the "-" takes the digit after it.
    await phone.fill("");
    await phone.pressSequentially("3055550123");
    await putCaret(phone, 9);
    await page.keyboard.press("Delete");
    await expect(phone).toHaveValue("(305) 555-123");
    expect(await caret(phone)).toEqual([9, 9]);
    // A letter typed in the middle changes nothing, and the caret doesn't move.
    await putCaret(phone, 4);
    await page.keyboard.type("x");
    await expect(phone).toHaveValue("(305) 555-123");
    expect(await caret(phone)).toEqual([4, 4]);
  });

  test("left incomplete, it says so under the box; whole or empty, it doesn't; it holds the message back", async ({ page }) => {
    const phone = page.getByLabel(f.phone);
    const error = page.locator("[data-phone-error]");
    await phone.pressSequentially("305555");
    await expect(error).toHaveCount(0);
    await page.getByLabel(f.email).click();
    await expect(error).toHaveText(copy.contact.phoneIncomplete);
    expect(copy.contact.phoneIncomplete).toBe("Enter all 10 digits");
    await expect(phone).toHaveAttribute("aria-invalid", "true");
    const errorId = await error.getAttribute("id");
    expect(errorId).toBeTruthy();
    await expect(phone).toHaveAttribute("aria-describedby", errorId!);
    await expect(phone).toHaveAccessibleDescription(copy.contact.phoneIncomplete);
    // The line sits under the box, inside the phone's column.
    const [p, e] = [(await phone.boundingBox())!, (await error.boundingBox())!];
    expect(e.y).toBeGreaterThanOrEqual(p.y + p.height);
    expect(e.x).toBeGreaterThanOrEqual(p.x - 1);
    // Whole: the line goes.
    await putCaret(phone, "(305) 555".length);
    await page.keyboard.type("0123");
    await expect(phone).toHaveValue("(305) 555-0123");
    await expect(error).toHaveCount(0);
    await expect(phone).not.toHaveAttribute("aria-invalid");
    await expect(phone).not.toHaveAttribute("aria-describedby");
    // Empty is fine: the phone is optional.
    await phone.fill("");
    await page.getByLabel(f.email).click();
    await expect(error).toHaveCount(0);
    // Sending with a part number: nothing is posted, the line shows and the box has focus.
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/contact")) posts.push(r.url());
    });
    await page.getByLabel(f.name).fill("Test Owner");
    await page.getByLabel(f.restaurant).fill("Test Kitchen");
    await page.getByLabel(f.email).fill("owner@example.com");
    await page.getByLabel(f.message).fill("This is a test message.");
    await phone.pressSequentially("305");
    await page.getByRole("button", { name: copy.contact.send }).click();
    await expect(error).toHaveText(copy.contact.phoneIncomplete);
    await expect(phone).toBeFocused();
    expect(posts).toEqual([]);
  });

  test("name, restaurant and message carry their maxLength; control characters don't stay", async ({ page }) => {
    for (const name of ["name", "restaurant", "email", "message"] as const) {
      await expect(page.getByLabel(f[name]), name).toHaveAttribute("maxlength", String(contactLimits[name].max));
    }
    const restaurant = page.getByLabel(f.restaurant);
    await restaurant.fill("Palm\u0007 &\tStone");
    await expect(restaurant).toHaveValue("Palm & Stone");
  });
});

test.describe("savings calculator", () => {
  test("orders a week: whole, digits only, 4 at most; average order: two decimals, $999.99 at most", async ({ page }) => {
    await page.goto("/");
    const calc = page.locator("#savings [data-calculator]");
    const orders = calc.getByLabel(copy.savings.orders);
    const value = calc.getByLabel(copy.savings.value);
    await expect(orders).toHaveAttribute("inputmode", "numeric");
    await expect(value).toHaveAttribute("inputmode", "decimal");
    for (const box of [orders, value]) await expect(box).toHaveAttribute("type", "text");
    // The owner's example still opens the calculator.
    await expect(orders).toHaveValue(String(copy.savings.example.orders));
    await expect(value).toHaveValue(String(copy.savings.example.value));

    await orders.fill("");
    await orders.pressSequentially("6a0.5e");
    await expect(orders).toHaveValue("605");
    await orders.fill("");
    await orders.pressSequentially("-12345");
    await expect(orders).toHaveValue("1234");

    await value.fill("");
    await value.pressSequentially("30.999");
    await expect(value).toHaveValue("30.99");
    await value.fill("");
    await value.pressSequentially("-1e2.5.5");
    await expect(value).toHaveValue("12.55");
    await value.fill("");
    await value.pressSequentially("1000");
    await expect(value).toHaveValue("100");

    // The result follows what the boxes hold.
    await orders.fill("");
    await orders.pressSequentially("6a0.5e");
    await value.fill("");
    await value.pressSequentially("30.999");
    const [low, high] = yearlyRange(605, 30.99).map((n) => `$${n.toLocaleString("en-US")}`);
    await expect(calc.locator("[data-result]")).toHaveText(`Between ${low} and ${high}`);
  });
});

test("the hero's box: 80 characters at most, and control characters stay out of the link", async ({ page }) => {
  await page.goto("/");
  const box = page.getByLabel(copy.hero.inputLabel);
  await expect(box).toHaveAttribute("maxlength", "80");
  await box.fill("Palm\u0007 &\tStone");
  await expect(box).toHaveValue("Palm & Stone");
  await page.locator("#top form").getByRole("button", { name: copy.cta.primary }).click();
  await page.waitForURL(/\/contact\?/);
  expect(new URL(page.url()).searchParams.get("restaurant")).toBe("Palm & Stone");
});
