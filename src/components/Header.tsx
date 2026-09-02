"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { onScrollPaint, prefersReducedMotion, supportsScrollTimeline } from "@/lib/scroll";

const TARGET_PX = 20;
const COMPACT = "(max-width: 1024px)";
const TOP_PX = 16;
const DIR_PX = 8;

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg className="dyas-menu-btn__icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {open ? (
        <path d="M7 7l10 10M17 7L7 17" />
      ) : (
        <path d="M4.5 8.25h15M4.5 15.75h10.5" />
      )}
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [recede, setRecede] = useState(false);
  const [away, setAway] = useState(false);
  const [frost, setFrost] = useState(false);
  const lockupRef = useRef<HTMLSpanElement>(null);
  const lastYRef = useRef(0);
  const openRef = useRef(false);

  openRef.current = open;

  useEffect(() => {
    const showreel = document.querySelector(".dyas-hero-stage");
    const compact = window.matchMedia(COMPACT);

    const apply = () => {
      if (compact.matches) {
        setRecede(false);
        return;
      }
      if (!showreel) {
        setRecede(false);
        return;
      }
      const rect = showreel.getBoundingClientRect();
      setRecede(rect.top <= 0 && rect.bottom > 0);
    };

    const stop = onScrollPaint(apply);
    compact.addEventListener("change", apply);
    return () => {
      stop();
      compact.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    const compact = window.matchMedia(COMPACT);
    lastYRef.current = window.scrollY;

    const apply = () => {
      if (!compact.matches) {
        setAway(false);
        setFrost(false);
        return;
      }
      if (openRef.current) {
        setAway(false);
        setFrost(true);
        return;
      }
      const y = Math.max(0, window.scrollY);
      if (y <= TOP_PX) {
        setAway(false);
        setFrost(false);
        lastYRef.current = y;
        return;
      }
      setFrost(true);
      const delta = y - lastYRef.current;
      if (delta > DIR_PX) {
        setAway(true);
        lastYRef.current = y;
      } else if (delta < -DIR_PX) {
        setAway(false);
        lastYRef.current = y;
      }
    };

    const stop = onScrollPaint(apply);
    compact.addEventListener("change", apply);
    return () => {
      stop();
      compact.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const lockup = lockupRef.current;
    if (!lockup) return;
    const reduced = prefersReducedMotion();
    document.documentElement.classList.toggle("dyas--anim", !reduced);
    if (reduced) return;

    const mq = window.matchMedia("(min-width: 769px)");
    const cssScroll = supportsScrollTimeline();
    let fontSize = 0;

    const readSize = () => {
      fontSize = parseFloat(getComputedStyle(lockup).fontSize) || 200;
      lockup.style.setProperty("--lockup-range", `${Math.max(300, fontSize)}px`);
    };

    const luminance = (color: string) => {
      const nums = color.match(/\d+(\.\d+)?/g);
      if (!nums || nums.length < 3) return 255;
      const [r, g, b] = nums.map(Number);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const invert = () => {
      try {
        const box = lockup.getBoundingClientRect();
        if (!box.width) return;
        const y = Math.min(window.innerHeight - 2, Math.max(2, box.top + box.height / 2));
        let dark = 0;
        let hits = 0;
        for (let i = 0; i < 5; i++) {
          const x = box.left + (box.width * (i + 0.5)) / 5;
          if (x < 0 || x >= window.innerWidth) continue;
          let node = document.elementFromPoint(x, y) as HTMLElement | null;
          while (node) {
            const cl = node.classList;
            if (cl && (cl.contains("dyas-tile") || cl.contains("dyas-showreel__frame"))) {
              hits++;
              dark++;
              break;
            }
            const bg = getComputedStyle(node).backgroundColor;
            if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
              hits++;
              if (luminance(bg) < 140) dark++;
              break;
            }
            node = node.parentElement;
          }
        }
        lockup.classList.toggle("dyas-lockup--on-dark", hits > 0 && dark * 2 >= hits);
      } catch {
        /* ignore */
      }
    };

    const tick = () => {
      if (!mq.matches) {
        lockup.style.transform = "";
        lockup.classList.remove("dyas-lockup--on-dark");
        return;
      }
      if (!fontSize) readSize();
      if (!cssScroll) {
        const t = Math.min(1, Math.max(0, window.scrollY / Math.max(300, fontSize)));
        if (t < 0.005) lockup.style.transform = "";
        else {
          const k = 1 + (TARGET_PX / fontSize - 1) * t;
          lockup.style.transform = `scale(${k.toFixed(4)})`;
        }
      }
      invert();
    };

    const onResize = () => {
      fontSize = 0;
      tick();
    };

    readSize();
    const stop = onScrollPaint(tick);
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    return () => {
      document.documentElement.classList.remove("dyas--anim");
      stop();
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      lockup.style.transform = "";
    };
  }, []);

  return (
    <>
      <header
        data-header-root="true"
        className={cn(
          "dyas-header",
          recede && "dyas-header--recede",
          away && "dyas-header--away",
          frost && "dyas-header--frost",
        )}
      >
        <Link href="/" aria-label="Home" className="contents">
          <Wordmark ref={lockupRef} />
        </Link>
      </header>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn("dyas-menu-btn", away && "dyas-menu-btn--away", frost && "dyas-menu-btn--frost")}
        onClick={() => setOpen((v) => !v)}
      >
        <MenuGlyph open={open} />
        <span className="dyas-menu-btn__label">{open ? "Close" : "Menu"}</span>
      </button>

      <div
        id="site-navigation"
        className={cn(
          "fixed inset-0 z-30 flex flex-col justify-between bg-day px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom))] text-black transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        inert={!open ? true : undefined}
      >
        <nav className="mx-auto flex w-full max-w-[42rem] flex-col gap-2">
          {nav.links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-heading-40 py-2"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mx-auto w-full max-w-[42rem]">
          <Button href={site.ctaHref}>{site.ctaLabel}</Button>
        </div>
      </div>
    </>
  );
}
