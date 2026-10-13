import { initRace } from './race';
import { initTyping } from './typing';
import { initContactForm } from './contact-form';
import { initDisclosure } from './disclosure';
import { initLightbox } from './lightbox';
import { initOrderFlow } from './order-flow';
import { initMonitor } from './monitor';

const boot = (): void => {
  initRace();
  initTyping();
  initContactForm();
  initDisclosure();
  initLightbox();
  initOrderFlow();
  initMonitor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
