import { generateChartData, buildDashboardChartSeries } from '@/shared/lib/chart-utils';

describe('generateChartData', () => {
  const raw = [
    { label: 'a', views: 100, earned: 10 },
    { label: 'b', views: 400, earned: 40 },
  ];

  it('retourne 7 points pour la période 7j', () => {
    const pts = generateChartData(raw, '7j');
    expect(pts).toHaveLength(7);
    expect(pts[6]?.label).toBe('Auj.');
    pts.forEach((p) => {
      expect(p).toHaveProperty('views');
      expect(p).toHaveProperty('earned');
    });
  });

  it('retourne 6 points pour 6m (défaut hors 7j/1m/3m)', () => {
    const pts = generateChartData(raw, '6m');
    expect(pts).toHaveLength(6);
  });

  it('gère une série vide', () => {
    const pts = generateChartData([], '7j');
    expect(pts).toHaveLength(7);
    expect(pts.every((p) => p.views === 0 && p.earned === 0)).toBe(true);
  });
});

describe('buildDashboardChartSeries', () => {
  const seed = [
    { views: 10_000, earned: 2 },
    { views: 50_000, earned: 9 },
    { views: 120_000, earned: 22 },
    { views: 200_000, earned: 38 },
    { views: 310_000, earned: 58 },
    { views: 400_000, earned: 72 },
  ];

  it('produit 6 points pour 6m', () => {
    const pts = buildDashboardChartSeries(seed, '6m');
    expect(pts).toHaveLength(6);
    expect(pts[0]).toMatchObject({ views: expect.any(Number), earned: expect.any(Number) });
  });

  it('produit 7 points pour 7j', () => {
    const pts = buildDashboardChartSeries(seed, '7j');
    expect(pts).toHaveLength(7);
  });

  it('all et 6m sont alignés sur 6 points', () => {
    const a = buildDashboardChartSeries(seed, 'all');
    const b = buildDashboardChartSeries(seed, '6m');
    expect(a).toHaveLength(6);
    expect(b).toHaveLength(6);
    expect(a.map((p) => p.views)).toEqual(b.map((p) => p.views));
  });
});
