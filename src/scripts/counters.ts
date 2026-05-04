export function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('.stat-number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const counter = entry.target as HTMLElement;
      const target = Number.parseInt(counter.dataset.target ?? '0', 10);
      const increment = target / 50;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = String(Math.floor(current));
      }, 50);
      observer.unobserve(counter);
    }
  });

  counters.forEach((c) => observer.observe(c));
}
