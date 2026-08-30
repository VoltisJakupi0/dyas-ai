import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/PageHero";
import { Kicker, MarkBadge, PlusBox } from "@/components/ui/Icons";
import { Proof } from "@/components/sections/Proof";
import { pages, site } from "@/lib/site";
import { pageSeo } from "@/lib/seo";
import { SheetStats } from "@/components/SheetMotion";

export const metadata: Metadata = pageSeo({
  title: pages.about.title,
  description: pages.about.description,
  path: "/about-us",
});

const NAME = [
  { letter: "D", word: "Do" },
  { letter: "Y", word: "Your" },
  { letter: "A", word: "AI" },
  { letter: "S", word: "Software" },
];

const BEATS = [
  { icon: "layers" as const, title: "London HQ", body: "Headquartered in London, shipping with a distributed team across Europe." },
  { icon: "bot" as const, title: "AI first", body: "Agents, chatbots, and automation sit at the core — not as a bolt-on." },
  { icon: "users" as const, title: "Last mile", body: "We put systems live in the tools you already run, so work actually leaves the week." },
];

export default function AboutPage() {
  const copy = pages.about;
  return (
    <main className="dyas-sheet">
      <PageHero breadcrumb={copy.breadcrumb} headline={copy.headline} body={copy.sub} />

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Kicker>{copy.eyebrow}</Kicker>
            {copy.paragraphs.map((p) => (
              <p key={p} className="text-body-18-light mt-6 max-w-[40rem] opacity-80">
                {p}
              </p>
            ))}
            <Button href={site.ctaHref} className="mt-10">
              Contact Us
            </Button>
          </div>
          <div className="dyas-sheet__grid">
            {BEATS.map((item, i) => (
              <article key={item.title} className="dyas-sheet-card" style={{ ["--i" as string]: i }}>
                <MarkBadge name={item.icon} />
                <h2 className="dyas-sheet-card__title">{item.title}</h2>
                <p className="dyas-sheet-card__body">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site">
          <SheetStats caption="label" />
        </div>
      </section>

      <section className="dyas-sheet__section dyas-sheet__section--flush">
        <div className="container-site">
          <PlusBox>
            <div className="px-4 py-10 sm:px-8 sm:py-14 lg:px-10">
              <Kicker>The name</Kicker>
              <h2 className="text-heading-40 mt-6 max-w-[28rem] text-pretty">{copy.nameHeadline}</h2>
              <div className="dyas-acronym mt-10">
                {NAME.map((item, i) => (
                  <div key={item.letter} style={{ ["--i" as string]: i }}>
                    <b>{item.letter}</b>
                    <em>{item.word}</em>
                  </div>
                ))}
              </div>
              <p className="text-body-18-light mt-8 max-w-[40rem] opacity-80">{copy.nameBody}</p>
              <p className="text-body-16-light mt-4 max-w-[36rem] opacity-70">{copy.nameNote}</p>
              <Button href="/services" variant="midnight" className="mt-8">
                Explore Our Services
              </Button>
            </div>
          </PlusBox>
        </div>
      </section>

      <Proof />
    </main>
  );
}
