import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { projects } from '../data/projects';
import { getLenis } from '../hooks/useLenis';
import { ytEmbedUrl } from '../utils/youtube';

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
        className="relative bg-black md:sticky md:top-0 md:h-screen"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.95, ease: SLIDE_EASE }}
      >
        {project.final?.id ? (
          <div className="flex h-[50vw] min-h-[260px] w-full items-center justify-center bg-black sm:h-[55vh] md:h-full">
            <YouTubePlayer video={project.final} />
          </div>
        ) : (
          <div
            className="h-[50vw] min-h-[260px] w-full sm:h-[55vh] md:h-full"
            style={{ backgroundImage: project.gradient }}
          />
        )}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 sm:bottom-6 sm:left-6 sm:right-6">
          <span>Final piece</span>
          <span>{project.year}</span>
        </div>
      </motion.div>

      {/* Scrollable content */}
      <motion.div
        className="flex flex-col gap-8 p-5 pt-7 sm:gap-10 sm:p-8 md:p-16"
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
          (project.bts?.length ?? 0) > 0 && (
            <div key="bts" className="flex flex-col gap-4 sm:gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Behind the scenes</p>
              {project.bts.map((v) => (
                <YouTubePlayer key={v.id} video={v} rounded />
              ))}
            </div>
          ),
          (project.stills?.length ?? 0) > 0 && (
            <div key="stills" className="flex flex-col gap-4 sm:gap-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Stills</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {project.stills.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${project.title} still ${i + 1}`}
                    loading="lazy"
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          ),
          <button
            key="next"
            onClick={onNext}
            className="glass mt-4 self-start rounded-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white transition-transform duration-300 hover:scale-[1.04] sm:mt-8 sm:px-7 sm:py-4"
          >
            Next Project →
          </button>,
        ].filter(Boolean).map((child, i) => (
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

// Responsive YouTube embed. Handles both 16:9 and 9:16 (shorts).
// When embedded in a flex parent (the left sticky panel), shorts render
// as a centered vertical frame capped by parent height.
function YouTubePlayer({ video, rounded = false }) {
  const isShort = !!video.shorts;
  const src = ytEmbedUrl(video.id);
  const radius = rounded ? 'rounded-xl' : '';

  if (isShort) {
    return (
      <div className={`relative mx-auto w-full max-w-[360px] overflow-hidden bg-black ${radius}`} style={{ aspectRatio: '9 / 16' }}>
        <iframe
          src={src}
          title="YouTube video player"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${radius}`}>
      <iframe
        src={src}
        title="YouTube video player"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
