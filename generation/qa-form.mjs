import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8123/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.click('.sw-topcta');
await page.waitForTimeout(500);
await page.screenshot({ path: 'qa/form-open.png' });
await page.fill('#cm-name', 'Test E2E');
await page.fill('#cm-email', 'test-e2e@example.com');
await page.fill('#cm-company', 'QA Corp');
await page.selectOption('#cm-type', 'AI automation');
await page.fill('#cm-message', 'Automated end-to-end test of the contact pipeline. Safe to delete.');
await page.click('.cm-submit');
await page.waitForTimeout(4000);
await page.screenshot({ path: 'qa/form-submitted.png' });
const state = await page.evaluate(() => ({
  successVisible: getComputedStyle(document.querySelector('.cm-success')).display !== 'none',
  errorText: document.querySelector('.cm-status').textContent,
}));
console.log(JSON.stringify(state));
await browser.close();
