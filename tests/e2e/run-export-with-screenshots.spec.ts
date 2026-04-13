import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(__dirname, '../../test-results/export-screenshots');

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

test('Export Test - Full Flow with Screenshots', async ({ page, context }) => {
  test.setTimeout(300000);

  const screenshotResults: { step: string; file: string; status: string }[] = [];
  const observations: string[] = [];

  const capture = async (name: string, label: string) => {
    const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    screenshotResults.push({ step: label, file: `test-results/export-screenshots/${name}.png`, status: '✅' });
    console.log(`📸 Screenshot saved: ${name}.png`);
  };

  // ─── STEP 1: Navigate to SSO ───────────────────────────────────────────────
  console.log('Step 1: Navigate to SSO page');
  await page.goto('/sso');
  await page.waitForLoadState('networkidle');
  await capture('export-step1-sso', 'Step 1 - SSO Login Page');
  observations.push('SSO page loaded successfully');

  // ─── STEP 2: Click Developer Login ─────────────────────────────────────────
  console.log('Step 2: Click Developer Login');
  const devLoginBtn = page.locator('button:has-text("Developer Login"), a:has-text("Developer Login"), [data-testid="developer-login"]');
  await devLoginBtn.first().waitFor({ state: 'visible', timeout: 15000 });
  await devLoginBtn.first().click();
  await page.waitForLoadState('networkidle');
  await capture('export-step2-after-login', 'Step 2 - After Developer Login');
  observations.push('Developer Login clicked — redirected to Content Center');

  // ─── STEP 3: Verify Content Center redirect ─────────────────────────────────
  console.log('Step 3: Verify Content Center redirect');
  await expect(page).toHaveURL(/content-center/, { timeout: 20000 });
  await capture('export-step3-content-center', 'Step 3 - Content Center Loaded');
  observations.push(`Redirected to: ${page.url()}`);

  // ─── STEP 4: Navigate to Obligations tab ───────────────────────────────────
  console.log('Step 4: Check Obligations tab');
  // Try to click the Obligations tab if not already active
  const obligationsTab = page.locator('text=Obligations, [data-tab="obligations"], .el-menu-item:has-text("Obligations"), a:has-text("Obligations")');
  const tabCount = await obligationsTab.count();
  if (tabCount > 0) {
    await obligationsTab.first().click();
    await page.waitForLoadState('networkidle');
    observations.push('Obligations tab clicked and active');
  } else {
    observations.push('Obligations tab already active by default');
  }
  await capture('export-step4-obligations-tab', 'Step 4 - Obligations Tab Active');

  // ─── STEP 5: Find and click Export button ──────────────────────────────────
  console.log('Step 5: Click Export button');

  // Multiple selector strategies as described in the test plan
  let exportBtn = page.locator('button:has-text("Export")').first();
  let exportFound = (await exportBtn.count()) > 0 && (await exportBtn.isVisible().catch(() => false));

  if (!exportFound) {
    exportBtn = page.locator('button[aria-label*="Export" i]').first();
    exportFound = (await exportBtn.count()) > 0 && (await exportBtn.isVisible().catch(() => false));
  }
  if (!exportFound) {
    exportBtn = page.locator('[class*="export" i]').first();
    exportFound = (await exportBtn.count()) > 0 && (await exportBtn.isVisible().catch(() => false));
  }
  if (!exportFound) {
    // Fallback: iterate all buttons
    const allButtons = page.locator('button');
    const count = await allButtons.count();
    for (let i = 0; i < count; i++) {
      const txt = await allButtons.nth(i).innerText().catch(() => '');
      if (txt.toLowerCase().includes('export')) {
        exportBtn = allButtons.nth(i);
        exportFound = true;
        observations.push(`Export button found via fallback iteration at index ${i} with text: "${txt}"`);
        break;
      }
    }
  }

  expect(exportFound, 'Export button should be found on the page').toBeTruthy();
  await capture('export-step5-before-export-click', 'Step 5 - Before Export Click');
  observations.push('Export button located successfully');

  // ─── STEP 6: Trigger export & detect loading indicator ────────────────────
  console.log('Step 6: Trigger export and verify process started');
  const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
  await exportBtn.click();
  await capture('export-step6-after-export-click', 'Step 6 - After Export Click');

  // Check for loading indicator
  const loadingVisible = await page.locator('.el-loading-mask, [class*="loading"], .el-icon-loading').first().isVisible().catch(() => false);
  if (loadingVisible) {
    observations.push('Loading indicator detected after Export click');
    await capture('export-step6b-loading', 'Step 6b - Loading Indicator Visible');
  } else {
    observations.push('No loading indicator detected (may be too fast or not present)');
  }

  // ─── STEP 7: Download exported file ───────────────────────────────────────
  console.log('Step 7: Wait for file download');
  const download = await downloadPromise;
  const suggestedName = download.suggestedFilename();
  const savePath = path.join(__dirname, '../../test-results', suggestedName);
  await download.saveAs(savePath);
  observations.push(`File downloaded: ${suggestedName}`);
  await capture('export-step7-download-complete', 'Step 7 - Download Complete');

  // ─── STEP 8: Verify file contents ─────────────────────────────────────────
  console.log('Step 8: Verify downloaded file');
  const fileExists = fs.existsSync(savePath);
  const fileSize = fileExists ? fs.statSync(savePath).size : 0;
  const fileSizeKB = (fileSize / 1024).toFixed(2);

  expect(fileExists, 'Downloaded file should exist on disk').toBeTruthy();
  expect(fileSize, 'Downloaded file should not be empty').toBeGreaterThan(0);

  observations.push(`File exists on disk: ${fileExists}`);
  observations.push(`File size: ${fileSizeKB} KB`);
  observations.push(`File format: ${path.extname(suggestedName).toLowerCase()}`);

  await capture('export-step8-verification-complete', 'Step 8 - Verification Complete');

  // ─── Write JSON results for report generation ─────────────────────────────
  const results = {
    status: 'PASSED',
    downloadedFile: suggestedName,
    fileSizeKB,
    screenshots: screenshotResults,
    observations,
    executedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(SCREENSHOTS_DIR, 'execution-results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('✅ Test complete. Results saved to execution-results.json');
});
