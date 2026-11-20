"use client";

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/scroll";
import { mountDeck } from "@/lib/sequence";

/**
 * The offer cards. On desktop this is just their flex column (the cards stay
 * plain sticky ones). On phones and tablets it becomes a pinned deck: the
 * cards slide in one after another at a steady pace, however fast the scroll.
 */
export function OfferDeck({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const pin = track?.firstElementChild as HTMLElement | null;
    if (!track || !pin || prefersReducedMotion()) return;

    const mobileMq = window.matchMedia("(max-width: 1024px)");
    let unmount = () => {};
    const configure = () => {
      unmount();
      unmount = () => {};
      if (!mobileMq.matches) return;
      const cards = [...pin.querySelectorAll<HTMLElement>(":scope > .dyas-offer-card")];
      unmount = mountDeck({ id: "offer", track, pin, cards });
    };
    configure();
    mobileMq.addEventListener("change", configure);
    return () => {
      unmount();
      mobileMq.removeEventListener("change", configure);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="dyas-offer__cards"
      style={{ "--offer-count": Children.count(children) } as CSSProperties}
    >
      <div className="dyas-offer__pin">{children}</div>
    </div>
  );
}
