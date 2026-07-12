import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8123/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
await page.screenshot({ path: 'qa/center-hero.png' });
await page.evaluate(() => window.scrollTo(0, innerHeight * 2.1)); // mid scene 2
await page.waitForTimeout(1600);
await page.screenshot({ path: 'qa/center-scene2.png' });
await browser.close();
