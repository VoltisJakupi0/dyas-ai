import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
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
    <main>
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.headline} body={copy.body} />
      <section className="bg-white py-18 text-black md:py-28">
        <div className="container-site grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-mono-s uppercase opacity-50">{copy.eyebrow}</p>
            <ul className="mt-8 space-y-4 text-body-18-light">
              <li>
                Contact: <a className="underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>Address: {site.address}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-heading-32">{copy.formHeadline}</h2>
            <p className="text-body-16-light mt-3 opacity-70">{copy.formBody}</p>
            <ContactForm cta={copy.formCta} />
          </div>
        </div>
        <div className="container-site mt-16">
          <iframe
            title="London, United Kingdom"
            className="h-[22rem] w-full border border-stroke-1"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=London%2C%20United%20Kingdom&z=11&output=embed"
          />
        </div>
      </section>
    </main>
  );
}
