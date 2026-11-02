import { useRef } from 'react';
import useInView from '../hooks/useInView';
import { ytThumbnail } from '../utils/youtube';

export default function ProjectCard({ project, index, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const cardRef = useRef(null);

  const handleClick = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    onOpen(project.id, rect);
  };

  const thumb = project.thumbnail ?? (project.final?.id ? ytThumbnail(project.final.id) : null);

  return (
    <div
      ref={ref}
      className="opacity-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 1s ${index * 0.1}s cubic-bezier(0.2,0.8,0.2,1), transform 1s ${index * 0.1}s cubic-bezier(0.2,0.8,0.2,1)`,
      }}
    >
      <button
        ref={cardRef}
        data-cursor="card"
        onClick={handleClick}
        className="group block w-full text-left"
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          style={{ backgroundImage: project.gradient }}
        >
          {thumb && (
            <img
              src={thumb}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-[1.06] group-hover:opacity-100"
              style={{ willChange: 'transform' }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          {/* Vignette border frame */}
          <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 60px 20px rgba(0,0,0,0.55)' }} />
          {project.spec && (
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">
              Concept / Spec
            </span>
          )}
          <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
            {project.year}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">{project.category}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-white">{project.title}</h3>
          </div>
        </div>
      </button>
    </div>
  );
}
