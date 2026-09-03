import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Kicker, MarkBadge, PlusBox } from "@/components/ui/Icons";
import { pages } from "@/lib/site";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: pages.career.title,
  description: pages.career.description,
  path: "/career",
});

export default function CareerPage() {
  const copy = pages.career;
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.heading} body={copy.description} />
      <section className="dyas-sheet__section dyas-sheet__section--flush dyas-sheet__section--end">
        <div className="container-site grid gap-12 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="dyas-sheet__grid">
            {copy.jobs.length ? (
              copy.jobs.map((job) => (
                <article key={job.slug} className="dyas-sheet-card">
                  <MarkBadge name="pen" />
                  <p className="dyas-sheet__kicker">
                    <span className="dyas-dot" />
                    Open role
                  </p>
                  <h2 className="dyas-sheet-card__title">{job.title}</h2>
                  <p className="dyas-sheet-card__body">{job.body}</p>
                  <Link href={`/career/${job.slug}`} className="dyas-sheet-card__link">
                    Read more
                  </Link>
                </article>
              ))
            ) : (
              <article className="dyas-sheet-card">
                <MarkBadge name="pen" />
                <p className="dyas-sheet__kicker">
                  <span className="dyas-dot" />
                  Open roles
                </p>
                <h2 className="dyas-sheet-card__title">Nothing listed</h2>
                <p className="dyas-sheet-card__body">{copy.empty}</p>
                <Link href="/contact-us" className="dyas-sheet-card__link">
                  Contact us
                </Link>
              </article>
            )}
          </div>
          <aside>
            <PlusBox>
              <div className="dyas-sheet-card">
                <Kicker>From the journal</Kicker>
                <ul className="mt-8 space-y-6">
                  {pages.blog.posts.map((post) => (
                    <li key={post.slug}>
                      <Link href={`/blog/${post.slug}`} className="text-body-16-light hover:underline">
                        {post.title}
                      </Link>
                      <p className="dyas-sheet__kicker mt-2">
                        <span className="dyas-dot" />
                        {post.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </PlusBox>
          </aside>
        </div>
      </section>
    </main>
  );
}
