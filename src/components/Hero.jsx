import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// FilmStrip kept in reserve — re-enable by uncommenting below + the JSX at bottom
// import FilmStrip from './FilmStrip';

export default function Hero() {
  const titleRef    = useRef(null);
  const roleRef     = useRef(null);
  const taglineRef  = useRef(null);
  const ctaRef      = useRef(null);
  const reelRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = titleRef.current?.querySelectorAll('.word') ?? [];
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(words,             { yPercent: 110, opacity: 0, duration: 1,   stagger: 0.08, ease: 'power4.out' })
        .from(roleRef.current,   { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from(taglineRef.current,{ opacity: 0, y: 14, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from(ctaRef.current,    { opacity: 0, y: 18, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from(reelRef.current,   { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <HeroBg />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/90" />

      {/* Main content — vertically centred between navbar and teaser */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col justify-center px-6 pt-20 pb-32 md:px-14 md:pt-24" style={{ height: 'calc(100svh - 80px)' }}>
        <div className="max-w-5xl">
          <div ref={titleRef} className="overflow-hidden">
            <h1 className="font-display text-hero font-semibold leading-[0.92] text-white">
              {'Ravneet'.split('').map((c, i) => (
                <span key={i} className="word inline-block">{c}</span>
              ))}
              <br />
              {'Singh.'.split('').map((c, i) => (
                <span key={i} className="word inline-block">{c}</span>
              ))}
            </h1>
          </div>

          <div ref={roleRef} className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white/65">
            <span>Motion Designer</span>
            <span className="h-px w-8 bg-white/25" />
            <span>After Effects · Blender</span>
            <span className="h-px w-8 bg-white/25" />
            <span>India</span>
          </div>

          {/* Tagline — styled as a catchphrase, not a description */}
          <p
            ref={taglineRef}
            className="mt-4 font-display text-xl font-semibold italic text-white/75 sm:text-2xl"
          >
            Eye candy visuals for brands that move.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              See the work <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Showreel teaser — pinned to bottom at a fixed distance on every screen */}
      <div
        ref={reelRef}
        className="absolute inset-x-0 bottom-10 z-10 px-6 md:bottom-12 md:px-14"
      >
        <ShowreelTeaser />
      </div>

      {/* Re-enable when showreel is ready:
      <FilmStrip volume={volume} onVolumeChange={setVolume} />
      */}
    </section>
  );
}

function ShowreelTeaser() {
  const [pulsing, setPulsing] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPulsing(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4">
      <div
        className="glass flex items-center gap-4 rounded-2xl px-5 py-4 sm:gap-5 sm:px-6"
        style={{ maxWidth: 520 }}
      >
        <div className="relative flex h-3 w-3 shrink-0">
          {pulsing && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
          )}
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </div>

        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-none text-white sm:text-xl">
            Showreel 2026
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.26em] text-white/45">
            In production &middot; dropping soon
          </p>
        </div>

        <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
          Coming soon
        </span>
      </div>

      <div className="pointer-events-none hidden flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/35">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
}

function HeroBg() {
  return (
    <div className="absolute inset-0">
      {/* Static dark gradient — no background-position animation to avoid repaints */}
      <div
        className="h-full w-full"
        style={{
          backgroundImage: 'linear-gradient(120deg,#0d0d0d 0%,#1a1025 30%,#1e2535 55%,#2d1520 80%,#0d0d0d 100%)',
        }}
      />
      {/* Colour blobs — only animates opacity (composited, zero repaint) */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: 'radial-gradient(55% 45% at 25% 35%, rgba(236,72,153,0.3) 0%, transparent 65%), radial-gradient(45% 35% at 75% 65%, rgba(14,165,233,0.25) 0%, transparent 65%)',
          animation: 'heroBgPulse 10s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes heroBgPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
