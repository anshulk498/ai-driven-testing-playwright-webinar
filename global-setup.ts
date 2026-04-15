import { chromium, FullConfig } from '@playwright/test';
import { URLS } from './utils/testData';

/**
 * Global setup: performs one Developer Login and saves storageState to auth.json.
 * All tests that use { storageState: 'auth.json' } will reuse this session.
 */
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(URLS.SSO);
  await page.waitForLoadState('domcontentloaded');

  await page.getByRole('button', { name: /Developer Login/i }).click();
  await page.waitForURL('**/content-center**', { timeout: 20_000 });
  await page.waitForLoadState('domcontentloaded');

  // Save authenticated state
  await page.context().storageState({ path: 'auth.json' });
  console.log('✓ Auth state saved to auth.json');

  await browser.close();
}

export default globalSetup;
