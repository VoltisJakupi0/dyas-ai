import { clamp01, collapseOncePlayed, forwardOnly, holdUntilPlayed, onScrollPaint, scrollProgress } from "@/lib/scroll";

/**
 * A pinned, scroll-linked sequence with the house rules applied:
 * - it follows the scroll, but never faster than `minDuration` for the whole
 *   thing, so a fast scroll still plays it smoothly;
 * - scrolled through faster than that, the pinned screen stays until it is done;
 * - it only plays forward, and once played its scroll track collapses to the
 *   pinned screen, so the way back up is neither a rewind nor a frozen stretch.
 */
export function mountSequence({
  id,
  track,
  pin,
  paint,
  rest,
  minDuration,
}: {
  id: string;
  track: HTMLElement;
  pin: HTMLElement | null;
  paint: (progress: number) => void;
  /** Nearest point at or after `progress` where the sequence can sit still. */
  rest?: (progress: number) => number;
  minDuration: number;
}) {
  const latch = forwardOnly(
    (p) => {
      paint(p);
      if (p < 1) return;
      gate.release();
      played.check();
    },
    rest,
    minDuration,
  );
  const played = collapseOncePlayed(id, track, pin, () => latch.done());
  // Scrolled through faster than it can play, the pinned screen waits for it.
  const gate = holdUntilPlayed(
    track,
    pin,
    () => latch.done(),
    () => latch.set(1),
  );
  if (played.restored) latch.set(1);

  const stop = onScrollPaint(() => {
    gate.check();
    latch.update(scrollProgress(track, pin));
    played.check();
  });

  return () => {
    stop();
    latch.stop();
    played.stop();
    gate.stop();
  };
}

/** Share of each card's scroll slot it rests before the next card comes in. */
const DECK_REST = 0.3;
/** Scroll slots after the last card has landed, as a share of one slot. Matches the CSS track height. */
const DECK_TAIL = 0.25;

/**
 * A deck of cards stacked in one pinned screen: each card after the first
 * slides up over the one before it. Used on phones and tablets, where the
 * stack used to be plain sticky cards that simply moved as fast as the scroll.
 */
export function mountDeck({
  id,
  track,
  pin,
  cards,
  secondsPerCard = 0.32,
}: {
  id: string;
  track: HTMLElement;
  pin: HTMLElement;
  cards: HTMLElement[];
  secondsPerCard?: number;
}) {
  const n = cards.length;
  const slots = Math.max(1, n - 1 + DECK_TAIL);

  // Cards waiting below are left painted (not hidden) and their images decoded
  // up front, so a card never flashes in blank. The extra distance keeps a
  // waiting card's shadow out of the pinned screen too.
  for (const img of cards.flatMap((card) => [...card.querySelectorAll("img")])) {
    img.decode?.().catch(() => {});
  }
  const paint = (p: number) => {
    const slot = p * slots;
    const away = pin.offsetHeight + 80;
    cards.forEach((card, i) => {
      const t = i === 0 ? 1 : clamp01((slot - (i - 1) - DECK_REST) / (1 - DECK_REST));
      // Eased in and out, so a card picks up speed and lands softly instead of
      // sliding at one speed and stopping dead.
      const entered = t * t * (3 - 2 * t);
      card.style.transform = `translate3d(0, ${((1 - entered) * away).toFixed(1)}px, 0)`;
    });
  };

  const rest = (p: number) => {
    const slot = p * slots;
    const i = Math.floor(slot);
    return i < n - 1 && slot - i > DECK_REST ? Math.min(1, (i + 1) / slots) : p;
  };

  const unmount = mountSequence({ id, track, pin, paint, rest, minDuration: slots * secondsPerCard * 1000 });

  return () => {
    unmount();
    cards.forEach((card) => {
      card.style.transform = "";
    });
  };
}
