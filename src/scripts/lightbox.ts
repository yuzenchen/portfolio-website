/**
 * Opens screenshots in a modal instead of leaving the page. Every
 * `a[data-lightbox]` is bound, with its `data-label` as the caption. The
 * markup is a plain link to the image, so without JS the click still shows
 * the file.
 */
export function initLightbox(): void {
  const dialog = document.getElementById('shot-lightbox') as HTMLDialogElement | null;
  const img = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const caption = document.getElementById('lightbox-caption');
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]');
  if (!dialog || !img || !caption || links.length === 0) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const label = link.dataset.label ?? '';
      img.src = link.href;
      img.alt = label;
      caption.textContent = label;
      dialog.showModal();
    });
  });

  dialog.querySelectorAll<HTMLElement>('[data-close-lightbox]').forEach((btn) =>
    btn.addEventListener('click', () => dialog.close()),
  );

  // Clicking the backdrop (anything that isn't the image) dismisses
  dialog.addEventListener('click', (e) => {
    if (e.target !== img) dialog.close();
  });
}
