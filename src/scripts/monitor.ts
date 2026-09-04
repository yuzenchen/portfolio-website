import { draw, easeOutCubic, enter, mix, playOnVisible, pop, q, readPalette, seg } from './anim';

const SX = 96;
const SW = 320;
const SH = 96;
const SY = [186, 312, 438];
const AX = 640;
const AY = 360;
const TX = 1040;
const TW = 200;
const TH = 84;
const TY = [258, 378];

/** Scene starts: Monitor / Detect / Alert / Recover. */
const S = [0, 1.6, 3.0, 4.8];
/** API 服務 is the card that goes down. */
const FAIL = 1;

const BARS = [
  [5, 7, 6, 8, 6, 7, 5, 6],
  [6, 5, 7, 6, 8, 7, 6, 7],
  [4, 6, 5, 6, 5, 7, 6, 5],
];
const BAR_X = SX + SW - 22 - 76;

export function initMonitor(): void {
  const root = document.querySelector<SVGSVGElement>('[data-anim="monitor"]');
  if (!root) return;

  const pal = readPalette(root, ['a', 'b', 'card', 'line', 'muted', 'red']);
  const idx = [0, 1, 2];

  const stage = q(root, 'stage');
  const head = q(root, 'head');
  const links = idx.map((i) => q(root, `link${i}`));
  const signal = q(root, 'signal');
  const outs = [q(root, 'out0'), q(root, 'out1')];
  const cards = idx.map((i) => q(root, `card${i}`));
  // These carry a colour class, so the healthy → failing blend has to go on
  // the inline style; a presentation attribute would lose to the class rule.
  const failCard = q<SVGElement>(root, 'failCard');
  const failDot = q<SVGElement>(root, 'failDot');
  const failHalo = q<SVGElement>(root, 'failHalo');
  const failMeta = q<SVGElement>(root, 'failMeta');
  const failLinkEl = q<SVGElement>(root, 'failLink');
  const bars = idx.map((i) => BARS[i].map((_, k) => q<SVGElement>(root, `bar${i}-${k}`)));
  const badge = q(root, 'badge');
  const rings = [q(root, 'ring0'), q(root, 'ring1')];
  const agent = q(root, 'agent');
  const caption = q(root, 'agentCaption');
  const msgs = [q(root, 'msg0'), q(root, 'msg1')];
  const sents = [q(root, 'sent0'), q(root, 'sent1')];
  const recovered = q(root, 'recovered');

  const frame = (t: number): void => {
    stage.setAttribute('opacity', String(1 - seg(t, 5.55, 0.4)));

    const h = enter(t, 0.05, 0.6);
    head.setAttribute('opacity', String(h.o));
    head.setAttribute('transform', `translate(0 ${h.y})`);

    // How far into the outage we are: ramps up on detect, back down on recover.
    const fu =
      seg(t, S[1] + 0.1, 0.35, easeOutCubic) * (1 - seg(t, S[3] + 0.1, 0.4));
    // Damped horizontal shudder on the card that just failed.
    const shakeT = t - (S[1] + 0.1);
    const shake =
      shakeT > 0 && shakeT < 0.45 ? Math.sin(shakeT * 60) * 6 * (1 - shakeT / 0.45) : 0;

    idx.forEach((i) => {
      const en = enter(t, S[0] + 0.1 + i * 0.12, 0.5);
      cards[i].setAttribute('opacity', String(en.o));
      cards[i].setAttribute(
        'transform',
        `translate(${i === FAIL ? shake : 0} ${en.y})`,
      );
      links[i].setAttribute('opacity', String(draw(t, S[0] + 0.5 + i * 0.12, 0.5)));

      const base = SY[i] + SH / 2 + 18;
      BARS[i].forEach((b, k) => {
        const live = Math.sin(t * 3 + k * 1.3 + i) * 0.5 + 0.5;
        const height =
          i === FAIL
            ? (b * 3.4 + live * 8) * (1 - fu) + (k > 4 ? 4 : b * 3.4) * fu
            : b * 3.4 + live * 8;
        bars[i][k].setAttribute('height', String(height));
        bars[i][k].setAttribute('y', String(base - height));
        if (i === FAIL && k > 4) bars[i][k].style.fill = mix(pal.a, pal.red, fu);
      });
    });

    failCard.style.stroke = mix(pal.card, pal.red, fu);
    const dot = mix(pal.b, pal.red, fu);
    failDot.style.fill = dot;
    failHalo.style.fill = dot;
    failLinkEl.style.stroke = mix(pal.line, pal.red, fu);
    failLinkEl.setAttribute('stroke-width', fu > 0 ? '3' : '2.5');
    failLinkEl.setAttribute('stroke-dasharray', fu > 0.5 ? 'none' : '8 8');

    const down = fu > 0.5;
    failMeta.textContent = down ? '回應逾時 · 504' : '回應 95ms';
    failMeta.style.fill = down ? pal.red : pal.muted;
    failMeta.style.fontWeight = down ? '600' : '400';

    const bg = pop(t, S[1] + 0.35, 0.45);
    badge.setAttribute('opacity', String(bg.o * (1 - seg(t, S[3] + 0.1, 0.3))));
    badge.setAttribute(
      'transform',
      `translate(422 307) scale(${bg.s}) translate(-422 -307)`,
    );

    // Red pulse running from the failing service up to the agent.
    const sig = draw(t, S[1] + 0.55, 0.55);
    signal.setAttribute('opacity', sig > 0 && sig < 1 ? '1' : '0');
    signal.setAttribute('stroke-dashoffset', String(-sig * 1.12 + 0.12));

    // One custom property recolours the agent's ring, face and label at once.
    const alert = seg(t, S[1] + 1.0, 0.25) * (1 - seg(t, S[3] + 0.2, 0.4));
    root.style.setProperty('--an-agent', mix(pal.b, pal.red, alert));

    const ap = pop(t, S[0] + 0.25, 0.6);
    agent.setAttribute('opacity', String(ap.o));
    agent.setAttribute('transform', `translate(${AX} ${AY}) scale(${ap.s}) translate(${-AX} ${-AY})`);
    caption.setAttribute('opacity', String(ap.o));
    caption.textContent = alert > 0.5 ? '判讀異常 · 自動通報' : '持續掃描服務狀態';

    const pulse = (t * 0.9) % 1;
    rings.forEach((ring, r) => {
      const u = (pulse + r * 0.5) % 1;
      ring.setAttribute('opacity', String(ap.o * (1 - u) * 0.7));
      ring.setAttribute(
        'transform',
        `translate(${AX} ${AY}) scale(${1 + u * 0.7}) translate(${-AX} ${-AY})`,
      );
    });

    const out = draw(t, S[2] + 0.05, 0.5);
    outs.forEach((o) => o.setAttribute('stroke-dashoffset', String(1 - out)));

    msgs.forEach((msg, i) => {
      const p = pop(t, S[2] + 0.5 + i * 0.15, 0.5);
      const cx = TX + TW / 2;
      const cy = TY[i] + TH / 2;
      msg.setAttribute('opacity', String(p.o));
      msg.setAttribute('transform', `translate(${cx} ${cy}) scale(${p.s}) translate(${-cx} ${-cy})`);
      const s = enter(t, S[2] + 1.15, 0.35);
      sents[i].setAttribute('opacity', String(s.o));
      sents[i].setAttribute('transform', `translate(0 ${s.y})`);
    });

    const rec = enter(t, S[3] + 0.35, 0.4);
    recovered.setAttribute('opacity', String(rec.o * (1 - seg(t, 5.4, 0.3))));
    recovered.setAttribute('transform', `translate(0 ${rec.y})`);
  };

  playOnVisible(root, frame);
}
