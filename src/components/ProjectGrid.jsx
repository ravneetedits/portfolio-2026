import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import useInView from '../hooks/useInView';

export default function ProjectGrid({ onOpen }) {
  const [titleRef, inView] = useInView({ threshold: 0.3 });

  return (
    <section id="work" className="relative bg-ink px-6 py-32 md:px-14 md:py-44">
      <div
        ref={titleRef}
        className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s cubic-bezier(0.2,0.8,0.2,1)',
        }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">01 / Selected Work</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
            Recent frames<br />
            in motion.
          </h2>
        </div>
        <p className="max-w-sm font-sans text-sm leading-relaxed text-white/60 md:text-right">
          SaaS explainers, brand loops, spec edits. Click any card to see the full breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
