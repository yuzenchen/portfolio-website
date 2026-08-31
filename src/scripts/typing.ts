import { prefersReducedMotion } from './canvas';

const WORDS = ['whoami', 'yuzen', 'sre', 'devops', 'consultant'];
const TYPE_MS = 90;
const DELETE_MS = 45;
/** How long a fully-typed word stays before deleting. */
const HOLD_MS = 3000;

export function initTyping(): void {
  const el = document.getElementById('typeWord');
  if (!el) return;

  if (prefersReducedMotion()) {
    el.textContent = WORDS[0] ?? '';
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = (): void => {
    const word = WORDS[wordIndex] ?? '';
    if (deleting) {
      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % WORDS.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, DELETE_MS);
    } else {
      charIndex++;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
        return;
      }
      setTimeout(tick, TYPE_MS);
    }
  };

  tick();
}
