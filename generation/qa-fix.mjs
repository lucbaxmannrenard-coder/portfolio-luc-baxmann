import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8123/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'qa/fix-hero.png' });
// end of contact section (CTA fully held)
const end = await page.evaluate(() => document.body.scrollHeight - innerHeight);
await page.evaluate(v => window.scrollTo(0, v), end);
await page.waitForTimeout(1600);
await page.screenshot({ path: 'qa/fix-contact.png' });
await browser.close();
