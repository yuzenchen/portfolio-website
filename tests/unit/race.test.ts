import { describe, expect, it } from 'vitest';
import { formatMinutes } from '@scripts/race';

describe('formatMinutes', () => {
  it('reads minutes under an hour', () => {
    expect(formatMinutes(0)).toBe('0 min');
    expect(formatMinutes(20)).toBe('20 min');
    expect(formatMinutes(59.4)).toBe('59 min');
  });

  it('switches to hours with a minute remainder', () => {
    expect(formatMinutes(72)).toBe('1 hr 12 min');
  });

  it('lands on the measured figures the markup renders', () => {
    expect(formatMinutes(120)).toBe('2 hr');
    expect(formatMinutes(20)).toBe('20 min');
  });
});
