import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:8123/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
for (const id of ['about', 'resume', 'portfolio', 'reviews', 'contact']) {
  await page.evaluate(s => document.getElementById(s).scrollIntoView(), id);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `qa/sec-${id}.png` });
}
console.log(JSON.stringify({ errors: errors.slice(0, 5) }));
await browser.close();
