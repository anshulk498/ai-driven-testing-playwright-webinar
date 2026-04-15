import { test, expect } from '@playwright/test';

test('SSO Historical Report Test', async ({ page }) => {
  test.setTimeout(120_000);

  // ── STEP 1: Navigate to SSO login page ──────────────────────────────────────
  console.log('\n══ STEP 1: Navigate to SSO ══');
  await page.goto('https://cert-comply.content.aws.lexis.com/sso');
  await page.waitForLoadState('networkidle');
  console.log('✓ SSO page loaded');

  // ── STEP 2: Developer Login ──────────────────────────────────────────────────
  console.log('\n══ STEP 2: Developer Login ══');
  await page.getByRole('button', { name: /Developer Login/i }).click();
  await page.waitForURL('**/content-center**', { timeout: 20_000 });
  await page.waitForLoadState('networkidle');
  console.log(`✓ Logged in – URL: ${page.url()}`);

  // ── STEP 3: Hover Report menu using the provided XPath ──────────────────────
  console.log('\n══ STEP 3: Hover Report menu ══');
  const reportMenu = page.locator(
    "xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']"
  );
  await reportMenu.waitFor({ state: 'visible', timeout: 15_000 });
  await reportMenu.hover();
  console.log('✓ Hovered over Report menu');
  await page.waitForTimeout(800);

  // ── STEP 4: Click "Historical Notes" sub-menu item ──────────────────────────
  console.log('\n══ STEP 4: Click Historical Notes ══');
  const historicalNotes = page.locator(
    "xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='Historical Notes']"
  );
  await historicalNotes.waitFor({ state: 'visible', timeout: 10_000 });
  await historicalNotes.click();
  console.log('✓ Clicked Historical Notes');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // ── STEP 5: Select Module → Aged Care ───────────────────────────────────────
  console.log('\n══ STEP 5: Select Module = Aged Care ══');
  await page.locator('input[placeholder="Select module"]').click();
  await page.waitForTimeout(800);
  await page
    .locator('.el-select-dropdown:visible li')
    .filter({ hasText: /Aged Care/i })
    .first()
    .click();
  console.log('✓ Module: Aged Care selected');
  await page.waitForTimeout(500);

  // ── STEP 6: Select From Date (22nd of current month) ────────────────────────
  console.log('\n══ STEP 6: Select From Date ══');
  await page.locator('input[placeholder="Select date"]').first().click();
  await page.waitForTimeout(1000);
  const dateCell = page
    .locator('.el-picker-panel:visible .el-date-table td')
    .filter({ hasText: /^22$/ })
    .first();
  if (await dateCell.count() > 0) {
    await dateCell.click();
    console.log('✓ Date 22 selected');
  } else {
    await page.locator('.el-picker-panel:visible .el-date-table td.available').first().click();
    console.log('✓ Fallback date selected');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ── STEP 7: Select Material Type ────────────────────────────────────────────
  // The dropdown renders as a tooltip popover with listitem values: "-", "material", "immaterial"
  console.log('\n══ STEP 7: Select Type = material ══');
  await page.locator('input[placeholder="Select type"]').click();
  await page.waitForTimeout(800);
  const materialItem = page.locator('li').filter({ hasText: /^material$/i }).first();
  await materialItem.waitFor({ state: 'visible', timeout: 10_000 });
  await materialItem.click();
  console.log('✓ Type: material selected');
  // Click elsewhere to dismiss any open dropdown/tooltip before GO
  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await page.waitForTimeout(600);

  // ── STEP 8: Click GO and wait for results ───────────────────────────────────
  console.log('\n══ STEP 8: Click GO ══');
  // The GO button text is inside a <span> child, match by accessible name with exact flag
  const goBtn = page.getByRole('button', { name: 'GO', exact: true });
  await goBtn.waitFor({ state: 'visible', timeout: 10_000 });
  await goBtn.click();
  console.log('✓ Clicked GO');
  // Wait for loading indicator to disappear
  await page
    .locator('.el-loading-mask')
    .waitFor({ state: 'hidden', timeout: 30_000 })
    .catch(() => {});
  await page.waitForTimeout(2000);
  console.log('✓ Results loaded');

  // ── STEP 9: Export if data exists (enabled) ─────────────────────────────────
  console.log('\n══ STEP 9: Export ══');
  const exportButton = page.getByRole('button', { name: /Export/i });
  const isExportEnabled = await exportButton.isEnabled().catch(() => false);
  if (isExportEnabled) {
    await exportButton.click();
    console.log('✓ Export clicked');
    await page.waitForTimeout(2000);
  } else {
    console.log('⚠ Export button disabled (no data returned) – test complete');
  }

  console.log('\n🎉 SSO Historical Report Test COMPLETED');
});
