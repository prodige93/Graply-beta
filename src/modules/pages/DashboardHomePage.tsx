import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/shared/ui/Sidebar';
import CreatorPanel from '@/shared/ui/CreatorPanel';
import { ROUTES } from '@/app/routes';

const slides = [
  { id: 1, title: 'iPhone 17', image: '/iphone17.jpeg', description: 'Nouvelle collection' },
  { id: 2, title: 'Black Ops 7', image: '/bo7.jpeg', description: 'Campagne exclusive' },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCreatorId) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedCreatorId]);

  const showPanel = !!selectedCreatorId;

  return (
    <div className="min-h-screen text-white flex flex-col lg:flex-row" style={{ background: '#050404' }}>
      <Sidebar activePage="home" onOpenSearch={() => {}} />

      {showPanel ? (
        <CreatorPanel
          creatorId={selectedCreatorId}
          dbProfile={null}
          onClose={() => setSelectedCreatorId(null)}
        />
      ) : (
        <main
          className="flex-1 relative overflow-hidden pb-20 lg:pb-0 cursor-pointer select-none"
          style={{ touchAction: 'manipulation', overscrollBehavior: 'none' }}
          onClick={() => navigate(ROUTES.campagnes)}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0 invisible pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/20 lg:bg-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 lg:p-12 pb-32 lg:pb-12">
                <h2 className="text-4xl lg:text-5xl font-bold mb-2 lg:mb-3">{slide.title}</h2>
                <p className="text-lg lg:text-xl text-gray-300">{slide.description}</p>
              </div>
            </div>
          ))}

          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[60] lg:hidden">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(ROUTES.campagnes); }}
              className="cursor-pointer select-none rounded-2xl px-6 py-3.5 flex items-center justify-center gap-2.5 active:scale-95 transition-transform duration-200"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <span className="text-white font-semibold text-base tracking-wide whitespace-nowrap">Voir les campagnes</span>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M4 10L10 4M10 4H5M10 4V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="absolute bottom-24 lg:bottom-6 left-6 lg:left-12 z-[60]">
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: index === currentSlide ? '14px' : '4px',
                    height: '4px',
                    background: index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-32 lg:bottom-16 left-1/2 -translate-x-1/2 z-[60]">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(ROUTES.campagnes); }}
              className="hidden lg:flex cursor-pointer select-none rounded-2xl px-6 py-3.5 items-center justify-center gap-2.5 active:scale-95 transition-transform duration-200"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <span className="text-white font-semibold text-base tracking-wide whitespace-nowrap">Voir les campagnes</span>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M4 10L10 4M10 4H5M10 4V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
