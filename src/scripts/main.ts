import { initNav } from './nav';
import { initParticles } from './particles';
import { initTyping } from './typing';
import { initCounters } from './counters';
import { initReveal } from './reveal';
import { initContactForm } from './contact-form';
import { initHeroParallax } from './hover';

const boot = (): void => {
  initNav();
  initParticles();
  initTyping();
  initCounters();
  initReveal();
  initContactForm();
  initHeroParallax();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
