import { showNotification } from './notify';

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Booking dialog: opened from the contact CTA, submits to Formspree over
 * fetch so the visitor stays on the page.
 */
export function initContactForm(): void {
  const dialog = document.getElementById('booking-dialog') as HTMLDialogElement | null;
  const openBtn = document.getElementById('booking-open');
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!dialog || !openBtn || !form) return;

  const closeButtons = dialog.querySelectorAll<HTMLElement>('[data-close-dialog]');

  openBtn.addEventListener('click', () => dialog.showModal());
  closeButtons.forEach((b) => b.addEventListener('click', () => dialog.close()));

  // Click on the backdrop (outside the panel) dismisses
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const email = String(data.get('email') ?? '');

    if (!data.get('name') || !email || !data.get('message')) {
      showNotification('請填寫所有必要欄位', 'error');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showNotification('Email 格式不正確', 'error');
      return;
    }
    if (!FORMSPREE_ENDPOINT) {
      showNotification('表單尚未設定 Formspree endpoint', 'error');
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const originalText = submitBtn?.textContent ?? '送出預約';
    if (submitBtn) {
      submitBtn.textContent = '送出中...';
      submitBtn.disabled = true;
    }

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (resp.ok) {
        form.reset();
        dialog.close();
        showNotification('已收到你的預約，我會盡快回覆', 'success');
      } else {
        showNotification('送出失敗，請稍後再試', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('網路錯誤，請稍後再試', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}
