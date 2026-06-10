import { describe, expect, it } from 'vitest';
import { computeFireScore, type SensorInputs } from '../src/lib/fire-score';

const clean: SensorInputs = {
  smoke: 'clean',
  coPpm: 5,
  coRisingFast: false,
  flame: false,
  humidity: 'stable',
  airQuality: 'clean',
};

describe('computeFireScore', () => {
  it('scores clean air as 0 / Normal', () => {
    const r = computeFireScore(clean);
    expect(r.score).toBe(0);
    expect(r.tier).toBe(0);
    expect(r.tierLabel).toBe('Normal');
    expect(r.mode).toBe('fire-scoring');
  });

  it('scores confirmed flame + critical CO as Critical', () => {
    const r = computeFireScore({ ...clean, flame: true, coPpm: 160 });
    expect(r.score).toBe(9);
    expect(r.tier).toBe(3);
    expect(r.tierLabel).toBe('Critical');
  });

  it('scores flame alone as 5 / Pre-warning', () => {
    const r = computeFireScore({ ...clean, flame: true });
    expect(r.score).toBe(5);
    expect(r.tier).toBe(1);
  });

  it('damps a cooking smoke spike to 0 (spike, CO clean, MQ-135 clean, no flame)', () => {
    const r = computeFireScore({ ...clean, smoke: 'spike' });
    expect(r.score).toBe(0);
    expect(r.mode).toBe('fire-scoring');
  });

  it('damps steam (smoke + rising humidity, no flame) to 0', () => {
    const r = computeFireScore({ ...clean, smoke: 'slight', humidity: 'rising' });
    expect(r.score).toBe(0);
  });

  it('damps CO-concern-only slow rise to 0', () => {
    const r = computeFireScore({ ...clean, coPpm: 40 });
    expect(r.score).toBe(0);
  });

  it('builds a real fire picture: smoke spike + CO 80 + humidity dropping fast', () => {
    const r = computeFireScore({
      ...clean,
      smoke: 'spike',
      coPpm: 80,
      coRisingFast: true,
      humidity: 'dropping-fast',
    });
    expect(r.score).toBe(7);
    expect(r.tier).toBe(2);
    expect(r.tierLabel).toBe('Emergency');
  });

  it('enters gas-leak mode for combustible gas without combustion markers', () => {
    const r = computeFireScore({ ...clean, smoke: 'spike', airQuality: 'poor' });
    expect(r.mode).toBe('gas-leak');
    expect(r.score).toBe(0);
  });

  it('clamps the score to 10', () => {
    const r = computeFireScore({
      smoke: 'spike',
      coPpm: 200,
      coRisingFast: true,
      flame: true,
      humidity: 'dropping-fast',
      airQuality: 'hazard',
    });
    expect(r.score).toBe(10);
    expect(r.tier).toBe(3);
  });
});
