/** Global animation speed multiplier (site owner preference). */
export const SPEED = 1.7;

/** Retina cap — above 2x the pixel count stops buying visible quality. */
const MAX_DPR = 2;

export interface Size {
  w: number;
  h: number;
}

/**
 * Size a canvas to its CSS box times devicePixelRatio, and scale the context
 * so all drawing code can work in CSS pixels.
 *
 * `maxDpr` is lowered to 1 for canvases doing expensive compositing.
 */
export function fitCanvas(cv: HTMLCanvasElement, maxDpr = MAX_DPR): Size {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  cv.width = r.width * dpr;
  cv.height = r.height * dpr;
  cv.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: r.width, h: r.height };
}

/**
 * Drive `draw` on rAF only while the canvas is on screen. With four canvases
 * on the page, letting them all run off-screen would saturate the main thread.
 */
export function loopOnVisible(cv: HTMLCanvasElement, draw: (t: number) => void): void {
  let visible = false;
  let running = false;

  const frame = (t: number): void => {
    if (!visible) {
      running = false;
      return;
    }
    draw(t);
    requestAnimationFrame(frame);
  };

  new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }
  }).observe(cv);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
