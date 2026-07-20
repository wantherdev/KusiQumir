import { chromium } from 'playwright-core';
const exe = '/home/k3rnyx/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
page.setDefaultTimeout(15000);

await page.goto('http://localhost:4200/admin/tours', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
let url = page.url();
console.log('URL after load:', url);
if (!url.includes('/admin/tours')) {
  await page.fill('input[type=email]', 'admin@kusiqumir.com').catch(()=>{});
  await page.fill('input[type=password]', 'admin123').catch(()=>{});
  await page.click('button[type=submit]').catch(()=>{});
  await page.waitForTimeout(2500);
  console.log('URL after login:', page.url());
}

await page.getByText('Nuevo tour', { exact: true }).click().catch(e => errors.push('nuevo: '+e.message));
await page.waitForTimeout(1500);

await page.fill('input[formcontrolname="title"]', 'Tour Playwright Test').catch(e=>errors.push('title: '+e.message));
await page.fill('textarea[formcontrolname="shortDescription"]', 'desc corta').catch(e=>errors.push('short: '+e.message));
await page.fill('textarea[formcontrolname="description"]', 'desc larga').catch(e=>errors.push('desc2: '+e.message));

const catInput = page.locator('input[placeholder="Buscar categoría…"]');
await catInput.fill('Aventura').catch(e=>errors.push('catfill: '+e.message));
await page.waitForTimeout(800);
await page.getByText('Aventura', { exact: true }).first().click({ force: true }).catch(e=>errors.push('catselect: '+e.message));
await page.waitForTimeout(600);
const catVal = await page.evaluate(() => {
  const el = document.querySelector('input[formcontrolname="categoryId"]');
  return el ? JSON.stringify(el.value) : 'TAG-MODE';
});
console.log('Category value:', catVal);

await page.getByRole('button', { name: /Crear tour|Guardando/ }).click().catch(e=>errors.push('submit: '+e.message));
await page.waitForTimeout(3500);
console.log('URL after submit:', page.url());
console.log('--- ERRORS ---');
console.log(errors.join('\n') || 'none');
await browser.close();
