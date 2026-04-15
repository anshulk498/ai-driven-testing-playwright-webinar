import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Alerts Export Test', () => {
  test('should export alerts successfully', async ({ page }) => {
    test.setTimeout(120_000);

    // ── STEP 1: Navigate to SSO ──────────────────────────────────────────────
    console.log('\n══ STEP 1: Navigate to SSO ══');
    await page.goto('https://cert-comply.content.aws.lexis.com/sso');
    await page.waitForLoadState('networkidle');
    console.log('✓ SSO page loaded');

    // ── STEP 2: Developer Login ──────────────────────────────────────────────
    console.log('\n══ STEP 2: Developer Login ══');
    await page.getByRole('button', { name: /Developer Login/i }).click();
    await page.waitForURL('**/content-center**', { timeout: 20_000 });
    await page.waitForLoadState('networkidle');
    console.log(`✓ Logged in – URL: ${page.url()}`);

    // ── STEP 3: Click Alerts tab ─────────────────────────────────────────────
    console.log('\n══ STEP 3: Click Alerts tab ══');
    const alertsTab = page.getByRole('tab', { name: 'Alerts' });
    await alertsTab.waitFor({ state: 'visible', timeout: 10_000 });
    await alertsTab.click();
    await page.waitForTimeout(2000);
    console.log('✓ Alerts tab active');

    // ── STEP 4: Wait for Export button to be enabled ─────────────────────────
    console.log('\n══ STEP 4: Wait for Export button ══');
    // The Export button accessible name is "Export" — use getByRole
    const exportBtn = page.getByRole('button', { name: 'Export', exact: true });
    await exportBtn.waitFor({ state: 'visible', timeout: 15_000 });
    const isEnabled = await exportBtn.isEnabled();
    console.log(`✓ Export button visible, enabled: ${isEnabled}`);

    // ── STEP 5: Download exported file ──────────────────────────────────────
    console.log('\n══ STEP 5: Click Export and download file ══');

    // Set up download listener BEFORE clicking to avoid race condition
    const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
    await exportBtn.click();
    const download = await downloadPromise;

    const suggestedName = download.suggestedFilename() || 'alerts.xlsx';
    console.log(`✓ Download triggered: ${suggestedName}`);

    const resultDir = path.join(
      'c:\\Users\\kamboja1\\Downloads\\ai-driven-testing-playwright-webinar - Copy',
      'test-results'
    );
    fs.mkdirSync(resultDir, { recursive: true });
    const filePath = path.join(resultDir, suggestedName);
    await download.saveAs(filePath);
    console.log(`✓ File saved: ${filePath}`);

    // ── STEP 6: Verify file ──────────────────────────────────────────────────
    console.log('\n══ STEP 6: Verify downloaded file ══');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBeTruthy();

    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);

    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✓ File validated: ${fileSizeKB} KB`);
    console.log('\n🎉 Alerts Export Test COMPLETED');
  });
});
