import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import FilmStrip from './FilmStrip';

// Hero: full-bleed showreel backdrop + overlaid name and CTAs.
// Placeholder "video" = animated gradient; replace <PlaceholderReel/> with a real <video> element.
export default function Hero() {
  const [volume, setVolume] = useState(0);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(titleRef.current?.querySelectorAll('.word') || [], {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'power4.out',
    })
      .from(
        roleRef.current,
        { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .from(
        ctaRef.current,
        { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    return () => tl.kill();
  }, []);

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <PlaceholderReel volume={volume} />
      {/* Contrast gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      <div className="relative z-10 flex h-full flex-col justify-between px-8 pb-52 pt-36 md:px-14">
        <div />
        <div className="max-w-5xl">
          <div ref={titleRef} className="overflow-hidden">
            <h1 className="font-display text-hero font-semibold leading-[0.92] text-white">
              {'Ravneet'.split('').map((c, i) => (
                <span key={i} className="word inline-block">
                  {c}
                </span>
              ))}
              <br />
              {'Singh.'.split('').map((c, i) => (
                <span key={i} className="word inline-block">
                  {c}
                </span>
              ))}
            </h1>
          </div>
          <div ref={roleRef} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">
            <span>Motion Designer</span>
            <span className="h-px w-8 bg-white/30" />
            <span>SaaS · Spec · Brand</span>
            <span className="h-px w-8 bg-white/30" />
            <span>Based Worldwide</span>
          </div>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="glass inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:scale-[1.03]"
            >
              See the work
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pointer-events-none absolute bottom-40 left-1/2 hidden -translate-x-1/2 md:block">
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </div>

      <FilmStrip volume={volume} onVolumeChange={setVolume} />
    </section>
  );
}

// Stand-in animated reel. Replace with:
// <video src="/videos/showreel.mp4" autoPlay muted={muted} loop playsInline className="h-full w-full object-cover" />
function PlaceholderReel({ volume }) {
  return (
    <div className="absolute inset-0">
      <div
        className="h-full w-full"
        style={{
          backgroundImage:
            'linear-gradient(120deg,#1a1a1a 0%,#2a1c3a 25%,#2b3a52 50%,#5a2b3a 75%,#1a1a1a 100%)',
          backgroundSize: '300% 300%',
          animation: 'reelShift 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 40%, rgba(236,72,153,0.35), transparent 60%), radial-gradient(50% 40% at 70% 60%, rgba(14,165,233,0.35), transparent 60%)',
          animation: 'reelPulse 8s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes reelShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes reelPulse { 0%,100%{opacity:.6} 50%{opacity:.9} }
      `}</style>
    </div>
  );
}
