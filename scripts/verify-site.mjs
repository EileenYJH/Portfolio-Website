import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'https://eileenyjh.github.io';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();

async function revealTo(page, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 250 });
  }, selector);
  await page.waitForTimeout(1300);
}

{
  const page = await (await browser.newContext({ viewport: { width: 1366, height: 900 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  check('homepage loads', (await page.title()).includes('Eileen'), await page.title());

  await page.mouse.move(1100, 200);
  await page.waitForTimeout(300);
  const t1 = await page.getAttribute('#arm-upper', 'transform');
  await page.mouse.move(200, 700);
  await page.waitForTimeout(900);
  const t2 = await page.getAttribute('#arm-upper', 'transform');
  check('robotic arm tracks cursor', Boolean(t1 && t2 && t1 !== t2), `${t1} -> ${t2}`);

  const heroVisible = await page.isVisible('h1');
  check('hero headline visible', heroVisible);

  await page.goto(`${BASE}/projects/aria/`, { waitUntil: 'networkidle' });
  await revealTo(page, '.sim');
  await page.click('[data-preset="fire"]');
  await page.waitForTimeout(200);
  const score = await page.textContent('#sim-score');
  check('simulator real-fire preset critical', Number(score) >= 8, `score ${score}`);
  await page.click('[data-preset="cooking"]');
  await page.waitForTimeout(200);
  const score2 = await page.textContent('#sim-score');
  check('simulator burnt-toast damped to 0', score2 === '0', `score ${score2}`);

  await revealTo(page, '.evac');
  await page.click('.zone[data-zone="B"]');
  await page.waitForTimeout(200);
  const arrowA = await page.textContent('#zone-arrow-A');
  const fillB = await page.getAttribute('#zone-rect-B', 'fill');
  check('evac demo routes around zone B fire', arrowA === '←' && fillB === '#F7E2E0', `A arrow ${arrowA}, B fill ${fillB}`);

  await revealTo(page, '.gallery');
  const imgsOk = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.gallery img')).every((i) => i.naturalWidth > 0),
  );
  check('dashboard screenshots load', imgsOk);

  await page.goto(`${BASE}/blog/`, { waitUntil: 'networkidle' });
  check('blog index has post card', (await page.locator('.blog-card').count()) >= 1);
  await page.goto(`${BASE}/blog/building-aria/`, { waitUntil: 'networkidle' });
  check('blog post renders', await page.isVisible('article h1'));

  check('no page errors on key pages', errors.length === 0, errors.join('; ').slice(0, 200));
  await page.context().close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('mobile: no horizontal overflow (home)', overflow <= 1, `${overflow}px`);
  await page.goto(`${BASE}/projects/aria/`, { waitUntil: 'networkidle' });
  const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('mobile: no horizontal overflow (aria)', overflow2 <= 1, `${overflow2}px`);
  await ctx.close();
}

{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const h1Opacity = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).opacity);
  const armPose = await page.getAttribute('#arm-upper', 'transform');
  check('reduced motion: content visible, arm posed statically', h1Opacity === '1' && Boolean(armPose), `opacity ${h1Opacity}, arm ${armPose}`);
  await ctx.close();
}

{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/projects/aria/`, { waitUntil: 'load' });
  const textVisible = await page.evaluate(() => {
    const h = document.querySelector('h1');
    return h && getComputedStyle(h).visibility !== 'hidden' && document.body.innerText.includes('Smoke detectors');
  });
  check('JS disabled: ARIA page content readable', Boolean(textVisible));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
