import useInView from '../hooks/useInView';
import headshot from '../../images/about me/headshot.jpeg';

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  // Group into small chunks so we animate ~7 elements instead of 27 individual words
  const rawWords = 'Four years in After Effects and still chasing the perfect frame. Motion, type and rhythm are how I make software feel like something worth using.'.split(' ');
  const chunks = [];
  for (let i = 0; i < rawWords.length; i += 4) chunks.push(rawWords.slice(i, i + 4).join(' '));

  return (
    <section
      id="about"
      ref={ref}
      className="cv-auto relative bg-paper px-6 py-32 text-ink md:px-14 md:py-44"
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
            <img
              src={headshot}
              alt="Ravneet headshot"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
              Ravneet · 2026
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink/50">03 / About</p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] md:text-6xl">
            {chunks.map((chunk, i) => (
              <span
                key={i}
                className="mr-[0.25em] inline-block"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.9s ${0.1 * i}s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s ${0.1 * i}s cubic-bezier(0.2,0.8,0.2,1)`,
                }}
              >
                {chunk}
              </span>
            ))}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60 sm:gap-6">
            <div>
              <p className="text-ink/40">Toolkit</p>
              <p className="mt-2">After Effects · Illustrator · Blender</p>
            </div>
            <div>
              <p className="text-ink/40">Experience</p>
              <p className="mt-2">4+ years · Freelance</p>
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
