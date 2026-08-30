import { Button } from "@/components/ui/Button";
import { site, services } from "@/lib/site";
import type { ServicePage } from "@/lib/services";
import { PageHero } from "@/components/PageHero";
import { FaqList } from "@/components/FaqList";
import { Pillars } from "@/components/Pillars";
import { Kicker, MarkBadge, PlusBox, type MarkName } from "@/components/ui/Icons";

export function ServiceView({ page }: { page: ServicePage }) {
  const icon = (services.find((item) => item.slug === page.slug)?.icon ?? "flow") as MarkName;

  return (
    <main className="dyas-sheet">
      <PageHero
        breadcrumb={page.breadcrumb}
        headline={page.heroHeadline}
        body={page.heroBody}
        ctaLabel={site.ctaLabel}
        ctaHref={site.ctaHref}
      />

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Kicker>{page.title}</Kicker>
            <h2 className="text-heading-40 mt-6 max-w-[36rem] text-pretty">{page.sectionHeadline}</h2>
            {page.body.map((p) => (
              <p key={p} className="text-body-18-light mt-6 max-w-[40rem] opacity-80">
                {p}
              </p>
            ))}
          </div>
          <PlusBox>
            <div className="dyas-sheet-card h-full">
              <MarkBadge name={icon} />
              <p className="dyas-sheet__kicker mt-8">
                <span className="dyas-dot" />
                In scope
              </p>
              {page.approachTitle && page.approach ? (
                <ul className="mt-8 space-y-3">
                  {page.approach.map((item) => (
                    <li key={item} className="dyas-sheet-check">
                      <span className="dyas-dot" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dyas-sheet-card__body">Built around your stack, your rules, and a number you already track.</p>
              )}
            </div>
          </PlusBox>
        </div>
      </section>

      {page.offerTitle && page.offers ? (
        <section className="dyas-sheet__section dyas-sheet__section--flush">
          <div className="container-site">
            <Kicker>{page.offerTitle}</Kicker>
            <div className="dyas-sheet__grid dyas-sheet__grid--cards mt-8">
              {page.offers.map((offer, i) => (
                <article key={offer.title} className="dyas-sheet-card" style={{ ["--i" as string]: i }}>
                  <MarkBadge name={icon} />
                  <h3 className="dyas-sheet-card__title">{offer.title}</h3>
                  <p className="dyas-sheet-card__body">{offer.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FaqList kicker={page.faqKicker} sub={page.faqSub} items={page.faqs} name={`faq-${page.slug}`} />

      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site">
          <PlusBox>
            <div className="dyas-sheet-banner">
              <p>{page.faqCta}</p>
              <Button href={site.ctaHref} variant="midnight">
                {site.ctaLabel}
              </Button>
            </div>
          </PlusBox>
        </div>
      </section>

      <Pillars headline={page.bannerHeadline} sub={page.bannerSub} items={page.pillars} />
    </main>
  );
}
