import { throttle } from './utils';

/** Hero parallax — separated from CSS so we can disable on small screens. */
export function initHeroParallax(): void {
  const visual = document.querySelector<HTMLElement>('.hero-visual');
  if (!visual) return;

  const onScroll = throttle(() => {
    const rate = window.pageYOffset * -0.5;
    visual.style.transform = `translateY(${rate}px)`;
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
}
