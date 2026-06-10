# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Eileen Yeoh's portfolio website — clean editorial design, mouse-tracking robotic arm hero, markdown blog, and an interactive ARIA project deep-dive — deployed free to GitHub Pages.

**Architecture:** Astro static site (zero-JS by default) with three vanilla-TypeScript interactive islands (`RoboticArm`, `FireScoreSimulator`, `EvacuationDemo`). Pure logic (fire scoring, evacuation routing) lives in `src/lib/` as framework-free modules with vitest unit tests. GSAP (ScrollTrigger + SplitText) drives all scroll and typography motion via a single `motion.ts` utility that respects `prefers-reduced-motion`.

**Tech Stack:** Astro 5, TypeScript, GSAP 3.13+ (free incl. SplitText), vitest, @fontsource-variable fonts (Fraunces display serif + Inter body), GitHub Actions → GitHub Pages.

**Working directory for ALL tasks:** `C:\Users\eilee\Documents\Projects\portfolio`

**Design language (applies to every page):** warm paper background `#FAF7F2`, ink text `#1C1B18`, muted `#6E6A60`, accent coral `#C8501F`, accent-soft `#F4E3DA`. Fraunces for display headings, Inter for everything else. Generous whitespace, max content width 1100px. Headings animate with SplitText character staggers; sections fade-rise on scroll. All motion skipped under `prefers-reduced-motion`.

---

## Phase 1 — Foundation

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `public/favicon.svg`

- [ ] **Step 1: Rename branch to main**

```powershell
git branch -M main
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "eileen-portfolio",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource-variable/fraunces": "^5.0.0",
    "@fontsource-variable/inter": "^5.0.0",
    "astro": "^5.0.0",
    "gsap": "^3.13.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 3: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eileenyjh.github.io',
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
.astro/
```

- [ ] **Step 7: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#1C1B18"/>
  <text x="16" y="22" font-family="Georgia, serif" font-size="17" fill="#FAF7F2" text-anchor="middle">ey</text>
</svg>
```

- [ ] **Step 8: Install dependencies and verify**

Run: `npm install`
Expected: completes without errors; `node_modules/` created.

Run: `npx astro --version`
Expected: prints an Astro 5.x version.

- [ ] **Step 9: Commit**

```powershell
git add -A
git commit -m "chore: scaffold Astro project with GSAP, fonts, vitest"
```

### Task 2: Design tokens and global styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create src/styles/global.css**

```css
:root {
  --paper: #FAF7F2;
  --paper-raised: #FFFFFF;
  --ink: #1C1B18;
  --muted: #6E6A60;
  --line: #E5DFD4;
  --accent: #C8501F;
  --accent-soft: #F4E3DA;
  --safe: #2E7D4F;
  --danger: #C03028;
  --warn: #D98E1B;
  --font-display: 'Fraunces Variable', Georgia, serif;
  --font-body: 'Inter Variable', system-ui, sans-serif;
  --content-w: 1100px;
  --space-section: clamp(5rem, 12vh, 9rem);
  --radius: 14px;
}

* { box-sizing: border-box; margin: 0; }

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 1.0625rem;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 560;
  line-height: 1.12;
  letter-spacing: -0.015em;
}

h1 { font-size: clamp(2.6rem, 7vw, 5rem); }
h2 { font-size: clamp(1.9rem, 4vw, 3rem); }
h3 { font-size: clamp(1.25rem, 2.2vw, 1.6rem); }

p { max-width: 65ch; }

a { color: inherit; }

img, video { max-width: 100%; height: auto; display: block; }

.wrap {
  width: min(var(--content-w), 100% - 3rem);
  margin-inline: auto;
}

.section {
  padding-block: var(--space-section);
}

.eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.muted { color: var(--muted); }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  border: 1.5px solid var(--ink);
  background: var(--ink);
  color: var(--paper);
  font-weight: 550;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn--ghost { background: transparent; color: var(--ink); }
.btn--ghost:hover { background: var(--ink); color: var(--paper); }

.card {
  background: var(--paper-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 1.5rem;
}

[data-split] .split-line { overflow: hidden; }

::selection { background: var(--accent-soft); }
```

- [ ] **Step 2: Verify the file parses (no build yet — just lint by building later). Commit**

```powershell
git add src/styles/global.css
git commit -m "feat: design tokens and global styles"
```

### Task 3: Motion utility (GSAP + ScrollTrigger + SplitText)

**Files:**
- Create: `src/lib/motion.ts`

- [ ] **Step 1: Create src/lib/motion.ts**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function motionOK(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initMotion(): void {
  if (!motionOK()) return;

  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    try {
      const split = SplitText.create(el, { type: 'lines,words', linesClass: 'split-line' });
      gsap.from(split.words, {
        yPercent: 115,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    } catch {
      el.style.visibility = 'visible';
    }
  });

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power2.out',
      delay: Number(el.dataset.revealDelay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

export { gsap, ScrollTrigger };
```

Design notes baked in: animations use `gsap.from`, so if JS never runs the content is already visible (graceful degradation). `once: true` keeps scrolling light. Reduced-motion users get everything static.

- [ ] **Step 2: Commit**

```powershell
git add src/lib/motion.ts
git commit -m "feat: motion utility with split-text and scroll reveals"
```

### Task 4: Base layout, nav, footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Create src/components/Nav.astro**

```astro
---
const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];
const path = Astro.url.pathname;
---
<header class="nav-bar">
  <div class="wrap nav-inner">
    <a href="/" class="nav-brand">Eileen Yeoh</a>
    <nav aria-label="Main">
      {links.map((l) => (
        <a href={l.href} class:list={['nav-link', { active: path.startsWith(l.href) }]}>{l.label}</a>
      ))}
    </nav>
  </div>
</header>
<style>
  .nav-bar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--paper) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 0.9rem;
  }
  .nav-brand {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 600;
    text-decoration: none;
  }
  .nav-link {
    margin-left: 1.6rem;
    text-decoration: none;
    font-size: 0.95rem;
    color: var(--muted);
    transition: color 0.2s ease;
  }
  .nav-link:hover, .nav-link.active { color: var(--ink); }
</style>
```

- [ ] **Step 2: Create src/components/Footer.astro**

```astro
---
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="wrap footer-inner">
    <div>
      <p class="footer-name">Eileen Yeoh</p>
      <p class="muted footer-tag">Electrical &amp; electronics engineering — systems, circuits, firmware.</p>
    </div>
    <nav class="footer-links" aria-label="Social">
      <a href="https://github.com/EileenYJH" rel="me noopener" target="_blank">GitHub</a>
      <a href="/cv.pdf" download>Download CV</a>
      <a href="mailto:eileenyeoh06@gmail.com">Email</a>
    </nav>
  </div>
  <div class="wrap muted footer-meta">© {year} Eileen Yeoh · Built with Astro</div>
</footer>
<style>
  .footer { border-top: 1px solid var(--line); padding-block: 3rem 2rem; margin-top: var(--space-section); }
  .footer-inner { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; align-items: start; }
  .footer-name { font-family: var(--font-display); font-size: 1.3rem; }
  .footer-tag { font-size: 0.9rem; }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-links a { font-size: 0.95rem; }
  .footer-meta { margin-top: 2.5rem; font-size: 0.8rem; }
</style>
```

Note: LinkedIn link is added later when Eileen provides the URL (content checklist in README, Task 16).

- [ ] **Step 3: Create src/layouts/BaseLayout.astro**

```astro
---
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}
const {
  title,
  description = 'Portfolio of Eileen Yeoh — electrical & electronics engineering projects, explained visually and interactively.',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
    <script>
      import { initMotion } from '../lib/motion';
      initMotion();
    </script>
  </body>
</html>
```

- [ ] **Step 4: Smoke-test with a temporary index page**

Create `src/pages/index.astro` (this is replaced fully in Task 9 — minimal placeholder content here is fine because the page is rebuilt by a later task, not left in the product):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Eileen Yeoh — Portfolio">
  <section class="section wrap">
    <h1 data-split>Eileen Yeoh</h1>
    <p class="muted" data-reveal>Site under construction.</p>
  </section>
</BaseLayout>
```

Run: `npm run build`
Expected: build succeeds, `dist/index.html` exists.

Run: `npm run dev` then open `http://localhost:4321`
Expected: page renders with warm paper background, Fraunces headline animates in, nav and footer visible.

- [ ] **Step 5: Commit**

```powershell
git add -A
git commit -m "feat: base layout, nav, footer with smoke-test homepage"
```

---

## Phase 2 — Interactive logic (TDD)

### Task 5: Fire-score engine

**Files:**
- Create: `src/lib/fire-score.ts`
- Test: `tests/fire-score.test.ts`

Model (simplified faithfully from the ARIA README scoring table): inputs are categorical/numeric sensor states; output is a 0–10 score, a tier, and a mode (`fire-scoring` or `gas-leak`). Disambiguation decision: gas-leak mode requires combustible reading without combustion markers — `smoke === 'spike' && airQuality !== 'clean' && coPpm < 35 && !flame && humidity === 'stable'`. The cooking-false-alarm damper case has `airQuality === 'clean'`, so the two never collide.

- [ ] **Step 1: Write the failing tests — tests/fire-score.test.ts**

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/lib/fire-score`.

- [ ] **Step 3: Implement src/lib/fire-score.ts**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all fire-score tests PASS. If the "real fire picture" case is off by one, re-check the arithmetic against the implementation (2 smoke + 3 CO fire-level + 1 rising + 1 humidity = 7) — fix the implementation, not the test.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/fire-score.ts tests/fire-score.test.ts
git commit -m "feat: fire-score engine ported from ARIA firmware logic, with tests"
```

### Task 6: Evacuation routing engine

**Files:**
- Create: `src/lib/evac-routing.ts`
- Test: `tests/evac-routing.test.ts`

- [ ] **Step 1: Write the failing tests — tests/evac-routing.test.ts**

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `../src/lib/evac-routing`.

- [ ] **Step 3: Implement src/lib/evac-routing.ts**

```ts
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
```

(Zone-to-exit mapping is identity — zone A evacuates via exit A, etc., matching the README's node/zone/exit table.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all tests PASS (fire-score + evac-routing).

- [ ] **Step 5: Commit**

```powershell
git add src/lib/evac-routing.ts tests/evac-routing.test.ts
git commit -m "feat: evacuation routing engine ported from ARIA exit-routing table, with tests"
```

---

## Phase 3 — Robotic arm hero component

### Task 7: RoboticArm component (2-joint IK, cursor tracking)

**Files:**
- Create: `src/components/RoboticArm.astro`

The arm: base + upper arm + forearm + simple two-finger gripper, drawn as flat vector shapes in the site palette. Two-link inverse kinematics aims the gripper at the cursor (clamped to reach). Idle: gentle sine-wave "breathing" sway. Touch / reduced-motion: holds an elegant static pose with the idle sway only (no cursor dependency).

- [ ] **Step 1: Create src/components/RoboticArm.astro**

```astro
<div class="arm-stage" id="arm-stage" aria-hidden="true">
  <svg id="arm-svg" viewBox="0 0 600 600" fill="none">
    <ellipse cx="300" cy="565" rx="120" ry="16" fill="#EFE9DF" />
    <g id="arm-base">
      <rect x="255" y="490" width="90" height="75" rx="12" fill="#1C1B18" />
      <circle cx="300" cy="490" r="34" fill="#1C1B18" />
      <circle cx="300" cy="490" r="10" fill="#C8501F" />
    </g>
    <g id="arm-upper" transform-origin="300 490">
      <rect x="284" y="290" width="32" height="206" rx="16" fill="#33312C" />
      <circle cx="300" cy="300" r="24" fill="#1C1B18" />
      <circle cx="300" cy="300" r="7" fill="#C8501F" />
      <g id="arm-fore" transform-origin="300 300">
        <rect x="287" y="130" width="26" height="176" rx="13" fill="#4A4740" />
        <circle cx="300" cy="140" r="18" fill="#1C1B18" />
        <g id="arm-hand" transform-origin="300 140">
          <rect x="288" y="96" width="24" height="48" rx="8" fill="#1C1B18" />
          <path id="finger-l" d="M291 100 q-14 -20 -6 -38" stroke="#1C1B18" stroke-width="9" stroke-linecap="round" transform-origin="291 100" />
          <path id="finger-r" d="M309 100 q14 -20 6 -38" stroke="#1C1B18" stroke-width="9" stroke-linecap="round" transform-origin="309 100" />
          <circle cx="300" cy="100" r="5" fill="#C8501F" />
        </g>
      </g>
    </g>
  </svg>
</div>

<style>
  .arm-stage {
    width: min(480px, 80vw);
    aspect-ratio: 1;
    margin-inline: auto;
  }
  .arm-stage svg { width: 100%; height: 100%; }
</style>

<script>
  const stage = document.getElementById('arm-stage');
  const svg = document.getElementById('arm-svg') as unknown as SVGSVGElement | null;
  const upper = document.getElementById('arm-upper');
  const fore = document.getElementById('arm-fore');
  const fingerL = document.getElementById('finger-l');
  const fingerR = document.getElementById('finger-r');

  if (stage && svg && upper && fore && fingerL && fingerR) {
    const SHOULDER = { x: 300, y: 490 };
    const L1 = 190;
    const L2 = 160;
    const REST = { x: 300, y: 160 };

    let target = { ...REST };
    let cur = { shoulder: 0, elbow: 0 };
    let goal = { shoulder: 0, elbow: 0 };
    let lastMove = 0;
    let t = 0;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    function solveIK(tx: number, ty: number) {
      const dx = tx - SHOULDER.x;
      const dy = ty - SHOULDER.y;
      const d = clamp(Math.hypot(dx, dy), 40, L1 + L2 - 4);
      const baseAngle = Math.atan2(dy, dx);
      const cosShoulder = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
      const cosElbow = clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1);
      const shoulderRad = baseAngle + Math.acos(cosShoulder);
      const elbowRad = Math.acos(cosElbow) - Math.PI;
      const restShoulder = -Math.PI / 2;
      return {
        shoulder: ((shoulderRad - restShoulder) * 180) / Math.PI,
        elbow: ((elbowRad + Math.PI) * 180) / Math.PI - 180,
      };
    }

    function toSvgPoint(clientX: number, clientY: number) {
      const pt = new DOMPoint(clientX, clientY);
      const m = svg!.getScreenCTM();
      if (!m) return REST;
      const p = pt.matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    }

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fine && !reduced) {
      window.addEventListener('pointermove', (e) => {
        target = toSvgPoint(e.clientX, e.clientY);
        lastMove = performance.now();
      });
    }

    function frame(now: number) {
      t += 0.016;
      const idle = now - lastMove > 2200 || !fine || reduced;
      const aim = idle
        ? { x: REST.x + Math.sin(t * 0.7) * 36, y: REST.y + Math.cos(t * 0.5) * 22 }
        : target;
      goal = solveIK(aim.x, aim.y);
      cur.shoulder += (goal.shoulder - cur.shoulder) * 0.09;
      cur.elbow += (goal.elbow - cur.elbow) * 0.09;
      upper!.setAttribute('transform', `rotate(${clamp(cur.shoulder, -70, 70)})`);
      fore!.setAttribute('transform', `rotate(${clamp(cur.elbow, -120, 120)})`);
      const dist = Math.hypot(aim.x - SHOULDER.x, aim.y - SHOULDER.y);
      const grip = clamp((dist - 120) / (L1 + L2 - 120), 0, 1) * 16;
      fingerL!.setAttribute('transform', `rotate(${-grip})`);
      fingerR!.setAttribute('transform', `rotate(${grip})`);
      requestAnimationFrame(frame);
    }

    if (reduced) {
      const pose = solveIK(REST.x + 30, REST.y);
      upper.setAttribute('transform', `rotate(${pose.shoulder})`);
      fore.setAttribute('transform', `rotate(${pose.elbow})`);
    } else {
      requestAnimationFrame(frame);
    }
  }
</script>
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`, temporarily add `<RoboticArm />` to the smoke-test index page (import it in frontmatter: `import RoboticArm from '../components/RoboticArm.astro';`), open `http://localhost:4321`.

Expected: arm renders; moving the mouse makes the arm articulate smoothly toward the cursor with natural elbow bend; leaving the mouse still for ~2 s starts a gentle idle sway; gripper fingers spread as the arm reaches further. No console errors.

Tuning pass (do this now, not later): if the arm aims mirrored or bends backwards, flip the sign of `Math.acos(cosShoulder)` — elbow-up vs elbow-down solution. Adjust rotation clamps so the arm never clips through the floor ellipse.

- [ ] **Step 3: Remove the temporary `<RoboticArm />` from index (it returns properly in Task 9). Commit**

```powershell
git add src/components/RoboticArm.astro src/pages/index.astro
git commit -m "feat: robotic arm hero component with 2-joint IK cursor tracking"
```

---

## Phase 4 — Content system and pages

### Task 8: Content collections (blog + projects)

**Files:**
- Create: `src/content.config.ts`, `src/content/blog/building-aria.md`, `src/content/projects/aria.md`

- [ ] **Step 1: Create src/content.config.ts**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    flagship: z.boolean().default(false),
    href: z.string().optional(),
    order: z.number().default(99),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 2: Create src/content/projects/aria.md**

```markdown
---
title: ARIA — distributed fire detection & evacuation guidance
summary: A 6-node ESP32 wireless sensor network that fuses smoke, CO, flame, and humidity readings to tell real fires from cooking smoke — then routes people to safe exits with animated LED guidance.
tags: [ESP32, ESP-NOW, sensor fusion, embedded C++]
flagship: true
href: /projects/aria
order: 1
---

ARIA is a two-tier wireless fire-safety system: one hub, up to six sensor
nodes, real-time LED exit routing, a live web dashboard, and Telegram alerts —
all communicating over ESP-NOW with no router required.
```

- [ ] **Step 3: Create src/content/blog/building-aria.md**

```markdown
---
title: What building ARIA taught me about false alarms
description: Why a smoke sensor alone can't tell a fire from breakfast, and how fusing five sensors fixed it.
date: 2026-06-11
tags: [embedded, sensors, lessons]
---

When I started building ARIA, I assumed detecting fire was the easy part —
point an MQ-2 at the air and wait for the number to jump. The number jumped
all the time. Cooking, haze, a humid afternoon: everything looked like fire.

The fix wasn't a better sensor. It was *more* sensors disagreeing with each
other. A real fire raises smoke **and** carbon monoxide **and** drops
humidity. Steam raises smoke readings but raises humidity too. So ARIA scores
each signal, lets contradictory evidence subtract points, and only alarms when
the picture is consistent.

This post is a placeholder for Eileen to rewrite in her own words — but the
engineering story it sketches is real, and it's the story the ARIA project
page tells interactively.
```

Note: this starter post exists so the blog system is testable end-to-end; the README content checklist (Task 16) tells Eileen to rewrite or replace it before launch.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds with no schema errors (content collections validate frontmatter at build time).

- [ ] **Step 5: Commit**

```powershell
git add src/content.config.ts src/content
git commit -m "feat: blog and projects content collections with starter entries"
```

### Task 9: Homepage

**Files:**
- Modify: `src/pages/index.astro` (full replacement of the smoke-test page)
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create src/components/ProjectCard.astro**

```astro
---
interface Props {
  title: string;
  summary: string;
  tags: string[];
  href: string;
  index: number;
}
const { title, summary, tags, href, index } = Astro.props;
---
<a class="proj-card card" href={href} data-reveal data-reveal-delay={index * 0.08}>
  <p class="eyebrow">{String(index + 1).padStart(2, '0')}</p>
  <h3>{title}</h3>
  <p class="muted proj-summary">{summary}</p>
  <ul class="proj-tags">
    {tags.map((t) => <li>{t}</li>)}
  </ul>
  <span class="proj-cta">Explore the system →</span>
</a>
<style>
  .proj-card {
    display: block;
    text-decoration: none;
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  .proj-card:hover { transform: translateY(-4px); border-color: var(--accent); }
  .proj-card h3 { margin-top: 0.4rem; }
  .proj-summary { font-size: 0.95rem; margin-top: 0.6rem; }
  .proj-tags {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .proj-tags li {
    font-size: 0.75rem;
    font-weight: 550;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
  }
  .proj-cta {
    display: inline-block;
    margin-top: 1.2rem;
    font-size: 0.9rem;
    font-weight: 550;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Replace src/pages/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import RoboticArm from '../components/RoboticArm.astro';
import ProjectCard from '../components/ProjectCard.astro';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
const fmt = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
---
<BaseLayout title="Eileen Yeoh — engineer of interactive systems">
  <section class="hero wrap">
    <div class="hero-copy">
      <p class="eyebrow" data-reveal>Electrical &amp; electronics engineering</p>
      <h1 data-split>I build systems where hardware meets intelligence.</h1>
      <p class="muted hero-sub" data-reveal data-reveal-delay="0.15">
        Sensor networks, embedded firmware, and the theory behind them —
        explained visually, built to be played with.
      </p>
      <div class="hero-actions" data-reveal data-reveal-delay="0.25">
        <a class="btn" href="/projects/aria">Explore ARIA</a>
        <a class="btn btn--ghost" href="/about">About me</a>
      </div>
    </div>
    <RoboticArm />
  </section>

  <section class="section wrap">
    <p class="eyebrow" data-reveal>Featured work</p>
    <h2 data-split>Projects you can play with</h2>
    <div class="proj-grid">
      {projects.map((p, i) => (
        <ProjectCard
          title={p.data.title}
          summary={p.data.summary}
          tags={p.data.tags}
          href={p.data.href ?? '/projects'}
          index={i}
        />
      ))}
    </div>
  </section>

  <section class="section wrap about-teaser">
    <p class="eyebrow" data-reveal>About</p>
    <h2 data-split>Engineering is a story worth telling well.</h2>
    <p class="muted" data-reveal>
      I'm an electrical &amp; electronics engineering student who believes a
      project isn't finished until someone else can understand it. This site is
      where my circuits, firmware, and systems get explained the way I wish
      textbooks did.
    </p>
    <a class="btn btn--ghost" href="/about" data-reveal>More about me</a>
  </section>

  <section class="section wrap">
    <p class="eyebrow" data-reveal>Writing</p>
    <h2 data-split>Latest from the blog</h2>
    <div class="post-list">
      {posts.map((post) => (
        <a class="post-row" href={`/blog/${post.id}`} data-reveal>
          <span class="muted post-date">{fmt.format(post.data.date)}</span>
          <span class="post-title">{post.data.title}</span>
          <span class="post-arrow">→</span>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    gap: 2rem;
    min-height: min(82vh, 760px);
    padding-block: 3rem;
  }
  .hero-sub { margin-top: 1.4rem; font-size: 1.15rem; }
  .hero-actions { display: flex; gap: 1rem; margin-top: 2.2rem; flex-wrap: wrap; }
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .about-teaser h2 { max-width: 18ch; }
  .about-teaser .btn--ghost { margin-top: 1.8rem; }
  .post-list { margin-top: 2.5rem; border-top: 1px solid var(--line); }
  .post-row {
    display: grid;
    grid-template-columns: 9rem 1fr auto;
    gap: 1.5rem;
    align-items: baseline;
    padding: 1.4rem 0.5rem;
    border-bottom: 1px solid var(--line);
    text-decoration: none;
    transition: background 0.2s ease;
  }
  .post-row:hover { background: var(--paper-raised); }
  .post-title { font-family: var(--font-display); font-size: 1.25rem; }
  .post-arrow { color: var(--accent); }
  .post-date { font-size: 0.85rem; }
  @media (max-width: 800px) {
    .hero { grid-template-columns: 1fr; text-align: center; }
    .hero-actions { justify-content: center; }
    .post-row { grid-template-columns: 1fr auto; }
    .post-date { grid-column: 1 / -1; }
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run build` — expected: success.
Run: `npm run dev`, open `http://localhost:4321`.
Expected: hero headline animates in word-by-word; robotic arm tracks cursor; ARIA project card appears with tags; latest-post row links to `/blog/building-aria` (404 for now — built in Task 10); responsive single-column at narrow width.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat: homepage with hero, featured projects, about teaser, latest posts"
```

### Task 10: Blog index and post pages

**Files:**
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create src/pages/blog/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);
const fmt = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
---
<BaseLayout title="Blog — Eileen Yeoh" description="Notes on circuits, firmware, and engineering school — by Eileen Yeoh.">
  <section class="section wrap">
    <p class="eyebrow" data-reveal>Blog</p>
    <h1 data-split>Notes from the bench</h1>
    <div class="blog-grid">
      {posts.map((post, i) => (
        <a class="card blog-card" href={`/blog/${post.id}`} data-reveal data-reveal-delay={i * 0.06}>
          <p class="muted blog-date">{fmt.format(post.data.date)}</p>
          <h3>{post.data.title}</h3>
          <p class="muted blog-desc">{post.data.description}</p>
          <ul class="blog-tags">
            {post.data.tags.map((t) => <li>{t}</li>)}
          </ul>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  .blog-card { text-decoration: none; transition: transform 0.3s ease, border-color 0.3s ease; }
  .blog-card:hover { transform: translateY(-4px); border-color: var(--accent); }
  .blog-date { font-size: 0.85rem; }
  .blog-card h3 { margin-top: 0.5rem; }
  .blog-desc { font-size: 0.95rem; margin-top: 0.6rem; }
  .blog-tags { list-style: none; padding: 0; display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; }
  .blog-tags li {
    font-size: 0.75rem;
    font-weight: 550;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Create src/pages/blog/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const fmt = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' });
const words = post.body ? post.body.split(/\s+/).length : 0;
const minutes = Math.max(1, Math.round(words / 220));
---
<BaseLayout title={`${post.data.title} — Eileen Yeoh`} description={post.data.description}>
  <article class="section wrap post">
    <p class="eyebrow" data-reveal>{fmt.format(post.data.date)} · {minutes} min read</p>
    <h1 data-split>{post.data.title}</h1>
    <div class="post-body">
      <Content />
    </div>
  </article>
</BaseLayout>

<style>
  .post { max-width: 760px; margin-inline: auto; }
  .post-body { margin-top: 2.5rem; }
  .post-body :global(h2) { margin-top: 2.5rem; }
  .post-body :global(p) { margin-top: 1.2rem; }
  .post-body :global(pre) {
    margin-top: 1.2rem;
    padding: 1.2rem;
    border-radius: var(--radius);
    overflow-x: auto;
    font-size: 0.9rem;
  }
  .post-body :global(blockquote) {
    margin-top: 1.2rem;
    padding-left: 1.2rem;
    border-left: 3px solid var(--accent);
    color: var(--muted);
  }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run build` — expected: success, `dist/blog/building-aria/index.html` exists.
Run: `npm run dev`, open `http://localhost:4321/blog` and click through to the post.
Expected: card grid renders; post shows date, reading time, styled body.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/blog
git commit -m "feat: blog index and post pages from markdown collection"
```

### Task 11: Projects index, about page, 404

**Files:**
- Create: `src/pages/projects/index.astro`, `src/pages/about.astro`, `src/pages/404.astro`

- [ ] **Step 1: Create src/pages/projects/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout title="Projects — Eileen Yeoh" description="Engineering projects by Eileen Yeoh — interactive deep-dives into hardware and firmware.">
  <section class="section wrap">
    <p class="eyebrow" data-reveal>Projects</p>
    <h1 data-split>Built, broken, rebuilt, explained</h1>
    <div class="proj-grid">
      {projects.map((p, i) => (
        <ProjectCard
          title={p.data.title}
          summary={p.data.summary}
          tags={p.data.tags}
          href={p.data.href ?? '#'}
          index={i}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .proj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
</style>
```

- [ ] **Step 2: Create src/pages/about.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const skills = [
  { area: 'Embedded systems', items: 'ESP32, Arduino, C/C++, FreeRTOS basics, ESP-NOW, I2C/SPI/UART' },
  { area: 'Electronics', items: 'Sensor interfacing, ADC calibration, relays & actuators, circuit prototyping' },
  { area: 'Software', items: 'TypeScript, Python, web dashboards (WebSocket), Git' },
  { area: 'Tools', items: 'Arduino IDE, PlatformIO, oscilloscope & multimeter, KiCad basics' },
];
---
<BaseLayout title="About — Eileen Yeoh" description="Eileen Yeoh — electrical & electronics engineering student building interactive, intelligent hardware systems.">
  <section class="section wrap">
    <p class="eyebrow" data-reveal>About</p>
    <h1 data-split>Hi, I'm Eileen.</h1>
    <div class="about-grid">
      <div class="about-story" data-reveal>
        <p>
          I'm an electrical &amp; electronics engineering student who likes
          building systems end to end — from the sensor soldered on a
          breadboard to the firmware that reads it to the dashboard that
          explains it.
        </p>
        <p>
          My current flagship project is <a href="/projects/aria">ARIA</a>, a
          six-node wireless fire-detection network that learned to tell real
          fires from burnt toast. It taught me more about signal noise,
          calibration, and honest engineering trade-offs than any lecture.
        </p>
        <p>
          I'm looking for internships and collaborations in embedded systems,
          IoT, and anywhere hardware meets software.
        </p>
        <a class="btn" href="/cv.pdf" download>Download my CV</a>
      </div>
      <div class="about-skills">
        {skills.map((s, i) => (
          <div class="card" data-reveal data-reveal-delay={i * 0.07}>
            <h3>{s.area}</h3>
            <p class="muted skill-items">{s.items}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 3rem;
    margin-top: 2.5rem;
  }
  .about-story p { margin-bottom: 1.2rem; }
  .about-story .btn { margin-top: 1rem; }
  .about-skills { display: grid; gap: 1.2rem; align-content: start; }
  .skill-items { font-size: 0.92rem; margin-top: 0.4rem; }
  @media (max-width: 800px) {
    .about-grid { grid-template-columns: 1fr; }
  }
</style>
```

Note: the about copy is a serviceable first draft in Eileen's voice for her to edit — listed in the README content checklist (Task 16).

- [ ] **Step 3: Create src/pages/404.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="404 — Eileen Yeoh">
  <section class="section wrap" style="text-align: center; min-height: 50vh; display: grid; place-content: center;">
    <p class="eyebrow">404</p>
    <h1>Signal lost.</h1>
    <p class="muted" style="margin-inline: auto; margin-top: 1rem;">
      This page is off the network. Let's route you back to a safe exit.
    </p>
    <a class="btn" href="/" style="margin-top: 2rem; justify-self: center;">Back home</a>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npm run build` — expected: success.
Open `/projects`, `/about`, and a bogus URL in dev.
Expected: all render in site style; about page is responsive.

- [ ] **Step 5: Commit**

```powershell
git add src/pages
git commit -m "feat: projects index, about page, and 404"
```

---

## Phase 5 — ARIA interactive deep-dive

### Task 12: ARIA page shell + animated architecture (sections 1–3)

**Files:**
- Create: `src/pages/projects/aria.astro`, `src/components/aria/ArchitectureDiagram.astro`

- [ ] **Step 1: Create src/components/aria/ArchitectureDiagram.astro**

A hub-and-nodes diagram where packet dots travel from each node to the hub on repeat while the section is on screen.

```astro
<div class="arch" data-reveal>
  <svg viewBox="0 0 800 420" fill="none" role="img" aria-label="ARIA architecture: six sensor nodes send data wirelessly to one hub, which drives LED strips, a dashboard, and Telegram alerts.">
    <g id="arch-links" stroke="#E5DFD4" stroke-width="1.5">
      <line x1="110" y1="80" x2="370" y2="210" />
      <line x1="110" y1="210" x2="370" y2="210" />
      <line x1="110" y1="340" x2="370" y2="210" />
      <line x1="690" y1="80" x2="430" y2="210" />
      <line x1="690" y1="210" x2="430" y2="210" />
      <line x1="690" y1="340" x2="430" y2="210" />
    </g>
    {[
      { x: 110, y: 80, label: 'Node 1 · Zone A' },
      { x: 110, y: 210, label: 'Node 2 · Zone B' },
      { x: 110, y: 340, label: 'Node 3 · Zone B' },
      { x: 690, y: 80, label: 'Node 4 · Zone C' },
      { x: 690, y: 210, label: 'Node 5 · Zone A' },
      { x: 690, y: 340, label: 'Node 6 · Zone C' },
    ].map((n) => (
      <g>
        <circle cx={n.x} cy={n.y} r="34" fill="#FFFFFF" stroke="#E5DFD4" stroke-width="1.5" />
        <circle cx={n.x} cy={n.y} r="8" fill="#C8501F" />
        <text x={n.x} y={n.y + 58} text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="13" fill="#6E6A60">{n.label}</text>
      </g>
    ))}
    <g>
      <rect x="340" y="160" width="120" height="100" rx="16" fill="#1C1B18" />
      <text x="400" y="205" text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="15" font-weight="600" fill="#FAF7F2">HUB</text>
      <text x="400" y="228" text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="11" fill="#B5B0A4">ESP-NOW · ch 6</text>
    </g>
    <g id="arch-packets">
      <circle class="pkt" data-from="110,80" data-to="370,210" r="5" fill="#C8501F" />
      <circle class="pkt" data-from="110,210" data-to="370,210" r="5" fill="#C8501F" />
      <circle class="pkt" data-from="110,340" data-to="370,210" r="5" fill="#C8501F" />
      <circle class="pkt" data-from="690,80" data-to="430,210" r="5" fill="#C8501F" />
      <circle class="pkt" data-from="690,210" data-to="430,210" r="5" fill="#C8501F" />
      <circle class="pkt" data-from="690,340" data-to="430,210" r="5" fill="#C8501F" />
    </g>
    <text x="400" y="320" text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="13" fill="#6E6A60">↓ dashboard · LED strips · Telegram</text>
  </svg>
</div>

<style>
  .arch { background: var(--paper-raised); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.5rem; }
  .arch svg { width: 100%; height: auto; }
</style>

<script>
  import { gsap, ScrollTrigger } from '../../lib/motion';

  const packets = document.querySelectorAll<SVGCircleElement>('.pkt');
  if (packets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    packets.forEach((pkt, i) => {
      const [fx, fy] = pkt.dataset.from!.split(',').map(Number);
      const [tx, ty] = pkt.dataset.to!.split(',').map(Number);
      gsap.fromTo(
        pkt,
        { attr: { cx: fx, cy: fy }, opacity: 0 },
        {
          attr: { cx: tx, cy: ty },
          opacity: 1,
          duration: 1.6,
          delay: i * 0.45,
          repeat: -1,
          repeatDelay: 1.2,
          ease: 'power1.inOut',
          scrollTrigger: { trigger: '.arch', start: 'top 85%', toggleActions: 'play pause resume pause' },
        },
      );
    });
  }
</script>
```

- [ ] **Step 2: Create src/pages/projects/aria.astro** (sections 1–3 now; sections 4–8 are appended by Tasks 13–15)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ArchitectureDiagram from '../../components/aria/ArchitectureDiagram.astro';
---
<BaseLayout
  title="ARIA — distributed fire detection — Eileen Yeoh"
  description="A 6-node ESP32 wireless sensor network that tells real fires from cooking smoke and routes people to safe exits. Interactive deep-dive."
>
  <section class="section wrap aria-hero">
    <p class="eyebrow" data-reveal>Project 01 · 2025–2026</p>
    <h1 data-split>ARIA</h1>
    <p class="aria-tagline" data-reveal>
      Autonomous Response &amp; Intelligence Architecture — a wireless sensor
      network that knows the difference between a fire and your breakfast.
    </p>
    <ul class="aria-tags" data-reveal>
      {['ESP32', 'ESP-NOW', 'multi-sensor fusion', 'embedded C++', 'WebSocket dashboard'].map((t) => <li>{t}</li>)}
    </ul>
  </section>

  <section class="section wrap">
    <p class="eyebrow" data-reveal>The problem</p>
    <h2 data-split>Smoke detectors cry wolf.</h2>
    <div class="problem-grid">
      <p data-reveal>
        A single smoke sensor can't tell combustion from cooking. Steam, haze,
        and a hot wok all push the same reading up — so alarms get ignored,
        batteries get pulled, and real fires get a head start.
      </p>
      <p data-reveal>
        ARIA's answer: never trust one sensor. Each node fuses smoke, carbon
        monoxide, air quality, flame, temperature, and humidity into a single
        0–10 fire score — and evidence <em>against</em> fire subtracts points.
      </p>
    </div>
  </section>

  <section class="section wrap">
    <p class="eyebrow" data-reveal>The system</p>
    <h2 data-split>One hub. Six nodes. No router.</h2>
    <p class="muted" data-reveal>
      Nodes broadcast sensor packets to the hub every 500 ms over ESP-NOW.
      The hub aggregates zone scores, drives LED evacuation strips, serves a
      live dashboard over its own Wi-Fi access point, and pushes Telegram
      alerts.
    </p>
    <ArchitectureDiagram />
  </section>
</BaseLayout>

<style>
  .aria-hero h1 { font-size: clamp(4rem, 14vw, 9rem); }
  .aria-tagline { font-size: 1.3rem; max-width: 38ch; margin-top: 1.2rem; }
  .aria-tags { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.8rem; }
  .aria-tags li {
    font-size: 0.8rem;
    font-weight: 550;
    padding: 0.3rem 0.85rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--paper-raised);
  }
  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; margin-top: 2rem; }
  @media (max-width: 800px) { .problem-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:4321/projects/aria`.
Expected: oversized ARIA headline animates; packet dots flow from nodes to hub repeatedly while the diagram is in view, pausing off-screen.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/projects/aria.astro src/components/aria
git commit -m "feat: ARIA page hero, problem statement, animated architecture"
```

### Task 13: Fire-score simulator island (section 4)

**Files:**
- Create: `src/components/aria/FireScoreSimulator.astro`
- Modify: `src/pages/projects/aria.astro` (append section)

- [ ] **Step 1: Create src/components/aria/FireScoreSimulator.astro**

```astro
<div class="sim card" data-reveal>
  <div class="sim-controls">
    <div class="sim-field">
      <label for="sim-smoke">Smoke (MQ-2)</label>
      <select id="sim-smoke">
        <option value="clean" selected>Clean air</option>
        <option value="slight">Slight smoke</option>
        <option value="spike">Heavy spike</option>
      </select>
    </div>
    <div class="sim-field">
      <label for="sim-co">Carbon monoxide: <output id="sim-co-out">5</output> ppm</label>
      <input type="range" id="sim-co" min="0" max="300" step="5" value="5" />
    </div>
    <div class="sim-field">
      <label for="sim-air">Air quality (MQ-135)</label>
      <select id="sim-air">
        <option value="clean" selected>Clean</option>
        <option value="poor">Poor</option>
        <option value="hazard">Hazardous</option>
      </select>
    </div>
    <div class="sim-field">
      <label for="sim-humidity">Humidity trend (DHT)</label>
      <select id="sim-humidity">
        <option value="stable" selected>Stable</option>
        <option value="rising">Rising (steam)</option>
        <option value="dropping-fast">Dropping fast (heat)</option>
      </select>
    </div>
    <div class="sim-toggles">
      <label class="sim-check"><input type="checkbox" id="sim-flame" /> Flame detected</label>
      <label class="sim-check"><input type="checkbox" id="sim-rising" /> CO rising fast</label>
    </div>
    <div class="sim-presets">
      <button type="button" data-preset="cooking">Burnt toast</button>
      <button type="button" data-preset="steam">Hot shower</button>
      <button type="button" data-preset="fire">Real fire</button>
      <button type="button" data-preset="gas">Gas leak</button>
    </div>
  </div>
  <div class="sim-readout">
    <p class="sim-score-label muted">Fire score</p>
    <p class="sim-score" id="sim-score">0</p>
    <p class="sim-tier" id="sim-tier">Normal</p>
    <div class="sim-bar"><div class="sim-bar-fill" id="sim-bar"></div></div>
    <p class="muted sim-note" id="sim-note">All quiet. This is the exact scoring logic running on each ARIA node every 500 ms.</p>
  </div>
</div>

<style>
  .sim { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; padding: 2rem; }
  .sim-controls { display: grid; gap: 1.1rem; align-content: start; }
  .sim-field label { display: block; font-size: 0.85rem; font-weight: 550; margin-bottom: 0.35rem; }
  .sim-field select, .sim-field input[type='range'] { width: 100%; }
  .sim-field select {
    padding: 0.5rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
    font: inherit;
  }
  .sim-field input[type='range'] { accent-color: var(--accent); }
  .sim-toggles { display: flex; gap: 1.5rem; flex-wrap: wrap; }
  .sim-check { font-size: 0.9rem; display: flex; gap: 0.45rem; align-items: center; }
  .sim-check input { accent-color: var(--accent); width: 1.05rem; height: 1.05rem; }
  .sim-presets { display: flex; gap: 0.6rem; flex-wrap: wrap; }
  .sim-presets button {
    font: inherit;
    font-size: 0.82rem;
    font-weight: 550;
    padding: 0.45rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--paper);
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .sim-presets button:hover { border-color: var(--accent); background: var(--accent-soft); }
  .sim-readout {
    text-align: center;
    display: grid;
    align-content: center;
    gap: 0.3rem;
    border-left: 1px solid var(--line);
    padding-left: 2rem;
  }
  .sim-score-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; }
  .sim-score { font-family: var(--font-display); font-size: 5rem; line-height: 1; transition: color 0.3s ease; }
  .sim-tier { font-weight: 600; font-size: 1.1rem; }
  .sim-bar { height: 10px; border-radius: 999px; background: var(--line); overflow: hidden; margin-top: 0.8rem; }
  .sim-bar-fill { height: 100%; width: 0%; border-radius: 999px; background: var(--safe); transition: width 0.4s ease, background 0.4s ease; }
  .sim-note { font-size: 0.85rem; margin-top: 0.8rem; }
  @media (max-width: 800px) {
    .sim { grid-template-columns: 1fr; }
    .sim-readout { border-left: 0; padding-left: 0; border-top: 1px solid var(--line); padding-top: 1.5rem; }
  }
</style>

<script>
  import { computeFireScore, type SensorInputs, type SmokeLevel, type AirQuality, type HumidityTrend } from '../../lib/fire-score';

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;
  const smoke = $('sim-smoke') as HTMLSelectElement | null;
  const co = $('sim-co') as HTMLInputElement | null;
  const coOut = $('sim-co-out');
  const air = $('sim-air') as HTMLSelectElement | null;
  const humidity = $('sim-humidity') as HTMLSelectElement | null;
  const flame = $('sim-flame') as HTMLInputElement | null;
  const rising = $('sim-rising') as HTMLInputElement | null;
  const scoreEl = $('sim-score');
  const tierEl = $('sim-tier');
  const barEl = $('sim-bar');
  const noteEl = $('sim-note');

  const TIER_COLOR: Record<string, string> = {
    Normal: 'var(--safe)',
    'Pre-warning': 'var(--warn)',
    Emergency: 'var(--danger)',
    Critical: 'var(--danger)',
  };

  const NOTES: Record<string, string> = {
    Normal: 'All quiet. This is the exact scoring logic running on each ARIA node every 500 ms.',
    'Pre-warning': 'Tier 1: the hub pulses the zone LEDs orange and sends a Telegram heads-up.',
    Emergency: 'Tier 2: alarm sounds, LED strips switch to evacuation routing.',
    Critical: 'Tier 3: rapid alarm, all alerts firing.',
    gas: 'Gas-leak pattern: combustibles high but no combustion markers — ARIA switches to gas mode (yellow strips, fan on) instead of a fire alarm.',
  };

  function read(): SensorInputs {
    return {
      smoke: (smoke?.value ?? 'clean') as SmokeLevel,
      coPpm: Number(co?.value ?? 0),
      coRisingFast: rising?.checked ?? false,
      flame: flame?.checked ?? false,
      humidity: (humidity?.value ?? 'stable') as HumidityTrend,
      airQuality: (air?.value ?? 'clean') as AirQuality,
    };
  }

  function update() {
    if (!scoreEl || !tierEl || !barEl || !noteEl) return;
    if (coOut && co) coOut.textContent = co.value;
    const result = computeFireScore(read());
    const gas = result.mode === 'gas-leak';
    scoreEl.textContent = String(result.score);
    tierEl.textContent = gas ? 'Gas leak' : result.tierLabel;
    const color = gas ? 'var(--warn)' : TIER_COLOR[result.tierLabel];
    scoreEl.style.color = color;
    tierEl.style.color = color;
    barEl.style.width = `${result.score * 10}%`;
    barEl.style.background = color;
    noteEl.textContent = gas ? NOTES.gas : NOTES[result.tierLabel];
  }

  const PRESETS: Record<string, { s: string; c: number; a: string; h: string; f: boolean; r: boolean }> = {
    cooking: { s: 'spike', c: 10, a: 'clean', h: 'stable', f: false, r: false },
    steam: { s: 'slight', c: 5, a: 'clean', h: 'rising', f: false, r: false },
    fire: { s: 'spike', c: 90, a: 'poor', h: 'dropping-fast', f: true, r: true },
    gas: { s: 'spike', c: 10, a: 'poor', h: 'stable', f: false, r: false },
  };

  document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = PRESETS[btn.dataset.preset!];
      if (!p || !smoke || !co || !air || !humidity || !flame || !rising) return;
      smoke.value = p.s;
      co.value = String(p.c);
      air.value = p.a;
      humidity.value = p.h;
      flame.checked = p.f;
      rising.checked = p.r;
      update();
    });
  });

  [smoke, co, air, humidity, flame, rising].forEach((el) => el?.addEventListener('input', update));
  update();
</script>
```

- [ ] **Step 2: Append section 4 to src/pages/projects/aria.astro**

Add import in frontmatter:

```ts
import FireScoreSimulator from '../../components/aria/FireScoreSimulator.astro';
```

Append after the architecture section, before `</BaseLayout>`:

```astro
  <section class="section wrap">
    <p class="eyebrow" data-reveal>Try it · the scoring algorithm</p>
    <h2 data-split>Score the room yourself.</h2>
    <p class="muted" data-reveal>
      Set the sensors and watch the fire score react — including the
      false-alarm patterns that <em>subtract</em> evidence. Try "Burnt toast":
      heavy smoke, but clean CO and air quality means no alarm.
    </p>
    <FireScoreSimulator />
  </section>
```

- [ ] **Step 3: Verify**

Run: `npm test` — expected: still all green (simulator reuses the tested engine).
Run: `npm run dev`, open `/projects/aria`.
Expected: presets work — "Burnt toast" shows 0/Normal, "Real fire" shows ≥8/Critical in red, "Gas leak" shows the gas mode note in amber. Sliders update live.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat: interactive fire-score simulator on ARIA page"
```

### Task 14: Evacuation routing demo island (section 5)

**Files:**
- Create: `src/components/aria/EvacuationDemo.astro`
- Modify: `src/pages/projects/aria.astro` (append section)

- [ ] **Step 1: Create src/components/aria/EvacuationDemo.astro**

```astro
<div class="evac card" data-reveal>
  <div class="evac-map">
    <svg viewBox="0 0 760 240" role="img" aria-label="Interactive floor map with zones A, B, C. Click a zone to simulate fire and see evacuation arrows re-route.">
      <text x="28" y="126" font-family="Inter Variable, sans-serif" font-size="12" font-weight="600" fill="#6E6A60" transform="rotate(-90 28 126)">EXIT A</text>
      <rect x="40" y="40" width="14" height="160" rx="4" fill="#2E7D4F" id="exit-A" />
      <text x="732" y="126" font-family="Inter Variable, sans-serif" font-size="12" font-weight="600" fill="#6E6A60" transform="rotate(90 732 126)">EXIT C</text>
      <rect x="706" y="40" width="14" height="160" rx="4" fill="#2E7D4F" id="exit-C" />
      <rect x="333" y="26" width="94" height="14" rx="4" fill="#2E7D4F" id="exit-B" />
      <text x="380" y="18" text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="12" font-weight="600" fill="#6E6A60">EXIT B</text>
      {(['A', 'B', 'C'] as const).map((z, i) => (
        <g class="zone" data-zone={z} style="cursor: pointer;">
          <rect x={70 + i * 212} y="40" width="196" height="160" rx="10" fill="#FFFFFF" stroke="#E5DFD4" stroke-width="1.5" id={`zone-rect-${z}`} />
          <text x={168 + i * 212} y="78" text-anchor="middle" font-family="Fraunces Variable, serif" font-size="26" fill="#1C1B18">Zone {z}</text>
          <text x={168 + i * 212} y="100" text-anchor="middle" font-family="Inter Variable, sans-serif" font-size="11" fill="#6E6A60" id={`zone-hint-${z}`}>click to ignite</text>
          <text x={168 + i * 212} y="160" text-anchor="middle" font-size="34" id={`zone-arrow-${z}`}></text>
        </g>
      ))}
    </svg>
  </div>
  <div class="evac-side">
    <p class="evac-title">Exit congestion</p>
    {(['A', 'B', 'C'] as const).map((z) => (
      <label class="evac-check"><input type="checkbox" data-congest={z} /> Exit {z} congested</label>
    ))}
    <button type="button" id="evac-reset" class="evac-reset">Reset</button>
    <ul class="evac-legend muted">
      <li><span style="background: #2E7D4F;"></span> safe — follow arrows</li>
      <li><span style="background: #C03028;"></span> fire — routing away</li>
      <li><span style="background: #D98E1B;"></span> exit congested — re-routed</li>
    </ul>
  </div>
</div>

<style>
  .evac { display: grid; grid-template-columns: 2.2fr 1fr; gap: 1.5rem; padding: 1.5rem; align-items: center; }
  .evac-map svg { width: 100%; height: auto; }
  .evac-title { font-weight: 600; font-size: 0.9rem; }
  .evac-check { display: flex; gap: 0.45rem; align-items: center; font-size: 0.9rem; margin-top: 0.5rem; }
  .evac-check input { accent-color: var(--accent); }
  .evac-reset {
    margin-top: 1rem;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 550;
    padding: 0.45rem 1.1rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--paper);
    cursor: pointer;
  }
  .evac-reset:hover { border-color: var(--accent); }
  .evac-legend { list-style: none; padding: 0; margin-top: 1.4rem; font-size: 0.8rem; display: grid; gap: 0.4rem; }
  .evac-legend span { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 0.4rem; vertical-align: -1px; }
  @media (max-width: 800px) { .evac { grid-template-columns: 1fr; } }
</style>

<script>
  import { routeZones, type ZoneId } from '../../lib/evac-routing';

  const fire = new Set<ZoneId>();
  const congested = new Set<ZoneId>();
  const ZONES: ZoneId[] = ['A', 'B', 'C'];

  const FILL: Record<string, string> = {
    off: '#FFFFFF',
    green: '#E3F0E8',
    red: '#F7E2E0',
    orange: '#F9EDDA',
  };
  const STROKE: Record<string, string> = {
    off: '#E5DFD4',
    green: '#2E7D4F',
    red: '#C03028',
    orange: '#D98E1B',
  };
  const ARROW: Record<string, string> = { left: '←', right: '→', none: '' };

  function render() {
    const plan = routeZones(fire, congested);
    for (const z of ZONES) {
      const rect = document.getElementById(`zone-rect-${z}`);
      const arrow = document.getElementById(`zone-arrow-${z}`);
      const hint = document.getElementById(`zone-hint-${z}`);
      if (!rect || !arrow || !hint) continue;
      const route = fire.has(z) ? { color: 'red' as const, direction: plan[z].direction } : plan[z];
      rect.setAttribute('fill', FILL[route.color]);
      rect.setAttribute('stroke', STROKE[route.color]);
      arrow.textContent = fire.has(z) ? '🔥' : ARROW[route.direction];
      arrow.setAttribute('fill', STROKE[route.color]);
      hint.textContent = fire.has(z) ? 'click to extinguish' : 'click to ignite';
    }
    for (const z of ZONES) {
      const exit = document.getElementById(`exit-${z}`);
      if (exit) exit.setAttribute('fill', congested.has(z) ? '#D98E1B' : '#2E7D4F');
    }
  }

  document.querySelectorAll<SVGGElement>('.zone').forEach((g) => {
    g.addEventListener('click', () => {
      const z = g.dataset.zone as ZoneId;
      if (fire.has(z)) fire.delete(z);
      else fire.add(z);
      render();
    });
  });

  document.querySelectorAll<HTMLInputElement>('[data-congest]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const z = cb.dataset.congest as ZoneId;
      if (cb.checked) congested.add(z);
      else congested.delete(z);
      render();
    });
  });

  document.getElementById('evac-reset')?.addEventListener('click', () => {
    fire.clear();
    congested.clear();
    document.querySelectorAll<HTMLInputElement>('[data-congest]').forEach((cb) => (cb.checked = false));
    render();
  });

  render();
</script>
```

- [ ] **Step 2: Append section 5 to src/pages/projects/aria.astro**

Add import in frontmatter:

```ts
import EvacuationDemo from '../../components/aria/EvacuationDemo.astro';
```

Append after the simulator section:

```astro
  <section class="section wrap">
    <p class="eyebrow" data-reveal>Try it · evacuation routing</p>
    <h2 data-split>Set a fire. Watch the exits think.</h2>
    <p class="muted" data-reveal>
      The hub's LED strips guide people zone by zone — green chases toward a
      safe exit, red warns away from fire, orange means the laser-beam
      counters detected a crowded exit. Click zones to start fires; toggle
      congestion and watch the routing adapt. This is ARIA's actual routing
      table.
    </p>
    <EvacuationDemo />
  </section>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `/projects/aria`.
Expected: clicking Zone B turns it red with 🔥; zones A and C go green with ← and → arrows matching the routing table; checking "Exit A congested" turns Zone A orange; Reset clears everything.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat: interactive evacuation routing demo on ARIA page"
```

### Task 15: ARIA closing sections — hardware, dashboard, outcome (sections 6–8)

**Files:**
- Modify: `src/pages/projects/aria.astro` (append sections)
- Create: `public/images/aria/` media directory (populated by Task 17 + Eileen's photos)

- [ ] **Step 1: Append sections 6–8 to src/pages/projects/aria.astro**

Add to frontmatter:

```ts
const sensors = [
  { name: 'MQ-2', role: 'Smoke, LPG & combustibles — the first hint something is burning' },
  { name: 'MQ-7', role: 'Carbon monoxide, converted to a ppm estimate — the silent killer check' },
  { name: 'MQ-135', role: 'Chemical air quality — catches what smoke sensors miss' },
  { name: 'Flame sensor', role: 'Direct IR flame detection, triple-read to reject sunlight' },
  { name: 'DHT22', role: 'Temperature & humidity — separates steam from fire' },
  { name: 'LDR + laser', role: 'Beam-break people counting at every exit for congestion detection' },
];
const galleryImages = [
  { src: '/images/aria/dashboard-warden.png', alt: 'ARIA dashboard, warden tab: zone scores, alert pills, live floor map and escape-route canvas' },
  { src: '/images/aria/dashboard-technical.png', alt: 'ARIA dashboard, technical tab: per-node sensor detail and live system log' },
];
```

Append before `</BaseLayout>`:

```astro
  <section class="section wrap">
    <p class="eyebrow" data-reveal>Hardware</p>
    <h2 data-split>Six senses per node.</h2>
    <div class="sensor-grid">
      {sensors.map((s, i) => (
        <div class="card sensor-card" data-reveal data-reveal-delay={i * 0.06}>
          <h3>{s.name}</h3>
          <p class="muted sensor-role">{s.role}</p>
        </div>
      ))}
    </div>
  </section>

  <section class="section wrap">
    <p class="eyebrow" data-reveal>The dashboard</p>
    <h2 data-split>Mission control in a browser.</h2>
    <p class="muted" data-reveal>
      The hub serves a live dashboard from its own Wi-Fi access point — no
      internet needed. Fire wardens see zone scores, SOS locations, and a live
      floor map; engineers get per-node telemetry and a real-time system log.
    </p>
    <div class="gallery">
      {galleryImages.map((img) => (
        <figure class="card gallery-item" data-reveal>
          <img src={img.src} alt={img.alt} loading="lazy" width="1280" height="800" />
        </figure>
      ))}
    </div>
  </section>

  <section class="section wrap outcome">
    <p class="eyebrow" data-reveal>Outcome</p>
    <h2 data-split>What I learned building it.</h2>
    <div class="outcome-grid">
      <div data-reveal>
        <h3>Calibration beats specification.</h3>
        <p class="muted">MQ sensors drift with every room. ARIA self-calibrates 30 samples at startup and sets thresholds relative to its own baseline.</p>
      </div>
      <div data-reveal data-reveal-delay="0.08">
        <h3>Radios fight for airtime.</h3>
        <p class="muted">ESP-NOW, Wi-Fi AP, and WS2812B timing all share one chip. Pinning the channel and disabling Wi-Fi power-save kept packets and pixels stable.</p>
      </div>
      <div data-reveal data-reveal-delay="0.16">
        <h3>Negative evidence matters.</h3>
        <p class="muted">The fire score improved most when contradictory signals started subtracting points — that's what finally beat the burnt-toast false alarm.</p>
      </div>
    </div>
    <a class="btn" href="https://github.com/EileenYJH/ARIA" target="_blank" rel="noopener" data-reveal>
      View the full source on GitHub →
    </a>
  </section>
```

Append to the page's `<style>` block:

```css
  .sensor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2rem;
    margin-top: 2.5rem;
  }
  .sensor-role { font-size: 0.9rem; margin-top: 0.4rem; }
  .gallery { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; }
  .gallery-item { padding: 0.6rem; }
  .gallery-item img { border-radius: calc(var(--radius) - 6px); }
  .outcome-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; margin-top: 2.5rem; }
  .outcome .btn { margin-top: 3rem; }
  @media (max-width: 800px) { .gallery { grid-template-columns: 1fr; } }
```

- [ ] **Step 2: Create the media directory with a .gitkeep**

```powershell
New-Item -ItemType Directory -Force public/images/aria | Out-Null
New-Item -ItemType File public/images/aria/.gitkeep | Out-Null
```

(The two dashboard screenshots referenced above are produced in Task 17; until then the gallery shows broken-image alt text in dev — acceptable mid-build, and Task 17 precedes deployment.)

- [ ] **Step 3: Verify**

Run: `npm run build` — expected: success.
Open `/projects/aria` in dev: full page scrolls through all 8 sections with reveals.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "feat: ARIA hardware, dashboard, and outcome sections"
```

---

## Phase 6 — Capture, deploy, verify

### Task 16: README with content checklist + GitHub Actions deploy

**Files:**
- Create: `README.md`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Create README.md**

```markdown
# eileenyjh.github.io — portfolio

Personal portfolio of Eileen Yeoh. Astro + GSAP. Deploys to GitHub Pages on
every push to `main`.

## Commands

| Command         | Action                                  |
| --------------- | --------------------------------------- |
| `npm run dev`   | Dev server at http://localhost:4321     |
| `npm run build` | Production build to `dist/`             |
| `npm test`      | Run unit tests (fire score and routing) |

## Writing a blog post

Create `src/content/blog/<slug>.md`:

    ---
    title: Post title
    description: One-sentence summary shown on cards.
    date: 2026-07-01
    tags: [embedded, uni]
    ---

    Markdown body here.

Push to `main` — the post appears automatically.

## Content checklist before sharing the link

- [ ] Replace/rewrite the starter post `src/content/blog/building-aria.md` in your own words
- [ ] Edit the about-page story (`src/pages/about.astro`) so it sounds like you
- [ ] Add `public/cv.pdf` (the footer and about page link to it)
- [ ] Add your LinkedIn URL to `src/components/Footer.astro`
- [ ] Add hardware photos / demo video to the ARIA page gallery
      (`galleryImages` array in `src/pages/projects/aria.astro`)
- [ ] Refine the hero one-liner on the homepage if it doesn't feel like you
```

- [ ] **Step 2: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Create the GitHub repo and push**

For the site to live at `https://eileenyjh.github.io` (no path suffix), the repo must be named exactly `EileenYJH.github.io`:

```powershell
gh repo create EileenYJH/EileenYJH.github.io --public --source . --remote origin
git push -u origin main
```

Then enable Pages with GitHub Actions as the source:

```powershell
gh api -X POST repos/EileenYJH/EileenYJH.github.io/pages -f build_type=workflow
```

(If the API call fails because Pages already exists, run `gh api -X PUT repos/EileenYJH/EileenYJH.github.io/pages -f build_type=workflow` instead.)

- [ ] **Step 4: Verify the deployment**

Run: `gh run watch` (or `gh run list --limit 1` until status is `completed success`).
Open `https://eileenyjh.github.io` — expected: homepage loads with working robotic arm.

- [ ] **Step 5: Commit (workflow + README go up with the push above; if edited after, commit again)**

```powershell
git add README.md .github
git commit -m "docs: README with content checklist; ci: GitHub Pages deploy"
git push
```

### Task 17: Capture ARIA dashboard screenshots

**Files:**
- Create: `scripts/extract-dashboard.mjs`
- Create: `public/images/aria/dashboard-warden.png`, `public/images/aria/dashboard-technical.png`

- [ ] **Step 1: Clone the ARIA repo to a temp folder**

```powershell
git clone --depth 1 https://github.com/EileenYJH/ARIA "$env:TEMP\aria-repo"
```

- [ ] **Step 2: Create scripts/extract-dashboard.mjs**

Extracts the HTML payload from the firmware's `html_page.h` (a C++ raw string literal in PROGMEM):

```js
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2];
const out = process.argv[3] ?? 'dashboard.html';
const text = readFileSync(src, 'utf8');

const rawMatch = text.match(/R"(\w*)\(([\s\S]*?)\)\1"/);
if (rawMatch) {
  writeFileSync(out, rawMatch[2]);
  console.log(`Extracted raw literal → ${out} (${rawMatch[2].length} bytes)`);
} else {
  const start = text.indexOf('<!DOCTYPE');
  const end = text.lastIndexOf('</html>');
  if (start === -1 || end === -1) throw new Error('No HTML payload found — inspect the header manually.');
  writeFileSync(out, text.slice(start, end + 7));
  console.log(`Extracted by tag span → ${out}`);
}
```

Run: `node scripts/extract-dashboard.mjs "$env:TEMP\aria-repo\ARIA_Hub_v6\html_page.h" "$env:TEMP\dashboard.html"`
Expected: prints the extracted byte count. If the path differs, locate the header with `Get-ChildItem -Recurse -Filter html_page.h "$env:TEMP\aria-repo"`.

- [ ] **Step 3: Read the extracted HTML to learn its data shape, then stub the WebSocket**

Open `$env:TEMP\dashboard.html` and find the `onmessage` handler to learn the JSON payload structure the dashboard expects (zone scores, node states, congestion flags). Then create `$env:TEMP\dashboard-demo.html` that wraps the original: it must define a fake `WebSocket` class **before** the original scripts run, whose instances fire `onopen` then deliver a realistic payload (e.g. zone A score 7/fire, zone B score 0, zone C score 2, exit B congested, one SOS active) via `onmessage` every second. This makes the dashboard render a live-looking incident for the screenshot. The exact payload fields must be copied from the real handler found in this step — do not invent field names.

- [ ] **Step 4: Screenshot both tabs**

Serve and capture with Playwright (no install in the site project needed — use npx):

```powershell
npx --yes playwright install chromium
npx --yes playwright screenshot --viewport-size "1280,800" --wait-for-timeout 4000 "file:///$($env:TEMP -replace '\\','/')/dashboard-demo.html" public/images/aria/dashboard-warden.png
```

For the technical tab, the dashboard switches tabs via a button — capture it by adding `#technical` click automation: simplest reliable route is a tiny Playwright script `scripts/shoot-dashboard.mjs`:

```js
import { chromium } from 'playwright';

const url = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url);
await page.waitForTimeout(4000);
await page.screenshot({ path: 'public/images/aria/dashboard-warden.png' });
const tab = page.getByText(/technical/i).first();
if (await tab.count()) {
  await tab.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/images/aria/dashboard-technical.png' });
}
await browser.close();
```

Run: `npx --yes -p playwright node scripts/shoot-dashboard.mjs "file:///$($env:TEMP -replace '\\','/')/dashboard-demo.html"`
Expected: both PNGs exist in `public/images/aria/` and show a populated dashboard (zone cards with scores, colored floor map), not empty zeros.

- [ ] **Step 5: Verify on the page, then commit**

Run: `npm run dev`, open `/projects/aria` — gallery shows both screenshots.

```powershell
git add scripts public/images/aria
git commit -m "feat: ARIA dashboard screenshots captured from real firmware dashboard"
git push
```

### Task 18: Final verification pass

- [ ] **Step 1: Full test + build**

Run: `npm test` — expected: all tests pass.
Run: `npm run build` — expected: clean build.

- [ ] **Step 2: Lighthouse**

Run: `npx --yes lighthouse https://eileenyjh.github.io --only-categories=performance,accessibility,seo --quiet --chrome-flags="--headless"` (repeat for `/projects/aria`).
Expected: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90. If performance is below target, the usual fixes in order: compress gallery PNGs (`npx @squoosh/cli` or save as WebP and update `galleryImages` paths), confirm fonts are the variable single-file versions, check no GSAP timeline runs while off-screen.

- [ ] **Step 3: Manual matrix**

- Desktop Chrome/Edge: robotic arm tracks cursor; all reveals fire once; simulator presets correct; evac demo matches routing table.
- Mobile viewport (devtools, 390px): hero stacks; arm idles (no cursor); nav usable; tables/cards don't overflow.
- Reduced motion (devtools emulation): no animations, all content visible, arm in static pose.
- JS disabled: all text content readable; interactive sections show their static markup.
- Share preview: paste the URL into a LinkedIn post draft — title and description render.

- [ ] **Step 4: Confirm the content checklist in README is intact for Eileen, then final push**

```powershell
git push
```

---

## Self-review notes

- **Spec coverage:** site map (Tasks 9–12), design language (Task 2), robotic arm hero with fallbacks (Task 7), ARIA 8 sections (Tasks 12–15 — sections 1–3 in T12, 4 in T13, 5 in T14, 6–8 in T15), blog markdown workflow (Tasks 8, 10), deploy (Task 16), dashboard screenshots (Task 17), Lighthouse/reduced-motion/mobile verification (Task 18). Hardware photos/videos and final copy are Eileen-provided content tracked in the README checklist, per spec ("not blocking initial build").
- **Type consistency:** `computeFireScore`/`SensorInputs` (T5) match the simulator imports (T13); `routeZones`/`ZoneId` (T6) match the evac demo imports (T14); `initMotion`/`gsap`/`ScrollTrigger` exports (T3) match imports in T4 and T12.
- **Known judgment calls:** gas-leak disambiguation rule documented in Task 5; smoke/CO/MQ-135 point tiers implemented as exclusive (else-if) ladders matching firmware-style thresholds; zone→exit mapping is identity per the README table.
