import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
// Capture the FormSubmit AJAX response to see activation status
let fsResponse = null;
page.on('response', async (r) => {
  if (r.url().includes('formsubmit.co')) {
    try { fsResponse = { status: r.status(), body: await r.text() }; } catch (e) {}
  }
});
await page.goto('https://portfolio-luc-baxmann.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.click('.sw-topcta');
await page.waitForTimeout(400);
await page.fill('#cm-name', 'Test activation');
await page.fill('#cm-email', 'luc.baxmannrenard@gmail.com');
await page.fill('#cm-message', 'Test de la notification email — si tu recois ce mail sur ta boite KEDGE, le pipeline marche.');
await page.click('.cm-submit');
await page.waitForTimeout(5000);
const success = await page.evaluate(() => getComputedStyle(document.querySelector('.cm-success')).display !== 'none');
console.log(JSON.stringify({ success, formsubmit: fsResponse }, null, 2));
await browser.close();
