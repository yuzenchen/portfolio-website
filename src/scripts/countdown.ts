import { prefersReducedMotion } from './motion';

const DURATION_MS = 1600;

/**
 * The counter's value at progress t (0..1), eased out with a cubic so it
 * slows as it lands: 1 - (1 - t)^3. Rounded to whole numbers.
 */
export function countValue(from: number, to: number, t: number): number {
  const p = Math.min(1, Math.max(0, t));
  const eased = 1 - (1 - p) ** 3;
  return Math.round(from + (to - from) * eased);
}

/**
 * Results row: the first card counts down from the old reconciliation time
 * to the new one, once, the first time it is mostly in view. With JS and
 * motion allowed it shows the old figure from boot until then. The markup
 * already shows the final figure, and the number is aria-hidden (the card
 * carries a full sentence for screen readers), so nothing is lost when
 * this never runs.
 */
export function initCountdown(): void {
  const el = document.querySelector<HTMLElement>('[data-countdown]');
  if (!el || prefersReducedMotion()) return;
  const card = el.closest<HTMLElement>('.result') ?? el;

  const from = Number(el.dataset.from);
  const to = Number(el.dataset.to);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return;

  // Start from the old figure straight away, so a visitor scrolling down
  // never sees the final figure jump back before the count begins.
  el.textContent = String(from);

  const play = (): void => {
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      el.textContent = String(countValue(from, to, t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.6)) {
        observer.disconnect();
        play();
      }
    },
    { threshold: 0.6 },
  );
  observer.observe(card);
}
