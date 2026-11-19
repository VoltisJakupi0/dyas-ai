export function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/**
 * Progress (0–1) of a tall scroll track. Pass the sticky element pinned inside
 * it when there is one: its height is the real sticky travel and, unlike the
 * visual viewport, it does not change while mobile browser toolbars collapse
 * mid-scroll, so the progress never jumps.
 */
export function scrollProgress(el: HTMLElement, pinned?: HTMLElement | null) {
  const range = el.offsetHeight - (pinned?.offsetHeight || viewportHeight());
  if (range <= 0) return 0;
  return clamp01(-el.getBoundingClientRect().top / range);
}

/**
 * One-way progress for a scroll-linked sequence. It holds the furthest value
 * reached, so scrolling back up never plays the sequence in reverse (a reload
 * replays it). If the user turns back while it sits between two resting
 * frames, it eases forward to the next one (`rest`) rather than freezing
 * mid-transition.
 */
export function forwardOnly(paint: (value: number) => void, rest: (value: number) => number = (v) => v) {
  let reached = 0;
  let raf = 0;

  const settle = (target: number) => {
    const from = reached;
    const t0 = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - t0) / 380);
      reached = Math.max(reached, from + (target - from) * (1 - (1 - t) ** 3));
      paint(reached);
      raf = t < 1 ? requestAnimationFrame(run) : 0;
    };
    raf = requestAnimationFrame(run);
  };

  return {
    update(raw: number) {
      if (raw >= reached) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        reached = raw;
      } else if (!raf && raw < reached - 0.002) {
        const target = rest(reached);
        if (target > reached + 0.0005) settle(target);
      }
      paint(reached);
    },
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function supportsViewTimeline() {
  return CSS.supports("(animation-timeline: view()) and (animation-range: entry)");
}

export function supportsScrollTimeline() {
  return CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)");
}

export function observeInView(
  nodes: Iterable<Element>,
  onEnter: (el: Element) => void,
  options?: IntersectionObserverInit & {
    once?: boolean;
    onLeave?: (el: Element) => void;
  },
) {
  const list = [...nodes];
  if (!list.length) return () => {};

  const { once = true, onLeave, ...ioOptions } = options ?? {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onEnter(entry.target);
          if (once) io.unobserve(entry.target);
          continue;
        }
        if (!once) onLeave?.(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08, ...ioOptions },
  );

  for (const n of list) io.observe(n);

  requestAnimationFrame(() => {
    const h = viewportHeight();
    for (const n of list) {
      const r = n.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) {
        onEnter(n);
        if (once) io.unobserve(n);
      }
    }
  });

  return () => io.disconnect();
}

export function onScrollPaint(cb: () => void) {
  let raf = 0;
  const tick = () => {
    raf = 0;
    cb();
  };
  const request = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const vv = window.visualViewport;

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("orientationchange", request);
  window.addEventListener("touchmove", request, { passive: true });
  vv?.addEventListener("resize", request);
  vv?.addEventListener("scroll", request);
  request();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
    window.removeEventListener("orientationchange", request);
    window.removeEventListener("touchmove", request);
    vv?.removeEventListener("resize", request);
    vv?.removeEventListener("scroll", request);
  };
}
