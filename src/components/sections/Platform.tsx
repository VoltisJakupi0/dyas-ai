"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BracketFrame, CornerFrame } from "@/components/ui/Frames";
import { PlatformStack } from "@/components/sections/PlatformStack";
import { banner, platform, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { onScrollPaint, prefersReducedMotion, scrollProgress } from "@/lib/scroll";

const SLIDES = platform.slides;
const COUNT = SLIDES.length;
const EASE = "cubic-bezier(0.76,0,0.24,1)";
/** Share of a slide's scroll slot the scroll must pass before the slide flips. */
const EDGE = 0.06;

function FeatureLabel({
  title,
  body,
  href,
  active,
  hideBottom,
  onSelect,
}: {
  title: string;
  body: string;
  href: string;
  active: boolean;
  hideBottom: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="block w-full text-left">
      <BracketFrame tick="stroke-1" hideBottom={hideBottom} className="w-full">
        <div className="py-3 pr-4 pl-6">
          <button
            type="button"
            onClick={onSelect}
            className="text-body-18-regular cursor-pointer text-left"
          >
            {title}
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300"
            style={{
              gridTemplateRows: active ? "auto" : "0fr",
              transitionTimingFunction: EASE,
            }}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className="text-body-16-light pt-1 text-pretty"
                style={{
                  opacity: active ? 0.8 : 0,
                  transition: `opacity 300ms ${EASE}`,
                }}
                aria-hidden={!active}
              >
                <p>{body}</p>
                <a href={href} className="text-nav-link mt-3 inline-block underline underline-offset-4">
                  Explore More
                </a>
              </div>
            </div>
          </div>
        </div>
      </BracketFrame>
    </div>
  );
}

function ScrollPlatform() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const lastSlotRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slot = scrollProgress(el, el.firstElementChild as HTMLElement | null) * COUNT;
    // Scrolling back up switches slides instantly (see .dyas-scroll-up in CSS):
    // the build-up only plays on the way down.
    if (Math.abs(slot - lastSlotRef.current) > 0.0005) {
      el.classList.toggle("dyas-scroll-up", slot < lastSlotRef.current);
      lastSlotRef.current = slot;
    }
    // Only re-render when the slide changes, and only once the scroll is
    // clearly inside the next slot, so a touch resting on a boundary (or iOS
    // rubber-banding) cannot flip the slide back and forth.
    const current = activeRef.current;
    if (slot >= current - EDGE && slot < current + 1 + EDGE) return;
    const next = Math.max(0, Math.min(COUNT - 1, Math.floor(slot)));
    if (next === current) return;
    activeRef.current = next;
    setActive(next);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};
    const configure = () => {
      stop();
      setReduce(motion.matches);
      if (!motion.matches) stop = onScrollPaint(sync);
    };
    const frame = requestAnimationFrame(configure);
    motion.addEventListener("change", configure);
    return () => {
      cancelAnimationFrame(frame);
      stop();
      motion.removeEventListener("change", configure);
    };
  }, [sync]);

  const goTo = useCallback((index: number) => {
    if (prefersReducedMotion()) {
      activeRef.current = index;
      setActive(index);
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    const pinned = el.firstElementChild as HTMLElement | null;
    const range = el.offsetHeight - (pinned?.offsetHeight || window.innerHeight);
    const start = el.getBoundingClientRect().top + window.scrollY;
    const t = COUNT <= 1 ? 0 : (index + 0.5) / COUNT;
    window.scrollTo({ top: start + t * range, behavior: "smooth" });
  }, []);

  const left = SLIDES.filter((_, i) => i % 2 === 0);
  const right = SLIDES.filter((_, i) => i % 2 === 1);

  const renderColumn = (items: typeof SLIDES, side: "left" | "right") => (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col py-2",
        side === "right" && "justify-self-end",
      )}
    >
      {items.map((item, idx) => {
        const i = SLIDES.indexOf(item);
        return (
          <Fragment key={item.title}>
            {idx > 0 ? <div className="min-h-2 flex-1" aria-hidden="true" /> : null}
            <div className="shrink-0">
              <FeatureLabel
                title={item.title}
                body={item.body}
                href={item.href}
                active={i === active}
                hideBottom={idx === items.length - 1}
                onSelect={() => goTo(i)}
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );

  return (
    <div
      ref={trackRef}
      className={reduce ? "h-auto" : "h-[300vh] lg:h-[480vh]"}
    >
      <div
        className={
          reduce
            ? "relative"
            : "sticky top-0 h-[100svh] lg:h-[100dvh] overflow-clip"
        }
      >
        <div className="relative hidden h-full w-full grid-cols-[1fr_47.17%_1fr] lg:grid">
          {renderColumn(left, "left")}

          <div className="relative min-h-0 p-6">
            <CornerFrame tick="text-stroke-2" className="size-full min-h-0">
              <div className="relative size-full min-h-0 overflow-clip p-4 md:p-6">
                <PlatformStack active={active} />
              </div>
            </CornerFrame>
            <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 -left-px w-px" />
            <div className="bg-stroke-1 pointer-events-none absolute inset-y-0 -right-px w-px" />
          </div>

          {renderColumn(right, "right")}

          <div className="bg-stroke-1 pointer-events-none absolute inset-x-0 top-0 h-px" />
          <div className="bg-stroke-1 pointer-events-none absolute inset-x-0 bottom-0 h-px" />
          <div className="bg-stroke-1 pointer-events-none absolute top-0 left-0 h-4 w-px" />
          <div className="bg-stroke-1 pointer-events-none absolute top-0 right-0 h-4 w-px" />
          <div className="bg-stroke-1 pointer-events-none absolute bottom-0 left-0 h-4 w-px" />
          <div className="bg-stroke-1 pointer-events-none absolute right-0 bottom-0 h-4 w-px" />
        </div>

        {/* Phones and tablets. The top padding clears the header that drops in
            on scroll-up; the copy block is as tall as its longest slide and the
            stack takes whatever is left, so the whole thing always fits the
            pinned screen and nothing moves when the slide changes. */}
        <div className="flex h-full min-h-0 flex-col justify-center gap-4 px-1 pt-[var(--header-height)] pb-4 lg:hidden">
          <div className="mx-auto grid w-full max-w-md shrink-0">
            {SLIDES.map((item, i) => (
              <div
                key={item.title}
                className="col-start-1 row-start-1 flex flex-col items-center text-center transition-opacity duration-300"
                style={{
                  opacity: i === active ? 1 : 0,
                  pointerEvents: i === active ? "auto" : "none",
                  transitionDelay: i === active ? "120ms" : "0ms",
                }}
                aria-hidden={i !== active}
              >
                <p className="text-heading-28 text-balance">{item.title}</p>
                <p className="text-body-18-light mt-3 max-w-80 text-pretty opacity-80">{item.body}</p>
                <a
                  href={item.href}
                  tabIndex={i === active ? undefined : -1}
                  className="text-nav-link mt-3 inline-block underline underline-offset-4"
                >
                  Explore More
                </a>
              </div>
            ))}
          </div>

          <div className="relative max-h-[min(110vw,480px)] min-h-0 flex-1 basis-0">
            <CornerFrame tick="text-stroke-2" className="h-full min-h-0">
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-clip p-4">
                <div className="relative aspect-[634/760] h-full max-h-full w-full max-w-[22rem]">
                  <PlatformStack active={active} />
                </div>
              </div>
            </CornerFrame>
          </div>

          <div className="flex shrink-0 justify-center gap-1.5" aria-label="Choose a service">
            {SLIDES.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={item.title}
                aria-pressed={i === active}
                onClick={() => goTo(i)}
                className="grid h-11 min-w-8 place-items-center px-1"
              >
                {/* Small pill, 44px-tall tap target. */}
                <span
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === active ? "bg-sun w-6" : "bg-stroke-2/50 w-2",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Platform() {
  return (
    <section
      id="services"
      className="relative bg-day pt-10 pb-18 text-black md:pt-14 md:pb-28 lg:pt-18 lg:pb-40"
    >
      <div className="container-site relative z-1 flex flex-col gap-y-0">
        <div className="space-y-14 md:space-y-18 lg:space-y-30">
          <div className="flex flex-col justify-between gap-x-10 gap-y-6 md:flex-row md:items-end">
            <div className="text-heading-40 max-w-177.5 flex-1">{platform.headline}</div>
            <Button href={platform.ctaHref} variant="midnight" className="shrink-0">
              {platform.cta}
            </Button>
          </div>
          <ScrollPlatform />
          <div className="flex flex-col items-start justify-between gap-6 border border-stroke-1 p-6 sm:flex-row sm:items-center sm:p-8">
            <p className="text-heading-32 max-w-[36rem]">{banner.headline}</p>
            <Button href={site.ctaHref} variant="midnight">
              {banner.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
