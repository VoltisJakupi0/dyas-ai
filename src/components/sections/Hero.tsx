"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Logos } from "@/components/sections/Logos";
import { hero, site } from "@/lib/site";
import {
  collapseOncePlayed,
  forwardOnly,
  holdUntilPlayed,
  observeInView,
  onScrollPaint,
  scrollProgress,
} from "@/lib/scroll";

type Beat = {
  text: string;
  size: string;
  mono?: boolean;
};

const BEATS: Beat[] = [
  { text: "Welcome to", size: "clamp(32px, 5vw, 60px)" },
  { text: "Dyas AI", size: "clamp(32px, 5vw, 60px)" },
  { text: "AI-powered solutions", size: "clamp(22px, 3.2vw, 36px)" },
  { text: "results_", size: "clamp(48px, 8vw, 96px)", mono: true },
  { text: "Built for founders, operators, and teams ready to automate.", size: "clamp(18px, 2.6vw, 30px)" },
  { text: "We automate the last mile.", size: "clamp(22px, 3.2vw, 36px)" },
];

const BEAT_START = 0.28;
const BEAT_END = 0.82;
/* Phones and tablets skip the zoom-in, so the beats use the whole scroll track
   and each one gets more room: stable whether you scroll slowly or flick. */
const BEAT_START_COMPACT = 0;
const BEAT_END_COMPACT = 0.92;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function focusPull(p: number, start: number, end: number, hold = false, blur = 12, from = 3): CSSProperties {
  const mid = (start + end) / 2;
  const inEnd = lerp(start, mid, 0.55);
  const outStart = lerp(mid, end, 0.45);

  if (p <= start) {
    return { opacity: 0, transform: `scale(${from})`, filter: blur ? `blur(${blur}px)` : "none" };
  }
  if (p < inEnd) {
    const t = (p - start) / Math.max(0.0001, inEnd - start);
    return {
      opacity: t,
      transform: `scale(${lerp(from, 0.95, t)})`,
      filter: blur ? `blur(${lerp(blur, 0, t)}px)` : "none",
    };
  }
  if (hold || p <= outStart) {
    return { opacity: 1, transform: "scale(0.95)", filter: "none" };
  }
  const t = Math.min(1, (p - outStart) / Math.max(0.0001, end - outStart));
  return {
    opacity: 1 - t,
    transform: `scale(${lerp(0.95, 0.9, t)})`,
    filter: blur ? `blur(${lerp(0, 2.6, t)}px)` : "none",
  };
}

export function Hero() {
  const stageRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const layersRef = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    return observeInView(document.querySelectorAll(".dyas-reveal"), (n) => n.classList.add("is-in"));
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const blur = window.matchMedia("(pointer: coarse)").matches ? 0 : 12;
    const noZoomMq = window.matchMedia("(max-width: 1024px)");

    const apply = (p: number) => {
      const noZoom = noZoomMq.matches;
      const zoom = noZoom ? 0 : clamp(p / 0.28, 0, 1);
      const pin = pinRef.current;
      const frame = frameRef.current;
      if (pin && frame) {
        frame.style.clipPath = "none";
        if (noZoom) {
          frame.style.transform = "none";
          frame.style.borderRadius = "0px";
        } else {
          const cover =
            Math.max(
              pin.clientWidth / Math.max(1, frame.offsetWidth),
              pin.clientHeight / Math.max(1, frame.offsetHeight),
            ) * 1.06;
          frame.style.transform = `translate3d(0, 0, 0) scale(${lerp(1, cover, zoom)})`;
          frame.style.borderRadius = `${lerp(12, 0, zoom)}px`;
        }
      }
      if (winRef.current) {
        winRef.current.style.transform = noZoom ? "none" : `scale(${lerp(0.82, 1, zoom)})`;
      }
      if (introRef.current) {
        introRef.current.style.opacity = "1";
        introRef.current.style.transform = "none";
        introRef.current.style.pointerEvents = "auto";
      }
      if (hintRef.current) {
        const hintEnd = noZoom ? 0.06 : 0.32;
        const hint = p < hintEnd ? 0.6 : clamp(0.6 - (p - hintEnd) / 0.08, 0, 0.6);
        hintRef.current.style.opacity = String(hint);
      }

      const n = BEATS.length;
      const beatStart = noZoom ? BEAT_START_COMPACT : BEAT_START;
      const beatEnd = noZoom ? BEAT_END_COMPACT : BEAT_END;
      const span = (beatEnd - beatStart) / n;
      // Without the blur, two lines on screen at once read as a glitch, so on
      // compact screens a beat is fully gone before the next one comes in.
      const overlap = noZoom ? 1 : 1.25;
      const from = noZoom ? 1.12 : 3;
      layersRef.current.forEach((el, i) => {
        if (!el) return;
        const start = beatStart + i * span;
        const end = start + span * overlap;
        const last = i === n - 1;
        let st = focusPull(p, start, last ? Math.max(end, 0.85) : end, last && p >= start + span * 0.4, blur, from);
        // The first line is already there when the window scrolls into view,
        // so the terminal never sits empty.
        if (noZoom && i === 0 && p < (start + end) / 2) {
          st = { opacity: 1, transform: "scale(0.95)", filter: "none" };
        }
        el.style.opacity = String(st.opacity ?? 0);
        el.style.transform = String(st.transform ?? `scale(${from})`);
        el.style.filter = String(st.filter ?? "none");
      });
    };

    // Nearest point at or after `p` where exactly one line is fully in focus.
    const rest = (p: number) => {
      const noZoom = noZoomMq.matches;
      const n = BEATS.length;
      const beatStart = noZoom ? BEAT_START_COMPACT : BEAT_START;
      const span = ((noZoom ? BEAT_END_COMPACT : BEAT_END) - beatStart) / n;
      if (p <= beatStart) return p;
      for (let i = 0; i < n; i++) {
        const last = i === n - 1;
        const start = beatStart + i * span;
        const end = last ? Math.max(start + span * (noZoom ? 1 : 1.25), 0.85) : start + span * (noZoom ? 1 : 1.25);
        const mid = (start + end) / 2;
        const inEnd = lerp(start, mid, 0.55);
        if (p < inEnd) return noZoom && i === 0 ? p : inEnd;
        if (last || p <= lerp(mid, end, 0.45)) return p;
      }
      return p;
    };

    // The showreel only plays forward: it holds the furthest point reached, so
    // scrolling back up shows its settled frame instead of running in reverse.
    // Fast scrolling cannot rush it either: the whole reel takes at least this long.
    const latch = forwardOnly(
      (p) => {
        apply(p);
        if (p < 1) return;
        gate.release();
        played.check();
      },
      rest,
      () => (noZoomMq.matches ? 2600 : 3200),
    );
    // ...and once it has played, its scroll track shrinks to one screen, so the
    // way back up is not several screens of a frozen frame.
    const played = collapseOncePlayed("hero", stage, pinRef.current, () => latch.done());
    // Scrolled through faster than it can play, the page waits at its end.
    const gate = holdUntilPlayed(
      stage,
      pinRef.current,
      // Only a sequence that has fallen behind the scroll needs the wait.
      () => latch.done() || !latch.lagging(),
      () => latch.set(1),
    );
    let stop = () => {};
    const configure = () => {
      stop();
      latch.stop();
      if (reduceMq.matches) {
        apply(1);
        if (frameRef.current) frameRef.current.style.transform = "none";
        if (winRef.current) winRef.current.style.transform = "none";
        return;
      }
      if (played.restored) latch.set(1);
      stop = onScrollPaint(() => {
        gate.check();
        latch.update(scrollProgress(stage, pinRef.current));
        played.check();
      });
    };
    configure();
    noZoomMq.addEventListener("change", configure);
    reduceMq.addEventListener("change", configure);
    return () => {
      stop();
      latch.stop();
      played.stop();
      gate.stop();
      noZoomMq.removeEventListener("change", configure);
      reduceMq.removeEventListener("change", configure);
    };
  }, []);

  return (
    <div className="dyas-hero-area">
      <div ref={introRef} className="dyas-hero-copy">
        <section className="dyas-hero dyas-hero-area__hero">
          <div className="dyas-hero__row">
            <div className="dyas-hero__main">
              <h1 className="dyas-hero__headline dyas-reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
                {hero.headlineLines.map((line) => (
                  <span key={line} className="dyas-hero__line">
                    {line}
                  </span>
                ))}
              </h1>
              <div className="dyas-hero__actions dyas-reveal" style={{ "--reveal-delay": "240ms" } as CSSProperties}>
                <Button href={site.ctaHref}>{site.ctaLabel}</Button>
                <Button
                  href={hero.ctaHref}
                  variant="ghost"
                  onClick={(e) => {
                    // Jump past the showreel (zoom + text beats) straight to work.
                    if (hero.ctaHref !== "#work") return;
                    e.preventDefault();
                    const work = document.getElementById("work");
                    if (!work) return;
                    const html = document.documentElement;
                    const prev = html.style.scrollBehavior;
                    html.style.scrollBehavior = "auto";
                    work.scrollIntoView({ behavior: "auto", block: "start" });
                    html.style.scrollBehavior = prev;
                    history.replaceState(null, "", "#work");
                  }}
                >
                  {hero.cta}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <p className="dyas-hero__sub dyas-hero-area__sub dyas-reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
          {hero.body}
        </p>
      </div>

      <section ref={stageRef} className="dyas-hero-stage dyas-hero-area__showreel" aria-label="Showreel">
        <div ref={pinRef} className="dyas-hero-pin">
          <div ref={frameRef} className="dyas-hero-frame">
            <div className="dyas-hero-land" aria-hidden="true">
              <Image
                className="dyas-hero-land__sharp"
                src="/images/hero-terrain.jpg"
                alt=""
                fill
                sizes="100vw"
                quality={90}
                priority
                fetchPriority="high"
              />
            </div>
            <div className="dyas-term-slot">
              <div ref={winRef} className="dyas-term">
                <div className="dyas-term__bar">
                  <span className="dyas-term__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="dyas-term__title">dyas.ai</span>
                  <span className="dyas-term__spacer" />
                </div>
                <div className="dyas-term__body">
                  {BEATS.map((beat, i) => (
                    <p
                      key={beat.text}
                      ref={(el) => {
                        layersRef.current[i] = el;
                      }}
                      className={beat.mono ? "dyas-term__line dyas-term__line--mono" : "dyas-term__line"}
                      style={{ fontSize: beat.size }}
                    >
                      {beat.text}
                    </p>
                  ))}
                  <p ref={hintRef} className="dyas-term__hint">
                    Keep scrolling ↓
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Logos />
    </div>
  );
}
