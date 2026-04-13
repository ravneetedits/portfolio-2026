import { useEffect, useRef, useState } from 'react';
import { getLenis } from '../hooks/useLenis';

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

// Sections with light backgrounds that need a dark navbar
const LIGHT_SECTIONS = ['about'];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const visibleSet = new Set();

    const observers = LIGHT_SECTIONS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) visibleSet.add(id);
          else visibleSet.delete(id);
          setIsDark(visibleSet.size > 0);
        },
        { threshold: 0.05 }
      );
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  };

  const fg = isDark ? '#0a0a0a' : '#fff';
  const fgMuted = isDark ? 'rgba(10,10,10,0.65)' : 'rgba(255,255,255,0.7)';
  const hoverBg = isDark ? 'rgba(10,10,10,0.08)' : 'rgba(255,255,255,0.10)';

  const pillStyle = {
    background: isDark ? 'rgba(10,10,10,0.12)' : 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: isDark ? '1px solid rgba(10,10,10,0.15)' : '1px solid rgba(255,255,255,0.12)',
    boxShadow: isDark
      ? 'inset 0 1px 0 rgba(0,0,0,0.08), 0 10px 40px rgba(0,0,0,0.12)'
      : 'inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 40px rgba(0,0,0,0.25)',
  };

  const handleLinkClick = (id) => (e) => {
    setMenuOpen(false);
    scrollTo(id)(e);
  };

  return (
    <>
      {/* ── Mobile nav ── */}
      <nav className="pointer-events-none fixed left-0 right-0 top-4 z-50 flex items-center justify-between px-4 sm:hidden">
        {/* Logo pill */}
        <div className="pointer-events-auto rounded-full px-3 py-2 transition-all duration-500" style={pillStyle}>
          <a href="#top" onClick={handleLinkClick('top')} className="flex items-center gap-2 px-1 py-0.5">
            <svg viewBox="0 0 120 120" className="h-4 w-4" style={{ color: fg }}>
              <path d="M20 100 L20 20 L60 20 Q90 20 90 50 Q90 75 60 80 L30 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 80 L100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            </svg>
            <span className="font-display text-sm font-semibold tracking-tight transition-colors duration-500" style={{ color: fg }}>
              Ravneet
            </span>
          </a>
        </div>

        {/* Hamburger pill */}
        <button
          className="pointer-events-auto rounded-full p-2.5 transition-all duration-500"
          style={pillStyle}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="flex h-3.5 w-4 flex-col justify-between">
            <span
              className="block h-px w-full rounded-full transition-all duration-300 origin-center"
              style={{
                background: fg,
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block h-px w-full rounded-full transition-all duration-300"
              style={{
                background: fg,
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? 'scaleX(0)' : 'none',
              }}
            />
            <span
              className="block h-px w-full rounded-full transition-all duration-300 origin-center"
              style={{
                background: fg,
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 sm:hidden"
        style={{
          background: isDark ? 'rgba(245,245,243,0.92)' : 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={handleLinkClick(l.id)}
              className="font-display text-5xl font-semibold tracking-tight transition-opacity duration-300"
              style={{
                color: isDark ? '#0a0a0a' : '#fff',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ${0.07 * i + 0.1}s ease, transform 0.4s ${0.07 * i + 0.1}s cubic-bezier(0.2,0.8,0.2,1)`,
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Desktop nav ── */}
      <nav className="pointer-events-none fixed left-0 right-0 top-6 z-50 hidden justify-center px-6 sm:flex">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full px-3 py-2 transition-all duration-500" style={pillStyle}>
          <a href="#top" onClick={handleLinkClick('top')} className="flex items-center gap-2 px-3 py-2">
            <svg viewBox="0 0 120 120" className="h-5 w-5" style={{ color: fg }}>
              <path d="M20 100 L20 20 L60 20 Q90 20 90 50 Q90 75 60 80 L30 80" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 80 L100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            </svg>
            <span className="font-display text-sm font-semibold tracking-tight transition-colors duration-500" style={{ color: fg }}>
              Ravneet
            </span>
          </a>
          <div className="mx-2 h-4 w-px transition-colors duration-500" style={{ background: isDark ? 'rgba(10,10,10,0.2)' : 'rgba(255,255,255,0.15)' }} />
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={handleLinkClick(l.id)}
              className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: fgMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = fg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = fgMuted; }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
