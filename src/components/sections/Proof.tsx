"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import { testimonials } from "@/lib/site";

const items = testimonials.items;
const TOTAL = items.length;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {dir === "prev" ? (
        <path d="M10.5 3.5 5.5 8l5 4.5" stroke="currentColor" strokeWidth="1.4" />
      ) : (
        <path d="M5.5 3.5 10.5 8l-5 4.5" stroke="currentColor" strokeWidth="1.4" />
      )}
    </svg>
  );
}

export function Proof() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 5200,
        playOnInit: true,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        stopOnFocusIn: false,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      containScroll: false,
      skipSnaps: false,
    },
    [autoplay],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const plugin = emblaApi.plugins()?.autoplay;
      if (!plugin) return;
      if (mq.matches) plugin.stop();
      else plugin.play();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="dyas-proof" id="proof">
      <div className="dyas-proof__head">
        <div className="dyas-proof__head-inner">
          <i className="dyas-plus dyas-plus--bl" aria-hidden="true" />
          <i className="dyas-plus dyas-plus--br" aria-hidden="true" />
          <h2 className="dyas-proof__heading dyas-reveal">{testimonials.wallHeadline}</h2>
          <div className="dyas-proof__nav">
            <button type="button" onClick={prev} aria-label="Previous testimonial">
              <Arrow dir="prev" />
            </button>
            <button type="button" onClick={next} aria-label="Next testimonial">
              <Arrow dir="next" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="dyas-proof__viewport"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
      >
        <div className="dyas-proof__container">
          {items.map((item, i) => (
            <article
              key={item.name}
              className="dyas-proof__slide"
              aria-hidden={i === selected ? undefined : true}
            >
              <figure className="dyas-quote">
                <p className="dyas-quote__count">
                  {pad(i + 1)} / {pad(TOTAL)}
                </p>
                <blockquote className="dyas-quote__text">{`“${item.quote}”`}</blockquote>
                <figcaption className="dyas-quote__person">
                  <b>{item.name}</b>
                  <em>
                    {item.role}, {item.company}
                  </em>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>

      <p className="dyas-visually-hidden" role="status" aria-live="polite">
        {items[selected]?.name}
      </p>
    </section>
  );
}
