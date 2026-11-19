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
    /** Jump straight to a value (a sequence that already played earlier). */
    set(value: number) {
      reached = Math.max(reached, value);
      paint(reached);
    },
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

/**
 * Which pinned sequences have played on a page, kept for the tab session so a
 * return through history (Back / Forward) finds the page as it was left. A
 * fresh visit or a reload starts clean.
 */
const playedStore = (() => {
  let poppedAt = -Infinity;
  let batch = { path: "", at: -Infinity, returning: false };
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {
      poppedAt = performance.now();
    });
  }
  const key = () => `dyas-played:${window.location.pathname}`;
  const read = (): string[] => {
    try {
      return JSON.parse(window.sessionStorage.getItem(key()) || "[]");
    } catch {
      return [];
    }
  };
  return {
    /** Shared by every sequence that mounts together on one page view. */
    returning() {
      const now = performance.now();
      const path = window.location.pathname;
      if (batch.path !== path || now - batch.at > 1000) {
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        const firstView = batch.path === "";
        const returning = now - poppedAt < 2000 || (firstView && nav?.type === "back_forward");
        batch = { path, at: now, returning };
        if (!returning) {
          try {
            window.sessionStorage.removeItem(key());
          } catch {}
        }
      }
      return batch.returning;
    },
    has: (id: string) => read().includes(id),
    add(id: string) {
      try {
        window.sessionStorage.setItem(key(), JSON.stringify([...new Set([...read(), id])]));
      } catch {}
    },
  };
})();

/**
 * Once a pinned sequence has fully played (see forwardOnly), its long scroll
 * track is dead distance on the way back up: the screen would sit frozen for
 * several screens of scrolling. This drops the extra length by adding
 * `className` (which must shrink the track to its pinned element) and moves
 * the scroll position by the same amount in the same frame, so nothing on
 * screen moves. It waits until the scroll is at rest and no finger is down, so
 * it never interrupts a drag or a momentum scroll.
 */
export function collapseOncePlayed(
  id: string,
  track: HTMLElement,
  pinned: HTMLElement | null,
  className = "dyas-played",
) {
  let done = false;
  let timer = 0;
  let touching = false;

  // Coming back through history, the saved scroll position belongs to the
  // collapsed page, so the track is collapsed again before anything else.
  const restored = playedStore.returning() && playedStore.has(id);
  if (restored) {
    track.classList.add(className);
    done = true;
  }

  const played = () => {
    const range = track.offsetHeight - (pinned?.offsetHeight || viewportHeight());
    return range > 1 && track.getBoundingClientRect().top <= 1 - range;
  };

  const collapse = () => {
    timer = 0;
    if (done || touching || !played()) return;
    // Everything on screen sits at or below the track's end, so that edge is
    // what has to stay put. Measuring it (rather than assuming the cut) also
    // covers the page bottom, where the browser clamps the scroll by itself.
    const before = track.getBoundingClientRect().bottom;
    track.classList.add(className);
    const shift = track.getBoundingClientRect().bottom - before;
    done = true;
    playedStore.add(id);
    if (Math.abs(shift) > 0.5) window.scrollBy({ top: shift, left: 0, behavior: "instant" });
  };

  const check = () => {
    if (done) return;
    window.clearTimeout(timer);
    timer = played() ? window.setTimeout(collapse, 200) : 0;
  };

  const onTouchStart = () => {
    touching = true;
  };
  const onTouchEnd = () => {
    touching = false;
    check();
  };
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return {
    /** True when the sequence had already played before a history return. */
    restored,
    check,
    stop() {
      window.clearTimeout(timer);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
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
