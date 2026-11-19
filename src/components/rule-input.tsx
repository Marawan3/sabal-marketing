"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type ChangeEvent,
  type CompositionEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type { InputRule } from "@/lib/input-rules";

type Rule = Pick<InputRule<unknown>, "name" | "filter" | "inputMode" | "type">;
type Box = HTMLInputElement | HTMLTextAreaElement;

/** What each box showed after its rule last ran: tells a deletion that only hit a ( ) - or space. */
const shown = new WeakMap<Box, string>();

/**
 * Runs the box's rule over what is in it now and puts the caret back where
 * it was among the characters that stayed. The box's text is only rewritten
 * when the rule changed it, so typing that the rule allows, accents and
 * other composed text included, is left alone.
 *
 * The caret: the rule run over the text before the caret gives how much of
 * the new text is before it. A letter typed into "(305) 555" leaves the caret
 * where it was; a digit typed after "(305) 5" lands after it however the
 * ( ) - and space move.
 *
 * A Backspace or Delete that only took one of the phone's ( ) - or spaces,
 * which the rule would put straight back, takes the digit beside it too, so
 * the box never seems stuck.
 */
function applyRule(box: Box, rule: Rule, inputType = "") {
  let raw = box.value;
  let at = box.selectionStart ?? raw.length;
  const before = shown.get(box);
  let next = rule.filter(raw);
  if (before !== undefined && next === before && inputType.startsWith("delete")) {
    const forward = inputType.includes("Forward");
    while (rule.filter(raw) === before && (forward ? at < raw.length : at > 0)) {
      raw = forward ? raw.slice(0, at) + raw.slice(at + 1) : raw.slice(0, at - 1) + raw.slice(at);
      if (!forward) at -= 1;
    }
    next = rule.filter(raw);
  }
  if (box.value !== next) {
    const caret = Math.min(rule.filter(raw.slice(0, at)).length, next.length);
    box.value = next;
    if (document.activeElement === box) box.setSelectionRange(caret, caret);
  }
  shown.set(box, next);
  return next;
}

/**
 * The rule's onChange, and a first run once the page's script is in, for
 * anything typed or autofilled before then. `onValue` hears each new value.
 */
function useRule<T extends Box>(rule: Rule, onValue?: (value: string) => void) {
  const ref = useRef<T>(null);
  const heard = useEffectEvent((value: string) => onValue?.(value));
  useEffect(() => {
    if (ref.current) heard(applyRule(ref.current, rule));
  }, [rule]);
  const run = (box: T, inputType?: string) => {
    // Not onValue?.(applyRule(...)): with no onValue, that would skip the rule too.
    const value = applyRule(box, rule, inputType);
    onValue?.(value);
  };
  // Mid-composition (an accent, a phone's other-language keyboard) the text is left alone, and the rule runs once it
  // ends. onValue still hears the text as it is, so a box with `value` keeps it rather than snapping back.
  const onChange = (event: ChangeEvent<T>) => {
    const input = event.nativeEvent as InputEvent;
    if (input.isComposing) onValue?.(event.currentTarget.value);
    else run(event.currentTarget, input.inputType);
  };
  const onCompositionEnd = (event: CompositionEvent<T>) => run(event.currentTarget);
  return { ref, onChange, onCompositionEnd };
}

type Shared = { rule: Rule; onValue?: (value: string) => void };

/**
 * A text box with a rule from src/lib/input-rules.ts: its type and keypad
 * come from the rule, and data-rule names it for the input guard. Works with
 * `value` (the calculator) or `defaultValue` (the contact form, read when it
 * is sent).
 */
export function RuleInput({
  rule,
  onValue,
  ...props
}: Shared & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "inputMode" | "onChange" | "onCompositionEnd">) {
  const handlers = useRule<HTMLInputElement>(rule, onValue);
  return <input {...props} {...handlers} type={rule.type ?? "text"} inputMode={rule.inputMode} data-rule={rule.name} />;
}

/** The same for a <textarea>: the contact form's message. */
export function RuleTextarea({
  rule,
  onValue,
  ...props
}: Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "onCompositionEnd">) {
  const handlers = useRule<HTMLTextAreaElement>(rule, onValue);
  return <textarea {...props} {...handlers} data-rule={rule.name} />;
}
