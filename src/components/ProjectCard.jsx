import { useRef, useState } from 'react';
import useInView from '../hooks/useInView';

export default function ProjectCard({ project, index, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleClick = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    onOpen(project.id, rect);
  };

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        className="group block w-full text-left"
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          style={{ backgroundImage: project.gradient }}
        >
          {/* Simulated video preview (gradient shift on hover) */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: hovered ? 1 : 0,
              backgroundImage: project.gradient,
              backgroundSize: '200% 200%',
              animation: hovered ? 'cardShift 6s ease-in-out infinite' : 'none',
            }}
          />
          <style>{`@keyframes cardShift {0%,100%{background-position:0% 0%}50%{background-position:100% 100%}}`}</style>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {project.spec && (
            <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">
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
