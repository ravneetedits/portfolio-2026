import useInView from '../hooks/useInView';

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = 'I design motion for software that deserves to feel alive. Two years deep in After Effects, chasing the frame where timing, type, and rhythm lock into place.'.split(' ');

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-paper px-6 py-32 text-ink md:px-14 md:py-44"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink"
            style={{
              transform: inView ? 'translateY(0)' : 'translateY(40px)',
              opacity: inView ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.2,0.8,0.2,1), opacity 1.2s cubic-bezier(0.2,0.8,0.2,1)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(60% 50% at 50% 40%, #333 0%, #0a0a0a 70%)',
              }}
            />
            <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
              Ravneet · 2026
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">02 — About</p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
            {words.map((w, i) => (
              <span
                key={i}
                className="mr-[0.25em] inline-block"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.9s ${0.05 * i}s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s ${0.05 * i}s cubic-bezier(0.2,0.8,0.2,1)`,
                }}
              >
                {w}
              </span>
            ))}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
            <div>
              <p className="text-ink/40">Toolkit</p>
              <p className="mt-2">After Effects · Illustrator · Premiere</p>
            </div>
            <div>
              <p className="text-ink/40">Experience</p>
              <p className="mt-2">2+ years · Freelance</p>
            </div>
            <div>
              <p className="text-ink/40">Focus</p>
              <p className="mt-2">SaaS · Brand · Title</p>
            </div>
            <div>
              <p className="text-ink/40">Open to</p>
              <p className="mt-2">Freelance · Full-time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
