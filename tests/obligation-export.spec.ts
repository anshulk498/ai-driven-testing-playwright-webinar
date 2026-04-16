import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Obligation Export', () => {
  test('login → obligations tab → status filter → export columns → verify toast', async ({ page }) => {
    test.setTimeout(180_000);

    // ── Step 1-3: Login ────────────────────────────────────────────────────────

    await page.goto('https://cert-comply.content.aws.lexis.com/content-center', { waitUntil: 'domcontentloaded' });
        const dashboard = new DashboardPage(page);

    // ── (Obligations tab is default, wait for table to load) ───────────────────
    await dashboard.clickObligationsTab();
    console.log('✓ Step 3: Obligations tab loaded');

    // ── Step 4: Status filter ── select "ready to publish" and submit ──────────────
    await dashboard.applyStatusFilter();
    console.log('✓ Step 4: Status filter applied — ready to publish');

    // ── Step 5-7: Hover Export → Export (Columns) → uncheck All → ID + Title → Export
    // ── Step 8: Verify toast ───────────────────────────────────────────────────
    await dashboard.exportColumns('Obligations columns exported successfully');
    console.log('✓ Steps 5-8: Export Columns completed and toast verified');
  });
});
