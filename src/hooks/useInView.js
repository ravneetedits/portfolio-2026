import { useEffect, useRef, useState } from 'react';
import usePrefersLite from './usePrefersLite';

export default function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const lite = usePrefersLite();
  const ref = useRef(null);
  // On lite devices, skip the IntersectionObserver entirely — elements start
  // visible so there are no scroll-triggered style recalculations at all.
  const [inView, setInView] = useState(lite);

  useEffect(() => {
    if (lite) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lite, threshold, rootMargin, once]);

  return [ref, inView];
}
