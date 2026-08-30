"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Logo } from "@/components/ui/Logo";
import { cta, footer, hrefProps, site } from "@/lib/site";
import { observeInView } from "@/lib/scroll";

const SOCIALS = [
  ["Instagram", site.social.instagram],
  ["X", site.social.x],
  ["LinkedIn", site.social.linkedin],
] as const;

function CtaHeadline({
  text,
  accent,
  className,
}: {
  text: string;
  accent: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeInView([el], () => el.classList.add("is-in"), {
      threshold: 0.2,
      rootMargin: "0px 0px -6% 0px",
    });
  }, []);

  const parts = text.split(/(\s+)/);
  let wordIndex = 0;

  return (
    <h2 ref={ref} className={className ? `dyas-line-reveal ${className}` : "dyas-line-reveal"}>
      {parts.map((part, i) => {
        if (/^\s+$/.test(part)) return <span key={i}>{part}</span>;
        const punct = part.match(/[.,!]+$/);
        const core = punct ? part.slice(0, -punct[0].length) : part;
        const delay = wordIndex++;
        const mix = core.toLowerCase() === accent.toLowerCase();
        return (
          <span
            key={i}
            className="dyas-line-reveal__word"
            style={{ "--i": delay } as CSSProperties}
          >
            {mix ? <em className="dyas-mix">{core}</em> : core}
            {punct ? punct[0] : null}
          </span>
        );
      })}
    </h2>
  );
}

export function Footer() {
  return (
    <footer className="dyas-closing">
      <div className="dyas-closing__top">
        <div className="dyas-closing__cta">
          <i className="dyas-plus dyas-plus--tl" aria-hidden="true" />
          <i className="dyas-plus dyas-plus--tr" aria-hidden="true" />
          <i className="dyas-plus dyas-plus--bl" aria-hidden="true" />
          <i className="dyas-plus dyas-plus--br" aria-hidden="true" />
          <CtaHeadline text={cta.headline} accent="Automate" className="dyas-closing__heading" />
          <p className="dyas-closing__sub">{cta.sub}</p>
          <div className="dyas-closing__actions">
            <a {...hrefProps(site.ctaHref)} className="pgp-btn pgp-btn--on-brand">
              <span className="pgp-btn__label">
                <span>{cta.button}</span>
                <span aria-hidden="true">{cta.button}</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="dyas-closing__mid">
        <nav className="dyas-closing__nav" aria-label="Footer">
          {footer.columns.map((column) => (
            <div key={column.title} className="dyas-closing__col">
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <form className="dyas-closing__form" action={`mailto:${site.email}`} method="get">
          <label htmlFor="footer-newsletter">Newsletter</label>
          <p>{footer.newsletter}</p>
          <div className="dyas-closing__field">
            <input
              id="footer-newsletter"
              name="body"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
            />
            <button type="submit">Join</button>
          </div>
          <small>{footer.privacyNote}</small>
        </form>
      </div>

      <div className="dyas-closing__bar">
        <div className="dyas-closing__socials">
          {SOCIALS.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>
        <Logo className="dyas-closing__logo" />
        <p>{footer.copyright}</p>
      </div>
    </footer>
  );
}
