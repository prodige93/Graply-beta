import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';
import Sidebar from '@/shared/ui/Sidebar';
import CampaignCard, { type CampaignData } from '@/modules/campaigns/ui/CampaignCard';
import { campaigns, sponsoredCampaigns } from '@/modules/campaigns/data/mock-campaign-catalog';
import { useSavedCampaigns } from '@/modules/campaigns/context/SavedCampaignsContext';
const instagramIcon = '/instagram_(1).svg';
import tiktokIcon from '@/assets/tiktok.svg';

const allCampaigns = [...campaigns, ...sponsoredCampaigns];

const platformIconMap: Record<string, string> = {
  instagram: instagramIcon,
  tiktok: tiktokIcon,
};

function SavedCardMobile({ data, onRemove }: { data: CampaignData; onRemove: () => void }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/campagne/${data.id}`, { state: { from: '/enregistre' } })}
      className="w-full rounded-2xl overflow-hidden text-left transition-all duration-200 hover:scale-[1.003] relative group"
      style={{
        background: 'rgba(10,10,15,1)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.85), 0 0 0 0.5px rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-stretch">
        <div className="relative w-28 shrink-0">
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 20%, rgba(10,10,15,1) 100%)' }} />
        </div>
        <div className="flex-1 px-4 py-4 flex flex-col gap-2 min-w-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-0.5">{data.brand}</p>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{data.title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {data.socials.map((p) =>
              platformIconMap[p] ? <img key={p} src={platformIconMap[p]} alt={p} className="w-3 h-3 brightness-0 invert opacity-50" /> : null
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {data.tags.filter((t) => ['ugc', 'clipping'].includes(t.toLowerCase())).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={
                  tag.toLowerCase() === 'ugc'
                    ? { background: 'rgba(255,0,217,0.1)', border: '1px solid rgba(255,0,217,0.25)', color: '#FF00D9' }
                    : { background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }
                }
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white">{data.ratePerView}<span className="text-[8px] text-white/30 font-medium">/1K</span></span>
            <span className="text-white/20 text-[9px]">.</span>
            <span className="text-[10px] font-bold text-white/70">{data.budget}</span>
          </div>
        </div>
      </div>
      <div
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemove(); }}
        className="absolute top-2.5 left-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer hover:bg-white/[0.14] hover:border-white/25 hover:shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        <Trash2 className="w-3.5 h-3.5 text-white/70" />
      </div>
    </button>
  );
}

export default function SavedCampaignsPage() {
  const navigate = useNavigate();
  const { savedIds, toggle } = useSavedCampaigns();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const savedCampaigns = allCampaigns.filter((c) => savedIds.includes(c.id));

  return (
    <div className="h-screen text-white flex overflow-hidden" style={{ backgroundColor: '#050404' }}>
      <Sidebar
        activePage="enregistre"
        onOpenSearch={() => {}}
      />

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        <div className="px-4 sm:px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white">Enregistre</h1>
              <p className="text-sm text-white/40 mt-0.5">
                {savedCampaigns.length} campagne{savedCampaigns.length !== 1 ? 's' : ''} sauvegardee{savedCampaigns.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-8">
          {savedCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Bookmark className="w-7 h-7 text-white/25" />
              </div>
              <div className="text-center">
                <p className="text-white/50 font-semibold">Aucune campagne enregistrée</p>
                <p className="text-white/25 text-sm mt-1">Les campagnes que vous sauvegardez apparaîtront ici</p>
              </div>
              <button
                onClick={() => navigate('/campagnes')}
                className="mt-2 px-6 py-2.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-white/90 transition-colors"
              >
                Explorer les campagnes
              </button>
            </div>
          ) : (
            <>
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {savedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} data={campaign} from="/enregistre" />
                ))}
              </div>

              <div className="sm:hidden space-y-3 pb-10">
                {savedCampaigns.map((campaign) => (
                  <SavedCardMobile
                    key={campaign.id}
                    data={campaign}
                    onRemove={() => toggle(campaign.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
