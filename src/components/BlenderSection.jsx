import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import { getLenis } from '../hooks/useLenis';
import { ytEmbedUrl, ytThumbnail } from '../utils/youtube';

const EASE = [0.76, 0, 0.24, 1];

const POPUP_CARDS = [
  {
    id: 'stills',
    eyebrow: 'Cinematic stills',
    title: 'Final Frames',
    meta: 'Blender · Cycles',
    blurb:
      'Key frames from the final render. Every shot was lit, shaded and composited entirely in Blender with Cycles -- my first time fully working inside Blender. A single 3-second animation took hours to render; the full final animations alone took 5 days to render across 15+ scenes.',
    gradient:
      'linear-gradient(135deg,#15151a 0%,#2a1f3a 40%,#3a2230 70%,#15151a 100%)',
    accent:
      'radial-gradient(50% 40% at 35% 45%, rgba(236,72,153,0.28), transparent 60%), radial-gradient(45% 35% at 70% 60%, rgba(56,189,248,0.22), transparent 60%)',
    images: [
      '/blender/stills/1.png',
      '/blender/stills/2.png',
      '/blender/stills/3.png',
      '/blender/stills/4.png',
      '/blender/stills/5.png',
      '/blender/stills/6.png',
      '/blender/stills/7.png',
    ],
  },
  {
    id: 'bts',
    eyebrow: 'Behind the scenes',
    title: 'Process & BTS',
    meta: 'Viewport · Wireframe · Nodes',
    blurb:
      'Scene breakdowns, wireframes, shader graphs and the messy bits in between.',
    gradient:
      'repeating-linear-gradient(45deg,#1a1a22 0 14px,#20202a 14px 28px)',
    accent:
      'radial-gradient(60% 50% at 50% 50%, rgba(168,85,247,0.28), transparent 65%)',
    stillCount: 6,
  },
];

export default function BlenderSection() {
  const [titleRef, inView] = useInView({ threshold: 0.3 });
  const [activeId, setActiveId] = useState(null);
  const active = POPUP_CARDS.find((c) => c.id === activeId) || null;

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

  return (
    <section id="blender" className="cv-auto relative bg-ink px-6 py-32 md:px-14 md:py-44">
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
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">02 / Blender · 3D</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] text-white md:text-7xl">
            Sculpted in<br />
            three dimensions.
          </h2>
        </div>
        <p className="max-w-sm font-sans text-sm leading-relaxed text-white/60">
          First time going fully 3D. A Valorant montage to "Munyun", built across 15+ scenes,{' '}
          <span className="text-white font-medium">400+ layers in After Effects</span>, and{' '}
          <span className="text-white font-medium">100+ hours</span> of figuring Blender out from scratch. A single 3-second shot took hours to render. Five days of Cycles render time to get there.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
        <FinalVideoCard />

        <div className="flex flex-col gap-6 md:col-span-2 md:gap-8">
          {POPUP_CARDS.map((card, i) => (
            <PopupCard key={card.id} card={card} index={i} onOpen={() => setActiveId(card.id)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <BlenderPopup card={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </section>
  );
}

function FinalVideoCard() {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="md:col-span-3"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(60px)',
        transition: 'opacity 1s cubic-bezier(0.2,0.8,0.2,1), transform 1s cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black md:aspect-auto md:h-full md:min-h-[480px]">
        <img
          src={ytThumbnail('vsrUu2hhWys')}
          alt="Blender final render"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe
            src={ytEmbedUrl('vsrUu2hhWys')}
            title="Blender Final Render"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80">
          Final render
        </span>
        <span className="pointer-events-none absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
          Blender · Cycles
        </span>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">Full piece</p>
          <h3 className="mt-1 font-display text-3xl font-semibold text-white md:text-4xl">MUNYUN / A 3D Valorant Cinematic Montage</h3>
        </div>
      </div>
    </div>
  );
}

function PopupCard({ card, index, onOpen }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="flex-1"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity 1s ${0.15 + index * 0.1}s cubic-bezier(0.2,0.8,0.2,1), transform 1s ${0.15 + index * 0.1}s cubic-bezier(0.2,0.8,0.2,1)`,
      }}
    >
      <button
        data-cursor="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onOpen}
        className="group block h-full w-full text-left"
      >
        <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:min-h-[240px]">
          {card.images?.[0] ? (
            <img
              src={card.images[0]}
              alt={card.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundImage: card.gradient }} />
          )}
          <div
            className="absolute inset-0 transition-opacity duration-700 mix-blend-screen"
            style={{ opacity: hovered ? (card.images ? 0.25 : 1) : (card.images ? 0 : 0.6), backgroundImage: card.accent }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
            {card.meta.split('·')[0].trim()}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">{card.eyebrow}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-white">{card.title}</h3>
          </div>
        </div>
      </button>
    </div>
  );
}

function BlenderPopup({ card, onClose }) {
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        data-lenis-prevent
        className="relative z-10 flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-ink"
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <button
          onClick={onClose}
          className="glass absolute right-4 top-4 z-30 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white sm:right-6 sm:top-6 sm:px-5 sm:py-3"
        >
          Close ✕
        </button>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain p-6 sm:p-10 md:p-14">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{card.eyebrow}</p>
            <h3 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-6xl">
              {card.title}
            </h3>
            <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-white/65 sm:text-base">
              {card.blurb}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{card.meta}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {(card.images ?? Array.from({ length: card.stillCount ?? 6 })).map((src, i) => (
              <div
                key={i}
                className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/5"
                style={card.images ? undefined : { backgroundImage: card.gradient }}
              >
                {card.images ? (
                  <img
                    src={src}
                    alt={`${card.title} ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 mix-blend-screen"
                    style={{ backgroundImage: card.accent, opacity: 0.5 + (i % 3) * 0.15 }}
                  />
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                  {card.id === 'bts' ? `BTS / ${String(i + 1).padStart(2, '0')}` : `Still / ${String(i + 1).padStart(2, '0')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
