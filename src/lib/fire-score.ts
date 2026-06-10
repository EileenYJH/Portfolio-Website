export type SmokeLevel = 'clean' | 'slight' | 'spike';
export type AirQuality = 'clean' | 'poor' | 'hazard';
export type HumidityTrend = 'stable' | 'rising' | 'dropping-fast';

export interface SensorInputs {
  smoke: SmokeLevel;
  coPpm: number;
  coRisingFast: boolean;
  flame: boolean;
  humidity: HumidityTrend;
  airQuality: AirQuality;
}

export type AlertMode = 'fire-scoring' | 'gas-leak';
export type TierLabel = 'Normal' | 'Pre-warning' | 'Emergency' | 'Critical';

export interface FireAssessment {
  score: number;
  tier: 0 | 1 | 2 | 3;
  tierLabel: TierLabel;
  mode: AlertMode;
}

const CO_CONCERN = 35;
const CO_DANGEROUS = 50;
const CO_FIRE = 70;
const CO_CRITICAL = 150;

function tierOf(score: number): { tier: 0 | 1 | 2 | 3; tierLabel: TierLabel } {
  if (score >= 8) return { tier: 3, tierLabel: 'Critical' };
  if (score >= 6) return { tier: 2, tierLabel: 'Emergency' };
  if (score >= 3) return { tier: 1, tierLabel: 'Pre-warning' };
  return { tier: 0, tierLabel: 'Normal' };
}

export function computeFireScore(s: SensorInputs): FireAssessment {
  const coSafe = s.coPpm < CO_CONCERN;

  const gasLeakPattern =
    !s.flame && coSafe && s.humidity === 'stable' && s.smoke === 'spike' && s.airQuality !== 'clean';
  if (gasLeakPattern) {
    return { score: 0, tier: 0, tierLabel: 'Normal', mode: 'gas-leak' };
  }

  let score = 0;

  if (s.flame) score += 5;

  if (s.smoke === 'spike') score += 2;
  else if (s.smoke === 'slight') score += 1;

  if (s.coPpm >= CO_CRITICAL) score += 4;
  else if (s.coPpm >= CO_FIRE) score += 3;
  else if (s.coPpm >= CO_DANGEROUS) score += 2;
  else if (s.coPpm >= CO_CONCERN) score += 1;

  if (s.coPpm >= CO_CONCERN && s.coRisingFast) score += 1;

  if (s.humidity === 'dropping-fast') score += 1;

  if (s.airQuality === 'hazard') score += 2;
  else if (s.airQuality === 'poor') score += 1;

  if (!s.flame) {
    if (s.smoke === 'spike' && coSafe && s.airQuality === 'clean') score -= 2;
    if (s.smoke !== 'clean' && s.humidity === 'rising') score -= 2;
    if (s.coPpm >= CO_CONCERN && s.coPpm < CO_DANGEROUS && !s.coRisingFast && s.smoke === 'clean') score -= 1;
    if (s.airQuality !== 'clean' && s.smoke === 'clean') score -= 1;
  }

  score = Math.max(0, Math.min(10, score));
  return { score, ...tierOf(score), mode: 'fire-scoring' };
}
