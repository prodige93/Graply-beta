import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { X, ChevronRight, Video, Clock } from 'lucide-react'
import MobileNav from './MobileNav'
import { getCreatorCampaigns, getSubmittedVideos, subscribeCreatorCampaigns, type CreatorCampaign } from '@/modules/campaigns/lib/creator-campaigns'
import { VERIFY_EVENT, openVerifyModal } from '@/shared/lib/verify-event'
import { pathTo, ROUTES } from '@/app/routes'

export default function MobileLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [verifyChoiceOpen, setVerifyChoiceOpen] = useState(false)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)
  const [activeCampaigns, setActiveCampaigns] = useState<CreatorCampaign[]>(
    () => getCreatorCampaigns().filter((c) => c.status === 'active' || c.status === 'paused')
  )

  useEffect(() => {
    return subscribeCreatorCampaigns(() => {
      setActiveCampaigns(getCreatorCampaigns().filter((c) => c.status === 'active' || c.status === 'paused'))
    })
  }, [])

  useEffect(() => {
    const handler = () => setVerifyModalOpen(true)
    window.addEventListener(VERIFY_EVENT, handler)
    return () => window.removeEventListener(VERIFY_EVENT, handler)
  }, [])

  const pendingVideosCount = getSubmittedVideos().filter((v) => v.status === 'in_review').length

  const handleMobileVerifyClick = () => {
    if (window.innerWidth < 1024) {
      setVerifyChoiceOpen(true)
    } else {
      openVerifyModal()
    }
  }

  return (
    <>
      <Outlet context={{ onVerifyClick: openVerifyModal }} />

      <MobileNav onVerifyClick={handleMobileVerifyClick} />

      {verifyChoiceOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center lg:hidden"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setVerifyChoiceOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl overflow-hidden animate-slide-up"
            style={{
              background: 'rgba(18,17,17,0.98)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 -8px 60px rgba(0,0,0,0.8)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <div className="px-4 pb-6 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setVerifyChoiceOpen(false)
                    openVerifyModal()
                  }}
                  className="flex-1 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <Video className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">Verifier ma video</p>
                    <p className="text-[10px] text-white/35 mt-1">Soumettre une video</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setVerifyChoiceOpen(false)
                    navigate(ROUTES.validationVideos)
                  }}
                  className="flex-1 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                  }}
                >
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      <Clock className="w-5 h-5 text-white/60" />
                    </div>
                    {pendingVideosCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1"
                        style={{ background: '#FFA672', boxShadow: '0 2px 8px rgba(255,166,114,0.4)' }}
                      >
                        {pendingVideosCount}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">En attente</p>
                    <p className="text-[10px] text-white/35 mt-1">Suivi des validations</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {verifyModalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setVerifyModalOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(18,17,17,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <h2 className="text-base font-bold text-white">Verifier ma video</h2>
                <p className="text-xs text-white/40 mt-0.5">Selectionne la campagne concernee</p>
              </div>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            <div className="px-4 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
              {activeCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-white/30">Aucune campagne active</p>
                  <p className="text-xs text-white/20 mt-1">Rejoins une campagne pour soumettre tes videos</p>
                </div>
              ) : (
                activeCampaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => {
                      setVerifyModalOpen(false)
                      navigate(pathTo.campagneVerification(campaign.id), { state: { from: location.pathname } })
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 hover:bg-white/[0.07] group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <img
                      src={campaign.photo}
                      alt={campaign.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-0.5">{campaign.brand}</p>
                      <p className="text-sm font-semibold text-white truncate">{campaign.name}</p>
                      <p className="text-[11px] text-white/35 mt-0.5">{campaign.ratePerK}/1K vues</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
            <div className="hidden sm:block h-5" />
            <div className="block sm:hidden" style={{ height: 'calc(5rem + env(safe-area-inset-bottom))' }} />
          </div>
        </div>
      )}
    </>
  )
}
