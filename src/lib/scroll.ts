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
 * One-way, speed-limited progress for a scroll-linked sequence.
 *
 * - It holds the furthest value reached, so scrolling back up never plays the
 *   sequence in reverse (a reload replays it).
 * - What is painted follows that value no faster than the full sequence in
 *   `minDuration` ms. At a normal scroll pace that is the scroll itself; a
 *   fast flick still plays every step smoothly instead of flashing past.
 * - If the user clearly turns back (not just a wobble of the finger) while it
 *   sits between two resting frames, it carries on to the next one (`rest`)
 *   rather than freezing mid-transition.
 */
export function forwardOnly(
  paint: (value: number) => void,
  rest: (value: number) => number = (v) => v,
  minDuration: number | (() => number) = 0,
) {
  let reached = 0;
  let shown = 0;
  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    raf = 0;
    const ms = typeof minDuration === "function" ? minDuration() : minDuration;
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    shown = ms > 0 ? Math.min(reached, shown + dt / ms) : reached;
    paint(shown);
    if (shown < reached) raf = requestAnimationFrame(tick);
    else last = 0;
  };

  return {
    /** Jump straight to a value (a sequence that already played earlier). */
    set(value: number) {
      reached = Math.max(reached, value);
      shown = reached;
      paint(shown);
    },
    /** True once the whole sequence has been painted. */
    done: () => shown >= 1,
    update(raw: number) {
      if (raw >= reached) reached = raw;
      else if (raw < reached - 0.03) reached = Math.max(reached, rest(reached));
      if (!raf) tick(performance.now());
    },
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
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
 * Scroll length taken out of played sequences, parked in an empty spacer at the
 * very top of the page. Trading track height for spacer height leaves every
 * visible pixel and the scroll position exactly where they were, so it is safe
 * in the middle of a drag or a momentum scroll. The spacer itself is removed
 * (with the one scroll correction this needs) as soon as the scroll rests, or
 * at the latest just before it could come into view.
 */
const slack = (() => {
  let spacer: HTMLElement | null = null;
  let owed = 0;
  let timer = 0;
  let touching = false;
  let listening = false;

  const flush = () => {
    window.clearTimeout(timer);
    timer = 0;
    const el = spacer;
    if (!owed || !el?.isConnected) {
      owed = 0;
      return;
    }
    owed = 0;
    // Measured rather than assumed: at the page bottom the browser clamps the
    // scroll position by itself when the document gets shorter.
    const anchor = el.nextElementSibling ?? el;
    const before = anchor.getBoundingClientRect().top;
    el.style.height = "0px";
    const shift = anchor.getBoundingClientRect().top - before;
    if (Math.abs(shift) > 0.5) window.scrollBy({ top: shift, left: 0, behavior: "instant" });
  };

  const onScroll = () => {
    if (!owed) return;
    window.clearTimeout(timer);
    // About to scroll into view: it has to go now.
    if (window.scrollY < owed + viewportHeight() * 1.5) {
      flush();
      return;
    }
    timer = window.setTimeout(() => {
      if (!touching) flush();
    }, 150);
  };

  const listen = () => {
    if (listening) return;
    listening = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", () => (touching = true), { passive: true });
    const lift = () => {
      touching = false;
      onScroll();
    };
    window.addEventListener("touchend", lift, { passive: true });
    window.addEventListener("touchcancel", lift, { passive: true });
  };

  return {
    /** Park `px` of removed track height. False when there is nowhere to put it. */
    take(px: number, apply: () => void) {
      if (!spacer?.isConnected) {
        const main = document.querySelector("main");
        if (!main) return false;
        spacer = document.createElement("div");
        spacer.setAttribute("aria-hidden", "true");
        spacer.style.cssText = "height:0;pointer-events:none";
        main.prepend(spacer);
        owed = 0;
      }
      owed += px;
      spacer.style.height = `${owed}px`;
      apply();
      listen();
      onScroll();
      return true;
    },
  };
})();

/**
 * Once a pinned sequence has fully played (see forwardOnly), its long scroll
 * track is dead distance on the way back up: the screen would sit frozen for
 * several screens of scrolling. The moment it has played, this shrinks the
 * track to its pinned element by adding `className`, with the removed length
 * parked in `slack` so nothing on screen moves, even mid-scroll.
 */
export function collapseOncePlayed(
  id: string,
  track: HTMLElement,
  pinned: HTMLElement | null,
  /** False while the sequence is still catching up with a fast scroll. */
  ready: () => boolean = () => true,
  className = "dyas-played",
) {
  let done = false;

  // Coming back through history, the saved scroll position belongs to the
  // collapsed page, so the track is collapsed again before anything else.
  const restored = playedStore.returning() && playedStore.has(id);
  if (restored) {
    track.classList.add(className);
    done = true;
  }

  const check = () => {
    if (done || !pinned || !ready()) return;
    const cut = track.offsetHeight - pinned.offsetHeight;
    if (cut <= 1 || track.getBoundingClientRect().top > 1 - cut) return;
    done = slack.take(cut, () => track.classList.add(className));
    if (done) playedStore.add(id);
  };

  return {
    /** True when the sequence had already played before a history return. */
    restored,
    /** True once the track has been collapsed. */
    collapsed: () => done,
    check,
    stop() {},
  };
}

/**
 * Touch screens: a flick cannot fly past a pinned sequence that has not played
 * yet. Whatever its speed, the momentum scroll is brought to rest where the
 * sequence starts and again where it ends, so the sequence is always seen. A
 * finger on the screen is never overridden, and neither are jumps (anchor
 * links, restored positions).
 */
export function gateFlicks(track: HTMLElement, pinned: HTMLElement | null, open: () => boolean) {
  if (!pinned || !window.matchMedia("(pointer: coarse)").matches) return { check() {}, stop() {} };

  let touching = false;
  let liftedAt = -Infinity;
  let lastY = window.scrollY;
  let hold: number | null = null;
  let heldAt = 0;
  const root = document.documentElement;

  // Stopping means two things: putting the scroll on the gate, and ending the
  // momentum behind it. Some engines end it on the correction alone; others
  // only when the page briefly cannot scroll (see .dyas-hold in the CSS).
  const release = () => {
    hold = null;
    root.classList.remove("dyas-hold");
  };

  const onTouchStart = () => {
    touching = true;
    release();
  };
  const onTouchEnd = () => {
    touching = false;
    liftedAt = performance.now();
  };
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  return {
    check() {
      const y = window.scrollY;
      const prev = lastY;
      lastY = y;
      if (open()) return;
      const now = performance.now();
      if (hold !== null) {
        if (Math.abs(y - hold) > 1) {
          window.scrollTo({ top: hold, left: 0, behavior: "instant" });
          lastY = hold;
        }
        return;
      }
      if (touching || now - liftedAt > 3000) return;
      const step = y - prev;
      if (step <= 0 || step > viewportHeight() * 0.9) return;
      const start = track.getBoundingClientRect().top + y;
      const end = start + track.offsetHeight - pinned.offsetHeight;
      for (const gate of [end, start]) {
        // One frame early (the next step would cross it): the scroll then
        // jumps forward onto the gate instead of overshooting and coming back.
        if (prev < gate - 1 && y + step >= gate) {
          hold = gate;
          heldAt = now;
          root.classList.add("dyas-hold");
          window.scrollTo({ top: gate, left: 0, behavior: "instant" });
          lastY = gate;
          window.setTimeout(() => {
            if (hold === gate && performance.now() - heldAt >= 150) release();
          }, 160);
          return;
        }
      }
    },
    stop() {
      release();
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
