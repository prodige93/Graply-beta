import { resolveCampaignDetail } from '@/modules/campaigns/lib/campaign-detail-resolver';

describe('resolveCampaignDetail', () => {
  it('résout une campagne du catalogue mock', () => {
    const c = resolveCampaignDetail('pumpfun-launch');
    expect(c).not.toBeNull();
    expect(c?.id).toBe('pumpfun-launch');
    expect(c?.title).toContain('Pump');
    expect(c?.chartData?.length).toBeGreaterThanOrEqual(2);
  });

  it('résout une campagne créateur (mock in-memory)', () => {
    const c = resolveCampaignDetail('apple-iphone17-ugc');
    expect(c).not.toBeNull();
    expect(c?.brand).toBe('Apple');
  });

  it('retourne null pour un id inconnu', () => {
    expect(resolveCampaignDetail('__unknown__')).toBeNull();
    expect(resolveCampaignDetail(undefined)).toBeNull();
  });
});
