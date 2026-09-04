import { initWave } from './wave';
import { initTyping } from './typing';
import { initContactForm } from './contact-form';
import { initDisclosure } from './disclosure';
import { initLightbox } from './lightbox';

const boot = (): void => {
  initWave();
  initTyping();
  initContactForm();
  initDisclosure();
  initLightbox();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
