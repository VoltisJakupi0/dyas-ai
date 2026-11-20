import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Kicker, PlusBox } from "@/components/ui/Icons";
import { pages, site } from "@/lib/site";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: pages.contact.title,
  description: pages.contact.description,
  path: "/contact-us",
});

export default function ContactPage() {
  const copy = pages.contact;
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.headline} body={copy.body} />
      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site">
          <PlusBox>
            {/* The form comes first in the markup (and on phones); from the lg
                breakpoint the map sits to its left. */}
            <div className="dyas-contact">
              <div className="dyas-contact__form">
                <Kicker>{copy.eyebrow}</Kicker>
                <h2 className="text-heading-32 mt-6">{copy.formHeadline}</h2>
                <p className="text-body-16-light mt-2 opacity-70">{copy.formBody}</p>
                <ContactForm cta={copy.formCta} />
              </div>
              <aside className="dyas-contact__side" aria-label="Where to find us">
                <div className="dyas-contact__map">
                  <iframe
                    title={`Map: ${site.address}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&z=11&output=embed`}
                  />
                </div>
                <dl className="dyas-contact__details">
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>{site.address}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </PlusBox>
        </div>
      </section>
    </main>
  );
}
