/**
 * Opens a <details data-auto-open> once it scrolls into view. The element
 * works as a normal click-to-expand disclosure without this; the observer
 * just saves the visitor the click.
 */
export function initAutoDetails(): void {
  const targets = document.querySelectorAll<HTMLDetailsElement>('details[data-auto-open]');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLDetailsElement;
        observer.unobserve(el);
        // Leave it alone if the visitor already opened (or closed) it.
        if (!el.dataset.touched) el.open = true;
      }
    },
    { threshold: 0.25 },
  );

  targets.forEach((el) => {
    el.addEventListener('toggle', () => {
      el.dataset.touched = '1';
    }, { once: true });
    observer.observe(el);
  });
}
