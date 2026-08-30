"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { Gallery } from "@/components/Gallery";
import { work } from "@/lib/site";
import { clamp01, onScrollPaint, prefersReducedMotion, scrollProgress } from "@/lib/scroll";

export function Work() {
  const trackRef = useRef<HTMLDivElement>(null);
  const caseRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = prefersReducedMotion();
    const mobileMq = window.matchMedia("(max-width: 1024px)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const reset = () => {
      caseRefs.current.forEach((node) => {
        if (!node) return;
        node.style.opacity = mobileMq.matches ? "1" : "";
        node.style.filter = "";
        node.style.pointerEvents = "";
        const inner = node.querySelector<HTMLElement>(".dyas-case__inner");
        if (inner) inner.style.translate = "";
        const shots = node.querySelector<HTMLElement>(".dyas-gallery__row");
        if (shots) shots.style.scale = "";
      });
    };

    const n = work.cases.length;

    const tick = () => {
      if (reduced || mobileMq.matches) {
        reset();
        return;
      }
      const p = scrollProgress(track);
      const slot = p * n;
      const fade = 0.22;

      caseRefs.current.forEach((node, i) => {
        if (!node) return;
        const local = slot - i;
        let opacity = 0;
        if (i === n - 1 && local >= 0) {
          opacity = 1;
        } else if (local >= -fade && local <= 1) {
          if (local < 0) opacity = (local + fade) / fade;
          else if (local > 1 - fade) opacity = (1 - local) / fade;
          else opacity = 1;
        }
        opacity = clamp01(opacity);
        node.style.opacity = opacity.toFixed(4);
        node.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        node.style.filter =
          !coarse && opacity > 0.02 && opacity < 0.98 ? `blur(${((1 - opacity) * 4).toFixed(2)}px)` : "";

        const inner = node.querySelector<HTMLElement>(".dyas-case__inner");
        if (inner) {
          const y = local < 0 ? (1 - opacity) * 20 : local > 0 ? local * -12 : 0;
          inner.style.translate = `0 ${y.toFixed(2)}px`;
        }

        const shots = node.querySelector<HTMLElement>(".dyas-gallery__row");
        if (shots) shots.style.scale = (1 + Math.max(0, local) * 0.045).toFixed(4);
      });
    };

    const stop = onScrollPaint(tick);
    mobileMq.addEventListener("change", tick);

    return () => {
      stop();
      mobileMq.removeEventListener("change", tick);
      reset();
    };
  }, []);

  return (
    <section
      className="dyas-work"
      id="work"
      style={{ "--case-count": work.cases.length } as CSSProperties}
    >
      <h2 className="dyas-visually-hidden">{work.heading}</h2>
      <div ref={trackRef} className="dyas-work__track">
        <div className="dyas-work__pin">
          {work.cases.map((item, index) => (
            <article
              key={item.name}
              className="dyas-case"
              style={{ "--i": index } as CSSProperties}
              ref={(el) => {
                caseRefs.current[index] = el;
              }}
            >
              <div className="dyas-case__inner">
                <div className="dyas-case__head">
                  <div className="dyas-case__intro dyas-reveal is-in">
                    <h3 className="dyas-case__title">{item.name}</h3>
                    <p className="dyas-case__desc">{item.body}</p>
                    <div className="dyas-case__tags">
                      <span className="dyas-case__tag dyas-case__tag--industry">
                        <span className="dyas-dot" />
                        {item.industry}
                      </span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="dyas-case__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.stats.length > 0 ? (
                    <dl className="dyas-case__stats dyas-reveal is-in" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                      {item.stats.map((stat) => (
                        <div key={stat.label}>
                          <dt className="dyas-stat__label">{stat.label}</dt>
                          <dd className="dyas-stat__value">
                            {stat.value}
                            {"unit" in stat && stat.unit ? <span className="dyas-stat__unit">{stat.unit}</span> : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
                <Gallery label={`${item.name} – project gallery`}>
                  <div className="dyas-gallery__row">
                    {item.images.map((src, i) => (
                      <figure key={`${src}-${i}`} className="dyas-tile">
                        <Image
                          src={src}
                          alt={`${item.name} ${i + 1}`}
                          width={1536}
                          height={1024}
                          sizes="(max-width: 1024px) 80vw, 33vw"
                          quality={70}
                        />
                      </figure>
                    ))}
                  </div>
                </Gallery>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
