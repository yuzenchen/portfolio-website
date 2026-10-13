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
  const status = form.querySelector<HTMLElement>('[data-form-status]');

  // Errors are written inside the dialog: an open modal sits in the top
  // layer, so a page-level toast would render underneath its backdrop.
  const setStatus = (message: string): void => {
    if (!status) return;
    status.textContent = message;
    status.hidden = message === '';
  };
  // Validation errors sit under the field they belong to, wired up with
  // aria-invalid / aria-describedby, and focus moves there.
  const fields = ['name', 'email', 'message'] as const;
  const fieldError = (id: string, message: string): void => {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
    const note = form.querySelector<HTMLElement>(`#${id}-error`);
    if (!input || !note) return;
    note.textContent = message;
    note.hidden = message === '';
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', note.id);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  };
  const clearAll = (): void => {
    setStatus('');
    fields.forEach((id) => fieldError(id, ''));
  };
  form.addEventListener('input', (e) => {
    const id = (e.target as HTMLElement).id;
    if ((fields as readonly string[]).includes(id)) fieldError(id, '');
    setStatus('');
  });
  dialog.addEventListener('close', clearAll);

  openBtn.addEventListener('click', () => dialog.showModal());
  closeButtons.forEach((b) => b.addEventListener('click', () => dialog.close()));

  // Click on the backdrop (outside the panel) dismisses
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAll();

    const data = new FormData(form);
    const email = String(data.get('email') ?? '');

    const problems: [string, string][] = [];
    if (!String(data.get('name') ?? '').trim()) problems.push(['name', '請填寫姓名。']);
    if (!email) problems.push(['email', '請填寫 Email，我會用它回覆你。']);
    else if (!EMAIL_RE.test(email)) problems.push(['email', 'Email 格式不正確，請確認是否少了 @ 或網域。']);
    if (!String(data.get('message') ?? '').trim()) problems.push(['message', '請簡單說明你的需求。']);
    if (problems.length > 0) {
      problems.forEach(([id, msg]) => fieldError(id, msg));
      form.querySelector<HTMLElement>(`#${problems[0]![0]}`)?.focus();
      return;
    }
    if (!FORMSPREE_ENDPOINT) {
      setStatus('表單暫時無法送出，請改寄信到 mail@yuzen.tw。');
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
        setStatus('送出失敗，請稍後再試，或直接寄信到 mail@yuzen.tw。');
      }
    } catch (err) {
      console.error(err);
      setStatus('網路連線中斷，請確認連線後再送出一次。');
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}
