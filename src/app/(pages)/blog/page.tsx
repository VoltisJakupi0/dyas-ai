import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { MarkBadge } from "@/components/ui/Icons";
import { pages } from "@/lib/site";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: pages.blog.title,
  description: pages.blog.description,
  path: "/blog",
});

export default function BlogPage() {
  const copy = pages.blog;
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.heading} body={copy.description} />
      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site">
          <div className="dyas-sheet__grid dyas-sheet__grid--cards">
            {copy.posts.map((post) => (
              <article key={post.slug} className="dyas-sheet-card">
                <MarkBadge name="spark" />
                <p className="dyas-sheet__kicker">
                  <span className="dyas-dot" />
                  {post.date}
                </p>
                <h2 className="dyas-sheet-card__title">{post.title}</h2>
                <p className="dyas-sheet-card__body">{post.excerpt}</p>
                {post.tags.length ? (
                  <p className="dyas-sheet__kicker mt-4">
                    <span className="dyas-dot" />
                    {post.tags.join(" · ")}
                  </p>
                ) : null}
                <Link href={`/blog/${post.slug}`} className="dyas-sheet-card__link">
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
