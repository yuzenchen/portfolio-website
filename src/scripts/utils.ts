export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: A): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

export function throttle<A extends unknown[]>(fn: (...args: A) => void, limit: number) {
  let inThrottle = false;
  return (...args: A): void => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => { inThrottle = false; }, limit);
  };
}
