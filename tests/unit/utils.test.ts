import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle } from '@scripts/utils';

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('only fires once after the wait window even if called many times', () => {
    const spy = vi.fn();
    const fn = debounce(spy, 100);

    fn();
    fn();
    fn();
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('forwards arguments to the wrapped function', () => {
    const spy = vi.fn();
    const fn = debounce(spy, 50);

    fn(1, 'x');
    fn(2, 'y');
    vi.advanceTimersByTime(50);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2, 'y');
  });

  it('resets the timer on every call', () => {
    const spy = vi.fn();
    const fn = debounce(spy, 100);

    fn();
    vi.advanceTimersByTime(80);
    fn();
    vi.advanceTimersByTime(80);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(20);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires immediately on first call', () => {
    const spy = vi.fn();
    const fn = throttle(spy, 100);

    fn();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('drops calls during the throttle window', () => {
    const spy = vi.fn();
    const fn = throttle(spy, 100);

    fn();
    fn();
    fn();
    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    fn();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('allows another call after the window elapses', () => {
    const spy = vi.fn();
    const fn = throttle(spy, 100);

    fn();
    vi.advanceTimersByTime(101);
    fn();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('forwards arguments', () => {
    const spy = vi.fn();
    const fn = throttle(spy, 100);

    fn('a', 1);
    expect(spy).toHaveBeenCalledWith('a', 1);
  });
});
