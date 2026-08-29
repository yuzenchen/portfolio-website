import { initWave } from './wave';

const boot = (): void => {
  initWave();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
