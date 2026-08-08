import { useEffect, useState } from 'react';

const MESSAGE = 'Back shortly.';

export default function MaintenancePage() {
  const [typedLength, setTypedLength] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (typedLength >= MESSAGE.length) return;
    const id = setTimeout(() => setTypedLength((n) => n + 1), 90);
    return () => clearTimeout(id);
  }, [typedLength]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="noise relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-white">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 40%, rgba(236,72,153,0.08), transparent 60%), radial-gradient(50% 40% at 70% 65%, rgba(14,165,233,0.07), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col">
        {/* Logo */}
        <div className="mb-16 flex items-center gap-2.5">
          <svg viewBox="0 0 120 120" className="h-6 w-6 text-white">
            <path d="M20 100 L20 20 L60 20 Q90 20 90 50 Q90 75 60 80 L30 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 80 L100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <span className="font-display text-base font-semibold tracking-tight">Ravneet</span>
        </div>

        {/* Eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/40">
          Site status
        </p>

        {/* Typed headline */}
        <h1 className="mt-5 font-display font-semibold leading-[0.95]" style={{ fontSize: 'clamp(48px, 9vw, 96px)' }}>
          <span>{MESSAGE.slice(0, typedLength)}</span>
          <span
            className="ml-1 inline-block w-[0.08em] rounded-sm bg-white"
            style={{
              height: '0.85em',
              verticalAlign: '-0.05em',
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.08s',
            }}
          />
        </h1>

        <p className="mt-8 max-w-sm font-sans text-sm leading-relaxed text-white/50">
          Refining the experience and adding new work. Everything will be back up very soon.
        </p>

        {/* Status pill */}
        <div className="mt-12 flex items-center gap-3">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
            In progress
          </span>
        </div>

        {/* Bottom rule */}
        <div className="mt-20 border-t border-white/8 pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">
          © 2026 Ravneet Singh
        </div>
      </div>
    </main>
  );
}
