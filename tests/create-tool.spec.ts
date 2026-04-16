import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ToolPage } from '../pages/ToolPage';
import { assertUrl } from '../utils/helpers';
import { URLS, TOOL_DATA } from '../test-data/testData';

test.describe('Create Tool', () => {
  test('full workflow – create, edit, review, publish, verify live status', async ({ page }) => {
    test.setTimeout(300_000);

    // ── Login ──────────────────────────────────────────────────────────────────

    // ── Open Tools tab and click Create → new tab ──────────────────────────────
    await page.goto('https://cert-comply.content.aws.lexis.com/content-center', { waitUntil: 'domcontentloaded' });
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

    // ── Navigate directly to tool details by ID ──────────────────────────────
    await toolTab.goto(`https://cert-comply.content.aws.lexis.com/content-center/toolDetails/${toolId}`, { waitUntil: 'domcontentloaded' });
    await expect(toolTab).toHaveURL(/toolDetails/, { timeout: 15_000 });

    // ── Edit → Save Draft → Start Review → Ready to Publish → Publish ─────────
    await toolPage.clickEdit();
    await toolPage.clickSaveDraft();

    await toolPage.clickStartReview();
    await toolPage.clickReadyToPublish();
    await toolPage.clickPublish();

    // ── Click Logo → Tools tab → verify the new tool row shows "live" status ─────
    await toolPage.clickLogoHome();
    await expect(toolTab).toHaveURL(/content-center/, { timeout: 15_000 });
    const dashboard2 = new DashboardPage(toolTab);
    await dashboard2.clickToolsTab();
    // Search for the tool by ID using the Tools tabpanel search input
    const toolsPanel = toolTab.getByRole('tabpanel', { name: 'Tools' });
    await toolsPanel.locator('input[placeholder="Search.."]').fill(toolId);
    await toolTab.waitForTimeout(2000);
    const toolRow = toolTab.getByRole('row').filter({ hasText: toolId });
    await expect(toolRow).toContainText('live', { timeout: 20_000 });
    console.log(`✓ Tool "${toolId}" status is live`);
  });
});
