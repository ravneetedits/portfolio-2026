import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { projects } from '../data/projects';
import { getLenis } from '../hooks/useLenis';

const SLIDE_EASE = [0.76, 0, 0.24, 1];

export default function ProjectDetail({ activeId, originRect, onClose, onNext }) {
  const project = projects.find((p) => p.id === activeId);
  const prevIdRef = useRef(null);

  useEffect(() => {
    const lenis = getLenis();
    if (activeId) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [activeId]);

  // Track whether this is a first-open (animate origin→fullscreen)
  // or a next-project swap (skip shell animation, slide content).
  const isFirstOpen = activeId && prevIdRef.current === null;
  useEffect(() => {
    prevIdRef.current = activeId;
  }, [activeId]);

  const origin =
    originRect && {
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
    };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[150]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute overflow-hidden bg-ink"
            initial={
              isFirstOpen
                ? {
                    top: origin?.top ?? 0,
                    left: origin?.left ?? 0,
                    width: origin?.width ?? '100vw',
                    height: origin?.height ?? '100vh',
                    borderRadius: 16,
                  }
                : false
            }
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
            }}
            exit={{
              top: origin?.top ?? 0,
              left: origin?.left ?? 0,
              width: origin?.width ?? '100vw',
              height: origin?.height ?? '100vh',
              borderRadius: 16,
              opacity: 0,
            }}
            transition={{ duration: 0.7, ease: SLIDE_EASE }}
          >
            <button
              onClick={onClose}
              className="glass absolute right-4 top-4 z-30 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white sm:right-6 sm:top-6 sm:px-5 sm:py-3"
            >
              Close ✕
            </button>

            {/* Sliding stage — keyed content crossfades/slides on Next */}
            <div className="relative h-full w-full">
              <AnimatePresence initial={false} mode="popLayout">
                <ProjectSlide key={project.id} project={project} onNext={onNext} />
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectSlide({ project, onNext }) {
  return (
    <motion.div
      data-lenis-prevent
      className="absolute inset-0 grid h-full grid-cols-1 overflow-y-auto overscroll-contain md:grid-cols-2"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-18%', opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.85, ease: SLIDE_EASE }}
    >
      {/* Visual panel — compact on mobile, sticky half on desktop */}
      <motion.div
        className="relative md:sticky md:top-0 md:h-screen"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.95, ease: SLIDE_EASE }}
      >
        <div
          className="h-[45vh] w-full sm:h-[55vh] md:h-full"
          style={{
            backgroundImage: project.gradient,
            backgroundSize: '200% 200%',
            animation: 'detailShift 12s ease-in-out infinite',
          }}
        />
        <style>{`@keyframes detailShift{0%,100%{background-position:0% 0%}50%{background-position:100% 100%}}`}</style>
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 sm:bottom-6 sm:left-6 sm:right-6">
          <span>Playing preview</span>
          <span>{project.year}</span>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <motion.div
        className="flex flex-col gap-8 p-5 pt-6 sm:gap-10 sm:p-8 md:p-16"
        initial="enter"
        animate="center"
        variants={{
          enter: {},
          center: { transition: { delayChildren: 0.18, staggerChildren: 0.06 } },
        }}
      >
        {[
          <div key="title">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{project.category}</p>
            <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:mt-4 sm:text-4xl md:text-6xl">
              {project.title}
            </h3>
          </div>,
          <div key="meta" className="grid grid-cols-2 gap-4 border-y border-white/10 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 sm:gap-6 sm:py-6">
            <div>
              <p className="text-white/40">Role</p>
              <p className="mt-1.5 text-white sm:mt-2">{project.role}</p>
            </div>
            <div>
              <p className="text-white/40">Year</p>
              <p className="mt-1.5 text-white sm:mt-2">{project.year}</p>
            </div>
            <div className="col-span-2">
              <p className="text-white/40">Tools</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-2 sm:gap-2">
                {project.tools.map((t) => (
                  <span key={t} className="rounded-full border border-white/15 px-2.5 py-0.5 text-white sm:px-3 sm:py-1">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>,
          <p key="desc" className="font-sans text-sm leading-relaxed text-white/70 sm:text-base">
            {project.description}
          </p>,
          <div key="process" className="flex flex-col gap-4 sm:gap-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Process</p>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-video w-full rounded-xl"
                style={{ backgroundImage: project.gradient, opacity: 0.6 - i * 0.15 }}
              />
            ))}
          </div>,
          <button
            key="next"
            onClick={onNext}
            className="glass mt-4 self-start rounded-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white transition-transform duration-300 hover:scale-[1.04] sm:mt-8 sm:px-7 sm:py-4"
          >
            Next Project →
          </button>,
        ].map((child, i) => (
          <motion.div
            key={child.key ?? i}
            variants={{
              enter: { opacity: 0, y: 28 },
              center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: SLIDE_EASE } },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
