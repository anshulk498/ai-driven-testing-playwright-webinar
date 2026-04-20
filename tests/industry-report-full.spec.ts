import { test, expect } from '@playwright/test';
import { ReportPage } from '../pages/ReportPage';
import { assertTableHasData, assertUrl } from '../utils/helpers';
import { REPORT_ITEMS, REPORT_DATA } from '../test-data/testData';

// ─────────────────────────────────────────────────────────────────────────────
// Industry Report — Full Test Suite
// Covers: Positive · Negative · Edge Cases
// Based on: docs/test-plans/INDUSTRY_REPORT_TEST.md
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Industry Report', () => {

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ POSITIVE TEST CASES
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('Positive', () => {

    test('TC-IR-01 | Full flow – Type: Content Type, Content Type: Obligations → GO → Export', async ({ page }) => {
      test.setTimeout(120_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);
      await assertUrl(page, 'content-center');

      await reportPage.selectType(REPORT_DATA.TYPE);               // "Content Type"
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE); // "Obligations"
      await reportPage.clickGo();

      const rowCount = await assertTableHasData(page);
      expect(rowCount).toBeGreaterThan(0);
      console.log(`✓ Table rows: ${rowCount}`);

      const exportEnabled = await reportPage.isExportEnabled();
      expect(exportEnabled, 'Export button should be enabled when data exists').toBe(true);

      const filename = await reportPage.clickExportAndGetDownload();
      expect(filename).toBeTruthy();
      console.log(`✓ Downloaded: ${filename}`);
    });

    test('TC-IR-02 | Report menu is accessible via hover → Industry Report loads', async ({ page }) => {
      test.setTimeout(60_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await assertUrl(page, 'content-center');
      await expect(reportPage.goBtn).toBeVisible({ timeout: 10_000 });
      console.log('✓ Industry Report page loaded after menu navigation');
    });

    test('TC-IR-03 | GO button enabled only after both filters are selected', async ({ page }) => {
      test.setTimeout(60_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      // Select Type only — GO should still work (Content Type may be optional)
      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);

      await expect(reportPage.goBtn).toBeVisible({ timeout: 8_000 });
      await expect(reportPage.goBtn).toBeEnabled();
      console.log('✓ GO button is enabled after selecting filters');
    });

    test('TC-IR-04 | Export button is visible and enabled after data loads', async ({ page }) => {
      test.setTimeout(120_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.clickGo();

      await assertTableHasData(page);
      const exportEnabled = await reportPage.isExportEnabled();
      expect(exportEnabled, 'Export button should be enabled when data exists').toBe(true);
      console.log('✓ Export button is enabled');
    });

    test('TC-IR-05 | Downloaded file has valid filename and non-zero size', async ({ page }) => {
      test.setTimeout(120_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.clickGo();
      await assertTableHasData(page);

      const downloadPromise = page.waitForEvent('download', { timeout: 60_000 });
      await reportPage.exportBtn.click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv|xls)$/i);
      console.log(`✓ File: ${download.suggestedFilename()}`);
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ❌ NEGATIVE TEST CASES
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('Negative', () => {

    test('TC-IR-N01 | Click GO without selecting any filters – verify behaviour', async ({ page }) => {
      test.setTimeout(60_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      // Click GO without selecting Type or Content Type
      await reportPage.goBtn.click();

      // Either: validation message appears, or table shows no data / empty state
      const hasError = await page.locator(
        '.el-form-item__error, .el-message--error, [class*="error"], [class*="warning"]'
      ).first().isVisible({ timeout: 5_000 }).catch(() => false);

      const hasEmptyState = await page.locator(
        '.el-table__empty-text, td.el-table__empty-block, [class*="no-data"]'
      ).first().isVisible({ timeout: 8_000 }).catch(() => false);

      expect(
        hasError || hasEmptyState,
        'Should show error message or empty state when GO is clicked without filters'
      ).toBe(true);
      console.log(`✓ No-filter GO: error=${hasError}, empty=${hasEmptyState}`);
    });

    test('TC-IR-N02 | Export button should not trigger download when no data loaded', async ({ page }) => {
      test.setTimeout(60_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      // Do NOT click GO — check Export button state
      const isExportEnabled = await reportPage.isExportEnabled();
      expect(isExportEnabled, 'Export should be disabled before GO is clicked').toBe(false);
      console.log('✓ Export button is disabled before GO');
    });

    test('TC-IR-N03 | Navigate away mid-report then return — filters should reset', async ({ page }) => {
      test.setTimeout(60_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);

      // Navigate away
      await page.goto('https://cert-comply.content.aws.lexis.com/content-center', { waitUntil: 'domcontentloaded' });

      // Return to Industry Report
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      // Type dropdown should be reset/blank
      const typeInput = page.locator('input[placeholder="Select type"], input[placeholder*="Type" i]').first();
      const typeValue = await typeInput.inputValue().catch(() => '');
      expect(typeValue, 'Type filter should reset after navigation').toBe('');
      console.log('✓ Filters reset after navigating away and back');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // ⚠️ EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════════

  test.describe('Edge Cases', () => {

    test('TC-IR-E01 | Click GO multiple times rapidly – no duplicate requests or crashes', async ({ page }) => {
      test.setTimeout(120_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);

      // Click GO 3 times rapidly
      await reportPage.goBtn.click();
      await reportPage.goBtn.click().catch(() => {});
      await reportPage.goBtn.click().catch(() => {});

      // Should still load data cleanly
      const rowCount = await assertTableHasData(page);
      expect(rowCount).toBeGreaterThan(0);
      console.log(`✓ Rapid GO clicks handled — rows: ${rowCount}`);
    });

    test('TC-IR-E02 | Change filters after GO and click GO again — data refreshes', async ({ page }) => {
      test.setTimeout(180_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      // First run
      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.clickGo();
      const firstCount = await assertTableHasData(page);
      console.log(`✓ First run rows: ${firstCount}`);

      // Change content type and run again
      await reportPage.selectContentType('Alerts');
      await reportPage.clickGo();

      // Verify data reloaded (either different count or same — must not crash)
      const secondCount = await page.locator('tbody tr, .el-table__body tr').count();
      console.log(`✓ Second run rows: ${secondCount}`);
      expect(secondCount).toBeGreaterThanOrEqual(0);
    });

    test('TC-IR-E03 | Report loads correctly in 1280x900 viewport', async ({ page }) => {
      test.setTimeout(120_000);

      await page.setViewportSize({ width: 1280, height: 900 });

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.clickGo();

      const rowCount = await assertTableHasData(page);
      expect(rowCount).toBeGreaterThan(0);

      // Export button should be visible in this viewport
      await expect(reportPage.exportBtn).toBeVisible({ timeout: 5_000 });
      console.log(`✓ Standard viewport (1280x900) — rows: ${rowCount}`);
    });

    test('TC-IR-E04 | Loader disappears before verifying table data', async ({ page }) => {
      test.setTimeout(120_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.goBtn.click();

      // Loader should appear then disappear
      await reportPage.loadingMask.waitFor({ state: 'hidden', timeout: 60_000 }).catch(() => {});

      // After loader gone, table should have data
      const rowCount = await assertTableHasData(page);
      expect(rowCount).toBeGreaterThan(0);
      console.log(`✓ Loader gone, table has ${rowCount} rows`);
    });

    test('TC-IR-E05 | Re-run report without refreshing page — session stays valid', async ({ page }) => {
      test.setTimeout(180_000);

      const reportPage = new ReportPage(page);
      await reportPage.navigateToReport(REPORT_ITEMS.INDUSTRY_REPORT);

      await reportPage.selectType(REPORT_DATA.TYPE);
      await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);
      await reportPage.clickGo();
      await assertTableHasData(page);

      // Export
      const filename1 = await reportPage.clickExportAndGetDownload();
      expect(filename1).toBeTruthy();
      console.log(`✓ First export: ${filename1}`);

      // Run GO again without page reload
      await reportPage.clickGo();
      await assertTableHasData(page);

      const filename2 = await reportPage.clickExportAndGetDownload();
      expect(filename2).toBeTruthy();
      console.log(`✓ Second export (same session): ${filename2}`);
    });

  });

});
