import { initWave } from './wave';
import { initTyping } from './typing';
import { initContactForm } from './contact-form';
import { initAutoDetails } from './autodetails';
import { initLightbox } from './lightbox';

const boot = (): void => {
  initWave();
  initTyping();
  initContactForm();
  initAutoDetails();
  initLightbox();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
