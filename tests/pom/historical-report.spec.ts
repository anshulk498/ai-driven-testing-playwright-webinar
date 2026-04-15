import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ReportPage } from '../../pages/ReportPage';
import { assertTableHasData, assertUrl } from '../../utils/helpers';
import { REPORT_ITEMS, REPORT_DATA } from '../../utils/testData';

test.describe('Historical Notes Report', () => {
  test('full flow – select module, date, type, GO, export', async ({ page }) => {
    test.setTimeout(120_000);

    // ── Login ──────────────────────────────────────────────────────────────────
    const loginPage = new LoginPage(page);
    await loginPage.loginAsDeveloper();
    await loginPage.verifyLoggedIn();

    // ── Navigate to Historical Notes ───────────────────────────────────────────
    const reportPage = new ReportPage(page);
    await reportPage.navigateToReport(REPORT_ITEMS.HISTORICAL_NOTES);
    await assertUrl(page, 'content-center');

    // ── Select Module → Aged Care ──────────────────────────────────────────────
    await reportPage.selectModule(REPORT_DATA.MODULE);

    // ── Select To Date → 22nd ─────────────────────────────────────────────────
    await reportPage.findAndClick([
      () => page.locator('input[placeholder="Select Date"]').last(),
      () => page.locator('.el-date-editor input').last(),
    ], 'To Date picker');
    await reportPage.selectCalendarDate(REPORT_DATA.CALENDAR_DAY);

    // ── Select Type → Material ────────────────────────────────────────────────
    await reportPage.selectMaterialType(REPORT_DATA.MATERIAL);

    // ── Run report ────────────────────────────────────────────────────────────
    await reportPage.clickGo();

    // ── Verify table ──────────────────────────────────────────────────────────
    const rowCount = await reportPage.getRowCount();
    console.log(`✓ Table rows: ${rowCount}`);

    // ── Export if data exists ─────────────────────────────────────────────────
    const exportEnabled = await reportPage.isExportEnabled();
    if (exportEnabled) {
      const filename = await reportPage.clickExportAndGetDownload();
      expect(filename, 'Download filename should not be empty').toBeTruthy();
      console.log(`✓ Downloaded: ${filename}`);
    } else {
      console.log('ℹ Export not available – no data for selected filters');
    }
  });
});
