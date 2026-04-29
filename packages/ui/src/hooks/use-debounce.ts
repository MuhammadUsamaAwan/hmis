import { useCallback, useRef } from "react";

/**
 * Returns a debounced version of the given callback.
 * The callback is delayed by `delay` ms; repeated calls reset the timer.
 */
// biome-ignore lint/suspicious/noExplicitAny: generic callback type
export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}
