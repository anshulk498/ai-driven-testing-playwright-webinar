import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../test-data/testData';

export class LoginPage extends BasePage {
  // ─── Locators ────────────────────────────────────────────────────────────────
  readonly developerLoginBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.developerLoginBtn = page.getByRole('button', { name: /Developer Login/i });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Navigate to SSO and perform Developer Login. Waits for content-center redirect. */
  async loginAsDeveloper(): Promise<void> {
    await this.navigateTo(URLS.SSO);
    await expect(this.developerLoginBtn).toBeVisible({ timeout: 15_000 });
    await this.developerLoginBtn.click();
    await this.page.waitForURL('**/content-center**', { timeout: 20_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Verify user is on content-center after login */
  async verifyLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/content-center/, { timeout: 15_000 });
  }
}
