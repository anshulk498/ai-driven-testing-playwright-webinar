import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // ─── Tab Locators ────────────────────────────────────────────────────────────
  readonly obligationsTab: Locator;
  readonly alertsTab: Locator;
  readonly toolsTab: Locator;

  // ─── Create Button / Menu ────────────────────────────────────────────────────
  readonly createBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.obligationsTab = page.getByRole('tab', { name: /^Obligations$/i });
    this.alertsTab      = page.getByRole('tab', { name: /^Alerts$/i });
    this.toolsTab       = page.getByRole('tab', { name: /^Tools$/i });
    this.createBtn      = page.getByRole('button', { name: /^Create$/i });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async clickObligationsTab(): Promise<void> {
    await expect(this.obligationsTab).toBeVisible({ timeout: 10_000 });
    await this.obligationsTab.click();
    await this.waitForLoader();
  }

  async clickAlertsTab(): Promise<void> {
    await expect(this.alertsTab).toBeVisible({ timeout: 10_000 });
    await this.alertsTab.click();
    await this.waitForLoader();
  }

  async clickToolsTab(): Promise<void> {
    await expect(this.toolsTab).toBeVisible({ timeout: 10_000 });
    await this.toolsTab.click();
    await this.waitForLoader();
  }

  /** Click Create and return new tab (Page) */
  async clickCreateAndGetNewTab(): Promise<Page> {
    const newTabPromise = this.page.context().waitForEvent('page');
    await expect(this.createBtn).toBeVisible({ timeout: 10_000 });
    await this.createBtn.click();
    const newTab = await newTabPromise;
    await newTab.waitForLoadState('domcontentloaded');
    return newTab;
  }

  /** Hover Create button and click a submenu item (e.g. "Subobligation") */
  async clickCreateSubmenuItem(itemText: string): Promise<Page> {
    const newTabPromise = this.page.context().waitForEvent('page');
    await this.createBtn.hover();
    await this.findAndClick([
      () => this.page.locator('.el-dropdown-menu:visible li').filter({ hasText: new RegExp(`^${itemText}$`, 'i') }).first(),
      () => this.page.locator('li').filter({ hasText: new RegExp(`^${itemText}$`, 'i') }).first(),
    ], `Create submenu "${itemText}"`);
    const newTab = await newTabPromise;
    await newTab.waitForLoadState('domcontentloaded');
    return newTab;
  }

  /** Export the currently active tab's data. Returns download filename. */
  async clickExport(): Promise<string | null> {
    const exportBtn = await this.findLocator([
      () => this.page.getByRole('button', { name: 'Export', exact: true }),
      () => this.page.locator('button').filter({ hasText: /^Export$/ }).first(),
    ], 'Export button');
    await expect(exportBtn).toBeEnabled({ timeout: 10_000 });
    const downloadPromise = this.page.waitForEvent('download', { timeout: 60_000 }).catch(() => null);
    await exportBtn.click();
    const download = await downloadPromise;
    return download?.suggestedFilename() ?? null;
  }

  /** Search by ID in the Tools/Obligations table using the column search icon */
  async searchById(id: string): Promise<void> {
    await this.findAndClick([
      () => this.page.locator('[data-v-f9001f20].table-header .el-icon.search-icon').first(),
      () => this.page.locator('[data-v-f9001f20] .table-header .el-icon.search-icon').first(),
      () => this.page.locator('.el-icon.search-icon').nth(2),
    ], 'ID search icon');
    const filterInput = this.page.locator('input[placeholder="Search by ID"]').last();
    await expect(filterInput).toBeVisible({ timeout: 8_000 });
    await filterInput.fill(id);
    await filterInput.press('Tab');
    await this.page.keyboard.press('Enter');
    await this.waitForLoader(15_000);
  }
}
