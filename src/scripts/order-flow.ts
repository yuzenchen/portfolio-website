import {
  draw,
  easeOutBack,
  enter,
  FADE_AT,
  makeCamera,
  playOnVisible,
  pop,
  q,
  seg,
  type Shot,
} from './anim';

/** Node centres and the shared centre line, straight from the handoff. */
const XS = [200, 493, 787, 1080];
const CY = 372;
/** Scene starts: Order / Notify / Complete / Invoice. */
const S = [0, 1.4, 2.9, 4.2];
/** Envelopes leave the notify node 0.45s into its scene. */
const FLY = S[1] + 0.45;
/** Centre of the flying envelope, from just above the node to the inbox row. */
const FLY_FROM = CY - 30 + 20;
const FLY_TO = 208 + 20;

/**
 * Phone framing: one shot per step, leading the beat slightly, then a pull-back.
 * Held wide enough that a node's 124-unit circle stays a component of the shot
 * rather than filling it, and tall enough to keep each step's caption in frame.
 */
const SHOTS: Shot[] = [
  { at: 0, rect: [0, 250, 524, 294.75] }, //         訂單成立
  { at: 1.25, rect: [163, 165, 660, 371.25] }, //    自動通知 — needs both inbox cards
  { at: 2.75, rect: [525, 250, 524, 294.75] }, //    完成訂單
  { at: 4.05, rect: [700, 235, 580, 326.25] }, //    自動開立發票 — plus the stamp
  { at: 5.9, rect: [0, 0, 1280, 720] }, //           全景
];

/** Envelope opacity: fades in over the first 15% of the flight, out over the last. */
const flightOpacity = (u: number): number => {
  if (u <= 0 || u >= 1) return 0;
  if (u < 0.15) return u / 0.15;
  if (u > 0.85) return (1 - u) / 0.15;
  return 1;
};

export function initOrderFlow(): void {
  const root = document.querySelector<SVGSVGElement>('[data-anim="order-flow"]');
  if (!root) return;

  const idx = [0, 1, 2, 3];
  const stage = q(root, 'stage');
  const head = q(root, 'head');
  const track = q(root, 'track');
  const fill = q(root, 'fill');
  const headDot = q(root, 'headDot');
  const nodes = idx.map((i) => q(root, `node${i}`));
  const labels = idx.map((i) => q(root, `label${i}`));
  const check = q(root, 'check');
  const flies = [q(root, 'fly0'), q(root, 'fly1')];
  const chips = [q(root, 'chip0'), q(root, 'chip1')];
  const sents = [q(root, 'chip0sent'), q(root, 'chip1sent')];
  const stamp = q(root, 'stamp');
  const camera = makeCamera(root, SHOTS);

  const frame = (t: number): void => {
    camera(t);
    stage.setAttribute('opacity', String(1 - seg(t, FADE_AT, 0.4)));

    const h = enter(t, 0.05, 0.6);
    head.setAttribute('opacity', String(h.o));
    head.setAttribute('transform', `translate(0 ${h.y})`);
    track.setAttribute('opacity', String(h.o));

    // Each segment draws between the pops of the two nodes it joins.
    let headX = XS[0];
    let drawn = 0;
    for (let i = 0; i < 3; i++) {
      const from = S[i] + 0.55;
      const p = draw(t, from, S[i + 1] + 0.1 - from);
      headX += p * (XS[i + 1] - XS[i]);
      drawn += p;
    }
    fill.setAttribute('width', String(Math.max(0, headX - XS[0])));
    headDot.setAttribute('opacity', drawn > 0.01 && drawn < 2.99 ? '1' : '0');
    headDot.setAttribute('transform', `translate(${headX} 0)`);

    idx.forEach((i) => {
      const p = pop(t, S[i] + 0.1);
      nodes[i].setAttribute('opacity', String(p.o));
      nodes[i].setAttribute(
        'transform',
        `translate(${XS[i]} ${CY}) scale(${p.s}) translate(${-XS[i]} ${-CY})`,
      );
      const l = enter(t, S[i] + 0.3, 0.45);
      labels[i].setAttribute('opacity', String(l.o));
      labels[i].setAttribute('transform', `translate(0 ${l.y})`);
    });

    // Two envelopes leave the notify node and split towards the two inboxes.
    const u = draw(t, FLY, 0.7);
    const o = flightOpacity(u);
    const cy = FLY_FROM + (FLY_TO - FLY_FROM) * u;
    const scale = 0.6 + 0.2 * u;
    flies.forEach((fly, i) => {
      fly.setAttribute('opacity', String(o));
      fly.setAttribute(
        'transform',
        `translate(${XS[1] + (i === 0 ? -130 : 130) * u} ${cy}) scale(${scale})`,
      );
    });

    chips.forEach((chip, i) => {
      const c = enter(t, FLY + 0.55 + i * 0.1, 0.45);
      chip.setAttribute('opacity', String(c.o));
      chip.setAttribute('transform', `translate(0 ${c.y})`);
      const s = enter(t, FLY + 0.75 + i * 0.1, 0.35);
      sents[i].setAttribute('opacity', String(s.o));
      sents[i].setAttribute('transform', `translate(0 ${s.y})`);
    });

    check.setAttribute('stroke-dashoffset', String(1 - draw(t, S[2] + 0.35, 0.5)));

    const st = pop(t, S[3] + 0.6, 0.5);
    const rot = -18 + 10 * seg(t, S[3] + 0.6, 0.5, easeOutBack);
    stamp.setAttribute('opacity', String(st.o));
    stamp.setAttribute(
      'transform',
      `translate(1150 275) rotate(${rot}) scale(${st.s}) translate(-1150 -275)`,
    );
  };

  playOnVisible(root, frame);
}
