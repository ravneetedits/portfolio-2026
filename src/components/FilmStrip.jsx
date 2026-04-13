import { useEffect, useRef, useState } from 'react';

// Minimal video playback controller pinned to the bottom of the hero.
// Shows play/pause, elapsed/total, and a draggable scrubber.
// Swap the internal fake ticker for real <video> bindings when the reel is added.
const TOTAL_DURATION = 72; // seconds — replace with real video.duration

const fmt = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export default function FilmStrip({ volume = 0, onVolumeChange }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [hoverX, setHoverX] = useState(null);

  const rafRef = useRef();
  const lastTickRef = useRef(performance.now());
  const trackRef = useRef(null);

  useEffect(() => {
    const tick = (t) => {
      const dt = (t - lastTickRef.current) / 1000;
      lastTickRef.current = t;
      if (playing && !dragging) {
        setElapsed((e) => (e + dt) % TOTAL_DURATION);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, dragging]);

  const progress = elapsed / TOTAL_DURATION;

  const pctFromEvent = (clientX) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  };

  const seekFromEvent = (clientX) => {
    setElapsed(pctFromEvent(clientX) * TOTAL_DURATION);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    seekFromEvent(e.clientX);
    trackRef.current?.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    setHoverX(pctFromEvent(e.clientX));
    if (dragging) seekFromEvent(e.clientX);
  };
  const onPointerUp = (e) => {
    if (dragging) {
      setDragging(false);
      trackRef.current?.releasePointerCapture?.(e.pointerId);
    }
  };
  const onPointerLeave = () => setHoverX(null);

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-8">
      <div className="glass flex items-center gap-2 rounded-full px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3 md:gap-5 md:px-5">
        {/* Play / pause */}
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause showreel' : 'Play showreel'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 hover:scale-[1.08] sm:h-9 sm:w-9"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M7 4 L20 12 L7 20 Z" />
            </svg>
          )}
        </button>

        {/* Elapsed */}
        <span className="hidden w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-white/70 sm:block">
          {fmt(elapsed)}
        </span>

        {/* Track */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          className="group relative h-6 flex-1 cursor-pointer touch-none select-none"
        >
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 transition-[height] duration-200 group-hover:h-[5px]">
            {hoverX !== null && (
              <div className="absolute left-0 top-0 h-full bg-white/25" style={{ width: `${hoverX * 100}%` }} />
            )}
            <div
              className="absolute left-0 top-0 h-full bg-white"
              style={{ width: `${progress * 100}%`, transition: dragging ? 'none' : 'width 0.08s linear' }}
            />
          </div>
          <div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${progress * 100}%`, transition: dragging ? 'none' : 'left 0.08s linear' }}
          >
            <div
              className="h-3 w-3 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.15)] transition-transform duration-200 group-hover:scale-125"
              style={{ transform: dragging ? 'scale(1.35)' : undefined }}
            />
          </div>
          {hoverX !== null && (
            <div
              className="pointer-events-none absolute bottom-[140%] -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md"
              style={{ left: `${hoverX * 100}%` }}
            >
              {fmt(hoverX * TOTAL_DURATION)}
            </div>
          )}
        </div>

        {/* Total */}
        <span className="hidden w-9 shrink-0 font-mono text-[10px] tabular-nums text-white/40 sm:block">
          {fmt(TOTAL_DURATION)}
        </span>

        {/* Label */}
        <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.28em] text-white/40 lg:block">
          Showreel
        </span>

        {/* Volume — always visible */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onVolumeChange?.(volume > 0 ? 0 : 0.7)}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            className="flex h-6 w-6 shrink-0 items-center justify-center text-white/60 transition-colors duration-200 hover:text-white"
          >
            <SpeakerIcon volume={volume} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
            className="vol-slider w-14 cursor-pointer sm:w-16"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

function SpeakerIcon({ volume }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-200">
      <path d="M11 5 L6 9 H3 V15 H6 L11 19 Z" fill="currentColor" stroke="none" />
      {volume === 0 ? (
        <>
          <line x1="16" y1="9" x2="22" y2="15" />
          <line x1="22" y1="9" x2="16" y2="15" />
        </>
      ) : volume < 0.5 ? (
        <path d="M15.5 8.5 A5 5 0 0 1 15.5 15.5" />
      ) : (
        <>
          <path d="M15.5 8.5 A5 5 0 0 1 15.5 15.5" />
          <path d="M18.5 6 A9 9 0 0 1 18.5 18" />
        </>
      )}
    </svg>
  );
}
