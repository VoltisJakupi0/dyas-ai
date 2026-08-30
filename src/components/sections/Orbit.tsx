"use client";

import { useEffect, useId, useRef } from "react";
import { orbit } from "@/lib/site";
import { onScrollPaint, prefersReducedMotion, viewportHeight } from "@/lib/scroll";

function RevealText({ text }: { text: string }) {
  const parts = text.split(/(\s+)/);

  return (
    <p>
      {parts.map((part, i) => {
        if (/^\s+$/.test(part)) {
          return (
            <span key={i} className="dyas-orbit__char">
              {part}
            </span>
          );
        }

        return (
          <span key={i} className="dyas-orbit__word">
            {[...part].map((ch, j) => (
              <span key={j} className="dyas-orbit__char">
                {ch}
              </span>
            ))}
          </span>
        );
      })}
    </p>
  );
}

function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6.5 4.5h3.2l1.4 3.6-2.2 1.3a11 11 0 0 0 5.4 5.4l1.3-2.2 3.6 1.4v3.2H17A12.5 12.5 0 0 1 4.5 7V4.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

function Artifact({
  kind,
  eyebrow,
  title,
  meta,
  stack,
}: (typeof orbit.artifacts)[number] & { stack: "down" | "up" }) {
  return (
    <div className={`dyas-artifact dyas-artifact--${stack}`}>
      <i aria-hidden="true" />
      <i aria-hidden="true" />
      <div className="dyas-artifact__card">
        <span className="dyas-artifact__icon">{kind === "call" ? <CallIcon /> : <MailIcon />}</span>
        <span className="dyas-artifact__copy">
          <em>{eyebrow}</em>
          <b>{title}</b>
          <small>{meta}</small>
        </span>
      </div>
    </div>
  );
}

function Arc({ flip }: { flip?: boolean }) {
  const d =
    "M2.66667 212.25C39.8365 147.87 93.2983 94.4082 157.678 57.2383C222.059 20.0684 295.089 0.500017 369.428 0.5C443.768 0.499983 516.798 20.0683 581.178 57.2382C645.559 94.4081 699.02 147.87 736.19 212.25";
  return (
    <svg
      className="dyas-orbit__arc"
      viewBox="0 0 738.857 214.917"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g transform={flip ? "translate(0 214.917) scale(1 -1)" : undefined}>
        <path
          d={d}
          stroke="currentColor"
          strokeOpacity="0.3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="dyas-orbit__run"
          d={d}
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

function Ring({ id, flip }: { id: string; flip?: boolean }) {
  const d =
    "M59.6191 106.768C40.1518 101.339 25.3303 95.5532 15.3865 89.577C5.40777 83.5798 0.500007 77.4891 0.5 71.5C0.499993 65.511 5.40774 59.4202 15.3865 53.423C25.3302 47.4469 40.1517 41.6615 59.619 36.2316C98.5466 25.3739 154.562 16.3513 222.046 10.077C289.525 3.80323 366.075 0.500001 444 0.5C521.925 0.499999 598.475 3.80322 665.954 10.077C733.437 16.3513 789.453 25.3738 828.381 36.2316C847.848 41.6615 862.67 47.4469 872.614 53.423C882.592 59.4202 887.5 65.511 887.5 71.5C887.5 77.489 882.592 83.5798 872.614 89.577C862.67 95.5531 847.848 101.339 828.381 106.768";
  return (
    <svg
      className={flip ? "dyas-orbit__ring dyas-orbit__ring--flip" : "dyas-orbit__ring"}
      viewBox="0 0 888 107.25"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g transform={flip ? "translate(0 107.25) scale(1 -1)" : undefined}>
        <defs>
          <linearGradient id={id} x1="444" y1="107.25" x2="444" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.25" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d={d} stroke={`url(#${id})`} vectorEffect="non-scaling-stroke" />
        <path className="dyas-orbit__run" d={d} stroke="currentColor" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function Orbit() {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const chars = root.querySelectorAll<HTMLElement>(".dyas-orbit__char");
    const runs = root.querySelectorAll<SVGPathElement>(".dyas-orbit__run");
    const reduce = prefersReducedMotion();
    if (reduce) {
      chars.forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    runs.forEach((path) => {
      const len = path.getTotalLength();
      path.style.setProperty("--path-len", `${len}`);
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("is-live", entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);

    const paint = () => {
      const line = viewportHeight() * 0.58;
      chars.forEach((el) => {
        const y = el.getBoundingClientRect().top;
        const t = Math.max(0, Math.min(1, (line - y) / 88));
        el.style.opacity = String(0.28 + t * 0.72);
      });
    };

    const stop = onScrollPaint(paint);
    return () => {
      stop();
      io.disconnect();
    };
  }, []);

  const [first, second] = orbit.artifacts;

  return (
    <section ref={ref} className="dyas-orbit" id="the-problem">
      <div className="dyas-orbit__glow" aria-hidden="true" />
      <div className="dyas-orbit__fade" aria-hidden="true" />

      <div className="dyas-orbit__inner">
        <div className="dyas-orbit__head">
          <Arc />
          <span className="dyas-orbit__dot dyas-orbit__dot--l" />
          <span className="dyas-orbit__dot dyas-orbit__dot--r" />
          <div className="dyas-orbit__stem">
            <p className="dyas-orbit__kicker">{orbit.kicker}</p>
            <div className="dyas-orbit__line">
              <i />
            </div>
          </div>
        </div>

        <div className="dyas-orbit__stage">
          <Ring id={`${uid}-ring`} />
          <Ring id={`${uid}-ring-flip`} flip />
          <div className="dyas-orbit__beads" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="dyas-orbit__core">
            <Artifact {...first} stack="down" />

            <div className="dyas-orbit__copy">
              <div className="sr-only">
                <p>{orbit.headline}</p>
                <p>{orbit.body}</p>
              </div>
              <div aria-hidden="true">
                <RevealText text={orbit.headline} />
                <RevealText text={orbit.body} />
              </div>
            </div>

            <Artifact {...second} stack="up" />
          </div>
        </div>

        <div className="dyas-orbit__foot">
          <Arc flip />
          <span className="dyas-orbit__dot dyas-orbit__dot--l" />
          <span className="dyas-orbit__dot dyas-orbit__dot--r" />
          <div className="dyas-orbit__line dyas-orbit__line--out">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
