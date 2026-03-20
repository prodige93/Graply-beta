import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, Check, X, Clock, Link2, ExternalLink, Video, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Sidebar from '@/shared/ui/Sidebar';
import { getSubmittedVideos, removeSubmittedVideo, type SubmittedVideo } from '@/modules/campaigns/lib/creator-campaigns';
import GrapeLoader from '@/shared/ui/GrapeLoader';
const instagramIcon = '/instagram_(1).svg';
import tiktokIcon from '@/assets/tiktok.svg';
import youtubeIcon from '@/assets/youtube.svg';

const platformIconMap: Record<string, string> = {
  instagram: instagramIcon,
  tiktok: tiktokIcon,
  youtube: youtubeIcon,
};

const platformLabel: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const statusOptions = ['Tous', 'En attente', 'Approuvee', 'Refusee'];
const statusFilterMap: Record<string, string> = {
  'En attente': 'in_review',
  'Approuvee': 'approved',
  'Refusee': 'rejected',
};

export default function MyVideosPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [, forceUpdate] = useState(0);
  const submittedVideos = getSubmittedVideos();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  const filteredVideos = submittedVideos.filter((v) => {
    const matchesSearch =
      v.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatforms.size === 0 || selectedPlatforms.has(v.platform);
    const matchesStatus = !selectedStatus || v.status === statusFilterMap[selectedStatus];
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const hasAnyFilter = searchQuery.trim() !== '' || selectedPlatforms.size > 0 || !!selectedStatus;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedPlatforms(new Set());
    setSelectedStatus(null);
    setOpenDropdown(null);
  };

  if (loading) {
    return (
      <GrapeLoader fullScreen />
    );
  }

  return (
    <div className="h-screen text-white flex overflow-hidden" style={{ backgroundColor: '#050404' }}>
      <Sidebar activePage="home" onOpenSearch={() => {}} />
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        <div className="px-4 sm:px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/10 shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-white">Videos en cours de verification</h1>
              <p className="text-sm text-white/40 mt-0.5">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} soumise{filteredVideos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-6" ref={dropdownRef}>
          <div className="relative mb-3 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une video..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-white/40 hover:text-white/70 transition-colors" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'Statut' ? null : 'Statut')}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap"
                style={
                  openDropdown === 'Statut' || selectedStatus
                    ? {
                        background: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.35)',
                        color: '#fff',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.7)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 2px rgba(0,0,0,0.15)',
                      }
                }
              >
                <span className="truncate">{selectedStatus || 'Statut'}</span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${openDropdown === 'Statut' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'Statut' && (
                <div
                  className="absolute top-full left-0 mt-2 w-52 rounded-2xl z-50 overflow-hidden"
                  style={{
                    background: 'rgba(20, 18, 18, 0.55)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  <div className="pt-1.5" />
                  {statusOptions.map((option) => {
                    const isSelected = (selectedStatus || 'Tous') === option;
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedStatus(option === 'Tous' ? null : option);
                          setOpenDropdown(null);
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold transition-all duration-200"
                        style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.85)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: isSelected ? '#fff' : 'rgba(255,255,255,0.2)', boxShadow: isSelected ? '0 0 6px rgba(255,255,255,0.6)' : 'none' }}
                          />
                          {option}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 text-white" />}
                      </button>
                    );
                  })}
                  <div className="pb-1.5" />
                </div>
              )}
            </div>

            {hasAnyFilter && (
              <button
                onClick={resetAllFilters}
                className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl transition-colors hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            {[
              { key: 'instagram', icon: <img src={instagramIcon} alt="Instagram" className="w-5 h-5" /> },
              { key: 'tiktok', icon: <img src={tiktokIcon} alt="TikTok" className="w-5 h-5" /> },
              { key: 'youtube', icon: <img src={youtubeIcon} alt="YouTube" className="w-5 h-5" /> },
            ].map(({ key, icon }) => (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                style={
                  selectedPlatforms.has(key)
                    ? { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }
                }
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 mt-6 pb-12">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Video className="w-6 h-6 text-white/25" />
              </div>
              <p className="text-white/40 text-sm font-medium">Aucune vidéo trouvée</p>
              <p className="text-white/20 text-xs mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onDelete={video.status !== 'in_review' ? () => {
                    removeSubmittedVideo(video.id);
                    forceUpdate((n) => n + 1);
                  } : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onDelete }: { video: SubmittedVideo; onDelete?: () => void }) {
  const statusConfig = {
    in_review: {
      icon: <Clock className="w-3 h-3" style={{ color: '#fb923c' }} />,
      label: 'En attente',
    },
    approved: {
      icon: <CheckCircle className="w-3 h-3" style={{ color: '#4ade80' }} />,
      label: 'Approuvee',
    },
    rejected: {
      icon: <XCircle className="w-3 h-3" style={{ color: '#f87171' }} />,
      label: 'Refusee',
    },
  };

  const config = statusConfig[video.status];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${onDelete ? 'flex-1 min-w-0' : 'w-full'} rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.003]`}
        style={{
          background: 'rgba(10,10,15,1)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04)',
          opacity: video.status === 'rejected' ? 0.6 : 1,
        }}
      >
        <div className="flex items-stretch h-[120px]">
          <div className="relative w-28 sm:w-36 shrink-0 h-full">
            <img
              src={video.campaignPhoto}
              alt={video.campaignName}
              className={`w-full h-full object-cover ${video.status === 'rejected' ? 'grayscale' : ''}`}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 20%, rgba(10,10,15,1) 100%)' }} />
          </div>

          <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-0.5">{video.brand}</p>
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{video.campaignName}</h3>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                {config.icon}
                <span className="text-[10px] font-bold text-white">{config.label}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {platformIconMap[video.platform] && (
                  <img src={platformIconMap[video.platform]} alt={video.platform} className="w-3.5 h-3.5 brightness-0 invert opacity-50" />
                )}
                <span className="text-[10px] text-white/40">{platformLabel[video.platform] ?? video.platform}</span>
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[10px] text-white/30">Soumise le {video.submittedAt}</span>
              </div>

              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voir la video</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-10 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            height: '80px',
            background: 'rgba(10,10,15,1)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10,10,15,1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
          }}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
}
