import CampaignCard from './CampaignCard';
import { campaigns } from '@/modules/campaigns/data/mock-campaign-catalog';

function CampaignMarquee({
  items,
  direction = 'left'
}: {
  items: typeof campaigns;
  direction?: 'left' | 'right';
}) {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex gap-4 sm:gap-6 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((campaign, i) => (
          <div key={i} className="w-[260px] sm:w-[340px] flex-shrink-0 h-[360px] sm:h-[420px]">
            <CampaignCard data={campaign} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PopularCampaigns({ isMars = false }: { isMars?: boolean }) {
  const firstRow = campaigns.slice(0, 4);
  const secondRow = campaigns.slice(4, 8);

  return (
    <section id="marques" className="bg-black">
      <div className="bg-gray-50 pt-10 pb-24 rounded-b-[48px] sm:rounded-b-[72px]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 bg-gray-900 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                Campagnes en cours
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {isMars ? (
                <>
                  <span className="sm:hidden">Ils font déjà des<br />millions de vues</span>
                  <span className="hidden sm:inline">Des marques comme la vôtre<br />font déjà des millions de vues</span>
                </>
              ) : (
                'Decouvrez les campagnes du moment'
              )}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
              {isMars ? (
                <>
                  <span className="sm:hidden">Rejoignez-les et lancez<br />votre première campagne.</span>
                  <span className="hidden sm:inline">Rejoignez-les et lancez votre première campagne.</span>
                </>
              ) : (
                'Rejoignez les meilleures marques et commencez a creer.'
              )}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-14">
          <CampaignMarquee items={firstRow} direction="left" />
          <CampaignMarquee items={secondRow} direction="right" />
        </div>

        <div className="flex justify-center px-6">
          {isMars ? (
            <a
              href="#campaigns"
              className="relative group cursor-pointer select-none"
            >
              <div
                className="absolute -inset-[7px] rounded-full pointer-events-none"
                style={{ border: '1.5px solid rgba(0,0,0,0.12)' }}
              />
              <div
                className="absolute -inset-[1.5px] rounded-full pointer-events-none"
                style={{ border: '1.5px solid rgba(0,0,0,0.2)' }}
              />
              <div
                className="relative rounded-full px-6 sm:px-8 py-2 sm:py-2.5 transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(180deg, rgba(35,35,35,0.95) 0%, rgba(15,15,15,0.98) 50%, rgba(8,8,8,1) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)',
                }}
              >
                <span className="relative z-10 text-white font-semibold text-base sm:text-lg tracking-wide inline-flex items-center gap-1.5">
                  Voir les campagnes
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="relative -top-px shrink-0"><path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </a>
          ) : (
            <a
              href="#campaigns"
              className="relative group cursor-pointer select-none"
            >
              <div
                className="absolute -inset-[7px] rounded-full pointer-events-none"
                style={{ border: '1.5px solid rgba(0,0,0,0.12)' }}
              />
              <div
                className="absolute -inset-[1.5px] rounded-full pointer-events-none"
                style={{ border: '1.5px solid rgba(0,0,0,0.2)' }}
              />
              <div
                className="relative rounded-full px-6 sm:px-8 py-2 sm:py-2.5 transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(180deg, rgba(35,35,35,0.95) 0%, rgba(15,15,15,0.98) 50%, rgba(8,8,8,1) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.4)',
                }}
              >
                <span className="relative z-10 text-white font-semibold text-base sm:text-lg tracking-wide inline-flex items-center gap-1.5">
                  Voir les campagnes
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="relative -top-px shrink-0"><path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
