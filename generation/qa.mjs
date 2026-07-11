// QA: seam continuity + scrub sanity, Chromium & WebKit.
// Usage: node qa.mjs <browser> <outdir>
import { chromium, webkit } from 'playwright';

const [, , browserName = 'chromium', outdir = 'qa'] = process.argv;
const engine = browserName === 'webkit' ? webkit : chromium;

const browser = await engine.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8123/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// Section widths in vh units (must mirror index.html config).
const widths = [1.5, 1.5, 1.5, 1.5, 1.5, 1.7];
const vh = 900;
const bounds = [];
let acc = 0;
for (const w of widths) { acc += w; bounds.push(acc * vh); }

async function settle(y) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(1400); // let the lerp + seek settle
}

// Seam screenshots: just before / just after each boundary.
for (let i = 0; i < 5; i++) {
  await settle(bounds[i] - 40);
  await page.screenshot({ path: `${outdir}/${browserName}-seam${i + 1}-before.png` });
  await settle(bounds[i] + 40);
  await page.screenshot({ path: `${outdir}/${browserName}-seam${i + 1}-after.png` });
}

// Scrub sanity on scene 1.
await settle(0.3 * vh);
const a = await page.evaluate(() => {
  const v = document.querySelector('video');
  return v ? { seekable: v.seekable.length ? v.seekable.end(0) : 0, t: v.currentTime } : null;
});
await settle(0.9 * vh);
const b = await page.evaluate(() => {
  const v = document.querySelector('video');
  return v ? { t: v.currentTime } : null;
});
console.log(JSON.stringify({ browser: browserName, seekableEnd: a?.seekable, t1: a?.t, t2: b?.t, tracks: !!(a && b && b.t > a.t + 0.5) }));

// Hero landing shot.
await settle(0);
await page.screenshot({ path: `${outdir}/${browserName}-hero.png` });
await browser.close();
