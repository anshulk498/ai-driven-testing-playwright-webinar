import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToolPage extends BasePage {
  // ─── Form Locators ───────────────────────────────────────────────────────────
  readonly moduleInput: Locator;
  readonly topicInput: Locator;
  readonly obligationInput: Locator;
  readonly addBtn: Locator;
  readonly titleInput: Locator;
  readonly toolFunctionsInput: Locator;
  readonly categoryInput: Locator;
  readonly externalLinkInput: Locator;
  readonly jurisdictionTrigger: Locator;

  // ─── Action Buttons ──────────────────────────────────────────────────────────
  readonly createBtn: Locator;
  readonly editBtn: Locator;
  readonly saveDraftBtn: Locator;
  readonly startReviewBtn: Locator;
  readonly readyToPublishBtn: Locator;
  readonly publishBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.moduleInput        = page.locator('input[placeholder="Select module"]');
    this.topicInput         = page.locator('input[placeholder="Select topic"]');
    this.obligationInput    = page.locator('input[placeholder="Select obligation"]');
    this.addBtn             = page.getByRole('button', { name: /^Add$/i });
    this.titleInput         = page.locator('input[placeholder="Enter title"]');
    this.toolFunctionsInput = page.locator('input[placeholder="Select Tool Functions"]');
    this.categoryInput      = page.locator('input[placeholder="Select Category"]');
    this.externalLinkInput  = page.locator('input[placeholder="Enter external link"]');
    this.jurisdictionTrigger = page.locator('.el-select').filter({
      has: page.locator('input[placeholder*="Jurisdictions" i]'),
    }).first();

    this.createBtn         = page.getByRole('button', { name: /^Create$/i });
    this.editBtn           = page.getByRole('button', { name: /^Edit$/i });
    this.saveDraftBtn      = page.getByRole('button', { name: /^Save Draft$/i });
    this.startReviewBtn    = page.getByRole('button', { name: /Start Review/i });
    this.readyToPublishBtn = page.getByRole('button', { name: /Ready to Publish/i });
    this.publishBtn        = page.getByRole('button', { name: /^Publish$/i });
  }

  // ─── Form Actions ────────────────────────────────────────────────────────────

  async selectModule(moduleName: string): Promise<void> {
    // Click the .el-select wrapper (input is readonly, intercepted by component)
    const trigger = this.page.locator('.el-select').filter({ has: this.moduleInput }).first();
    await this.selectDropdownOption([() => trigger], moduleName, 'Module');
  }

  async selectTopic(topicName: string): Promise<void> {
    // Wait for topic input to be enabled (dependent on module selection)
    await expect(this.topicInput).toBeEnabled({ timeout: 15_000 });
    const trigger = this.page.locator('.el-select').filter({ has: this.topicInput }).first();
    await this.selectDropdownOption([() => trigger], topicName, 'Topic');
  }

  async selectObligation(): Promise<void> {
    // Wait for obligation input to be enabled (dependent on topic selection)
    await expect(this.obligationInput).toBeEnabled({ timeout: 15_000 });

    // Click the obligation input to open dropdown
    await this.obligationInput.click();

    // Wait for dropdown items to load (API call after topic selected)
    // Select by text "title 2" — same as original passing spec
    const targetOption = this.page.locator('.el-select-dropdown:visible li').filter({ hasText: /^title 2$/i }).first();
    const fallbackOption = this.page.locator('.el-select-dropdown:visible li').nth(1); // 2nd item = "title 2"

    await targetOption.waitFor({ state: 'visible', timeout: 20_000 }).catch(() => {});

    const isTargetVisible = await targetOption.isVisible().catch(() => false);
    if (isTargetVisible) {
      await targetOption.click({ force: true });
      console.log('  ✓ Obligation: "title 2"');
    } else {
      // Fallback: click nth(1) which corresponds to "title 2" in the list
      await fallbackOption.waitFor({ state: 'visible', timeout: 10_000 });
      const text = (await fallbackOption.textContent())?.trim() ?? '';
      await fallbackOption.click({ force: true });
      console.log(`  ✓ Obligation fallback: "${text}"`);
    }
  }

  async clickAdd(): Promise<void> {
    await expect(this.addBtn).toBeVisible({ timeout: 8_000 });
    await this.addBtn.click();
  }

  async enterTitle(title: string): Promise<void> {
    await this.fillWhenVisible(this.titleInput, title);
  }

  async selectToolFunctions(option: string): Promise<void> {
    await this.selectDropdownOption([() => this.toolFunctionsInput], option, 'Tool Functions');
  }

  async selectCategory(option: string): Promise<void> {
    await this.selectDropdownOption([() => this.categoryInput], option, 'Category');
  }

  async fillExternalLink(url: string): Promise<void> {
    await this.fillWhenVisible(this.externalLinkInput, url);
  }

  async selectJurisdictions(indices: number[]): Promise<void> {
    await this.jurisdictionTrigger.click();
    for (const idx of indices) {
      const item = this.page.locator('.el-select-dropdown:visible ul > div > div').nth(idx).locator('span').first();
      await expect(item).toBeVisible({ timeout: 8_000 });
      await item.click();
    }
    await this.page.keyboard.press('Escape');
  }

  async clickCreate(): Promise<string> {
    const toastPromise = this.getToastText(15_000);
    // Use multi-fallback same as working spec
    await this.findAndClick([
      () => this.page.locator('[data-v-f9001f20] .el-button--primary').filter({ hasText: /^Create$/i }).first(),
      () => this.page.getByRole('button', { name: /^Create$/i }),
      () => this.page.locator('button.el-button--primary').filter({ hasText: /^Create$/i }).first(),
      () => this.page.locator('button').filter({ hasText: /^Create$/ }).last(),
    ], 'Create submit');
    await this.page.waitForLoadState('domcontentloaded');
    await toastPromise;
    return toastPromise;
  }

  /** Extract the tool ID — waits for a 5+ digit number to appear in the body or URL */
  async extractToolId(): Promise<string> {
    // First check URL
    const urlMatch = this.page.url().match(/\/(\d{4,})/);
    if (urlMatch) return urlMatch[1];

    // Wait for page body to contain an ID using the same patterns as the original spec
    await this.page.waitForFunction(() => {
      const body = document.body.textContent ?? '';
      return /ID[:\s]+\d+/i.test(body)
        || /Tool ID[:\s]+\d+/i.test(body)
        || /#\d{5,}/.test(body)
        || /\b\d{7,}\b/.test(body);
    }, { timeout: 15_000 });

    const body = (await this.page.locator('body').textContent()) ?? '';
    for (const pat of [/ID[:\s]+(\d+)/i, /Tool ID[:\s]+(\d+)/i, /#(\d{5,})/, /\b(\d{7,})\b/]) {
      const m = body.match(pat);
      if (m) { console.log(`  ✓ Tool ID from body: "${m[1]}"`); return m[1]; }
    }
    throw new Error(`Could not extract tool ID. URL: ${this.page.url()}`);
  }

  // ─── Workflow Buttons ────────────────────────────────────────────────────────

  async clickEdit(): Promise<void> {
    await this.clickWhenVisible(this.editBtn);
  }

  async clickSaveDraft(): Promise<string> {
    const toastPromise = this.getToastText(15_000);
    await this.clickWhenVisible(this.saveDraftBtn);
    return toastPromise;
  }

  async clickStartReview(): Promise<string> {
    const toastPromise = this.getToastText(20_000);
    await this.clickWhenVisible(this.startReviewBtn);
    await this.findAndClick([
      () => this.page.locator('.el-dialog__footer button').filter({ hasText: /Move to Review/i }),
      () => this.page.locator('.el-message-box__btns button').filter({ hasText: /Move to Review/i }),
      () => this.page.locator('button').filter({ hasText: /Move to Review/i }),
    ], 'Move to Review button');
    return toastPromise;
  }

  async clickReadyToPublish(): Promise<string> {
    const toastPromise = this.getToastText(20_000);
    await this.clickWhenVisible(this.readyToPublishBtn);
    await this.findAndClick([
      () => this.page.locator('.el-dialog__footer button').filter({ hasText: /Yes.*Mark as Ready/i }),
      () => this.page.locator('button').filter({ hasText: /Mark as Ready/i }),
    ], 'Yes, Mark as Ready button');
    return toastPromise;
  }

  async clickPublish(): Promise<string> {
    const toastPromise = this.getToastText(20_000);
    await this.clickWhenVisible(this.publishBtn);
    await this.findAndClick([
      () => this.page.locator('.el-dialog__footer button').filter({ hasText: /Yes.*Publish/i }),
      () => this.page.locator('button').filter({ hasText: /Yes.*Publish/i }),
    ], 'Yes Publish button');
    return toastPromise;
  }

  async clickBackArrow(): Promise<void> {
    await this.findAndClick([
      () => this.page.locator('[class*="back-icon"]').first(),
      () => this.page.locator('[class*="back"]').first(),
      () => this.page.locator('a[class*="back"]').first(),
    ], 'Back arrow');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickLogoHome(): Promise<void> {
    await this.findAndClick([
      () => this.page.locator('a').filter({ has: this.page.locator('img') }).first(),
      () => this.page.locator('.logo img').first(),
      () => this.page.locator('header img').first(),
      () => this.page.locator('img').first(),
    ], 'Logo / Home link');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
