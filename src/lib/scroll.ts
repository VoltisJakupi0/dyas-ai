export function viewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function scrollProgress(el: HTMLElement) {
  const range = el.offsetHeight - viewportHeight();
  if (range <= 0) return 0;
  return clamp01(-el.getBoundingClientRect().top / range);
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
  options?: IntersectionObserverInit,
) {
  const list = [...nodes];
  if (!list.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        onEnter(entry.target);
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08, ...options },
  );

  for (const n of list) io.observe(n);

  requestAnimationFrame(() => {
    const h = viewportHeight();
    for (const n of list) {
      const r = n.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) {
        onEnter(n);
        io.unobserve(n);
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
