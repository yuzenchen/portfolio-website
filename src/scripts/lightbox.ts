/**
 * Opens case-study screenshots in a modal instead of a new tab. The markup is
 * a plain link to the image, so without JS the click still shows the file.
 */
export function initLightbox(): void {
  const dialog = document.getElementById('shot-lightbox') as HTMLDialogElement | null;
  const img = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const caption = document.getElementById('lightbox-caption');
  const thumbs = document.querySelectorAll<HTMLAnchorElement>('.case-thumb');
  if (!dialog || !img || !caption || thumbs.length === 0) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      const label = thumb.dataset.label ?? '';
      img.src = thumb.href;
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
