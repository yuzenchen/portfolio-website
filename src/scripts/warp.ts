import { SPEED, fitCanvas, loopOnVisible, prefersReducedMotion } from './canvas';
import { debounce } from './utils';

const STREAK_COUNT = 220;
const COLORS = ['120,235,200', '110,170,255', '190,120,255', '255,120,200', '235,240,255'];
/** Speed multiplier applied when the section scrolls in, easing back to cruise. */
const BOOST_ON_ENTER = 2.2;
/** Past this normalised distance a streak has left the frame and is recycled. */
const RESET_DISTANCE = 1.15;

interface Streak {
  /** angle out from the vanishing point */
  th: number;
  /** normalised distance travelled outward */
  d: number;
  c: string;
  sz: number;
}

function make(): Streak {
  return {
    th: Math.random() * Math.PI * 2,
    d: Math.random() * 0.9 + 0.05,
    c: COLORS[(Math.random() * COLORS.length) | 0]!,
    sz: Math.random() * 1.4 + 0.4,
  };
}

/**
 * Warp tunnel: streaks fire radially out from a vanishing point and accelerate
 * as they travel, so the field reads as depth. Trails come from washing the
 * canvas with a translucent fill each frame instead of clearing it.
 */
export function initWarp(): void {
  const cv = document.getElementById('cvWarp') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const host = cv.parentElement;
  if (!host) return;
  if (prefersReducedMotion()) return;

  // 'lighter' compositing is costly, so this canvas stays at dpr 1.
  let { w, h } = fitCanvas(cv, 1);

  const paintBackdrop = (): void => {
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);
  };

  window.addEventListener(
    'resize',
    debounce(() => {
      ({ w, h } = fitCanvas(cv, 1));
      paintBackdrop();
    }, 150),
  );

  // Parallax: the vanishing point drifts toward the cursor.
  const mouse = { x: 0, y: 0 };
  host.addEventListener('mousemove', (e) => {
    const r = cv.getBoundingClientRect();
    mouse.x = (e.clientX - r.left - r.width / 2) / r.width;
    mouse.y = (e.clientY - r.top - r.height / 2) / r.height;
  });

  let boost = 0;
  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) boost = BOOST_ON_ENTER;
    },
    { threshold: 0.5 },
  ).observe(cv);

  const streaks: Streak[] = Array.from({ length: STREAK_COUNT }, make);

  // Opaque first frame so the trail wash has something to build on.
  paintBackdrop();

  const draw = (): void => {
    boost += (0 - boost) * 0.012;
    const sp = (0.012 + boost * 0.02) * SPEED;

    ctx.fillStyle = 'rgba(13,17,23,.32)';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2 + mouse.x * w * 0.12;
    const cy = h / 2 + mouse.y * h * 0.12;
    const R = Math.hypot(w, h) * 0.55;

    ctx.globalCompositeOperation = 'lighter';
    for (const p of streaks) {
      const d0 = p.d;
      p.d *= 1 + sp * (0.6 + p.d * 2.4); // further out = faster
      const x0 = cx + Math.cos(p.th) * d0 * R;
      const y0 = cy + Math.sin(p.th) * d0 * R * 0.9;
      const x1 = cx + Math.cos(p.th) * p.d * R;
      const y1 = cy + Math.sin(p.th) * p.d * R * 0.9;
      ctx.strokeStyle = `rgba(${p.c},${Math.min(0.9, 0.1 + p.d * 1.1)})`;
      ctx.lineWidth = p.sz * (0.4 + p.d * 2);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
      if (p.d > RESET_DISTANCE) Object.assign(p, make(), { d: Math.random() * 0.12 + 0.02 });
    }

    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    core.addColorStop(0, 'rgba(140,220,255,.14)');
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  };

  loopOnVisible(cv, draw);
}
