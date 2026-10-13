import { prefersReducedMotion } from './motion';

/** Real seconds of playback per reconciliation minute: 120 min runs 6 s. */
const MS_PER_MINUTE = 50;

/** "45 min", "1 hr 12 min", "2 hr". Exported for the unit test. */
export function formatMinutes(total: number): string {
  const m = Math.round(total);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} hr` : `${h} hr ${rest} min`;
}

interface Lane {
  el: HTMLElement;
  minutes: number;
  stations: HTMLElement[];
  time: HTMLElement;
  now: HTMLElement;
}

/**
 * Hero race. Both lanes start together; each runs for its own measured
 * reconciliation time scaled by MS_PER_MINUTE, so the automated lane
 * finishes at exactly one sixth of the manual one. The markup already shows
 * the finished race, so nothing is lost when this never runs.
 */
export function initRace(): void {
  const race = document.querySelector<HTMLElement>('[data-race]');
  if (!race || prefersReducedMotion()) return;

  const replay = race.querySelector<HTMLButtonElement>('[data-replay]');
  const lanes: Lane[] = [...race.querySelectorAll<HTMLElement>('[data-lane]')].map((el) => ({
    el,
    minutes: Number(el.dataset.minutes) || 0,
    stations: [...el.querySelectorAll<HTMLElement>('.st')],
    time: el.querySelector<HTMLElement>('[data-time]')!,
    now: el.querySelector<HTMLElement>('[data-now]')!,
  }));
  if (lanes.length === 0) return;

  let frame = 0;

  const paint = (lane: Lane, progress: number): void => {
    const n = lane.stations.length;
    // Station i is finished once its fifth of the run has passed; the one
    // in progress is marked active so the slow manual steps read as work.
    const done = Math.min(n, Math.floor(progress * n + 1e-9));
    lane.stations.forEach((st, i) => {
      st.classList.toggle('is-done', i < done);
      st.classList.toggle('is-active', i === done && progress < 1);
    });
    const current = lane.stations[Math.min(done, n - 1)];
    lane.now.textContent = current?.textContent ?? '';
    lane.time.textContent = formatMinutes(lane.minutes * progress);
    lane.el.classList.toggle('is-finished', progress >= 1);
  };

  const run = (): void => {
    cancelAnimationFrame(frame);
    race.classList.add('is-running');
    if (replay) replay.hidden = true;
    const start = performance.now();
    const longest = Math.max(...lanes.map((l) => l.minutes)) * MS_PER_MINUTE;

    const tick = (t: number): void => {
      const elapsed = t - start;
      for (const lane of lanes) {
        paint(lane, Math.min(1, elapsed / (lane.minutes * MS_PER_MINUTE)));
      }
      if (elapsed < longest) {
        frame = requestAnimationFrame(tick);
      } else {
        race.classList.remove('is-running');
        if (replay) replay.hidden = false;
      }
    };
    frame = requestAnimationFrame(tick);
  };

  // Reset to the start line before the first paint the observer allows,
  // then race once the track is properly in view.
  lanes.forEach((lane) => paint(lane, 0));

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        run();
      }
    },
    { threshold: 0.45 },
  );
  observer.observe(race);

  replay?.addEventListener('click', run);
}
