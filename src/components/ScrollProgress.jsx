import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      if (barRef.current) barRef.current.style.height = `${pct * 100}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-0 z-40 hidden h-full w-[2px] md:block">
      <div className="glass absolute inset-0 rounded-full" />
      <div
        ref={barRef}
        className="absolute left-0 top-0 w-full rounded-full bg-white/80"
        style={{ height: '0%', transition: 'height 0.1s linear' }}
      />
    </div>
  );
}
