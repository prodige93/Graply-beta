import {
  MARQUEE_VIEWS_MONTHLY,
  MARQUEE_PAYOUTS_EUR_MONTHLY,
  MARQUEE_PLATFORM_AGGREGATES,
  formatCompactViews,
  formatCompactEur,
  formatCreatorsShort,
  percentGrowthFirstToLast,
  maxChartValue,
} from '@/shared/lib/marketing-marquee-charts';

describe('marketing-marquee-charts', () => {
  it('formatCompactViews formate millions et milliers', () => {
    expect(formatCompactViews(1_500_000)).toBe('1.5M');
    expect(formatCompactViews(12_400)).toBe('12K');
  });

  it('formatCompactEur gère M€ entiers et k€', () => {
    expect(formatCompactEur(2_000_000)).toBe('2M€');
    expect(formatCompactEur(310_000)).toBe('310k€');
  });

  it('formatCreatorsShort', () => {
    expect(formatCreatorsShort(13_000)).toBe('13K');
  });

  it('percentGrowthFirstToLast sur les séries marquee', () => {
    const v = percentGrowthFirstToLast(MARQUEE_VIEWS_MONTHLY.map((p) => p.value));
    expect(v).toBeGreaterThan(0);
    const p = percentGrowthFirstToLast(MARQUEE_PAYOUTS_EUR_MONTHLY.map((x) => x.value));
    expect(p).toBeGreaterThan(0);
  });

  it('maxChartValue ajoute une marge', () => {
    const m = maxChartValue(MARQUEE_VIEWS_MONTHLY, 1.08);
    expect(m).toBeGreaterThan(MARQUEE_VIEWS_MONTHLY[MARQUEE_VIEWS_MONTHLY.length - 1]!.value);
  });

  it('agrégats plateforme cohérents', () => {
    expect(MARQUEE_PLATFORM_AGGREGATES.activeCreators).toBe(13_000);
    expect(MARQUEE_PLATFORM_AGGREGATES.activeCampaigns).toBe(1000);
    expect(MARQUEE_PLATFORM_AGGREGATES.totalPayoutsToDateEur).toBe(2_000_000);
  });
});
