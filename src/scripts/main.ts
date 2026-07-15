import { initStars } from './stars';
import { initWave } from './wave';
import { initGalaxy } from './galaxy';
import { initWarp } from './warp';
import { initTyping } from './typing';
import { initCounters } from './counters';
import { initReveal } from './reveal';
import { initContactForm } from './contact-form';

const boot = (): void => {
  initStars();
  initWave();
  initGalaxy();
  initWarp();
  initTyping();
  initCounters();
  initReveal();
  initContactForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
