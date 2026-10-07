import type { ReactNode } from "react";
import { SmartLink } from "./smart-link";

/** Buttons: 14px radius, at least 44px tall. */
export const buttonBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] font-medium leading-none transition-colors duration-150";

export const buttonSizes = {
  md: "min-h-12 px-6 text-body",
  sm: "min-h-11 px-4 text-small",
} as const;

/** The one action on the site. Saffron fill, ink text, everywhere. */
export function CtaLink({
  href,
  children,
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  size?: keyof typeof buttonSizes;
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={`${buttonBase} ${buttonSizes[size]} bg-saffron text-ink hover:bg-saffron-deep ${className}`}
    >
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
      className={`inline-flex min-h-11 items-center font-medium underline decoration-ink/30 underline-offset-4 transition-colors duration-150 hover:decoration-ink ${className}`}
    >
      {children}
    </SmartLink>
  );
}
