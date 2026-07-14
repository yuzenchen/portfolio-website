import { fitCanvas, prefersReducedMotion } from './canvas';
import { debounce } from './utils';

const STAR_COUNT = 160;

interface Star {
  /** normalised 0–1 position, so resize doesn't need a reseed */
  x: number;
  y: number;
  r: number;
  /** phase + speed of the twinkle */
  p: number;
  s: number;
}

export function initStars(): void {
  const cv = document.getElementById('cvStars') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  let { w, h } = fitCanvas(cv);
  window.addEventListener(
    'resize',
    debounce(() => {
      ({ w, h } = fitCanvas(cv));
    }, 150),
  );

  const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.3 + 0.3,
    p: Math.random() * Math.PI * 2,
    s: 0.5 + Math.random() * 1.5,
  }));

  const paint = (t: number): void => {
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      const a = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.001 * st.s + st.p));
      ctx.fillStyle = `rgba(190,220,255,${a})`;
      ctx.beginPath();
      ctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  if (prefersReducedMotion()) {
    paint(0);
    return;
  }

  const draw = (t: number): void => {
    paint(t);
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
