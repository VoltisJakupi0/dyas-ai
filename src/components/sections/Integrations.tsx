import type { CSSProperties } from "react";
import { integrations } from "@/lib/site";

function MixedLine({
  text,
  accent,
  className,
}: {
  text: string;
  accent: string;
  className?: string;
}) {
  const at = text.toLowerCase().indexOf(accent.toLowerCase());
  if (at < 0) return <h2 className={className}>{text}</h2>;
  return (
    <h2 className={className}>
      {text.slice(0, at)}
      <em className="dyas-mix">{text.slice(at, at + accent.length)}</em>
      {text.slice(at + accent.length)}
    </h2>
  );
}

export function Integrations() {
  return (
    <section className="dyas-wire" id="integrations">
      <div className="dyas-wire__inner">
        <div className="dyas-wire__grid">
          <header className="dyas-wire__copy dyas-reveal">
            <MixedLine text={integrations.headline} accent="models" className="dyas-wire__heading" />
            <p className="dyas-wire__sub">{integrations.sub}</p>
            <p className="dyas-wire__stat">
              <strong>
                {integrations.stat.value}
                {integrations.stat.suffix}
              </strong>
              <span>{integrations.stat.label}</span>
            </p>
          </header>

          <div
            className="dyas-wire__panel dyas-reveal"
            style={{ "--reveal-delay": "120ms" } as CSSProperties}
          >
            <i className="dyas-plus dyas-plus--tl" aria-hidden="true" />
            <i className="dyas-plus dyas-plus--tr" aria-hidden="true" />
            <i className="dyas-plus dyas-plus--bl" aria-hidden="true" />
            <i className="dyas-plus dyas-plus--br" aria-hidden="true" />
            <ul className="dyas-wire__rows">
              {integrations.categories.map((category) => (
                <li key={category.label} className="dyas-wire-row">
                  <div className="dyas-wire-row__lead">
                    <h3 className="dyas-wire-row__name">{category.label}</h3>
                    <p className="dyas-wire-row__count">{String(category.logos.length).padStart(2, "0")}</p>
                  </div>
                  <p className="dyas-wire-row__desc">{category.body}</p>
                  <ul className="dyas-wire-row__logos">
                    {category.logos.map((logo) => (
                      <li key={logo.alt} className="dyas-wire-chip">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.src} alt={logo.alt} loading="lazy" draggable={false} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
