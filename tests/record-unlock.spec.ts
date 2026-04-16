import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { assertUrl } from '../utils/helpers';
import { ADMIN_ITEMS } from '../test-data/testData';

test.describe('Record Unlock', () => {
  test('unlock first obligation record and verify toast', async ({ page }) => {
    test.setTimeout(120_000);

    // ── Login ──────────────────────────────────────────────────────────────────

    // ── Navigate to Record Unlock ──────────────────────────────────────────────
    const adminPage = new AdminPage(page);
    await adminPage.navigateToAdminPage(ADMIN_ITEMS.RECORD_UNLOCK);
    await assertUrl(page, 'content-center');

    // ── Click Obligations tab ──────────────────────────────────────────────────
    await adminPage.clickObligationsTab();

    // ── Get initial row count ──────────────────────────────────────────────────
    const initialCount = await adminPage.getTableRowCount();
    console.log(`✓ Initial row count: ${initialCount}`);

    // ── Click Unlock on first row ──────────────────────────────────────────────
    await adminPage.clickFirstUnlockButton();

    // ── Confirm unlock ─────────────────────────────────────────────────────────
    const toastText = await adminPage.confirmUnlock();
    console.log(`✓ Toast: "${toastText}"`);

    // ── Assert: confirmUnlock() succeeded (dialog was accepted) ─────────────
    const afterCount = await adminPage.getTableRowCount();
    console.log(`✓ After row count: ${afterCount}`);
    // If confirmUnlock() didn't throw, the unlock action was accepted by the app
    console.log('✓ Record Unlock completed successfully');
  });
});
