import { prefersReducedMotion } from './canvas';

const DURATION = 1600;

export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('.countup');
  if (counters.length === 0) return;

  const reduced = prefersReducedMotion();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);

        const target = Number.parseFloat(el.dataset.target ?? '0');
        const dec = Number.parseInt(el.dataset.dec ?? '0', 10);

        if (reduced) {
          el.textContent = target.toFixed(dec);
          continue;
        }

        const t0 = performance.now();
        const step = (t: number): void => {
          const k = Math.min(1, (t - t0) / DURATION);
          const eased = 1 - Math.pow(1 - k, 3); // ease-out cubic
          el.textContent = (target * eased).toFixed(dec);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.4 },
  );

  counters.forEach((c) => observer.observe(c));
}
