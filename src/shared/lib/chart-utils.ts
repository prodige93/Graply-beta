export interface ChartPoint {
  label: string;
  views: number;
  earned: number;
}

export interface RawChartData {
  label: string;
  views: number;
  earned: number;
}

export type DashboardSeedPoint = { views: number; earned: number };

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

const DASH_MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec'];
const DASH_DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function interpolateSeed(seed: DashboardSeedPoint[], count: number): { views: number; earned: number }[] {
  if (count < 2) {
    const z = seed[0] ?? { views: 0, earned: 0 };
    return Array.from({ length: Math.max(1, count) }, () => ({ ...z }));
  }
  if (seed.length === 0) return Array.from({ length: count }, () => ({ views: 0, earned: 0 }));
  if (seed.length === 1) return Array.from({ length: count }, () => ({ ...seed[0]! }));

  const result: { views: number; earned: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * (seed.length - 1);
    const low = Math.floor(t);
    const high = Math.min(low + 1, seed.length - 1);
    const f = t - low;
    result.push({
      views: Math.round(seed[low]!.views + (seed[high]!.views - seed[low]!.views) * f),
      earned: Math.round(seed[low]!.earned + (seed[high]!.earned - seed[low]!.earned) * f),
    });
  }
  return result;
}

/** Courbes dashboard créateur (même logique que l’ancien `buildChartPoints` local). */
export function buildDashboardChartSeries(
  seed: DashboardSeedPoint[],
  period: 'all' | '7j' | '1m' | '3m' | '6m',
): ChartPoint[] {
  const now = new Date();

  if (period === 'all' || period === '6m') {
    const pts = interpolateSeed(seed, 6);
    return pts.map((p, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      const label = i === 5 ? DASH_MONTH_NAMES[now.getMonth()]! : DASH_MONTH_NAMES[d.getMonth()]!;
      return { label, views: p.views, earned: p.earned };
    });
  }

  if (period === '7j') {
    const pts = interpolateSeed(seed, 7);
    return pts.map((p, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const label = i === 6 ? 'Auj.' : `${DASH_DAY_NAMES[d.getDay()]} ${d.getDate()}`;
      return { label, views: p.views, earned: p.earned };
    });
  }

  if (period === '1m') {
    const pts = interpolateSeed(seed, 4);
    return pts.map((p, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (3 - i) * 7);
      const label = i === 3 ? 'Auj.' : `${d.getDate()} ${DASH_MONTH_NAMES[d.getMonth()]!}`;
      return { label, views: p.views, earned: p.earned };
    });
  }

  const pts = interpolateSeed(seed, 3);
  return pts.map((p, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (2 - i));
    const label = i === 2 ? DASH_MONTH_NAMES[now.getMonth()]! : DASH_MONTH_NAMES[d.getMonth()]!;
    return { label, views: p.views, earned: p.earned };
  });
}

function interpolate(data: RawChartData[], count: number): { views: number; earned: number }[] {
  if (data.length === 0) return Array(count).fill({ views: 0, earned: 0 });
  if (data.length === 1) return Array(count).fill({ views: data[0].views, earned: data[0].earned });

  const result: { views: number; earned: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * (data.length - 1);
    const low = Math.floor(t);
    const high = Math.min(low + 1, data.length - 1);
    const frac = t - low;
    result.push({
      views: Math.round(data[low].views + (data[high].views - data[low].views) * frac),
      earned: Math.round(data[low].earned + (data[high].earned - data[low].earned) * frac),
    });
  }
  return result;
}

export function generateChartData(rawData: RawChartData[], period: string): ChartPoint[] {
  const now = new Date();

  if (period === '7j') {
    const points = interpolate(rawData, 7);
    return points.map((p, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const label = i === 6 ? "Auj." : DAY_NAMES[d.getDay()] + ' ' + d.getDate();
      return { label, views: p.views, earned: p.earned };
    });
  }

  if (period === '1m') {
    const points = interpolate(rawData, 4);
    return points.map((p, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (3 - i) * 7);
      const label = i === 3 ? "Auj." : d.getDate() + ' ' + MONTH_NAMES[d.getMonth()];
      return { label, views: p.views, earned: p.earned };
    });
  }

  if (period === '3m') {
    const points = interpolate(rawData, 3);
    return points.map((p, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (2 - i));
      const label = i === 2 ? MONTH_NAMES[now.getMonth()] : MONTH_NAMES[d.getMonth()];
      return { label, views: p.views, earned: p.earned };
    });
  }

  const points = interpolate(rawData, 6);
  return points.map((p, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - (5 - i));
    const label = i === 5 ? MONTH_NAMES[now.getMonth()] : MONTH_NAMES[d.getMonth()];
    return { label, views: p.views, earned: p.earned };
  });
}
