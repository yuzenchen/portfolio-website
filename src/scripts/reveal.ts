const SELECTOR = '.service-card, .portfolio-item, .skill-category, .contact-item';

export function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (elements.length === 0) return;

  elements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' },
  );

  elements.forEach((el) => observer.observe(el));
}
