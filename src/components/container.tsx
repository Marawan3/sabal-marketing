import type { ReactNode } from "react";

/** 1120px column. Side gutters: 16px on phones, 32px from 640px, 48px from 1024px. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1120px] px-4 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
