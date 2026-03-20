import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { getCreatorCampaigns, getSubmittedVideos } from '@/modules/campaigns/lib/creator-campaigns';
const instagramIcon = '/instagram_(1).svg';
import tiktokIcon from '@/assets/tiktok.svg';
import youtubeIcon from '@/assets/youtube.svg';

const platformIconMap: Record<string, string> = {
  instagram: instagramIcon,
  tiktok: tiktokIcon,
  youtube: youtubeIcon,
};

interface Props {
  onClose: () => void;
  hidePendingBadges?: boolean;
}

export default function VerifyVideoModal({ onClose, hidePendingBadges = false }: Props) {
  const navigate = useNavigate();
  const campaigns = getCreatorCampaigns().filter((c) => c.status === 'active' || c.status === 'paused');
  const submittedVideos = getSubmittedVideos();
  const pendingByC = (cId: string) => submittedVideos.filter((v) => v.campaignId === cId && v.status === 'in_review').length;

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/campagne/${id}/verification`);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.055)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
        }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="text-base font-bold text-white">Verifier ma video</h2>
            <p className="text-xs text-white/40 mt-0.5">Selectionne la campagne concernee</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-sm text-white/30 text-center">Aucune campagne active.<br />Rejoins une campagne pour soumettre tes videos.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group hover:scale-[1.01] active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.10)';
                  }}
                >
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/35 font-semibold uppercase tracking-wider mb-0.5">{c.brand}</p>
                    <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {c.platforms.map((p) =>
                        platformIconMap[p] ? (
                          <img key={p} src={platformIconMap[p]} alt={p} className="w-3.5 h-3.5 social-icon opacity-50" />
                        ) : null
                      )}
                      <span className="text-[10px] text-white/25 ml-1">{c.ratePerK}/1K vues</span>
                    </div>
                  </div>
                  {!hidePendingBadges && pendingByC(c.id) > 0 && (
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: 'rgba(255,166,114,0.12)', color: '#FFA672', border: '1px solid rgba(255,166,114,0.25)' }}
                    >
                      video en attente
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block h-5" />
        <div className="block sm:hidden" style={{ height: 'calc(5rem + env(safe-area-inset-bottom))' }} />
      </div>
    </div>
  );
}
