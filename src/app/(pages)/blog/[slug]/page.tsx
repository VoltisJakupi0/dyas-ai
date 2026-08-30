import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { pages, site } from "@/lib/site";
import { absUrl, pageSeo, serializeJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return pages.blog.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = pages.blog.posts.find((item) => item.slug === slug);
  if (!post) return {};
  return pageSeo({
    title: `${post.title} | ${site.name}`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = pages.blog.posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": `${site.url}/#org` },
    mainEntityOfPage: absUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
  };
  return (
    <main className="dyas-sheet">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleLd) }} />
      <PageHero breadcrumb={[...pages.blog.breadcrumb, post.title]} headline={post.title} body={post.excerpt} />
      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site max-w-[46rem]">
          <p className="dyas-sheet__kicker">
            <span className="dyas-dot" />
            {post.date}
          </p>
          {post.tags.length ? (
            <p className="dyas-sheet__kicker mt-3">
              <span className="dyas-dot" />
              {post.tags.join(" · ")}
            </p>
          ) : null}
          <p className="text-body-18-light mt-8 opacity-80">{post.excerpt}</p>
        </div>
      </section>
    </main>
  );
}
