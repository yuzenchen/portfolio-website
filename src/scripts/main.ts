import { initRace } from './race';
import { initCountdown } from './countdown';
import { initContactForm } from './contact-form';
import { initLightbox } from './lightbox';
import { initOrderFlow } from './order-flow';
import { initMonitor } from './monitor';

const boot = (): void => {
  initRace();
  initCountdown();
  initContactForm();
  initLightbox();
  initOrderFlow();
  initMonitor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
