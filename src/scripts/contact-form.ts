import { showNotification } from './notify';

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT ?? '';

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      showNotification('請填寫所有必要欄位', 'error');
      return;
    }

    if (!FORMSPREE_ENDPOINT) {
      showNotification('表單尚未設定 Formspree endpoint', 'error');
      return;
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const span = submitBtn?.querySelector<HTMLSpanElement>('span');
    const originalText = span?.textContent ?? '發送訊息';
    if (span) span.textContent = '發送中...';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (resp.ok) {
        showNotification('訊息已送出，我會盡快回覆你', 'success');
        form.reset();
      } else {
        showNotification('發送失敗，請稍後再試', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('網路錯誤，請稍後再試', 'error');
    } finally {
      if (span) span.textContent = originalText;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
