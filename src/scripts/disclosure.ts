/**
 * "我做了什麼" disclosure. Opens on click, or on its own once the block reaches
 * the middle of the viewport — but never overrides a visitor who has already
 * toggled it themselves.
 *
 * The observer root is squeezed to a thin band at viewport centre: a collapsed
 * block is only ~36px tall, so a plain threshold would fire while it's still
 * peeking in at the bottom edge and it would look like it was never closed.
 */
export function initDisclosure(): void {
  const blocks = document.querySelectorAll<HTMLElement>('.case-more[data-auto-open]');
  if (blocks.length === 0) return;

  // The gallery reveals in the other column, so the open state also goes on
  // the enclosing .case article, not just the toggle block.
  const setOpen = (block: HTMLElement, open: boolean): void => {
    block.classList.toggle('is-open', open);
    block.closest<HTMLElement>('.case')?.classList.toggle('is-open', open);
    block.querySelector<HTMLButtonElement>('.case-toggle')?.setAttribute('aria-expanded', String(open));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const block = entry.target as HTMLElement;
        observer.unobserve(block);
        if (!block.dataset.touched) setOpen(block, true);
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );

  blocks.forEach((block) => {
    block.querySelector<HTMLButtonElement>('.case-toggle')?.addEventListener('click', () => {
      block.dataset.touched = '1';
      setOpen(block, !block.classList.contains('is-open'));
    });
    observer.observe(block);
  });
}
