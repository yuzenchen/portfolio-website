import { SPEED, fitCanvas, loopOnVisible, prefersReducedMotion } from './canvas';
import { debounce } from './utils';

const ROWS = 34;
const COLS = 96;
/** Max downward displacement of the cursor "black hole" dent, in px. */
const MAX_DENT = 28;

/**
 * Perspective particle terrain across the hero. Rows run far (top) to near
 * (bottom); height comes from layered sin/cos noise, and the cursor pushes
 * the surface down with an inverse-square falloff.
 */
export function initWave(): void {
  const cv = document.getElementById('cvWave') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const host = cv.parentElement;
  if (!host) return;
  if (prefersReducedMotion()) return;

  let { w, h } = fitCanvas(cv);
  window.addEventListener(
    'resize',
    debounce(() => {
      ({ w, h } = fitCanvas(cv));
    }, 150),
  );

  const mouse = { x: -9999, y: -9999 };
  host.addEventListener('mousemove', (e) => {
    const r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  host.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  const draw = (t: number): void => {
    const tm = t * 0.0006 * SPEED;
    ctx.clearRect(0, 0, w, h);
    const horizon = h * 0.52;

    for (let i = 0; i < ROWS; i++) {
      const z = i / (ROWS - 1); // 0 far → 1 near
      const y0 = horizon + Math.pow(z, 1.7) * (h - horizon - 8);
      const spread = 1 + z * 1.6;

      for (let j = 0; j < COLS; j++) {
        const u = j / (COLS - 1) - 0.5;
        const x = w / 2 + u * w * spread;
        if (x < -10 || x > w + 10) continue;

        const n =
          Math.sin(j * 0.32 + tm * 2 + i * 0.55) * Math.cos(i * 0.38 - tm * 1.4) +
          Math.sin(j * 0.11 - tm) * 0.6;
        let y = y0 - n * 16 * (0.25 + z);

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        y += Math.min(MAX_DENT, (90000 / (d2 + 900)) * 0.35);

        const hue = 165 - (n * 0.5 + 0.5) * 60 - z * 30; // teal → blue
        ctx.fillStyle = `hsla(${hue},70%,${55 + n * 10}%,${0.12 + z * 0.5})`;
        const s = 0.8 + z * 1.6;
        ctx.fillRect(x, y, s, s);
      }
    }
  };

  loopOnVisible(cv, draw);
}
