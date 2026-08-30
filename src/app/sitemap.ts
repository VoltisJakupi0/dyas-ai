import type { MetadataRoute } from "next";
import { routes } from "@/lib/site";
import { SITE_UPDATED, absUrl } from "@/lib/seo";

function priority(path: string) {
  if (path === "/") return 1;
  if (path === "/services" || path === "/contact-us" || path === "/about-us") return 0.9;
  if (path.startsWith("/service/")) return 0.8;
  if (path === "/pricing-plans") return 0.7;
  if (path === "/blog" || path.startsWith("/blog/")) return 0.6;
  return 0.5;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(`${SITE_UPDATED}T00:00:00.000Z`);
  return routes.map((path) => ({
    url: absUrl(path),
    lastModified,
    changeFrequency: path === "/" || path.startsWith("/blog") ? "weekly" : "monthly",
    priority: priority(path),
  }));
}
