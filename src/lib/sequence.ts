import { collapseOncePlayed, forwardOnly, holdUntilPlayed, onScrollPaint, scrollProgress } from "@/lib/scroll";

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

/** Share of a card's scroll slot to pass before it comes in. */
const DECK_ENTER = 0.35;
/** Scroll slots after the last card has come in, as a share of one slot. Matches the CSS track height. */
const DECK_TAIL = 0.25;
// Starts at about its average speed and lands softly, so a card glides up. A
// sharper ease-out covers nearly the whole distance in the first third of the
// time, and the card read as shooting in however long the slide was.
const DECK_EASE = "cubic-bezier(0.3, 0.3, 0.2, 1)";

/**
 * A deck of cards stacked in one pinned screen: each card after the first
 * slides up over the one before it. Used on phones and tablets.
 *
 * The scroll decides when a card comes in (once it is a little way into the
 * card's slot); the slide itself is a CSS transition. A slide driven from
 * script every frame trails the finger on iOS, where the page scrolls on
 * another thread, and the cards travel faster than the scroll, so it read as
 * lag. A transition runs on the compositor and is smooth whatever the main
 * thread is doing. However fast the scroll, cards come in one at a time
 * (`gap` apart) and the pinned screen stays until the last one has landed.
 */
export function mountDeck({
  id,
  track,
  pin,
  cards,
  duration = 800,
  gap = 560,
}: {
  id: string;
  track: HTMLElement;
  pin: HTMLElement;
  cards: HTMLElement[];
  /** Length of one card's slide, ms. */
  duration?: number;
  /** Shortest time between two cards starting to come in, ms. */
  gap?: number;
}) {
  const n = cards.length;
  const slots = Math.max(1, n - 1 + DECK_TAIL);
  let shown = 0;
  let target = 0;
  let timer = 0;
  let pinnedAt = 0;
  let finished = n <= 1;

  // A waiting card sits in place underneath the first one rather than below
  // the screen: off screen the browser would not paint it, and painting a
  // full-screen photo the moment its slide starts dropped frames (on iOS).
  for (const img of cards.flatMap((card) => [...card.querySelectorAll("img")])) {
    img.decode?.().catch(() => {});
  }
  // Stacking is set explicitly: a waiting card is below every card that is in
  // (left to the DOM order, the last card would sit on top of the first and the
  // deck would open on its end), and each card in is above the ones before it.
  const wait = (card: HTMLElement) => {
    card.style.transition = "none";
    card.style.zIndex = "0";
    card.style.transform = "translate3d(0, 0, 0)";
  };
  const land = (card: HTMLElement) => {
    card.style.transition = "none";
    card.style.zIndex = String(cards.indexOf(card) + 1);
    card.style.transform = "translate3d(0, 0, 0)";
  };
  const slideIn = (card: HTMLElement) => {
    // Back on top and just below the screen (the extra distance keeps its
    // shadow out of view), then slides up from there.
    card.style.transition = "none";
    card.style.zIndex = String(cards.indexOf(card) + 1);
    card.style.transform = `translate3d(0, ${pin.offsetHeight + 80}px, 0)`;
    void card.offsetHeight;
    card.style.transition = `transform ${duration}ms ${DECK_EASE}`;
    card.style.transform = "translate3d(0, 0, 0)";
  };
  cards.forEach((card, i) => (i === 0 ? land(card) : wait(card)));

  const finish = () => {
    finished = true;
    gate.release();
    played.check();
  };

  const advance = () => {
    timer = 0;
    if (shown < target) {
      // The first card gets its moment too before the next one covers it.
      const hold = shown === 0 ? pinnedAt + gap - performance.now() : 0;
      if (hold > 0) {
        timer = window.setTimeout(advance, hold);
        return;
      }
      shown += 1;
      slideIn(cards[shown]);
      // The next card may follow once this one is well on its way; the deck
      // has played once the last one has landed.
      timer = window.setTimeout(advance, shown < n - 1 ? gap : duration);
      return;
    }
    if (shown >= n - 1) finish();
  };

  // Everything in at once (a deck that played earlier, or a jump past it).
  const showAll = () => {
    window.clearTimeout(timer);
    timer = 0;
    shown = target = n - 1;
    cards.forEach(land);
    finished = true;
  };

  const played = collapseOncePlayed(id, track, pin, () => finished);
  const gate = holdUntilPlayed(track, pin, () => finished, showAll);
  if (played.restored) showAll();

  const stop = onScrollPaint(() => {
    gate.check();
    if (!finished) {
      const p = scrollProgress(track, pin);
      if (p > 0 && !pinnedAt) pinnedAt = performance.now();
      const slot = p * slots;
      let next = p >= 1 ? n - 1 : 0;
      for (let i = 1; i < n; i++) if (slot >= i - 1 + DECK_ENTER) next = i;
      // Forward only: scrolling back up never takes a card out again.
      target = Math.max(target, next);
      if (target > shown && !timer) advance();
    }
    played.check();
  });

  return () => {
    stop();
    window.clearTimeout(timer);
    played.stop();
    gate.stop();
    cards.forEach((card) => {
      card.style.transition = "";
      card.style.transform = "";
      card.style.zIndex = "";
    });
  };
}
