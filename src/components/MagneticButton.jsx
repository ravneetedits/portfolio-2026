import { useRef } from 'react';
import { gsap } from 'gsap';
import clsx from '../utils/clsx';

export default function MagneticButton({ children, className = '', strength = 0.35, radius = 120, as: Tag = 'button', ...rest }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  const handleMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) return;
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.5, ease: 'power3.out' });
    gsap.to(innerRef.current, { x: dx * strength * 0.4, y: dy * strength * 0.4, duration: 0.5, ease: 'power3.out' });
  };

  const handleLeave = () => {
    gsap.to(wrapRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' });
  };

  return (
    <Tag
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={clsx('glass inline-flex items-center justify-center rounded-full px-8 py-4 font-display text-sm uppercase tracking-[0.2em] text-white', className)}
      {...rest}
    >
      <span ref={innerRef} className="inline-block">
        {children}
      </span>
    </Tag>
  );
}
