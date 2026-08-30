import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { BracketFrame } from "@/components/ui/Frames";
import { site } from "@/lib/site";

export function PageHero({
  breadcrumb,
  headline,
  body,
  ctaLabel,
  ctaHref,
}: {
  breadcrumb: string[];
  headline: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-day pt-10 pb-14 text-black md:pt-14 md:pb-18">
      <div className="container-site">
        <p className="dyas-sheet__kicker">
          <span className="dyas-dot" />
          {breadcrumb.join(" / ")}
        </p>
        <BracketFrame className="mt-8" tick="stroke-3">
          <div className="max-w-[42rem] px-3 py-8 sm:px-6 lg:px-8">
            <h1 className="text-heading-56 text-pretty dyas-reveal">{headline}</h1>
            {body ? (
              <div className="dyas-reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                <p className="text-body-18-light mt-4 max-w-[36rem] opacity-80">{body}</p>
              </div>
            ) : null}
            {ctaLabel ? (
              <div className="mt-8 dyas-reveal" style={{ "--reveal-delay": "220ms" } as CSSProperties}>
                <Button href={ctaHref ?? site.ctaHref}>{ctaLabel}</Button>
              </div>
            ) : null}
          </div>
        </BracketFrame>
      </div>
    </section>
  );
}
