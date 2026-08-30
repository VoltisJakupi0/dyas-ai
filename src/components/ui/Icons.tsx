import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const MARKS = {
  flow: (
    <>
      <rect x="3" y="3.5" width="8" height="6" rx="1" />
      <rect x="13" y="14.5" width="8" height="6" rx="1" />
      <path d="M11 6.5h3.5A2.5 2.5 0 0 1 17 9v5.5" />
    </>
  ),
  bot: (
    <>
      <rect x="3.5" y="8" width="17" height="11.5" rx="2.5" />
      <path d="M12 3.5V8M8.5 13.5h.01M15.5 13.5h.01M12 16h.01" />
    </>
  ),
  chat: <path d="M4 5h16v10.5H9.5L4 20z" />,
  device: (
    <>
      <rect x="2" y="4.5" width="13.5" height="10" rx="1" />
      <path d="M5.5 18h6.5" />
      <rect x="17" y="8.5" width="5" height="11" rx="1" />
    </>
  ),
  cart: (
    <>
      <path d="M2.5 4h2.2l2.4 10.5h11" />
      <path d="M6.2 6.8H21.5l-1.8 6.2H7.6" />
      <circle cx="9.5" cy="19" r="1.5" />
      <circle cx="17.5" cy="19" r="1.5" />
    </>
  ),
  pen: (
    <>
      <path d="M4 20.5l1-4.2L16.8 4.5l3.2 3.2L8.2 19.5z" />
      <path d="M14.8 6.5l3.2 3.2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16.2 14.2c2.4.4 4.3 2 4.8 4.8" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.2l2.6 2.6L16.2 9.4" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5l1.4 6.1L19.5 11 13.4 13.4 12 20.5l-1.4-7.1L4.5 11l6.1-1.4z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.4l3.4 2.2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 4l8.5 4.5L12 13 3.5 8.5z" />
      <path d="M4 12.5L12 17l8-4.5" />
      <path d="M4 16.2L12 20.5l8-4.3" />
    </>
  ),
} as const;

export type MarkName = keyof typeof MARKS;

export function Mark({ name, className }: { name: MarkName; className?: string }) {
  return (
    <svg className={cn("dyas-mark", className)} viewBox="0 0 24 24" aria-hidden="true">
      {MARKS[name]}
    </svg>
  );
}

export function MarkBadge({ name, tone = "night" }: { name: MarkName; tone?: "night" | "brand" | "ground" }) {
  return (
    <span className={cn("dyas-mark-badge", tone !== "night" && `dyas-mark-badge--${tone}`)}>
      <Mark name={name} />
    </span>
  );
}

export function PlusBox({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("dyas-plusbox", className)}>
      <i className="dyas-plus dyas-plus--tl" aria-hidden="true" />
      <i className="dyas-plus dyas-plus--tr" aria-hidden="true" />
      <i className="dyas-plus dyas-plus--bl" aria-hidden="true" />
      <i className="dyas-plus dyas-plus--br" aria-hidden="true" />
      {children}
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="dyas-sheet__kicker">
      <span className="dyas-dot" />
      {children}
    </p>
  );
}
