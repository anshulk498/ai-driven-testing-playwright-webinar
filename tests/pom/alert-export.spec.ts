import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Alert Export', () => {
  test('login → alerts tab → export → verify download', async ({ page }) => {
    test.setTimeout(120_000);

    // ── Login ──────────────────────────────────────────────────────────────────
    const loginPage = new LoginPage(page);
    await loginPage.loginAsDeveloper();
    await loginPage.verifyLoggedIn();

    // ── Click Alerts tab ───────────────────────────────────────────────────────
    const dashboard = new DashboardPage(page);
    await dashboard.clickAlertsTab();

    // ── Export ─────────────────────────────────────────────────────────────────
    const filename = await dashboard.clickExport();
    expect(filename, 'Export download should have a filename').toBeTruthy();
    console.log(`✓ Downloaded: ${filename}`);
  });
});
