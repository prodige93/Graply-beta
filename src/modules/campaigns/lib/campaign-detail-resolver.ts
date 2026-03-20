import type { CampaignData } from '@/modules/campaigns/ui/CampaignCard';
import { campaigns } from '@/modules/campaigns/data/mock-campaign-catalog';
import { getCreatorCampaigns, type CreatorCampaign } from './creator-campaigns';

export type CampaignDetailModel = {
  id: string;
  image: string;
  title: string;
  brand: string;
  brandLogo: string;
  verified: boolean;
  timeAgo: string;
  applicants: number;
  tags: string[];
  ratePerView: string;
  socials: ('youtube' | 'tiktok' | 'instagram')[];
  description: string;
  isPublic: boolean;
  rules: string[];
  documents: { name: string; type: string; size: string }[];
  ratesPerPlatform: { platform: 'youtube' | 'tiktok' | 'instagram'; rate: string }[];
  topCreators: { name: string; avatar: string; platform: 'youtube' | 'tiktok' | 'instagram'; views: string; earned: string }[];
  platformStats: { platform: 'youtube' | 'tiktok' | 'instagram'; views: string; earned: string }[];
  views: string;
  earned: string;
  budget: string;
  chartData: { label: string; views: number; earned: number }[];
};

function parseApplicants(creatorsStr: string): number {
  const n = parseInt(creatorsStr.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function normalizeSocials(platforms: string[]): ('youtube' | 'tiktok' | 'instagram')[] {
  const allowed = new Set(['youtube', 'tiktok', 'instagram']);
  return platforms.filter((p): p is 'youtube' | 'tiktok' | 'instagram' => allowed.has(p));
}

function campaignDataToDetail(c: CampaignData): CampaignDetailModel {
  const socials = c.socials;
  const progress = c.progress;
  const baseViews = Math.max(1000, progress * 10000);
  const baseEarned = Math.max(100, progress * 200);
  return {
    id: c.id,
    image: c.image,
    title: c.title,
    brand: c.brand,
    brandLogo: c.logo ?? c.image,
    verified: c.verified,
    timeAgo: c.timeAgo,
    applicants: parseApplicants(c.creators),
    tags: c.tags,
    ratePerView: c.ratePerView,
    socials,
    description: `Campagne « ${c.title} » proposée par ${c.brand}. Crée du contenu authentique qui correspond aux objectifs de la marque et maximise tes gains pour chaque tranche de 1 000 vues.`,
    isPublic: true,
    rules: [],
    documents: [],
    ratesPerPlatform: socials.map((platform) => ({ platform, rate: c.ratePerView })),
    topCreators: [],
    platformStats: socials.map((platform) => ({
      platform,
      views: c.views,
      earned: c.earned,
    })),
    views: c.views,
    earned: c.earned,
    budget: c.budget,
    chartData: [
      { label: 'debut', views: Math.round(baseViews * 0.35), earned: Math.round(baseEarned * 0.35) },
      { label: 'milieu', views: Math.round(baseViews * 0.72), earned: Math.round(baseEarned * 0.72) },
      { label: 'actuel', views: Math.round(baseViews), earned: Math.round(baseEarned) },
    ],
  };
}

function formatViewsShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function creatorCampaignToDetail(c: CreatorCampaign): CampaignDetailModel {
  const socials = normalizeSocials(c.platforms);
  const effectiveSocials: ('youtube' | 'tiktok' | 'instagram')[] =
    socials.length > 0 ? socials : ['tiktok'];
  const perPlatViews = Math.max(0, Math.floor(c.totalViews / effectiveSocials.length));
  const earnedNum = c.totalEarned;
  const sliceEarned = Math.max(0, Math.floor(earnedNum / effectiveSocials.length));
  return {
    id: c.id,
    image: c.photo,
    title: c.name,
    brand: c.brand,
    brandLogo: c.brandLogo,
    verified: false,
    timeAgo: `Depuis ${c.joinedAt}`,
    applicants: parseApplicants(c.creators),
    tags: [c.contentType, c.category].filter(Boolean),
    ratePerView: c.ratePerView,
    socials: effectiveSocials,
    description: `Tu participes à cette campagne en tant que créateur. Respecte le brief et les exigences de ${c.brand} pour valider tes vidéos.`,
    isPublic: true,
    rules: [],
    documents: [],
    ratesPerPlatform: effectiveSocials.map((platform) => ({ platform, rate: c.ratePerK })),
    topCreators: [],
    platformStats: effectiveSocials.map((platform) => ({
      platform,
      views: formatViewsShort(perPlatViews),
      earned: `$${sliceEarned.toLocaleString()}`,
    })),
    views: formatViewsShort(c.totalViews),
    earned: c.earned,
    budget: c.budget,
    chartData: [
      { label: 'a', views: Math.round(c.totalViews * 0.4), earned: Math.round(earnedNum * 0.4) },
      { label: 'b', views: c.totalViews, earned: Math.round(earnedNum) },
    ],
  };
}

export function resolveCampaignDetail(id: string | undefined): CampaignDetailModel | null {
  if (!id) return null;
  const staticHit = campaigns.find((c) => c.id === id);
  if (staticHit) return campaignDataToDetail(staticHit);
  const creatorHit = getCreatorCampaigns().find((c) => c.id === id);
  if (creatorHit) return creatorCampaignToDetail(creatorHit);
  return null;
}
