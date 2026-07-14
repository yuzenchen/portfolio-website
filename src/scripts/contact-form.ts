import { showNotification } from './notify';

const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT ?? '';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

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
    const originalText = submitBtn?.textContent ?? '發送訊息';
    if (submitBtn) {
      submitBtn.textContent = '發送中...';
      submitBtn.disabled = true;
    }

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
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}
