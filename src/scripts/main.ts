import { initWave } from './wave';
import { initTyping } from './typing';
import { initContactForm } from './contact-form';

const boot = (): void => {
  initWave();
  initTyping();
  initContactForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
