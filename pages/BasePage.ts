import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Wait for element to be visible ─────────────────────────────────────────
  async waitForVisible(locator: Locator, timeout = 15_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  // ─── Wait for element to be hidden ──────────────────────────────────────────
  async waitForHidden(locator: Locator, timeout = 30_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  // ─── Click with visibility check ────────────────────────────────────────────
  async clickWhenVisible(locator: Locator, timeout = 15_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await locator.click();
  }

  // ─── Fill input with visibility check ───────────────────────────────────────
  async fillWhenVisible(locator: Locator, value: string, timeout = 15_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  // ─── Multi-fallback click (tries each locator in order) ─────────────────────
  async findAndClick(locators: (() => Locator)[], label: string, timeout = 10_000): Promise<void> {
    let round = 1;
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      for (const locatorFn of locators) {
        try {
          const loc = locatorFn();
          await loc.waitFor({ state: 'visible', timeout: 3_000 });
          await loc.click();
          console.log(`  ✓ ${label} (locator ${locators.indexOf(locatorFn) + 1}, round ${round})`);
          return;
        } catch { /* try next */ }
      }
      round++;
    }
    throw new Error(`✗ ${label} – not found within ${timeout / 1000}s`);
  }

  // ─── Multi-fallback find (no click) ─────────────────────────────────────────
  async findLocator(locators: (() => Locator)[], label: string, timeout = 10_000): Promise<Locator> {
    let round = 1;
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      for (const locatorFn of locators) {
        try {
          const loc = locatorFn();
          await loc.waitFor({ state: 'visible', timeout: 3_000 });
          console.log(`  ✓ ${label} found (locator ${locators.indexOf(locatorFn) + 1}, round ${round})`);
          return loc;
        } catch { /* try next */ }
      }
      round++;
    }
    throw new Error(`✗ ${label} – not found within ${timeout / 1000}s`);
  }

  // ─── Select dropdown option ──────────────────────────────────────────────────
  async selectDropdownOption(
    triggerLocators: (() => Locator)[],
    optionText: string,
    label: string
  ): Promise<void> {
    await this.findAndClick(triggerLocators, `${label} trigger`);
    await this.findAndClick([
      () => this.page.locator('.el-select-dropdown:visible li').filter({ hasText: new RegExp(`^${optionText}$`) }).first(),
      () => this.page.locator('.el-select-dropdown:visible li').filter({ hasText: new RegExp(optionText, 'i') }).first(),
      () => this.page.locator('li').filter({ hasText: new RegExp(`^${optionText}$`) }).first(),
    ], `${label} option "${optionText}"`);
  }

  // ─── Wait for loading mask to disappear ─────────────────────────────────────
  async waitForLoader(timeout = 30_000): Promise<void> {
    await this.page.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  // ─── Get toast message text ──────────────────────────────────────────────────
  async getToastText(timeout = 10_000): Promise<string> {
    const toast = this.page.locator('.el-message--success, .el-notification--success, .el-message').first();
    await toast.waitFor({ state: 'visible', timeout }).catch(() => {});
    return (await toast.textContent().catch(() => ''))?.trim() ?? '';
  }

  // ─── Navigate and wait for domcontentloaded ──────────────────────────────────
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
