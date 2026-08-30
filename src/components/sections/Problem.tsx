import type { CSSProperties } from "react";
import { problem } from "@/lib/site";

const TONE = {
  white: { card: "dyas-offer-card--white", btn: "pgp-btn--primary", rot: "0deg" },
  black: { card: "dyas-offer-card--black", btn: "pgp-btn--invert", rot: "-8deg" },
  brand: { card: "dyas-offer-card--brand", btn: "pgp-btn--on-brand", rot: "8deg" },
};

export function Problem() {
  return (
    <section className="dyas-offer" id="growth">
      <div className="dyas-offer__inner">
        <header className="dyas-offer__head dyas-reveal">
          <h2 className="dyas-offer__heading">{problem.headline}</h2>
          <p className="dyas-offer__sub">{problem.body}</p>
        </header>

        <div className="dyas-offer__cards">
          {problem.cards.map((card) => {
            const tone = TONE[card.tone];
            return (
              <article
                key={card.title}
                className={`dyas-offer-card ${tone.card}`}
                style={{ "--rot": tone.rot } as CSSProperties}
              >
                <p className="dyas-offer-card__eyebrow">
                  <span className="dyas-dot" />
                  {card.eyebrow}
                </p>
                <h3 className="dyas-offer-card__title">{card.title}</h3>
                <p className="dyas-offer-card__desc">{card.body}</p>
                <ul className="dyas-list">
                  {card.points.map((point) => (
                    <li key={point}>
                      <span className="dyas-dot" />
                      {point}
                    </li>
                  ))}
                </ul>
                <a href={card.ctaHref} className={`pgp-btn ${tone.btn}`}>
                  <span className="pgp-btn__label">
                    <span>{card.cta}</span>
                    <span aria-hidden="true">{card.cta}</span>
                  </span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
