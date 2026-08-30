import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/PageHero";
import { Kicker, MarkBadge, PlusBox } from "@/components/ui/Icons";
import { pages, services, banner, site } from "@/lib/site";
import { pageSeo } from "@/lib/seo";
import { SheetStats } from "@/components/SheetMotion";

export const metadata: Metadata = pageSeo({
  title: pages.services.title,
  description: pages.services.description,
  path: "/services",
});

const TONE = ["", "night", "brand", "", "night", ""] as const;

export default function ServicesPage() {
  return (
    <main className="dyas-sheet">
      <PageHero
        breadcrumb={pages.services.breadcrumb}
        headline={pages.services.heading}
        body={pages.services.description}
      />

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site">
          <SheetStats caption="title" />
        </div>
      </section>

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site">
          <Kicker>What we ship</Kicker>
          <div className="dyas-sheet__grid dyas-sheet__grid--services mt-8">
            {services.map((service, i) => {
              const tone = TONE[i];
              const cls = tone ? `dyas-sheet-card dyas-sheet-card--${tone}` : "dyas-sheet-card";
              return (
                <article key={service.slug} className={cls} style={{ ["--i" as string]: i }}>
                  <MarkBadge name={service.icon} tone={tone === "night" || tone === "brand" ? "ground" : "night"} />
                  <p className="dyas-sheet__kicker mt-8">
                    <span className="dyas-dot" />
                    {service.ticker}
                  </p>
                  <h2 className="dyas-sheet-card__title">{service.title}</h2>
                  <p className="dyas-sheet-card__body">{service.short}</p>
                  <Link href={service.href} className="dyas-sheet-card__link">
                    Explore more
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site">
          <PlusBox>
            <div className="dyas-sheet-banner">
              <p>{banner.headline}</p>
              <Button href={site.ctaHref} variant="midnight">
                {banner.cta}
              </Button>
            </div>
          </PlusBox>
        </div>
      </section>
    </main>
  );
}
