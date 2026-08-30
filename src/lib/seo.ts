import type { Metadata } from "next";
import { site } from "@/lib/site";

export const SITE_UPDATED = "2026-08-29";

export function absUrl(path: string) {
  if (path === "/") return site.url;
  return `${site.url}${path}`;
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function pageSeo({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: site.name,
      title,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      email: site.email,
      description: site.description,
      image: `${site.url}/opengraph-image`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: site.email,
        contactType: "sales",
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "21:00",
        },
      },
      sameAs: [site.social.instagram, site.social.x, site.social.linkedin],
      areaServed: "GB",
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": `${site.url}/#org` },
    },
  ],
};
