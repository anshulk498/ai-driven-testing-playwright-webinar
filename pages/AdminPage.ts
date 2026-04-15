import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  // ─── Admin Menu ──────────────────────────────────────────────────────────────
  readonly adminMenuTrigger: Locator;

  constructor(page: Page) {
    super(page);
    this.adminMenuTrigger = page.locator("xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Admin']");
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async hoverAdminMenu(): Promise<void> {
    await expect(this.adminMenuTrigger).toBeVisible({ timeout: 10_000 });
    await this.adminMenuTrigger.hover();
  }

  async clickAdminMenuItem(itemName: string): Promise<void> {
    await this.findAndClick([
      () => this.page.locator(`xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='${itemName}']`),
      () => this.page.locator('.el-menu--popup .el-menu-item').filter({ hasText: new RegExp(`^${itemName}$`) }).first(),
      () => this.page.locator('li.el-menu-item').filter({ hasText: new RegExp(itemName, 'i') }).first(),
    ], `Admin menu item "${itemName}"`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToAdminPage(pageName: string): Promise<void> {
    await this.hoverAdminMenu();
    await this.clickAdminMenuItem(pageName);
  }

  // ─── Record Unlock ───────────────────────────────────────────────────────────

  async clickObligationsTab(): Promise<void> {
    await this.findAndClick([
      () => this.page.getByRole('tab', { name: /^Obligations$/i }),
      () => this.page.locator('.el-tabs__item').filter({ hasText: /^Obligations$/ }).first(),
    ], 'Obligations tab');
    await this.waitForLoader();
  }

  async clickFirstUnlockButton(): Promise<void> {
    const firstRow = this.page.locator('tbody tr, .el-table__body tr').first();
    await expect(firstRow).toBeVisible({ timeout: 15_000 });
    const unlockBtn = firstRow.getByRole('button', { name: /Unlock/i });
    await expect(unlockBtn).toBeVisible({ timeout: 10_000 });
    await unlockBtn.click();
  }

  async confirmUnlock(): Promise<string> {
    await this.findAndClick([
      () => this.page.getByRole('button', { name: /Yes.*Unlock/i }),
      () => this.page.locator('.el-dialog button').filter({ hasText: /Yes.*Unlock/i }),
      () => this.page.locator('.el-message-box__btns button').filter({ hasText: /Yes.*Unlock/i }),
    ], 'Yes, Unlock button');
    // Toast may be brief — capture text or fall back to empty string
    const toast = this.page.locator('.el-message--success, .el-notification--success, .el-message').first();
    await toast.waitFor({ state: 'visible', timeout: 8_000 }).catch(() => {});
    return (await toast.textContent().catch(() => ''))?.trim() ?? '';
  }

  async getTableRowCount(): Promise<number> {
    return this.page.locator('tbody tr, .el-table__body tr').count();
  }
}
