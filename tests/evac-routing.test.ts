import { describe, expect, it } from 'vitest';
import { routeZones } from '../src/lib/evac-routing';

describe('routeZones', () => {
  it('returns all-off when no fire', () => {
    const plan = routeZones(new Set(), new Set());
    expect(plan.A).toEqual({ color: 'off', direction: 'none' });
    expect(plan.B).toEqual({ color: 'off', direction: 'none' });
    expect(plan.C).toEqual({ color: 'off', direction: 'none' });
  });

  it('routes fire in zone B: A green left, B red left, C green right', () => {
    const plan = routeZones(new Set(['B']), new Set());
    expect(plan.A).toEqual({ color: 'green', direction: 'left' });
    expect(plan.B).toEqual({ color: 'red', direction: 'left' });
    expect(plan.C).toEqual({ color: 'green', direction: 'right' });
  });

  it('routes fire in zones A+C: B stays green toward exit B', () => {
    const plan = routeZones(new Set(['A', 'C']), new Set());
    expect(plan.A).toEqual({ color: 'red', direction: 'right' });
    expect(plan.B).toEqual({ color: 'green', direction: 'right' });
    expect(plan.C).toEqual({ color: 'red', direction: 'left' });
  });

  it('routes all zones on fire', () => {
    const plan = routeZones(new Set(['A', 'B', 'C']), new Set());
    expect(plan.A).toEqual({ color: 'red', direction: 'left' });
    expect(plan.B).toEqual({ color: 'red', direction: 'right' });
    expect(plan.C).toEqual({ color: 'red', direction: 'right' });
  });

  it('turns a green zone orange when its exit is congested', () => {
    const plan = routeZones(new Set(['B']), new Set(['A']));
    expect(plan.A).toEqual({ color: 'orange', direction: 'left' });
    expect(plan.C).toEqual({ color: 'green', direction: 'right' });
  });

  it('never turns red zones orange', () => {
    const plan = routeZones(new Set(['B']), new Set(['B']));
    expect(plan.B.color).toBe('red');
  });
});
