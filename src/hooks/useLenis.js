import { useEffect } from 'react';
import Lenis from 'lenis';
import usePrefersLite from './usePrefersLite';

let lenisInstance = null;
export const getLenis = () => lenisInstance;

export default function useLenis() {
  const lite = usePrefersLite();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip smooth scroll on reduced-motion OR low-end devices — native scroll
    // has zero JS overhead and is always smooth on the compositor thread.
    if (lite) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [lite]);
}
