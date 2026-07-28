import { useState, useEffect } from 'react';

/**
 * useReducedMotion — detects if the user prefers reduced motion.
 * 
 * Returns `true` when `prefers-reduced-motion: reduce` is active.
 * Updates live when the preference changes via OS settings.
 * 
 * Usage:
 * ```tsx
 * const reduced = useReducedMotion();
 * const duration = reduced ? 0 : 350;
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
