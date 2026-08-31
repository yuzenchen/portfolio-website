import { initWave } from './wave';
import { initTyping } from './typing';

const boot = (): void => {
  initWave();
  initTyping();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
