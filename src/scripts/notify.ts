export type NotificationType = 'success' | 'error' | 'info';

export function showNotification(message: string, type: NotificationType = 'info'): void {
  const el = document.createElement('div');
  el.className = `notification notification-${type}`;
  el.textContent = message;
  document.body.appendChild(el);

  // next frame so the transition triggers
  requestAnimationFrame(() => el.classList.add('is-visible'));

  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 300);
  }, 4000);
}
