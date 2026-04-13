import { useEffect, useRef } from 'react';
import useIsTouch from '../hooks/useIsTouch';

// Keyframe-diamond custom cursor with lerp smoothing.
export default function Cursor() {
  const isTouch = useIsTouch();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const state = useRef('default');

  useEffect(() => {
    if (isTouch) return;
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const setState = (s) => {
      state.current = s;
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;
      ring.dataset.state = s;
      dot.dataset.state = s;
    };

    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-cursor="card"]')) setState('card');
      else if (t.closest('a, button, [data-cursor="hover"]')) setState('hover');
      else setState('default');
    };

    const onDown = () => {
      const dot = dotRef.current;
      if (dot) dot.style.transform += ' scale(0.7)';
    };
    const onUp = () => setState(state.current);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    let rafId;
    const tick = () => {
      const lerp = 0.18;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (dot && ring) {
        dot.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) rotate(45deg)`;
        ring.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        data-state="default"
        className="pointer-events-none fixed left-0 top-0 z-[200] h-[10px] w-[10px] bg-white mix-blend-difference transition-[width,height,opacity] duration-200 ease-out data-[state=card]:h-0 data-[state=card]:w-0 data-[state=hover]:h-[14px] data-[state=hover]:w-[14px]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        data-state="default"
        className="pointer-events-none fixed left-0 top-0 z-[199] h-10 w-10 rounded-full border border-white/40 mix-blend-difference transition-[width,height,border-radius,opacity] duration-300 ease-out data-[state=card]:h-20 data-[state=card]:w-20 data-[state=card]:border-white/70 data-[state=hover]:h-14 data-[state=hover]:w-14"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
