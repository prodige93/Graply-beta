/** Séries mensuelles partagées : bandeau auth (CampaignsMarquee) + graphiques vues / versements. */

export type MarqueeMonthPoint = { month: string; value: number };

export const MARQUEE_VIEWS_MONTHLY: MarqueeMonthPoint[] = [
  { month: 'Jan', value: 1_200_000 },
  { month: 'Fev', value: 2_100_000 },
  { month: 'Mar', value: 1_800_000 },
  { month: 'Avr', value: 3_400_000 },
  { month: 'Mai', value: 4_800_000 },
  { month: 'Jun', value: 4_200_000 },
  { month: 'Jul', value: 6_100_000 },
  { month: 'Aou', value: 7_300_000 },
  { month: 'Sep', value: 6_800_000 },
  { month: 'Oct', value: 9_200_000 },
  { month: 'Nov', value: 11_400_000 },
  { month: 'Dec', value: 14_700_000 },
];

export const MARQUEE_PAYOUTS_EUR_MONTHLY: MarqueeMonthPoint[] = [
  { month: 'Jan', value: 42_000 },
  { month: 'Fev', value: 68_000 },
  { month: 'Mar', value: 55_000 },
  { month: 'Avr', value: 91_000 },
  { month: 'Mai', value: 120_000 },
  { month: 'Jun', value: 108_000 },
  { month: 'Jul', value: 155_000 },
  { month: 'Aou', value: 178_000 },
  { month: 'Sep', value: 162_000 },
  { month: 'Oct', value: 210_000 },
  { month: 'Nov', value: 248_000 },
  { month: 'Dec', value: 310_000 },
];

/** Agrégats plateforme (cohérents avec les chiffres affichés sous les cartes du marquee). */
export const MARQUEE_PLATFORM_AGGREGATES = {
  activeCreators: 13_000,
  activeCampaigns: 1000,
  /** Total cumulé versé aux créateurs (hors détail mensuel du graphique). */
  totalPayoutsToDateEur: 2_000_000,
} as const;

export function formatCompactViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

/** Montant en euros entiers → libellé type « 310k€ » ou « 2M€ ». */
export function formatCompactEur(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const whole = Math.abs(m - Math.round(m)) < 1e-9;
    return whole ? `${Math.round(m)}M€` : `${m.toFixed(1)}M€`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}k€`;
  return `${n}€`;
}

export function formatCreatorsShort(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

/** Croissance en % entre première et dernière valeur de la série (arrondi). */
export function percentGrowthFirstToLast(values: number[]): number {
  if (values.length < 2) return 0;
  const first = values[0]!;
  const last = values[values.length - 1]!;
  if (first === 0) return last > 0 ? 100 : 0;
  return Math.round(((last - first) / first) * 100);
}

export function maxChartValue(series: MarqueeMonthPoint[], headroom = 1.08): number {
  const m = Math.max(...series.map((p) => p.value), 1);
  return Math.ceil(m * headroom);
}
