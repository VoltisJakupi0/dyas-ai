import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/FaqList";
import { PageHero } from "@/components/PageHero";
import { Kicker, MarkBadge, PlusBox } from "@/components/ui/Icons";
import { hrefProps, pages, site } from "@/lib/site";
import { cn } from "@/lib/cn";

const PLAN_MARK = ["layers", "check", "spark"] as const;
const PLAN_TONE = ["", "brand", "night"] as const;

export default function PricingPage() {
  const copy = pages.pricing;

  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.heading} body={copy.description} />

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site">
          <Kicker>Pick a shape, not a SKU</Kicker>

          <div className="dyas-sheet__grid dyas-sheet__grid--plans mt-10">
            {copy.plans.map((plan, i) => {
              const tone = PLAN_TONE[i];
              const cls = tone ? `dyas-sheet-card dyas-sheet-card--${tone}` : "dyas-sheet-card";
              return (
                <article key={plan.name} className={cls} style={{ ["--i" as string]: i }}>
                  <MarkBadge
                    name={PLAN_MARK[i]}
                    tone={tone === "night" || tone === "brand" ? "ground" : "night"}
                  />
                  <h2 className="dyas-sheet-card__title">{plan.name}</h2>
                  <p className="dyas-sheet-card__body">{plan.body}</p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="dyas-sheet-check">
                        <span className="dyas-dot" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <a
                      {...hrefProps(site.ctaHref)}
                      className={cn(
                        "pgp-btn",
                        tone === "night"
                          ? "pgp-btn--invert"
                          : tone === "brand"
                            ? "pgp-btn--on-brand"
                            : "pgp-btn--primary",
                      )}
                    >
                      <span className="pgp-btn__label">
                        <span>{plan.cta}</span>
                        <span aria-hidden="true">{plan.cta}</span>
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="text-body-16-light mt-8 max-w-[36rem] opacity-70">{copy.note}</p>
        </div>
      </section>

      <FaqList kicker={copy.faqKicker} sub={copy.faqSub} items={copy.faqs} name="pricing-faq" />

      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site">
          <PlusBox>
            <div className="dyas-sheet-banner">
              <p>Not sure which plan? Book a call and we map it with you.</p>
              <Button href={site.ctaHref} variant="midnight">
                Schedule a Call
              </Button>
            </div>
          </PlusBox>
        </div>
      </section>
    </main>
  );
}
