import { chromium, FullConfig } from '@playwright/test';
import { URLS } from './test-data/testData';

const SSO_EMAIL    = 'kamboja1@legal.regn.net';
const SSO_PASSWORD = 'LexisFeb@192026';

/**
 * Global setup: performs SSO login once and saves storageState to auth.json.
 * All tests reuse this authenticated session via { storageState: 'auth.json' }.
 */
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // ── Step 1: Go to SSO page ────────────────────────────────────────────────
  await page.goto(URLS.SSO);
  await page.waitForLoadState('domcontentloaded');

  // ── Step 2: Click "Log in with SSO" button ────────────────────────────────
  await page.getByRole('button', { name: /log in with sso/i }).click();
  await page.waitForLoadState('domcontentloaded');

  // ── Step 3: Enter email ───────────────────────────────────────────────────
  const emailInput = page.locator('input[type="email"], input[name="email"], input[name="loginfmt"], input[placeholder*="email" i]').first();
  await emailInput.waitFor({ state: 'visible', timeout: 15_000 });
  await emailInput.fill(SSO_EMAIL);

  // Submit email (Next button or Enter)
  const nextBtn = page.getByRole('button', { name: /next|continue|submit/i }).first();
  const hasNext = await nextBtn.isVisible().catch(() => false);
  if (hasNext) {
    await nextBtn.click();
  } else {
    await emailInput.press('Enter');
  }
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // ── Step 4: Enter password ────────────────────────────────────────────────
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
  await passwordInput.fill(SSO_PASSWORD);

  // Submit password
  const signInBtn = page.getByRole('button', { name: /sign in|log in|submit/i }).first();
  const hasSignIn = await signInBtn.isVisible().catch(() => false);
  if (hasSignIn) {
    await signInBtn.click();
  } else {
    await passwordInput.press('Enter');
  }

  // ── Step 5: Wait for redirect to content-center ───────────────────────────
  await page.waitForURL('**/content-center**', { timeout: 60_000 });
  await page.waitForLoadState('domcontentloaded');

  // ── Step 6: Save authenticated session ───────────────────────────────────
  await page.context().storageState({ path: 'auth.json' });
  console.log('✓ SSO login successful — auth state saved to auth.json');

  await browser.close();
}

export default globalSetup;
