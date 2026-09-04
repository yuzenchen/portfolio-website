import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { draw, DURATION, enter, mix, pop, seg } from '@scripts/anim';

describe('timeline primitives', () => {
  it('clamps at both ends of the window', () => {
    expect(seg(0, 2, 1)).toBe(0);
    expect(seg(1.9, 2, 1)).toBe(0);
    expect(seg(3.1, 2, 1)).toBe(1);
    expect(seg(2.5, 2, 1)).toBeCloseTo(0.5);
  });

  it('enters from 18px below at zero opacity', () => {
    expect(enter(0, 1)).toEqual({ o: 0, y: 18 });
    expect(enter(9, 1)).toEqual({ o: 1, y: 0 });
  });

  it('draws 0 to 1', () => {
    expect(draw(0, 1)).toBe(0);
    expect(draw(9, 1)).toBe(1);
  });

  it('pops from 0.4 to 1, overshooting on the way', () => {
    expect(pop(0, 1).s).toBeCloseTo(0.4);
    expect(pop(9, 1).s).toBeCloseTo(1);
    // easeOutBack means it passes 1 before settling
    const peak = Math.max(...Array.from({ length: 60 }, (_, i) => pop(1 + i * 0.01, 1).s));
    expect(peak).toBeGreaterThan(1);
    // opacity is done in the first 40% of the window
    expect(pop(1.22, 1, 0.55).o).toBe(1);
  });

  it('blends colours end to end', () => {
    expect(mix('#000000', '#ffffff', 0)).toBe('rgb(0,0,0)');
    expect(mix('#000000', '#ffffff', 1)).toBe('rgb(255,255,255)');
    expect(mix('#000000', '#ffffff', 0.5)).toBe('rgb(128,128,128)');
  });
});

/* ── Driving the two animations against the real markup ──────────────── */

const PALETTE: Record<string, string> = {
  '--an-a': '#3d9be9',
  '--an-b': '#45d6a8',
  '--an-card': '#151b23',
  '--an-line': '#232b36',
  '--an-muted': '#8b96a5',
  '--an-red': '#e5484d',
};

interface Written {
  el: string;
  name: string;
  value: string;
}

class FakeEl {
  style: Record<string, string> = {};
  textContent = '';
  constructor(
    readonly key: string,
    private readonly log: Written[],
  ) {}
  setAttribute(name: string, value: string): void {
    this.log.push({ el: this.key, name, value });
  }
}

class FakeRoot {
  readonly els = new Map<string, FakeEl>();
  style = { setProperty: (n: string, v: string) => this.log.push({ el: ':root', name: n, value: v }) };
  constructor(
    keys: string[],
    private readonly log: Written[],
  ) {
    for (const k of keys) this.els.set(k, new FakeEl(k, log));
  }
  querySelector(sel: string): FakeEl | null {
    const m = /\[data-k="(.+)"\]/.exec(sel);
    return (m && this.els.get(m[1])) || null;
  }
  /** The camera writes viewBox on the root itself. */
  setAttribute(name: string, value: string): void {
    this.log.push({ el: ':svg', name, value });
  }
}

/** data-k names actually present in the built SVG for one animation. */
function keysFromBuild(anim: string): string[] {
  const dist = fileURLToPath(new URL('../../dist/index.html', import.meta.url));
  const html = readFileSync(dist, 'utf8');
  const svg = Array.from(html.matchAll(/<svg class="anim"[\s\S]*?<\/svg>/g))
    .map((m) => m[0])
    .find((s) => s.includes(`data-anim="${anim}"`));
  if (!svg) throw new Error(`no built SVG for ${anim} — run npm run build first`);
  return Array.from(svg.matchAll(/data-k="([^"]+)"/g), (m) => m[1]);
}

const saved = { ...globalThis } as Record<string, unknown>;

/**
 * Run one animation's frame function across the whole loop and hand back every
 * attribute it wrote. The rAF/IntersectionObserver stubs let us step time by
 * hand instead of waiting on a real clock.
 */
function sweep(init: () => void, anim: string, narrow = false, step = 0.05): Written[] {
  const log: Written[] = [];
  const root = new FakeRoot(keysFromBuild(anim), log);

  const queued: ((t: number) => void)[] = [];
  Object.assign(globalThis, {
    document: { querySelector: (s: string) => (s.includes(anim) ? root : null) },
    // Only the viewport query flips; reduced motion always stays off.
    window: { matchMedia: (q: string) => ({ matches: narrow && q.includes('max-width') }) },
    getComputedStyle: () => ({ getPropertyValue: (n: string) => PALETTE[n] ?? '#000000' }),
    requestAnimationFrame: (cb: (t: number) => void) => queued.push(cb),
    IntersectionObserver: class {
      constructor(private readonly cb: (e: { isIntersecting: boolean }[]) => void) {}
      observe(): void {
        this.cb([{ isIntersecting: true }]);
      }
    },
  });

  init();
  // The observer stub starts the loop synchronously; drive it frame by frame.
  for (let t = 0; t < DURATION; t += step) {
    const cb = queued.shift();
    if (!cb) throw new Error('loop stopped early');
    cb(t * 1000);
  }
  return log;
}

afterEach(() => {
  for (const k of ['document', 'window', 'getComputedStyle', 'requestAnimationFrame', 'IntersectionObserver']) {
    if (k in saved) (globalThis as Record<string, unknown>)[k] = saved[k];
    else delete (globalThis as Record<string, unknown>)[k];
  }
});

/**
 * v2 of the handoff stretched each loop's last scene so the finished diagram
 * holds before the fade. Guard both ends of that hold.
 */
function assertHoldsThenFades(log: Written[], step: number): void {
  const stage = log.filter((w) => w.el === 'stage' && w.name === 'opacity').map((w) => Number(w.value));
  const at = (t: number): number => stage[Math.round(t / step)];
  expect(at(5.5), 'still fully visible a second before the end').toBe(1);
  expect(at(6.4), 'hold lasts right up to the fade').toBe(1);
  expect(at(6.95), 'faded out by the loop point').toBeLessThan(0.05);
}

/**
 * Every crop the phone camera lands on has to be 16:9 and inside the canvas —
 * a crop of another ratio would change the element's rendered height mid-loop,
 * and one hanging off the edge would show blank.
 */
function assertCamera(log: Written[], opening: string): void {
  const boxes = log.filter((w) => w.el === ':svg' && w.name === 'viewBox').map((w) => w.value);
  expect(boxes.length, 'camera moves during the loop').toBeGreaterThan(20);
  expect(boxes[0], 'opens on the first step').toBe(opening);
  expect(boxes.at(-1), 'pulls back to the whole frame').toBe('0 0 1280 720');
  for (const b of boxes) {
    const [x, y, w, h] = b.split(' ').map(Number);
    expect(w / h, `16:9 for "${b}"`).toBeCloseTo(16 / 9, 2);
    expect(x, `left edge of "${b}"`).toBeGreaterThanOrEqual(0);
    expect(y, `top edge of "${b}"`).toBeGreaterThanOrEqual(0);
    expect(x + w, `right edge of "${b}"`).toBeLessThanOrEqual(1280.5);
    expect(y + h, `bottom edge of "${b}"`).toBeLessThanOrEqual(720.5);
  }
}

/** Nothing may be NaN, and the values with a defined range must stay in it. */
function assertSane(log: Written[]): void {
  expect(log.length).toBeGreaterThan(1000);
  for (const { el, name, value } of log) {
    expect(value, `${el}.${name}`).not.toMatch(/NaN|undefined|Infinity/);
    if (name === 'opacity') {
      const n = Number(value);
      expect(n, `${el}.opacity`).toBeGreaterThanOrEqual(0);
      expect(n, `${el}.opacity`).toBeLessThanOrEqual(1);
    }
    if (name === 'width' || name === 'height') {
      expect(Number(value), `${el}.${name}`).toBeGreaterThanOrEqual(0);
    }
  }
}

describe('order flow animation', () => {
  it('writes finite, in-range values across the whole loop', async () => {
    const { initOrderFlow } = await import('@scripts/order-flow');
    const log = sweep(initOrderFlow, 'order-flow');
    assertSane(log);
    assertHoldsThenFades(log, 0.05);

    // The connector fills the full 880px track by the time the last node lands.
    const widths = log.filter((w) => w.el === 'fill' && w.name === 'width').map((w) => Number(w.value));
    expect(widths[0]).toBe(0);
    expect(widths.at(-1)).toBeCloseTo(880);

    // The travelling dot only shows while the line is part-drawn.
    const dot = log.filter((w) => w.el === 'headDot' && w.name === 'opacity');
    expect(dot[0].value).toBe('0');
    expect(dot.at(-1)!.value).toBe('0');
    expect(dot.some((w) => w.value === '1')).toBe(true);

    // Desktop leaves the frame alone — one write, then nothing.
    const boxes = log.filter((w) => w.el === ':svg' && w.name === 'viewBox');
    expect(boxes).toHaveLength(1);
    expect(boxes[0].value).toBe('0 0 1280 720');
  });

  it('tracks each step with the camera on a narrow viewport', async () => {
    const { initOrderFlow } = await import('@scripts/order-flow');
    const log = sweep(initOrderFlow, 'order-flow', true);
    assertSane(log);
    assertCamera(log, '0 270 470 264');
  });
});

describe('monitor animation', () => {
  it('writes finite, in-range values across the whole loop', async () => {
    const { initMonitor } = await import('@scripts/monitor');
    const log = sweep(initMonitor, 'monitor');
    assertSane(log);
    assertHoldsThenFades(log, 0.05);

    // The agent recolours to red during the outage and back again.
    const agent = log.filter((w) => w.name === '--an-agent').map((w) => w.value);
    expect(agent[0]).toBe('rgb(69,214,168)');
    expect(agent.at(-1)).toBe('rgb(69,214,168)');
    expect(agent).toContain('rgb(229,72,77)');

    // The failing card's link goes solid only while it is actually failing.
    const dash = log.filter((w) => w.el === 'failLink' && w.name === 'stroke-dasharray').map((w) => w.value);
    expect(dash[0]).toBe('8 8');
    expect(dash.at(-1)).toBe('8 8');
    expect(dash).toContain('none');
  });

  it('tracks each scene with the camera on a narrow viewport', async () => {
    const { initMonitor } = await import('@scripts/monitor');
    const log = sweep(initMonitor, 'monitor', true);
    assertSane(log);
    assertCamera(log, '40 160 740 416');
  });
});
