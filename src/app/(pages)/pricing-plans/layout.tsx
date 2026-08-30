import type { Metadata } from "next";
import { pages } from "@/lib/site";
import { pageSeo, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: pages.pricing.title,
  description: pages.pricing.description,
  path: "/pricing-plans",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pages.pricing.faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />
      {children}
    </>
  );
}
