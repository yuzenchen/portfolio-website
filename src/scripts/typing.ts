import { prefersReducedMotion } from './canvas';

const LINE_1 = '高可用系統，';
const LINE_2 = '從程式碼到維運。';
const CHAR_MS = 90;

export function initTyping(): void {
  const a = document.getElementById('typeA');
  const b = document.getElementById('typeB');
  if (!a || !b) return;

  if (prefersReducedMotion()) {
    a.textContent = LINE_1;
    b.textContent = LINE_2;
    return;
  }

  const total = LINE_1.length + LINE_2.length;
  let i = 0;

  const tick = (): void => {
    i++;
    a.textContent = LINE_1.slice(0, i);
    b.textContent = i > LINE_1.length ? LINE_2.slice(0, i - LINE_1.length) : '';
    if (i < total) setTimeout(tick, CHAR_MS);
  };
  tick();
}
