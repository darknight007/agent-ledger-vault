import { useState, useEffect, useRef } from "react";

interface UseCountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  enabled?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp({
  end,
  start = 0,
  duration = 1200,
  delay = 0,
  enabled = true,
  decimals = 0,
  prefix = "",
  suffix = "",
}: UseCountUpOptions) {
  const [value, setValue] = useState(start);
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setValue(start);
      setIsComplete(false);
      return;
    }

    const delayTimer = setTimeout(() => {
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;

        setValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setValue(end);
          setIsComplete(true);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, duration, delay, enabled]);

  const formatted = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return { value, formatted, isComplete };
}
