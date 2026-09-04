/**
 * Timeline helpers shared by the two FAQ explainer animations.
 *
 * Both were handed over as a 6-second loop driven by a single time value T,
 * with every movement built from exactly three primitives — enter / draw /
 * pop — so those three are all that lives here.
 */

/**
 * Loop length. Both animations are authored to the same timeline; v2 of the
 * handoff stretched each one's final scene by a second so the end state holds
 * long enough to read before the fade.
 */
export const DURATION = 7;

/** Everything fades out over the last 450ms of the loop. */
export const FADE_AT = DURATION - 0.45;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

/** 0→1 across an absolute window on the timeline, clamped at both ends. */
export function seg(t: number, start: number, dur: number, ease = easeInOutCubic): number {
  return ease(clamp01((t - start) / dur));
}

export interface Enter {
  /** opacity 0→1 */
  o: number;
  /** downward offset in viewBox units, 18→0 */
  y: number;
}

/** Fade up from 18px below. */
export function enter(t: number, start: number, dur = 0.5): Enter {
  const u = seg(t, start, dur, easeOutCubic);
  return { o: u, y: 18 - 18 * u };
}

/** 0→1 progress for stroke lengths and dashoffsets. */
export function draw(t: number, start: number, dur = 0.6): number {
  return seg(t, start, dur, easeInOutCubic);
}

export interface Pop {
  o: number;
  /** scale 0.4→1, overshooting slightly on the way */
  s: number;
}

/** Scale in with a back-ease overshoot; opacity lands in the first 40%. */
export function pop(t: number, start: number, dur = 0.55): Pop {
  return {
    o: seg(t, start, dur * 0.4, easeOutCubic),
    s: 0.4 + 0.6 * seg(t, start, dur, easeOutBack),
  };
}

/** Blend two `#rrggbb` values. Used for the healthy → failing colour shifts. */
export function mix(from: string, to: string, u: number): string {
  const parse = (c: string): number[] => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const at = (a: number, b: number): number => Math.round(a + (b - a) * u);
  return `rgb(${at(r1, r2)},${at(g1, g2)},${at(b1, b2)})`;
}

/**
 * Resolve the animation's colour tokens off the SVG root, so the palette stays
 * in the stylesheet next to the rest of the site's tokens while JS can still
 * interpolate between them.
 */
export function readPalette(root: Element, names: readonly string[]): Record<string, string> {
  const cs = getComputedStyle(root);
  const out: Record<string, string> = {};
  for (const n of names) out[n] = cs.getPropertyValue(`--an-${n}`).trim();
  return out;
}

export const q = <T extends Element>(root: Element, key: string): T =>
  root.querySelector<T>(`[data-k="${key}"]`) as T;

export const qa = <T extends Element>(root: Element, key: string): T[] =>
  Array.from(root.querySelectorAll<T>(`[data-k="${key}"]`));

/**
 * Drive `frame` on rAF while `root` is on screen. Two of these run on the same
 * page, and an off-screen loop repainting 100+ nodes buys nothing.
 *
 * Both animations are authored in the markup at their end state, so bailing
 * out here leaves reduced-motion (and no-JS) visitors a finished diagram —
 * nothing has to be painted to stand still.
 */
export function playOnVisible(root: Element, frame: (t: number) => void): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let visible = false;
  let running = false;
  let origin = 0;

  const step = (now: number): void => {
    if (!visible) {
      running = false;
      return;
    }
    if (!origin) origin = now;
    frame(((now - origin) / 1000) % DURATION);
    requestAnimationFrame(step);
  };

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        requestAnimationFrame(step);
      }
    }
  }).observe(root);
}
