import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/PageHero";
import { pages, site } from "@/lib/site";
import { absUrl, pageSeo, serializeJsonLd, SITE_UPDATED } from "@/lib/seo";

export function generateStaticParams() {
  return pages.career.jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = pages.career.jobs.find((item) => item.slug === slug);
  if (!job) return {};
  return pageSeo({
    title: `${job.title} | ${site.name}`,
    description: job.body.length > 160 ? `${job.body.slice(0, 157).trimEnd()}…` : job.body,
    path: `/career/${job.slug}`,
  });
}

export default async function CareerJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = pages.career.jobs.find((item) => item.slug === slug);
  if (!job) notFound();
  const jobLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.body,
    datePosted: SITE_UPDATED,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
    },
    url: absUrl(`/career/${job.slug}`),
  };
  return (
    <main className="dyas-sheet">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jobLd) }} />
      <PageHero breadcrumb={[...pages.career.breadcrumb, job.title]} headline={job.title} />
      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site max-w-[46rem]">
          <p className="text-body-18-light opacity-80">{job.body}</p>
          <Button href={site.ctaHref} className="mt-10">
            Contact Us
          </Button>
        </div>
      </section>
    </main>
  );
}
