import { chromium } from 'playwright';
const targets = [
  ['cemax', 'https://cemax-store.com'],
  ['canaria', 'https://canaria.provence-epi.com'],
  ['biodatabank', 'https://siteweb-wheat.vercel.app'],
  ['hydra-store', 'https://hydra-store-casque-sans-fil-bluetoo.vercel.app'],
  ['portfolio', 'https://portfolio-luc-baxmann.vercel.app'],
];
const browser = await chromium.launch();
for (const [name, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `../site/assets/work/${name}.jpg`, type: 'jpeg', quality: 82 });
    console.log(name + ' ok — title: ' + (await page.title()));
  } catch (e) { console.log(name + ' FAIL: ' + e.message.split('\n')[0]); }
  await page.close();
}
await browser.close();
