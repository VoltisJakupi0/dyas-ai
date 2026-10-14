import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { hrefProps, site } from "@/lib/site";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "dust" | "midnight" | "ghost";
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function Button({ href = site.ctaHref, children, variant = "dust", className, onClick }: Props) {
  const kind = variant === "ghost" ? "outline" : "primary";

  return (
    <a
      {...hrefProps(href)}
      onClick={onClick}
      className={cn("pgp-btn", kind === "primary" ? "pgp-btn--primary" : "pgp-btn--outline", className)}
    >
      <span className="pgp-btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}
