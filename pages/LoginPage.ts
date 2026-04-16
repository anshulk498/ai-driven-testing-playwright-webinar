import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URLS } from '../test-data/testData';

const SSO_EMAIL    = 'kamboja1@legal.regn.net';
const SSO_PASSWORD = 'LexisFeb@192026';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Full SSO login flow: SSO page → Log in with SSO → email → password → content-center */
  async loginAsDeveloper(): Promise<void> {
    await this.navigateTo(URLS.SSO);

    // Click "Log in with SSO"
    await this.page.getByRole('button', { name: /log in with sso/i }).click();
    await this.page.waitForLoadState('domcontentloaded');

    // Enter email
    const emailInput = this.page.locator('input[type="email"], input[name="email"], input[name="loginfmt"], input[placeholder*="email" i]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 15_000 });
    await emailInput.fill(SSO_EMAIL);

    const nextBtn = this.page.getByRole('button', { name: /next|continue|submit/i }).first();
    const hasNext = await nextBtn.isVisible().catch(() => false);
    if (hasNext) {
      await nextBtn.click();
    } else {
      await emailInput.press('Enter');
    }
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    // Enter password
    const passwordInput = this.page.locator('input[type="password"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
    await passwordInput.fill(SSO_PASSWORD);

    const signInBtn = this.page.getByRole('button', { name: /sign in|log in|submit/i }).first();
    const hasSignIn = await signInBtn.isVisible().catch(() => false);
    if (hasSignIn) {
      await signInBtn.click();
    } else {
      await passwordInput.press('Enter');
    }

    await this.page.waitForURL('**/content-center**', { timeout: 60_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/content-center/, { timeout: 15_000 });
  }
}
