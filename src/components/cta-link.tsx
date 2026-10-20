import type { ReactNode } from "react";
import { SmartLink } from "./smart-link";

/** Buttons and inputs: 12px radius, at least 44px tall. */
export const buttonBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] font-medium leading-none transition-colors duration-150";

export const buttonSizes = {
  md: "min-h-12 px-6 text-body",
  sm: "min-h-11 px-4 text-small",
} as const;

/**
 * The one action on the site. Saffron fill and ink text, except on the
 * saffron band, where it turns navy with white text so it still reads (navy
 * is the one dark, owner 2026-10-20).
 */
export function CtaLink({
  href,
  children,
  size = "md",
  className = "",
  onSaffron = false,
}: {
  href: string;
  children: ReactNode;
  size?: keyof typeof buttonSizes;
  className?: string;
  onSaffron?: boolean;
}) {
  const fill = onSaffron ? "bg-navy text-paper hover:bg-navy-deep" : "bg-saffron text-ink hover:bg-saffron-deep";
  return (
    <SmartLink href={href} className={`${buttonBase} ${buttonSizes[size]} ${fill} ${className}`}>
      {children}
    </SmartLink>
  );
}

/** Secondary action: a plain underlined link, never a ghost button. 44px tap height. */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={`inline-flex min-h-11 items-center font-medium underline decoration-ink-muted underline-offset-4 transition-colors duration-150 hover:decoration-ink ${className}`}
    >
      {children}
    </SmartLink>
  );
}
