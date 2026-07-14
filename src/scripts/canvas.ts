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
 */
export function fitCanvas(cv: HTMLCanvasElement): Size {
  const r = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  cv.width = r.width * dpr;
  cv.height = r.height * dpr;
  cv.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: r.width, h: r.height };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
