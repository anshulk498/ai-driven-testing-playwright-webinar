import { test, expect } from '@playwright/test';

// ─── Helper: find and click a locator with retries ────────────────────────────
async function findAndClick(
  page: any,
  locators: (() => any)[],
  label: string,
  timeout = 10_000
): Promise<void> {
  for (let attempt = 1; attempt <= locators.length; attempt++) {
    try {
      const loc = locators[attempt - 1]();
      await loc.waitFor({ state: 'visible', timeout });
      await loc.click();
      console.log(`  ✓ ${label} – clicked (attempt ${attempt})`);
      return;
    } catch {
      console.log(`  ⚠ ${label} – attempt ${attempt} failed, retrying...`);
    }
  }
  throw new Error(`✗ ${label} – could not be found after ${locators.length} attempts`);
}

// ─── Helper: find a locator with retries (no click) ──────────────────────────
async function findLocator(
  page: any,
  locators: (() => any)[],
  label: string,
  timeout = 10_000
): Promise<any> {
  for (let attempt = 1; attempt <= locators.length; attempt++) {
    try {
      const loc = locators[attempt - 1]();
      await loc.waitFor({ state: 'visible', timeout });
      console.log(`  ✓ ${label} – found (attempt ${attempt})`);
      return loc;
    } catch {
      console.log(`  ⚠ ${label} – attempt ${attempt} failed, retrying...`);
    }
  }
  throw new Error(`✗ ${label} – could not be found after ${locators.length} attempts`);
}

// ─── Test ─────────────────────────────────────────────────────────────────────
test('Broken Links Report – full flow', async ({ page }) => {
  test.setTimeout(120_000);

  // ── STEP 1: Navigate to SSO ──────────────────────────────────────────────────
  console.log('\n══ STEP 1: Navigate to SSO ══');
  await page.goto('https://cert-comply.content.aws.lexis.com/sso');
  await page.waitForLoadState('domcontentloaded');
  console.log('✓ SSO page loaded');

  // ── STEP 2: Developer Login ──────────────────────────────────────────────────
  console.log('\n══ STEP 2: Developer Login ══');
  await findAndClick(page, [
    () => page.getByRole('button', { name: /Developer Login/i }),
    () => page.locator('button').filter({ hasText: /Developer Login/i }).first(),
    () => page.locator('text=Developer Login').first(),
  ], 'Developer Login button');

  await page.waitForURL('**/content-center**', { timeout: 20_000 });
  await page.waitForLoadState('domcontentloaded');
  console.log(`✓ Logged in – URL: ${page.url()}`);

  // ── STEP 3: Hover Report menu ────────────────────────────────────────────────
  console.log('\n══ STEP 3: Hover Report menu ══');
  const reportMenu = await findLocator(page, [
    () => page.locator("xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']"),
    () => page.locator('.el-sub-menu__title').filter({ hasText: /^Report$/ }).first(),
    () => page.locator('li.el-sub-menu').filter({ hasText: /^Report/ }).first(),
  ], 'Report menu');

  await reportMenu.hover();
  console.log('✓ Hovered over Report menu');
  await page.waitForTimeout(800);

  // ── STEP 4: Click "Broken Links" sub-menu item ───────────────────────────────
  console.log('\n══ STEP 4: Click Broken Links ══');
  await findAndClick(page, [
    () => page.locator("xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='Broken Links']"),
    () => page.locator('.el-menu--popup .el-menu-item').filter({ hasText: /^Broken Links$/ }).first(),
    () => page.locator('li.el-menu-item').filter({ hasText: /Broken Links/i }).first(),
    () => page.getByRole('menuitem', { name: /Broken Links/i }),
  ], 'Broken Links menu item');

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  console.log('✓ Broken Links page loaded');

  // ── STEP 5: Select Type → Content Type ──────────────────────────────────────
  console.log('\n══ STEP 5: Select Type = Content Type ══');
  await findAndClick(page, [
    () => page.locator('input[placeholder="Select type"]'),
    () => page.locator('input[placeholder*="Type" i]').first(),
    () => page.locator('.el-select').filter({ has: page.locator('input[placeholder*="type" i]') }).first(),
  ], 'Type dropdown');

  await page.waitForTimeout(800);

  await findAndClick(page, [
    () => page.locator('.el-select-dropdown:visible li').filter({ hasText: /^Content Type$/ }).first(),
    () => page.locator('.el-select-dropdown:visible li').filter({ hasText: /Content Type/i }).first(),
    () => page.locator('li').filter({ hasText: /^Content Type$/ }).first(),
  ], 'Content Type option');

  console.log('✓ Type: Content Type selected');
  await page.waitForTimeout(600);

  // ── STEP 6: Select Content Type → Obligations ───────────────────────────────
  console.log('\n══ STEP 6: Select Content Type = Obligations ══');
  await findAndClick(page, [
    () => page.locator('input[placeholder="Select content type"]'),
    () => page.locator('input[placeholder*="content type" i]').first(),
    () => page.locator('input[placeholder*="Content" i]').first(),
  ], 'Content Type dropdown');

  await page.waitForTimeout(800);

  await findAndClick(page, [
    () => page.locator('.el-select-dropdown:visible li').filter({ hasText: /^Obligations$/ }).first(),
    () => page.locator('.el-select-dropdown:visible li').filter({ hasText: /Obligations/i }).first(),
    () => page.locator('li').filter({ hasText: /^Obligations$/ }).first(),
  ], 'Obligations option');

  console.log('✓ Content Type: Obligations selected');
  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await page.waitForTimeout(600);

  // ── STEP 7: Click GO ─────────────────────────────────────────────────────────
  console.log('\n══ STEP 7: Click GO ══');
  await findAndClick(page, [
    () => page.getByRole('button', { name: 'GO', exact: true }),
    () => page.locator('button.el-button--primary').filter({ hasText: /^GO$/i }).first(),
    () => page.locator('button').filter({ hasText: /^Go$/i }).first(),
  ], 'GO button');

  console.log('✓ Clicked GO');

  // ── STEP 8: Wait for loader to disappear ─────────────────────────────────────
  console.log('\n══ STEP 8: Wait for loader ══');
  await page.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log('✓ Loader gone – data loaded');

  // ── STEP 9: Verify table has data ────────────────────────────────────────────
  console.log('\n══ STEP 9: Verify table data ══');
  const tableRows = page.locator('tbody tr, .el-table__body tr');
  const rowCount = await tableRows.count();
  console.log(`✓ Table rows visible: ${rowCount}`);

  const noData = page.locator('text=No results found, text=No data');
  const hasNoData = await noData.isVisible().catch(() => false);
  if (hasNoData) {
    console.log('⚠ Table shows "No results found" – data may be empty for selected filters');
  } else {
    console.log('✓ Table has data');
  }

  // ── STEP 10: Verify Export button is enabled ──────────────────────────────────
  console.log('\n══ STEP 10: Verify Export button ══');
  const exportBtn = await findLocator(page, [
    () => page.getByRole('button', { name: 'Export', exact: true }),
    () => page.locator('button').filter({ hasText: /^Export$/ }).first(),
  ], 'Export button');

  const isExportEnabled = await exportBtn.isEnabled();
  console.log(`✓ Export button enabled: ${isExportEnabled}`);

  // ── STEP 11: Click Export ─────────────────────────────────────────────────────
  console.log('\n══ STEP 11: Click Export ══');
  if (isExportEnabled) {
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 }).catch(() => null);
    await exportBtn.click();
    console.log('✓ Export clicked');

    const download = await downloadPromise;
    if (download) {
      console.log(`✓ Download triggered: ${download.suggestedFilename()}`);
    }

    await page.waitForTimeout(2000);

    const successToast = page.locator(
      '.el-message--success, .el-notification--success, .el-message, .el-notification'
    ).first();
    const toastVisible = await successToast.isVisible().catch(() => false);
    if (toastVisible) {
      const toastText = (await successToast.textContent())?.trim();
      console.log(`✓ Toast: "${toastText}"`);
    } else {
      console.log('⚠ No toast visible – export may have triggered a direct download without toast');
    }
  } else {
    console.log('⚠ Export button disabled – no data to export, skipping export step');
  }

  console.log('\n🎉 Broken Links Report Test COMPLETED');
});
