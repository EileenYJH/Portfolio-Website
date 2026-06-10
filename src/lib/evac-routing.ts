export type ZoneId = 'A' | 'B' | 'C';
export type Direction = 'left' | 'right' | 'none';
export type ZoneColor = 'off' | 'green' | 'red' | 'orange';

export interface ZoneRoute {
  color: ZoneColor;
  direction: Direction;
}

export type RoutePlan = Record<ZoneId, ZoneRoute>;

const r = (color: ZoneColor, direction: Direction): ZoneRoute => ({ color, direction });

const TABLE: Record<string, RoutePlan> = {
  '': { A: r('off', 'none'), B: r('off', 'none'), C: r('off', 'none') },
  A: { A: r('red', 'right'), B: r('green', 'right'), C: r('green', 'right') },
  B: { A: r('green', 'left'), B: r('red', 'left'), C: r('green', 'right') },
  C: { A: r('green', 'left'), B: r('green', 'right'), C: r('red', 'left') },
  'A,B': { A: r('red', 'right'), B: r('red', 'left'), C: r('green', 'right') },
  'A,C': { A: r('red', 'right'), B: r('green', 'right'), C: r('red', 'left') },
  'B,C': { A: r('green', 'left'), B: r('red', 'left'), C: r('red', 'left') },
  'A,B,C': { A: r('red', 'left'), B: r('red', 'right'), C: r('red', 'right') },
};

export function routeZones(fire: Set<ZoneId>, congestedExits: Set<ZoneId>): RoutePlan {
  const key = (['A', 'B', 'C'] as ZoneId[]).filter((z) => fire.has(z)).join(',');
  const base = TABLE[key];
  const plan: RoutePlan = {
    A: { ...base.A },
    B: { ...base.B },
    C: { ...base.C },
  };
  for (const zone of ['A', 'B', 'C'] as ZoneId[]) {
    if (plan[zone].color === 'green' && congestedExits.has(zone)) {
      plan[zone].color = 'orange';
    }
  }
  return plan;
}
