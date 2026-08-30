"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { stats } from "@/lib/site";
import {
  observeInView,
  onScrollPaint,
  prefersReducedMotion,
  isFinePointer,
  supportsScrollTimeline,
  viewportHeight,
} from "@/lib/scroll";

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

export function CountStat({
  value,
  suffix,
  label,
}: {
  value: string;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Number(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return;
    if (prefersReducedMotion()) {
      el.textContent = value;
      return;
    }

    let raf = 0;
    const stop = observeInView(
      [el.closest(".dyas-sheet-stat") ?? el],
      () => {
        const start = performance.now();
        const dur = 1200;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          el.textContent = String(Math.round(target * easeOut(t)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    return () => {
      stop();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, value]);

  return (
    <div className="dyas-sheet-stat">
      <p className="dyas-sheet-stat__value" aria-label={`${value}${suffix}`}>
        <span ref={ref}>0</span>
        <span>{suffix}</span>
      </p>
      <p className="dyas-sheet-stat__label">{label}</p>
    </div>
  );
}

export function SheetStats({ caption }: { caption: "title" | "label" }) {
  return (
    <div className="dyas-sheet-stats">
      {stats.items.map((item) => (
        <CountStat key={item.title} value={item.value} suffix={item.suffix} label={item[caption]} />
      ))}
    </div>
  );
}

export function SheetMotion() {
  const path = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    main.classList.add("dyas-js");

    const reduce = prefersReducedMotion();
    const nodes = main.querySelectorAll(
      ".dyas-reveal, .dyas-sheet-card, .dyas-sheet-stat, .dyas-plusbox, .dyas-acronym > div, .faq-item, .dyas-sheet-rise",
    );

    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const stopReveal = observeInView(nodes, (n) => n.classList.add("is-in"));

    const bar = barRef.current;
    const cssBar = supportsScrollTimeline() && isFinePointer();
    let stopPaint = () => {};
    if (bar && !cssBar) {
      stopPaint = onScrollPaint(() => {
        const max = document.documentElement.scrollHeight - viewportHeight();
        const t = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
        bar.style.transform = `scaleX(${t})`;
      });
    }

    return () => {
      stopReveal();
      stopPaint();
    };
  }, [path]);

  return <div ref={barRef} className="dyas-page-progress" aria-hidden="true" />;
}
