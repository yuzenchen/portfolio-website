import { describe, expect, it } from 'vitest';
import { countValue } from '@scripts/countdown';

describe('countValue', () => {
  it('starts at the old figure and lands on the new one', () => {
    expect(countValue(120, 20, 0)).toBe(120);
    expect(countValue(120, 20, 1)).toBe(20);
  });

  it('clamps progress outside 0..1', () => {
    expect(countValue(120, 20, -0.5)).toBe(120);
    expect(countValue(120, 20, 1.5)).toBe(20);
  });

  it('only ever moves toward the target', () => {
    let prev = countValue(120, 20, 0);
    for (let i = 1; i <= 100; i++) {
      const v = countValue(120, 20, i / 100);
      expect(v).toBeLessThanOrEqual(prev);
      prev = v;
    }
  });

  it('eases out: past the halfway figure at half time', () => {
    const linear = 120 + (20 - 120) * 0.5;
    const mid = countValue(120, 20, 0.5);
    expect(Math.abs(mid - 20)).toBeLessThan(Math.abs(linear - 20));
    expect(mid).toBe(33);
  });

  it('returns whole numbers', () => {
    for (let i = 0; i <= 20; i++) {
      expect(Number.isInteger(countValue(120, 20, i / 20))).toBe(true);
    }
  });
});
