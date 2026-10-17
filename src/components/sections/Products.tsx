import Image from "next/image";
import Link from "next/link";
import { RaftMedia } from "@/components/sections/RaftMedia";
import { products } from "@/lib/site";

export function Products() {
  return (
    <section className="dyas-products" id="products" aria-labelledby="dyas-products-label">
      <div className="dyas-products__head">
        <p id="dyas-products-label" className="dyas-products__label">
          {products.label}
        </p>
        <h2 className="dyas-products__headline">{products.headline}</h2>
        <p className="dyas-products__sub">{products.sub}</p>
      </div>

      <div className="dyas-products__list">
        {products.items.map((item, index) => {
          const dark = item.tone === "dark";
          return (
            <article
              key={item.id}
              className={[
                "dyas-products__panel",
                `is-${item.id}`,
                dark ? "is-dark" : "is-light",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="dyas-products__copy">
                <div className="dyas-products__brand">
                  {item.id === "folet" ? (
                    <img
                      src={item.logo}
                      alt={item.logoAlt}
                      className="dyas-products__logo"
                      width={120}
                      height={32}
                    />
                  ) : (
                    <h3 className="dyas-products__wordmark">{item.name}</h3>
                  )}
                </div>
                {item.id === "folet" ? <h3 className="dyas-visually-hidden">{item.name}</h3> : null}
                <p className="dyas-products__tagline">{item.tagline}</p>
                <p className="dyas-products__pitch">{item.pitch}</p>
                {item.stats?.length ? (
                  <dl className="dyas-products__stats">
                    {item.stats.map((stat) => (
                      <div key={stat.label} className="dyas-products__stat">
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                <div className="dyas-products__chips">
                  {item.chips.map((chip) => (
                    <span key={chip} className="dyas-products__chip">
                      {chip}
                    </span>
                  ))}
                </div>
                <Link href={item.exploreHref} className="pgp-btn pgp-btn--primary dyas-products__cta">
                  <span className="pgp-btn__label">
                    <span>Explore</span>
                    <span aria-hidden="true">Explore</span>
                  </span>
                </Link>
              </div>

              {item.id === "raft" ? (
                <div className="dyas-products__media dyas-products__media--raft">
                  <RaftMedia />
                </div>
              ) : (
                <div className="dyas-products__media">
                  <Image
                    src={item.image}
                    alt={item.id === "folet" ? "Villa featured on Folet’s nature stays marketplace" : "Raft AI shelf monitoring preview"}
                    width={960}
                    height={1200}
                    className="dyas-products__img"
                    sizes="(max-width: 900px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
