/**
 * Every input's type rule (owner, 2026-11-18). The box keeps only what the
 * rule allows as people type, paste or autofill, and the server checks again
 * with the same rule, so the two cannot drift. No imports: the forms, the
 * handler (src/app/api/contact/route.ts) and the tests all read this file.
 *
 * A rule has three parts:
 * - filter(raw): what a keystroke, paste or autofill leaves in the box;
 * - parse(raw): the stored value, or null when the text isn't one;
 * - format(value): how a stored value shows.
 *
 * Never type="number": it lets "e", "-" and "." through, and drops the box's
 * text in some browsers when it can't read it. Number boxes are text boxes
 * with a numeric keypad (inputMode) and one of these rules.
 */
export type InputRule<T> = {
  /** Written on the box as data-rule, so the input guard (tests/inputs.spec.ts) can see it. */
  name: string;
  filter(raw: string): string;
  parse(raw: string): T | null;
  format(value: T): string;
  /** The keypad on phones. */
  inputMode?: "numeric" | "decimal";
  /** The box's type; "text" unless the rule says otherwise. */
  type?: "tel";
};

/**
 * The digits of a US phone number: a leading 1 is the country code (no US
 * area code starts with 1), and the number is the 10 after it.
 */
const phoneDigits = (raw: string) => raw.replace(/\D/g, "").replace(/^1+/, "");

/** 10 digits or fewer, shown as much of (305) 555-0123 as has been typed. */
function showPhone(digits: string) {
  const [area, exchange, line] = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)];
  if (!digits) return "";
  if (!exchange) return `(${area}`;
  if (!line) return `(${area}) ${exchange}`;
  return `(${area}) ${exchange}-${line}`;
}

/**
 * A US phone number: digits only, at most 10. A pasted "+1 (305) 555-0123"
 * or "13055550123" is the same 10 digits. Stored as the 10 digits, shown as
 * (305) 555-0123. The server refuses anything with a letter in it, and
 * anything that isn't exactly 10 digits after the country code.
 */
export const usPhone: InputRule<string> = {
  name: "us-phone",
  type: "tel",
  inputMode: "numeric",
  filter: (raw) => showPhone(phoneDigits(raw).slice(0, 10)),
  parse(raw) {
    if (/[^\d\s().+-]/.test(raw)) return null;
    const digits = phoneDigits(raw);
    return digits.length === 10 ? digits : null;
  },
  format: (digits) => showPhone(digits),
};

/** A whole number from min to max: digits only, never more digits than max has. */
export function wholeNumber({ min, max }: { min: number; max: number }): InputRule<number> & { min: number; max: number } {
  const digits = String(max).length;
  return {
    name: "whole-number",
    inputMode: "numeric",
    min,
    max,
    filter: (raw) => raw.replace(/\D/g, "").slice(0, digits),
    parse(raw) {
      const text = raw.trim();
      if (!/^\d+$/.test(text)) return null;
      const n = Number(text);
      return n >= min && n <= max ? n : null;
    },
    format: (n) => String(n),
  };
}

/**
 * A dollar amount from min to max: digits and one decimal point, at most two
 * digits after it, and never more whole dollars' digits than max has. No
 * "$", commas, minus signs or "e" in the box (the "$" is drawn beside it).
 */
export function dollarAmount({ min, max }: { min: number; max: number }): InputRule<number> & { min: number; max: number } {
  const whole = String(Math.floor(max)).length;
  return {
    name: "dollar-amount",
    inputMode: "decimal",
    min,
    max,
    filter(raw) {
      const kept = raw.replace(/[^\d.]/g, "");
      const dot = kept.indexOf(".");
      if (dot < 0) return kept.slice(0, whole);
      const cents = kept.slice(dot + 1).replace(/\./g, "").slice(0, 2);
      return `${kept.slice(0, dot).slice(0, whole)}.${cents}`;
    },
    parse(raw) {
      const text = raw.trim();
      if (!/^(\d+\.?\d{0,2}|\.\d{1,2})$/.test(text)) return null;
      const n = Number(text);
      return n >= min && n <= max ? n : null;
    },
    format: (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2)),
  };
}

/**
 * Text of at most `max` characters with control characters taken out. On
 * one line, a pasted line break or tab becomes a space; in a message (multiline)
 * a line break stays, as "\n". parse also trims, and refuses text that is
 * still longer than max.
 */
export function boundedText({ max, multiline = false }: { max: number; multiline?: boolean }): InputRule<string> & { max: number } {
  const controls = multiline ? /[\u0000-\u0009\u000b-\u001f\u007f-\u009f]/g : /[\u0000-\u001f\u007f-\u009f]/g;
  const clean = (raw: string) =>
    (multiline ? raw.replace(/\r\n?/g, "\n") : raw.replace(/\r\n?|\n/g, " ")).replace(/\t/g, " ").replace(controls, "");
  return {
    name: multiline ? "message-text" : "text",
    max,
    filter: (raw) => clean(raw).slice(0, max),
    parse(raw) {
      const text = clean(raw).trim();
      return text.length <= max ? text : null;
    },
    format: (text) => text,
  };
}
