import { test, expect } from '@playwright/test';
import { ReportPage } from '../pages/ReportPage';
import { assertTableHasData, assertUrl } from '../utils/helpers';
import { REPORT_ITEMS, REPORT_DATA } from '../test-data/testData';

test.describe('Broken Links Report', () => {
  test('full flow – select filters, GO, export', async ({ page }) => {
    test.setTimeout(120_000);

    // ── Login ──────────────────────────────────────────────────────────────────

    // ── Navigate to Broken Links ───────────────────────────────────────────────
    const reportPage = new ReportPage(page);
    await reportPage.navigateToReport(REPORT_ITEMS.BROKEN_LINKS);
    await assertUrl(page, 'content-center');

    // ── Select filters ─────────────────────────────────────────────────────────
    await reportPage.selectType(REPORT_DATA.TYPE);
    await reportPage.selectContentType(REPORT_DATA.CONTENT_TYPE);

    // ── Run report ─────────────────────────────────────────────────────────────
    await reportPage.clickGo();

    // ── Verify table has data ──────────────────────────────────────────────────
    const rowCount = await assertTableHasData(page);
    console.log(`✓ Table rows: ${rowCount}`);

    // ── Verify Export is enabled ───────────────────────────────────────────────
    const exportEnabled = await reportPage.isExportEnabled();
    expect(exportEnabled, 'Export button should be enabled').toBe(true);

    // ── Click Export and verify download ──────────────────────────────────────
    const filename = await reportPage.clickExportAndGetDownload();
    expect(filename, 'Download filename should not be empty').toBeTruthy();
    console.log(`✓ Downloaded: ${filename}`);
  });
});
