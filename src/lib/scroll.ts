let adjustedAt = -Infinity;

/**
 * Moves the scroll position for a layout change of our own (nothing on screen
 * moves). Anything reading the scroll direction, like the header, should skip
 * the step right after it: see `wasAdjusted`.
 */
export function adjustScroll(top: number) {
  adjustedAt = performance.now();
  window.scrollBy({ top, left: 0, behavior: "instant" });
}

/** True for the scroll event(s) that follow an `adjustScroll`. */
export function wasAdjusted() {
  return performance.now() - adjustedAt < 160;
}

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
  const range = el.offsetHeight - (extension.get(el) ?? 0) - (pinned?.offsetHeight || viewportHeight());
  if (range <= 0) return 0;
  const done = -el.getBoundingClientRect().top;
  // Scroll positions are whole pixels: within one of the end is the end.
  return done >= range - 1 ? 1 : clamp01(done / range);
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
    const gap = reached - shown;
    const cap = ms > 0 ? dt / ms : Infinity;
    // Within the speed limit it is glued to the scroll (no trailing behind the
    // finger). Scrolled faster, it plays at the limit and settles gently.
    if (gap <= cap || gap < 0.0008) shown = reached;
    else shown = Math.min(reached, shown + Math.min(cap, Math.max(gap * (1 - Math.exp(-dt / 90)), cap * 0.25)));
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
 * (with the one scroll correction this needs) only while the page stands
 * still, normally once the scroll rests: iOS ignores or delays a scroll
 * correction made during a momentum scroll, which flashed the wrong content or
 * even landed the page at its very end. Scrolling back up towards it, it has
 * to go before it comes into view: on touch screens the scroll is brought to a
 * stop first, then it goes.
 */
const slack = (() => {
  let spacer: HTMLElement | null = null;
  let owed = 0;
  let timer = 0;
  let touching = false;
  let stopping = false;
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
    if (Math.abs(shift) > 0.5) adjustScroll(shift);
  };

  // Brings a (momentum) scroll to a stop, then flushes. On iOS `overflow:
  // hidden` alone does not stop a momentum scroll, but a scroll to where the
  // page already is does (a frame or so later).
  const stopThenFlush = () => {
    if (stopping) return;
    stopping = true;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let seen = window.scrollY;
    let still = 0;
    let frames = 0;
    const halt = () => window.scrollTo({ top: window.scrollY, left: 0, behavior: "instant" });
    halt();
    const wait = () => {
      const y = window.scrollY;
      still = y === seen ? still + 1 : 0;
      seen = y;
      if (still < 2 && ++frames < 40) {
        if (frames % 6 === 0) halt();
        requestAnimationFrame(wait);
        return;
      }
      flush();
      root.style.overflow = "";
      stopping = false;
    };
    requestAnimationFrame(wait);
  };

  let lastY = 0;
  const onScroll = () => {
    if (!owed) return;
    window.clearTimeout(timer);
    const y = window.scrollY;
    const up = y < lastY;
    lastY = y;
    if (stopping) return;
    // Scrolling back up and getting close: it has to go now.
    if (up && y < owed + viewportHeight() * 2.5) {
      if (window.matchMedia("(pointer: coarse)").matches) stopThenFlush();
      else flush();
      return;
    }
    timer = window.setTimeout(() => {
      if (touching) return;
      // Still moving (a busy main thread can delay the scroll events): wait on.
      if (window.scrollY !== lastY) onScroll();
      else flush();
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
      lastY = window.scrollY;
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
    const top = track.getBoundingClientRect().top;
    // Only once the pinned screen has reached the top: from then on it can sit
    // anywhere along its track (including a hold extension, see
    // holdUntilPlayed). The length above it goes to the spacer, which keeps it
    // exactly where it is; any rest of the track is below the screen.
    if (cut <= 1 || top > 0.5) return;
    done = slack.take(Math.min(cut, -top), () => track.classList.add(className));
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

/** Extra length a hold has added to a track (see holdUntilPlayed). */
const extension = new WeakMap<HTMLElement, number>();

/**
 * A pinned sequence is never skipped by scrolling fast. While it has not
 * finished playing, its track is kept at least two screens longer than the
 * scroll has got to, so the pinned screen stays put however far a fling
 * carries, and the sequence plays on at its own pace. The extra length is
 * below the screen, so adding it never moves anything, and it goes again with
 * the rest of the track once the sequence has played (collapseOncePlayed).
 *
 * This does not fight the scroll: iOS keeps a momentum scroll going through
 * `overflow: hidden` and applies scroll corrections late, so locking the page
 * there overshot and snapped back (a visible jump).
 *
 * Jumps (anchor links, a restored position) are not scrolls: they mark the
 * sequence as played instead (`skip`).
 */
export function holdUntilPlayed(
  track: HTMLElement,
  pinned: HTMLElement | null,
  played: () => boolean,
  skip: () => void,
) {
  let lastY = window.scrollY;
  let lastStep = 0;
  let first = true;
  let base = 0;
  let extra = 0;

  const extend = (px: number) => {
    if (!extra) base = track.offsetHeight;
    extra = px;
    const height = px ? `${base + px}px` : "";
    track.style.height = height;
    track.style.minHeight = height;
    if (px) extension.set(track, px);
    else extension.delete(track);
  };

  const check = () => {
    const y = window.scrollY;
    const step = y - lastY;
    const before = lastStep;
    lastY = y;
    lastStep = step;
    if (!pinned) return;
    const top = track.getBoundingClientRect().top;
    const range = track.offsetHeight - extra - pinned.offsetHeight;
    // Read every time: positions on the page shift when earlier sequences
    // give their scroll length back.
    const end = top + y + range;
    if (played()) {
      // The extension goes once the track has collapsed (the collapse overrides
      // it) or while it is wholly below the screen; never from under the pin.
      if (extra && (range <= 1 || y <= end)) extend(0);
      return;
    }
    if (range <= 1) return;
    if (first) {
      first = false;
      if (y >= end) skip();
      return;
    }
    // A jump (a link, a restored position) moves a page that was standing
    // still. A big step in the middle of a fling is the browser catching up
    // after a busy main thread, and right after one of our own corrections the
    // step is not a scroll at all.
    const vh = viewportHeight();
    if (step > vh * 1.25 && Math.abs(before) < vh * 0.1 && !wasAdjusted() && y >= end - 1) {
      skip();
      return;
    }
    // Topped up a few screens at a time: a height change re-lays out the page,
    // so it should not happen on every frame of a slow scroll.
    const margin = viewportHeight() * 2;
    if (y + margin > end + extra) extend(Math.ceil(y + margin * 2 - end));
  };

  return {
    check,
    release: check,
    stop() {
      extend(0);
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
