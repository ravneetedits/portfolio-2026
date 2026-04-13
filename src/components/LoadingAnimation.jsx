import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Plays once per session: stroke-draw the logo, split pieces, then release.
export default function LoadingAnimation({ onDone }) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const pathRefs = useRef([]);
  const skipRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const played = sessionStorage.getItem('rs-intro-played');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (played || prefersReduced) {
      setVisible(false);
      onDone?.();
      return;
    }
    sessionStorage.setItem('rs-intro-played', '1');

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onDone?.();
      },
    });

    pathRefs.current.forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });

    tl.to(pathRefs.current, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power2.inOut',
      stagger: 0.12,
    })
      .to(
        pathRefs.current,
        {
          x: (i) => (i === 0 ? -40 : 60),
          y: (i) => (i === 0 ? -20 : 30),
          opacity: 0,
          rotate: (i) => (i === 0 ? -8 : 12),
          duration: 0.7,
          ease: 'power3.in',
          stagger: 0.05,
        },
        '+=0.15'
      )
      .to(
        rootRef.current,
        { autoAlpha: 0, duration: 0.45, ease: 'power2.out' },
        '-=0.2'
      );

    // Skip button fades in after 1s
    gsap.fromTo(
      skipRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, delay: 1, duration: 0.4 }
    );

    return () => tl.kill();
  }, [onDone]);

  if (!visible) return null;

  const skip = () => {
    setVisible(false);
    onDone?.();
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink"
    >
      <svg viewBox="0 0 120 120" className="h-40 w-40 text-white">
        <path
          ref={(el) => (pathRefs.current[0] = el)}
          d="M20 100 L20 20 L60 20 Q90 20 90 50 Q90 75 60 80 L30 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          ref={(el) => (pathRefs.current[1] = el)}
          d="M50 80 L100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <button
        ref={skipRef}
        onClick={skip}
        className="absolute bottom-10 right-10 font-mono text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
      >
        Skip →
      </button>
    </div>
  );
}
