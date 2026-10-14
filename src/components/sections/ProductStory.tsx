import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { RaftMedia } from "@/components/sections/RaftMedia";
import { products } from "@/lib/site";

type Item = (typeof products.items)[number];

export function ProductStory({ item, index = 0 }: { item: Item; index?: number }) {
  const dark = item.tone === "dark";
  const flip = index % 2 === 1;

  return (
    <article
      id={item.id}
      className={[
        "dyas-product-story",
        `is-${item.id}`,
        dark ? "is-dark" : "is-light",
        flip ? "is-flip" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="dyas-product-story__inner">
        <div className="dyas-product-story__copy">
          <div className="dyas-product-story__brand">
            {item.id === "folet" ? (
              <img src={item.logo} alt={item.logoAlt} className="dyas-product-story__logo" width={140} height={36} />
            ) : (
              <span className="dyas-product-story__wordmark">{item.name}</span>
            )}
          </div>
          <p className="dyas-product-story__tagline">{item.tagline}</p>
          <p className="dyas-product-story__body">{item.body}</p>

          {item.stats?.length ? (
            <dl className="dyas-product-story__stats">
              {item.stats.map((stat) => (
                <div key={stat.label} className="dyas-product-story__stat">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {item.highlights?.length ? (
            <div className="dyas-product-story__highlights">
              {item.highlights.map((h) => (
                <div key={h.title} className="dyas-product-story__highlight">
                  <h3>{h.title}</h3>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="dyas-product-story__list">
            {item.capabilities.map((cap) => (
              <li key={cap}>
                <span className="dyas-dot" />
                {cap}
              </li>
            ))}
          </ul>
          <div className="dyas-product-story__cta">
            <Button href={item.ctaHref} className={dark ? "pgp-btn--invert" : undefined}>
              {item.cta}
            </Button>
          </div>
        </div>

        <div className="dyas-product-story__media">
          {item.id === "raft" ? (
            <RaftMedia priority={index === 0} />
          ) : (
            <div className="dyas-product-story__hero">
              <Image
                src={item.image}
                alt=""
                width={1200}
                height={1500}
                className="dyas-product-story__hero-img"
                sizes="(max-width: 900px) 100vw, 48vw"
                priority={index === 0}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
