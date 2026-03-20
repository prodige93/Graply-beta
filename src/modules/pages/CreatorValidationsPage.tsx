import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Clock, CheckCircle, XCircle, ChevronRight, Megaphone, Users } from 'lucide-react';
import { openVerifyModal } from '@/shared/lib/verify-event';
import Sidebar from '@/shared/ui/Sidebar';
import GrapeLoader from '@/shared/ui/GrapeLoader';
const instagramIcon = '/instagram_(1).svg';
import tiktokIcon from '@/assets/tiktok.svg';
import youtubeIcon from '@/assets/youtube.svg';
import { getCreatorCampaigns, getPendingApplications, subscribeCreatorCampaigns } from '@/modules/campaigns/lib/creator-campaigns';

const platformIconMap: Record<string, string> = {
  instagram: instagramIcon,
  tiktok: tiktokIcon,
  youtube: youtubeIcon,
};

type VideoStatus = 'in_review' | 'approved' | 'rejected';

interface SubmittedVideo {
  id: string;
  campaignId: string;
  campaignName: string;
  campaignPhoto: string;
  brandLogo: string;
  brand: string;
  platform: string;
  videoUrl: string;
  submittedAt: string;
  status: VideoStatus;
  ratePerK: string;
}

const mockVideos: SubmittedVideo[] = [
  {
    id: 'v1',
    campaignId: 'pumpfun-launch',
    campaignName: 'Pump.fun Launch Campaign',
    campaignPhoto: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400',
    brandLogo: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=100',
    brand: 'Pump.fun',
    platform: 'tiktok',
    videoUrl: 'https://www.tiktok.com/@user/video/7123456789',
    submittedAt: '13 mars 2026',
    status: 'in_review',
    ratePerK: '$1.25',
  },
  {
    id: 'v2',
    campaignId: 'apple-iphone17-ugc',
    campaignName: 'Apple — iPhone 17 Pro Max UGC',
    campaignPhoto: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    brandLogo: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=100',
    brand: 'Apple',
    platform: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/abc123',
    submittedAt: '11 mars 2026',
    status: 'approved',
    ratePerK: '$0.20',
  },
  {
    id: 'v3',
    campaignId: 'cod-bo7-clipping',
    campaignName: 'Call of Duty BO7 Official Clipping',
    campaignPhoto: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
    brandLogo: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=100',
    brand: 'Activision',
    platform: 'tiktok',
    videoUrl: 'https://www.tiktok.com/@user/video/9876543210',
    submittedAt: '9 mars 2026',
    status: 'rejected',
    ratePerK: '$0.18',
  },
];

function StatusBadge({ status }: { status: VideoStatus }) {
  if (status === 'in_review') {
    return (
      <span
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
        style={{ background: 'rgba(251,191,36,0.12)', color: '#FBbf24', border: '1px solid rgba(251,191,36,0.2)' }}
      >
        <Clock className="w-3 h-3" />
        En cours
      </span>
    );
  }
  if (status === 'approved') {
    return (
      <span
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
        style={{ background: 'rgba(100,250,81,0.1)', color: '#64FA51', border: '1px solid rgba(100,250,81,0.2)' }}
      >
        <CheckCircle className="w-3 h-3" />
        Approuvee
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      <XCircle className="w-3 h-3" />
      Refusee
    </span>
  );
}

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <span
        className="px-2.5 py-0.5 rounded-full text-xs font-bold"
        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
      >
        {count}
      </span>
    </div>
  );
}

export default function CreatorValidationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsub = subscribeCreatorCampaigns(() => forceUpdate((n) => n + 1));
    const timer = setTimeout(() => setLoading(false), 400);
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  const videos = mockVideos;
  const pendingApplications = getPendingApplications();
  const activeCampaigns = getCreatorCampaigns();

  const allApplications = [
    ...pendingApplications.map((a) => ({ ...a, appStatus: 'pending' as const })),
    ...activeCampaigns.map((c) => ({
      id: c.id,
      name: c.name,
      brand: c.brand,
      brandLogo: c.brandLogo,
      photo: c.photo,
      platforms: c.platforms,
      category: c.category,
      ratePerK: c.ratePerK,
      appliedAt: c.joinedAt,
      applicantsCount: parseInt(c.creators.replace(',', '')) || 0,
      appStatus: 'accepted' as const,
    })),
  ];

  if (loading) {
    return (
      <GrapeLoader fullScreen />
    );
  }

  return (
    <div className="h-screen text-white flex overflow-hidden" style={{ backgroundColor: '#050404' }}>
      <Sidebar activePage="home" onOpenSearch={() => {}} />
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-colors hover:bg-white/10 shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mes validations</h1>
              <p className="text-xs sm:text-sm text-white/35 mt-0.5 sm:mt-1 hidden sm:block">Videos soumises et candidatures en cours</p>
            </div>
            <button
              onClick={() => openVerifyModal()}
              className="group relative flex items-center justify-center py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden shrink-0"
              style={{ background: '#FFA672' }}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <Video className="w-4 h-4 text-white relative z-10 sm:hidden" />
              <span className="font-bold text-sm relative z-10 text-white hidden sm:inline">Verifier ma video</span>
            </button>
          </div>

          <div className="mb-10">
            <SectionHeader
              icon={<Video className="w-4 h-4 text-white/70" />}
              title="Videos en cours de validation"
              count={videos.length}
            />
            {videos.length === 0 ? (
              <div
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3"
                style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Video className="w-8 h-8 text-white/15" />
                <p className="text-sm text-white/30">Aucune video soumise pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                    style={{
                      background: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <img
                      src={video.campaignPhoto}
                      alt={video.campaignName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] sm:text-sm font-semibold text-white truncate">{video.campaignName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {platformIconMap[video.platform] && (
                          <img src={platformIconMap[video.platform]} alt={video.platform} className="w-3.5 h-3.5 social-icon opacity-60 shrink-0" />
                        )}
                        <p className="text-xs text-white/35 truncate hidden sm:block">{video.videoUrl}</p>
                        <p className="text-[11px] text-white/25 sm:hidden">{video.submittedAt}</p>
                      </div>
                      <p className="text-[11px] text-white/25 mt-0.5 hidden sm:block">{video.submittedAt} · {video.ratePerK}/1K vues</p>
                    </div>
                    <StatusBadge status={video.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <SectionHeader
              icon={<Megaphone className="w-4 h-4 text-white/70" />}
              title="Campagnes ou j'ai postule"
              count={allApplications.length}
            />
            {allApplications.length === 0 ? (
              <div
                className="rounded-xl p-8 flex flex-col items-center justify-center gap-3"
                style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Megaphone className="w-8 h-8 text-white/15" />
                <p className="text-sm text-white/30">Aucune candidature pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allApplications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => navigate(`/campagne/${app.id}`)}
                    className="w-full group rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-200 text-left"
                    style={{
                      background: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <img
                      src={app.photo}
                      alt={app.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] sm:text-sm font-semibold text-white truncate">{app.name}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          {app.platforms.map((p) =>
                            platformIconMap[p] ? (
                              <div
                                key={p}
                                className="w-5 h-5 rounded-md flex items-center justify-center"
                                style={{ background: 'rgba(255,255,255,0.06)' }}
                              >
                                <img src={platformIconMap[p]} alt={p} className="w-3 h-3 social-icon" />
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-2.5 mt-1">
                        <p className="text-xs text-white/35">{app.ratePerK}/1K</p>
                        <span className="text-white/15 hidden sm:inline">·</span>
                        <div className="hidden sm:flex items-center gap-1">
                          <Users className="w-3 h-3 text-white/25" />
                          <p className="text-xs text-white/35">{app.applicantsCount.toLocaleString()} candidats</p>
                        </div>
                        <span className="text-white/15 hidden sm:inline">·</span>
                        <p className="text-xs text-white/25 hidden sm:block">{app.appliedAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {app.appStatus === 'pending' ? (
                        <span
                          className="px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
                          style={{ background: 'rgba(251,191,36,0.12)', color: '#FBbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                        >
                          En attente
                        </span>
                      ) : (
                        <span
                          className="px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap"
                          style={{ background: 'rgba(100,250,81,0.1)', color: '#64FA51', border: '1px solid rgba(100,250,81,0.2)' }}
                        >
                          Accepte
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors hidden sm:block" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
