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
    // Scroll the table into view so the header is accessible
    await this.page.evaluate(() => {
      const table = document.querySelector('.el-table');
      if (table) table.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await this.page.waitForTimeout(300);
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

  /**
   * Click the Status column filter icon, select "ready to publish" checkbox, click Submit.
   */
  async applyStatusFilter(): Promise<void> {
    // Scope to the visible tabpanel's table to avoid picking a duplicate hidden th
    const activePanel = this.page.locator('[role="tabpanel"]:visible, [role="tabpanel"][aria-hidden="false"]').last();
    const statusHeader = activePanel.locator('th').filter({ hasText: /^status$/i }).first();
    await statusHeader.waitFor({ state: 'attached', timeout: 10_000 });
    await statusHeader.hover({ force: true });
    await this.page.waitForTimeout(600);

    await this.findAndClick([
      () => statusHeader.locator('img').first(),
      () => activePanel.locator('[role="columnheader"]').filter({ hasText: /status/i }).locator('img').first(),
      () => activePanel.locator('.el-table__header th').filter({ hasText: /status/i }).locator('img, i, svg').first(),
    ], 'Status filter icon', 10_000);
    await this.page.waitForTimeout(400);
    console.log('  ✓ Status filter icon clicked');

    // Wait for tooltip/popover to appear
    const tooltip = this.page.locator('[role="tooltip"]:visible').last();
    await tooltip.waitFor({ state: 'visible', timeout: 8_000 });
    await this.page.waitForTimeout(300);
    console.log('  ✓ Status filter popover opened');

    // Click the "ready to publish" label (Element UI hides the actual input — click the wrapper label)
    const readyToPublishLabel = tooltip.locator('.el-checkbox').filter({ hasText: /ready to publish/i }).first();
    await readyToPublishLabel.waitFor({ state: 'attached', timeout: 8_000 });
    await readyToPublishLabel.click();
    console.log('  ✓ Selected "ready to publish"');

    // Click Submit
    await this.findAndClick([
      () => tooltip.getByRole('button', { name: /submit/i }),
      () => tooltip.locator('button').filter({ hasText: /submit/i }).first(),
    ], 'Status filter Submit', 8_000);

    await this.waitForLoader(15_000);
    console.log('  ✓ Status filter submitted');
  }

  /**
   * Hover the Export icon to reveal the dropdown, then click "Export (Columns)".
   * In the popup: uncheck Select All, check ID + Title, click Export.
   * Waits for and returns the success toast text.
   */
  async exportColumns(toastExpected: string): Promise<void> {
    // Try direct "Export (Columns)" button first (Alerts tab has it directly)
    // If not found, hover the Export button to open dropdown (Obligations tab)
    const directBtn = this.page.getByRole('button', { name: /export.*columns/i });
    const hasDirect = await directBtn.isVisible().catch(() => false);

    if (hasDirect) {
      await directBtn.click();
      console.log('  ✓ Clicked Export (Columns) button directly');
    } else {
      // Hover/click the Export button to reveal dropdown
      const exportTrigger = await this.findLocator([
        () => this.page.getByRole('button', { name: /^export$/i }),
        () => this.page.locator('button').filter({ hasText: /^export$/i }).first(),
      ], 'Export button', 15_000);
      await exportTrigger.hover();
      await this.page.waitForTimeout(400);

      const hasDropdown = await this.page.locator('.el-dropdown-menu:visible li').count();
      if (hasDropdown === 0) {
        await exportTrigger.click();
        await this.page.waitForTimeout(400);
      }

      await this.findAndClick([
        () => this.page.locator('.el-dropdown-menu:visible li').filter({ hasText: /export.*columns/i }).first(),
        () => this.page.locator('li').filter({ hasText: /export.*columns/i }).first(),
        () => this.page.getByRole('button', { name: /export.*columns/i }),
      ], 'Export (Columns) option', 10_000);
    }

    // Wait for the popup/dialog
    await this.page.locator('.el-dialog, .el-popover').first().waitFor({ state: 'visible', timeout: 10_000 });
    console.log('  ✓ Export Columns popup opened');

    // Uncheck "Select All"
    const selectAll = this.page.locator('.el-checkbox').filter({ hasText: /select all/i }).first();
    const isChecked = await selectAll.locator('.el-checkbox__input').evaluate(
      (el) => el.classList.contains('is-checked')
    ).catch(() => true);
    if (isChecked) {
      await selectAll.click();
      console.log('  ✓ Unchecked Select All');
    }

    // Select ID checkbox
    await this.page.locator('.el-checkbox').filter({ hasText: /^id$/i }).first().click();
    console.log('  ✓ Checked ID');

    // Select Title checkbox
    await this.page.locator('.el-checkbox').filter({ hasText: /^title$/i }).first().click();
    console.log('  ✓ Checked Title');

    // Click Export button inside popup
    await this.findAndClick([
      () => this.page.locator('.el-dialog__footer .el-button--primary').filter({ hasText: /^export$/i }).first(),
      () => this.page.locator('.el-dialog__footer button').filter({ hasText: /export/i }).first(),
      () => this.page.getByRole('button', { name: /^export$/i }).last(),
    ], 'Export submit button', 10_000);

    // Wait for success toast
    const toast = this.page.locator('[role="alert"], .el-message--success, .el-notification--success, .el-message').first();
    await toast.waitFor({ state: 'visible', timeout: 30_000 });
    const toastText = (await toast.textContent())?.trim() ?? '';
    expect(toastText).toContain(toastExpected);
    console.log(`  ✓ Toast verified: "${toastText}"`);
  }

  /** Search by ID in the active tab's table */
  async searchById(id: string): Promise<void> {
    // Tools tab has a direct search input inside the tabpanel
    const activePanel = this.page.locator('[role="tabpanel"]:visible').last();
    const directInput = activePanel.locator('input[placeholder="Search.."], input[placeholder*="Search" i]').first();
    const hasDirect = await directInput.isVisible().catch(() => false);

    if (hasDirect) {
      // Use JS to set value and dispatch input event (triggers Vue reactivity)
      await directInput.evaluate((el, val) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeInputValueSetter?.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }, id);
      await this.page.waitForTimeout(800);
      await this.waitForLoader(15_000);
    } else {
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
    }
    await this.waitForLoader(15_000);
  }
}
