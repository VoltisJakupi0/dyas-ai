import type { CSSProperties } from "react";
import { logos } from "@/lib/site";

export function Logos() {
  return (
    <div className="dyas-logos dyas-hero-area__logos dyas-reveal" style={{ "--reveal-delay": "240ms" } as CSSProperties}>
      <p className="dyas-logos__label">{logos.label}</p>
      <div className="dyas-logos__track">
        {logos.items.map((item) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={120}
            height={20}
            decoding="async"
            loading="lazy"
            style={{ "--logo-s": item.scale } as CSSProperties}
          />
        ))}
        {logos.items.map((item) => (
          <img
            key={`${item.src}-dup`}
            className="is-dup"
            src={item.src}
            alt=""
            width={120}
            height={20}
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            aria-hidden="true"
            style={{ "--logo-s": item.scale } as CSSProperties}
          />
        ))}
        {logos.items.map((item) => (
          <img
            key={`${item.src}-dup2`}
            className="is-dup"
            src={item.src}
            alt=""
            width={120}
            height={20}
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            aria-hidden="true"
            style={{ "--logo-s": item.scale } as CSSProperties}
          />
        ))}
        {logos.items.map((item) => (
          <img
            key={`${item.src}-dup3`}
            className="is-dup"
            src={item.src}
            alt=""
            width={120}
            height={20}
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            aria-hidden="true"
            style={{ "--logo-s": item.scale } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
