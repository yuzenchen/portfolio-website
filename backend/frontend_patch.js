// 使用後端API發送Telegram訊息版本
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        if (!data.name || !data.email || !data.message) {
            showNotification('請填寫所有必要欄位', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.querySelector('span').textContent;
        submitBtn.querySelector('span').textContent = '發送中...';
        submitBtn.disabled = true;

        try {
            const resp = await fetch('/api/send-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await resp.json();
            if (resp.ok && result.status === 'success') {
                showNotification('訊息已成功送出（Telegram）', 'success');
                form.reset();
            } else {
                showNotification('發送失敗，請稍後再試', 'error');
            }
        } catch (err) {
            console.error(err);
            showNotification('網路錯誤，請稍後再試', 'error');
        } finally {
            submitBtn.querySelector('span').textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
