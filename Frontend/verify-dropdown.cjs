const { chromium } = require('playwright-core');
(async () => {
  const execPath = '/home/k3rnyx/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
  const browser = await chromium.launch({ executablePath: execPath });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/', { waitUntil: 'networkidle' });
  console.log('1. Home abierto:', page.url());
  
  const destinosLink = page.locator('nav a', { hasText: 'Destinos' }).first();
  await destinosLink.click();
  await page.waitForTimeout(500);
  console.log('2. Click en Destinos -> URL:', page.url());
  
  // 3. Verificar dropdown SIN hover (solo después del click)
  const dropdown = page.locator('nav .group .absolute').first();
  const visibleAfterClick = await dropdown.isVisible().catch(() => false);
  console.log('3. Dropdown visible DESPUÉS del click (sin hover):', visibleAfterClick);
  
  // 4. Hover y verificar que aparece
  await page.locator('nav a', { hasText: 'Destinos' }).first().hover();
  await page.waitForTimeout(400);
  const visibleAfterHover = await page.locator('nav .group .absolute').first().isVisible().catch(() => false);
  console.log('4. Dropdown visible DESPUÉS de hover:', visibleAfterHover);
  
  // 5. Click en un tour para navegar y verificar que dropdown cierra
  const firstTour = page.locator('nav a[href*="/destinos/tour/"]').first();
  if (await firstTour.count() > 0) {
    await firstTour.click();
    await page.waitForTimeout(500);
    console.log('5. Click en tour -> URL:', page.url());
  }
  
  await browser.close();
})().catch(e => { console.error('ERROR', e); process.exit(1); });
