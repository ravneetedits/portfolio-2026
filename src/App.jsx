import { useCallback, useState } from 'react';
import useLenis from './hooks/useLenis';
import Cursor from './components/Cursor';
import LoadingAnimation from './components/LoadingAnimation';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectGrid from './components/ProjectGrid';
import BlenderSection from './components/BlenderSection';
import ProjectDetail from './components/ProjectDetail';
import About from './components/About';
import Contact from './components/Contact';
import ScrollProgress from './components/ScrollProgress';
import MaintenancePage from './components/MaintenancePage';
import { projects } from './data/projects';

const MAINTENANCE_MODE = false;

function PortfolioSite() {
  useLenis();
  const [introDone, setIntroDone] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [originRect, setOriginRect] = useState(null);

  const openProject = useCallback((id, rect) => {
    setActiveId(id);
    setOriginRect(rect || null);
  }, []);

  const closeProject = useCallback(() => {
    setActiveId(null);
  }, []);

  const nextProject = useCallback(() => {
    const idx = projects.findIndex((p) => p.id === activeId);
    const next = projects[(idx + 1) % projects.length];
    setOriginRect(null);
    setActiveId(next.id);
  }, [activeId]);

  return (
    <div className="noise relative min-h-screen bg-ink text-white">
      <LoadingAnimation onDone={() => setIntroDone(true)} />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main
        style={{
          opacity: introDone ? 1 : 0,
          transform: introDone ? 'scale(1)' : 'scale(0.98)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}
      >
        <Hero />
        <ProjectGrid onOpen={openProject} />
        <BlenderSection />
        <About />
        <Contact />
      </main>
      <ProjectDetail
        activeId={activeId}
        originRect={originRect}
        onClose={closeProject}
        onNext={nextProject}
      />
    </div>
  );
}

export default function App() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return <PortfolioSite />;
}
