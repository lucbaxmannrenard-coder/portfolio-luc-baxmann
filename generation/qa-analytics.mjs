import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
const hits = [];
page.on('request', r => { if (r.url().includes('/_vercel/insights')) hits.push(r.url().split('?')[0]); });
await page.goto('https://portfolio-luc-baxmann.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
console.log(JSON.stringify(hits));
await browser.close();
