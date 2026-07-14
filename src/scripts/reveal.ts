export function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.fade');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  elements.forEach((el) => observer.observe(el));
}
