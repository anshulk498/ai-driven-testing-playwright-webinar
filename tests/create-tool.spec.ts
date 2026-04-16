import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ToolPage } from '../pages/ToolPage';
import { assertUrl } from '../utils/helpers';
import { URLS, TOOL_DATA } from '../test-data/testData';

test.describe('Create Tool', () => {
  test('full workflow – create, edit, review, publish, verify live status', async ({ page }) => {
    test.setTimeout(300_000);

    // ── Login ──────────────────────────────────────────────────────────────────
    const loginPage = new LoginPage(page);
    await loginPage.loginAsDeveloper();
    await loginPage.verifyLoggedIn();

    // ── Open Tools tab and click Create → new tab ──────────────────────────────
    const dashboard = new DashboardPage(page);
    await dashboard.clickToolsTab();
    const toolTab = await dashboard.clickCreateAndGetNewTab();
    await expect(toolTab).toHaveURL(/toolCreation/, { timeout: 15_000 });

    // ── Fill toolCreation form ─────────────────────────────────────────────────
    const toolPage = new ToolPage(toolTab);
    const title = TOOL_DATA.title();

    await toolPage.selectModule(TOOL_DATA.MODULE);
    await toolPage.selectTopic(TOOL_DATA.TOPIC);
    await toolPage.selectObligation();
    await toolPage.clickAdd();
    await toolPage.enterTitle(title);
    await toolPage.selectToolFunctions(TOOL_DATA.TOOL_FUNCTIONS);
    await toolPage.selectCategory(TOOL_DATA.CATEGORY);
    await toolPage.fillExternalLink(TOOL_DATA.EXTERNAL_LINK);
    await toolPage.selectJurisdictions(TOOL_DATA.JURISDICTION_INDICES as unknown as number[]);

    // ── Submit creation ────────────────────────────────────────────────────────
    await toolPage.clickCreate();
    const toolId = await toolPage.extractToolId();
    console.log(`✓ Tool ID: ${toolId}`);
    expect(toolId).toMatch(/\d{6,}/);

    // ── Navigate back to content-center and search ────────────────────────────
    await toolPage.clickLogoHome();
    await expect(toolTab).toHaveURL(/content-center/, { timeout: 15_000 });

    const toolDashboard = new DashboardPage(toolTab);
    await toolDashboard.clickToolsTab();
    await toolDashboard.searchById(toolId);

    const idCell = toolTab.locator('td').filter({ hasText: toolId }).first();
    await expect(idCell).toBeVisible({ timeout: 15_000 });

    // ── Click title to open tool details ──────────────────────────────────────
    await toolTab.locator('tbody tr').filter({ hasText: toolId }).first().locator('td').nth(2).click();
    await expect(toolTab).toHaveURL(/toolDetails/, { timeout: 15_000 });

    // ── Edit → Save Draft → Start Review → Ready to Publish → Publish ─────────
    await toolPage.clickEdit();
    await toolPage.clickSaveDraft();

    await toolPage.clickStartReview();
    await toolPage.clickReadyToPublish();
    await toolPage.clickPublish();

    // ── Navigate back and verify status is "live" ─────────────────────────────
    await toolPage.clickBackArrow();
    await expect(toolTab).toHaveURL(/content-center/, { timeout: 15_000 });

    await toolDashboard.clickToolsTab();
    await toolDashboard.searchById(toolId);

    const liveStatus = toolTab.locator('tbody tr')
      .filter({ hasText: toolId }).first()
      .locator('td').filter({ hasText: /^live$/i });
    await expect(liveStatus).toBeVisible({ timeout: 15_000 });
    console.log(`✓ Tool "${toolId}" status is live`);
  });
});
