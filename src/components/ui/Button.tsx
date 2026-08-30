import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hrefProps, site } from "@/lib/site";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "dust" | "midnight" | "ghost";
  className?: string;
};

export function Button({ href = site.ctaHref, children, variant = "dust", className }: Props) {
  const kind = variant === "ghost" ? "outline" : "primary";

  return (
    <a {...hrefProps(href)} className={cn("pgp-btn", kind === "primary" ? "pgp-btn--primary" : "pgp-btn--outline", className)}>
      <span className="pgp-btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}
