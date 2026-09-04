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

/* ── Mobile camera ─────────────────────────────────────────────────── */

/** A viewBox crop: x, y, width, height in canvas units. */
export type Rect = readonly [number, number, number, number];

/** Where the camera sits from time `at` onwards. */
export interface Shot {
  readonly at: number;
  readonly rect: Rect;
}

const FULL: Rect = [0, 0, 1280, 720];
/** How long the camera takes to travel between two shots. */
const MOVE = 0.6;

/** Extra seconds each shot gets on a phone, where there is more to take in. */
const HOLD = 0.5;

/**
 * How long the timeline takes to play on a phone. The same 7s of animation,
 * run slower so every shot lingers — stretching the clock rather than freezing
 * the content, because the connector line draws straight through the scene
 * boundaries and would visibly stall if it were paused there.
 */
export const narrowSpan = (shots: readonly Shot[]): number => DURATION + HOLD * shots.length;

/** The crop at time `t`, easing from the previous shot into the current one. */
export function cameraAt(shots: readonly Shot[], t: number): Rect {
  let i = 0;
  while (i + 1 < shots.length && t >= shots[i + 1].at) i++;
  const to = shots[i];
  const from = shots[i - 1];
  if (!from) return to.rect;
  const u = seg(t, to.at, MOVE);
  return [0, 1, 2, 3].map(
    (k) => Math.round((from.rect[k] + (to.rect[k] - from.rect[k]) * u) * 10) / 10,
  ) as unknown as Rect;
}

/**
 * A phone gets ~375px of width. Showing all 1280 units at once puts the
 * supporting type at about 4px, and holding it legible means a diagram wider
 * than the screen. So on narrow viewports the viewBox follows the step being
 * described and pulls back to the whole frame for the closing hold. Every crop
 * is 16:9, so the element's rendered height never changes.
 *
 * Desktop keeps the full frame, written once rather than every frame.
 */
export function makeCamera(root: Element, shots: readonly Shot[]): (t: number) => void {
  const narrow = window.matchMedia('(max-width: 768px)');
  let applied = '';
  return (t: number): void => {
    const box = (narrow.matches ? cameraAt(shots, t) : FULL).join(' ');
    if (box === applied) return;
    root.setAttribute('viewBox', box);
    applied = box;
  };
}

export const q = <T extends Element>(root: Element, key: string): T =>
  root.querySelector<T>(`[data-k="${key}"]`) as T;

export const qa = <T extends Element>(root: Element, key: string): T[] =>
  Array.from(root.querySelectorAll<T>(`[data-k="${key}"]`));

/**
 * Two ways to drive `frame`, picked by viewport.
 *
 * Wide: loop on rAF while `root` is on screen. Two of these live on the same
 * page, and an off-screen loop repainting 100+ nodes buys nothing.
 *
 * Narrow: hold still behind a play button and run the timeline exactly once
 * when tapped, then settle back to the still. A diagram that loops on its own
 * next to body text is a lot of movement to scroll past on a phone, and one
 * that has already started is one you have to wait out.
 *
 * Both animations are authored in the markup at their settled state, so the
 * still costs nothing to render and reduced-motion (or no-JS) visitors simply
 * keep it.
 */
export function playOnVisible(
  root: Element,
  frame: (t: number) => void,
  /** Wall-clock length of the one-shot phone playback; see `narrowSpan`. */
  span = DURATION,
): void {
  const wrap = root.parentElement;
  const trigger = wrap?.querySelector<HTMLButtonElement>('.anim-play') ?? null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Nothing will ever play, so don't offer a button that does nothing.
    wrap?.classList.add('is-static');
    return;
  }

  const narrow = window.matchMedia('(max-width: 768px)');
  let raf = 0;
  let visible = false;
  let origin = 0;

  const loop = (now: number): void => {
    if (!visible || narrow.matches) {
      raf = 0;
      return;
    }
    if (!origin) origin = now;
    frame(((now - origin) / 1000) % DURATION);
    raf = requestAnimationFrame(loop);
  };

  const once = (now: number): void => {
    if (!origin) origin = now;
    const elapsed = (now - origin) / 1000;
    if (elapsed >= span) {
      raf = 0;
      // Land on the settled frame rather than the tail of the fade.
      frame(FADE_AT);
      wrap?.classList.remove('is-playing');
      return;
    }
    frame((elapsed * DURATION) / span);
    raf = requestAnimationFrame(once);
  };

  trigger?.addEventListener('click', () => {
    if (raf) return;
    wrap?.classList.add('is-playing');
    origin = 0;
    raf = requestAnimationFrame(once);
  });

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !raf && !narrow.matches) {
        origin = 0;
        raf = requestAnimationFrame(loop);
      }
    }
  }).observe(root);

  // Rotating a phone, or dragging a desktop window narrow, swaps the mode.
  narrow.addEventListener('change', () => {
    cancelAnimationFrame(raf);
    raf = 0;
    origin = 0;
    frame(FADE_AT);
    wrap?.classList.remove('is-playing');
    if (!narrow.matches && visible) raf = requestAnimationFrame(loop);
  });
}
