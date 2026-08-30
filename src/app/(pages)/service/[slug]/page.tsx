import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages, getServicePage } from "@/lib/services";
import { ServiceView } from "@/components/ServiceView";
import { site } from "@/lib/site";
import { absUrl, pageSeo, serializeJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};
  return pageSeo({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/service/${page.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  const serviceLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.title,
        description: page.metaDescription,
        provider: { "@id": `${site.url}/#org` },
        url: absUrl(`/service/${page.slug}`),
        areaServed: "GB",
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceLd) }} />
      <ServiceView page={page} />
    </>
  );
}
