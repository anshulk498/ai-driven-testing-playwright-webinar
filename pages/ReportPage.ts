import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReportPage extends BasePage {
  // ─── Locators ────────────────────────────────────────────────────────────────
  readonly reportMenuTrigger: Locator;
  readonly goBtn: Locator;
  readonly exportBtn: Locator;
  readonly loadingMask: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    super(page);
    this.reportMenuTrigger = page.locator("xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']");
    this.goBtn             = page.getByRole('button', { name: 'GO', exact: true });
    this.exportBtn         = page.getByRole('button', { name: 'Export', exact: true });
    this.loadingMask       = page.locator('.el-loading-mask');
    this.tableRows         = page.locator('tbody tr, .el-table__body tr');
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  async hoverReportMenu(): Promise<void> {
    await expect(this.reportMenuTrigger).toBeVisible({ timeout: 10_000 });
    await this.reportMenuTrigger.hover();
  }

  async clickReportMenuItem(itemName: string): Promise<void> {
    await this.findAndClick([
      () => this.page.locator(`xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='${itemName}']`),
      () => this.page.locator('.el-menu--popup .el-menu-item').filter({ hasText: new RegExp(`^${itemName}$`) }).first(),
      () => this.page.locator('li.el-menu-item').filter({ hasText: new RegExp(itemName, 'i') }).first(),
    ], `"${itemName}" menu item`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Navigate to a report by hovering Report menu then clicking item */
  async navigateToReport(reportName: string): Promise<void> {
    await this.navigateTo('https://cert-comply.content.aws.lexis.com/content-center');
    await this.hoverReportMenu();
    await this.clickReportMenuItem(reportName);
  }

  // ─── Filter Actions ───────────────────────────────────────────────────────────

  async selectType(optionText: string): Promise<void> {
    await this.selectDropdownOption([
      () => this.page.locator('input[placeholder="Select type"]'),
      () => this.page.locator('input[placeholder*="Type" i]').first(),
    ], optionText, 'Type');
  }

  async selectContentType(optionText: string): Promise<void> {
    await this.selectDropdownOption([
      () => this.page.locator('input[placeholder="Select content type"]'),
      () => this.page.locator('input[placeholder*="content type" i]').first(),
    ], optionText, 'Content Type');
    // Dismiss dropdown
    await this.page.locator('body').click({ position: { x: 10, y: 10 } });
  }

  async selectModule(moduleName: string): Promise<void> {
    await this.selectDropdownOption([
      () => this.page.locator('input[placeholder="Select module"]'),
      () => this.page.locator('input[placeholder*="module" i]').first(),
    ], moduleName, 'Module');
  }

  async selectMaterialType(optionText: string): Promise<void> {
    await this.selectDropdownOption([
      () => this.page.locator('input[placeholder="Select type"]'),
      () => this.page.locator('input[placeholder*="Type" i]').first(),
    ], optionText, 'Material Type');
    await this.page.locator('body').click({ position: { x: 10, y: 10 } });
  }

  /** Select the Nth date (by day number) in the calendar picker */
  async selectCalendarDate(day: number): Promise<void> {
    // Try gridcell role first (accessible), then td fallback with JS click
    const gridCell = this.page.getByRole('gridcell', { name: new RegExp(`^${day}$`) }).first();
    const hasGridCell = await gridCell.isVisible().catch(() => false);
    if (hasGridCell) {
      await gridCell.click();
    } else {
      // JS click as fallback for hidden-but-attached td
      await this.page.evaluate((dayNum) => {
        const cells = Array.from(document.querySelectorAll('.el-date-table td'));
        const target = cells.find(td => td.textContent?.trim() === String(dayNum));
        if (target) (target as HTMLElement).click();
      }, day);
    }
  }

  async clickGo(): Promise<void> {
    await this.findAndClick([
      () => this.goBtn,
      () => this.page.locator('button.el-button--primary').filter({ hasText: /^GO$/i }).first(),
      () => this.page.locator('button').filter({ hasText: /^Go$/i }).first(),
    ], 'GO button');
    await this.waitForLoader();
  }

  // ─── Export ───────────────────────────────────────────────────────────────────

  async isExportEnabled(): Promise<boolean> {
    await expect(this.exportBtn).toBeVisible({ timeout: 10_000 });
    return this.exportBtn.isEnabled();
  }

  async clickExportAndGetDownload(): Promise<string | null> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 60_000 }).catch(() => null);
    await this.exportBtn.click();
    const download = await downloadPromise;
    return download?.suggestedFilename() ?? null;
  }

  // ─── Assertions ─── (called from test, not here — these are convenience getters)

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  async hasTableData(): Promise<boolean> {
    const count = await this.getRowCount();
    return count > 0;
  }
}
