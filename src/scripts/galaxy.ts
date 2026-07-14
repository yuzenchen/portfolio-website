import { SPEED, fitCanvas, prefersReducedMotion } from './canvas';
import { debounce } from './utils';

const PARTICLE_COUNT = 650;
/** Ellipse flattening: b = a * ORBIT_RATIO */
const ORBIT_RATIO = 0.26;
const CORE_RADIUS = 90;

interface Orbiter {
  /** semi-major / semi-minor axes */
  a: number;
  b: number;
  /** current angle + angular speed (inner orbits run faster) */
  th: number;
  sp: number;
  sz: number;
  /** colour bucket selector */
  c: number;
}

export function initGalaxy(): void {
  const cv = document.getElementById('cvGalaxy') as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  if (prefersReducedMotion()) return;

  let { w, h } = fitCanvas(cv);
  window.addEventListener(
    'resize',
    debounce(() => {
      ({ w, h } = fitCanvas(cv));
    }, 150),
  );

  const ps: Orbiter[] = Array.from({ length: PARTICLE_COUNT }, () => {
    const a = 60 + Math.pow(Math.random(), 0.6) * 260;
    return {
      a,
      b: a * ORBIT_RATIO,
      th: Math.random() * Math.PI * 2,
      sp: (14 / a) * (Math.random() * 0.5 + 0.75),
      sz: Math.random() * 1.6 + 0.4,
      c: Math.random(),
    };
  });

  const draw = (t: number): void => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h * 0.62;
    const tm = t * 0.001 * SPEED;

    ctx.globalCompositeOperation = 'lighter';

    // Breathing core
    const pulse = 1 + Math.sin(tm * 1.6) * 0.08;
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, CORE_RADIUS * pulse);
    core.addColorStop(0, 'rgba(255,255,255,.9)');
    core.addColorStop(0.25, 'rgba(120,235,200,.55)');
    core.addColorStop(0.6, 'rgba(70,140,220,.18)');
    core.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, CORE_RADIUS * pulse, 0, Math.PI * 2);
    ctx.fill();

    for (const p of ps) {
      const th = p.th + tm * p.sp;
      const x = cx + Math.cos(th) * p.a;
      const y = cy + Math.sin(th) * p.b + Math.cos(th * 2) * 3;
      const front = Math.sin(th) > 0 ? 1 : 0.45; // dim the far half of the orbit
      const col = p.c < 0.55 ? '120,235,200' : p.c < 0.85 ? '110,170,255' : '235,240,255';
      ctx.fillStyle = `rgba(${col},${(0.14 + 0.5 * (1 - p.a / 340)) * front})`;
      ctx.beginPath();
      ctx.arc(x, y, p.sz * front, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}
