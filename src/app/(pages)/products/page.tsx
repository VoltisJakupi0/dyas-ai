import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductStory } from "@/components/sections/ProductStory";
import { pageSeo } from "@/lib/seo";
import { pages, products } from "@/lib/site";

export const metadata: Metadata = pageSeo({
  title: pages.products.title,
  description: pages.products.description,
  path: "/products",
});

export default function ProductsPage() {
  const copy = pages.products;
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.headline} body={copy.sub} />

      <section className="dyas-product-page" aria-label={products.label}>
        {products.items.map((item, index) => (
          <ProductStory key={item.id} item={item} index={index} />
        ))}
      </section>
    </main>
  );
}
