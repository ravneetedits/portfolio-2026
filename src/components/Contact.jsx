import { useEffect, useRef, useState } from 'react';
import MagneticButton from './MagneticButton';
import useInView from '../hooks/useInView';

const EMAIL = 'ravneetedits@gmail.com';
const HANDLE = '@ravneetedits';
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

// Direct DOM scramble — no React setState in the RAF loop, zero re-renders.
function useScramble(target, active) {
  const elRef = useRef(null);
  const frameRef = useRef(0);
  const queueRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (!active) {
      el.textContent = target;
      return;
    }
    const length = target.length;
    const queue = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20) + 10;
      return { to: target[i] || '', start, end, char: '' };
    });
    queueRef.current = queue;
    frameRef.current = 0;

    const update = () => {
      let output = '';
      let complete = 0;
      for (const q of queueRef.current) {
        if (frameRef.current >= q.end) {
          complete++;
          output += q.to;
        } else if (frameRef.current >= q.start) {
          if (!q.char || Math.random() < 0.28)
            q.char = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          output += q.char;
        } else {
          output += q.to;
        }
      }
      el.textContent = output;
      if (complete < queueRef.current.length) {
        frameRef.current++;
        rafRef.current = requestAnimationFrame(update);
      }
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active]);

  return elRef;
}

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hover, setHover] = useState(false);
  const emailRef = useScramble(EMAIL, hover);

  return (
    <section id="contact" ref={ref} className="cv-auto relative bg-ink px-6 pb-20 pt-32 text-white md:px-14 md:pt-44">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">04 / Contact</p>
        <h2
          className="mt-6 font-display text-6xl font-semibold leading-[0.95] md:text-[11vw]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(50px)',
            transition: 'opacity 1s cubic-bezier(0.2,0.8,0.2,1), transform 1s cubic-bezier(0.2,0.8,0.2,1)',
          }}
        >
          Let's make<br />something move.
        </h2>

        <div className="mt-16 flex flex-col items-start gap-8">
          <a
            href={`mailto:${EMAIL}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="font-mono text-sm uppercase tracking-[0.2em] text-white/60 hover:text-white"
          >
            <span ref={emailRef}>{EMAIL}</span>
          </a>
          <MagneticButton as="a" href={`mailto:${EMAIL}`}>
            Start a project →
          </MagneticButton>
        </div>

        <div className="mt-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Find me at {HANDLE}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {[
              { label: 'Instagram', href: 'https://instagram.com/ravneetedits' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/ravneetedits' },
              { label: 'Twitter', href: 'https://twitter.com/ravneetedits' },
              { label: 'YouTube', href: 'https://youtube.com/@ravneetedits' },
            ].map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/70 transition-[color,background-color,border-color] duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transitionProperty: 'opacity, transform, color, background-color, border-color',
                  transitionDuration: '0.7s, 0.7s, 0.3s, 0.3s, 0.3s',
                  transitionDelay: `${0.1 + i * 0.08}s, ${0.1 + i * 0.08}s, 0s, 0s, 0s`,
                  transitionTimingFunction: 'ease-out',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-28 flex items-center justify-between border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          <span>© 2026 Ravneet Singh</span>
          <span>Hand-animated, not auto-generated.</span>
        </div>
      </div>
    </section>
  );
}
