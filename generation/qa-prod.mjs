import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://portfolio-luc-baxmann.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(1500);
const video = await page.evaluate(() => {
  const v = document.querySelector('video');
  return v ? { seekable: v.seekable.length ? v.seekable.end(0) : 0, t: v.currentTime } : null;
});
await page.click('.sw-topcta');
await page.waitForTimeout(500);
const modalOpen = await page.evaluate(() => document.getElementById('contact-modal').classList.contains('is-open'));
await page.screenshot({ path: 'qa/prod-check.png' });
console.log(JSON.stringify({ video, modalOpen }));
await browser.close();
