import { useCallback, useRef } from "react";

export const useDebounce = (fn: Function, ms: number = 500) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        return fn(...args);
      }, ms);
    },
    [fn, ms]
  );
};
