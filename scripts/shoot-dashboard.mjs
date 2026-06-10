import { chromium } from 'playwright';

const url = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url);
await page.waitForTimeout(4000);
await page.screenshot({ path: 'public/images/aria/dashboard-warden.png', fullPage: false });
const tab = page.getByText(/technical/i).first();
if ((await tab.count()) > 0) {
  await tab.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/images/aria/dashboard-technical.png', fullPage: false });
}
await browser.close();
console.log('Screenshots captured.');
