const PHRASES = [
  'IT SRE & Full Stack Developer',
  'Python & JavaScript Expert',
  'DevOps & Automation Specialist',
  'Web Development Professional',
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_TIME = 2000;

export function initTyping(): void {
  const el = document.querySelector<HTMLElement>('.typing-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = (): void => {
    const phrase = PHRASES[phraseIndex] ?? '';
    if (deleting) {
      el.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    } else {
      el.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_TIME);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    }
  };

  setTimeout(tick, 1000);
}
