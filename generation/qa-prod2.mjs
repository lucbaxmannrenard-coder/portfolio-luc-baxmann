import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('https://portfolio-luc-baxmann.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
// nav works?
await page.click('.sw-nav__item:nth-child(3)'); // Portfolio
await page.waitForTimeout(1800);
await page.screenshot({ path: 'qa/prod-portfolio.png' });
const checks = await page.evaluate(() => ({
  mapTiles: document.querySelectorAll('#pf-map img').length,
  cards: document.querySelectorAll('.pf-card').length,
  routeHidden: document.body.classList.contains('past-world'),
  video: (() => { const v = document.querySelector('video'); return v && v.seekable.length ? v.seekable.end(0) : 0; })(),
}));
console.log(JSON.stringify({ checks, errors: errors.slice(0, 3) }));
await browser.close();
