/**
 * Test Helpers
 * Common utilities for test files
 */

import { Page, expect } from '@playwright/test';

/**
 * Login helper for Developer Login
 */
export async function performDeveloperLogin(page: Page): Promise<void> {
  console.log('Performing Developer Login...');
  
  await page.goto('https://cert-comply.content.aws.lexis.com/sso');
  await page.waitForLoadState('networkidle');
  
  const devLoginButton = page.locator('button:has-text("Developer Login")');
  await devLoginButton.click();
  await page.waitForTimeout(2000);
  
  // Verify redirect
  await page.waitForURL('**/content-center**', { timeout: 10000 });
  console.log('✓ Logged in successfully');
}

/**
 * Wait for toast message and return its content
 */
export async function waitForToast(
  page: Page,
  timeout: number = 5000
): Promise<string> {
  const toast = page.locator('.el-message, .el-notification, [class*="toast"]');
  await toast.waitFor({ state: 'visible', timeout });
  const message = await toast.textContent() || '';
  console.log(`Toast: ${message}`);
  return message;
}

/**
 * Fill Element UI select dropdown
 */
export async function fillElSelect(
  page: Page,
  placeholder: string,
  value: string
): Promise<void> {
  const selectInput = page.locator(`input[placeholder="${placeholder}"]`);
  await selectInput.click();
  await page.waitForTimeout(1000);
  
  const option = page.locator(`.el-select-dropdown__item:has-text("${value}")`);
  await option.click();
  await page.waitForTimeout(500);
}

/**
 * Fill date input field
 */
export async function fillDateInput(
  page: Page,
  placeholder: string,
  date: string
): Promise<void> {
  const dateInput = page.locator(`input[placeholder*="${placeholder}" i]`);
  await dateInput.click();
  await page.waitForTimeout(500);
  await page.keyboard.type(date);
  await page.waitForTimeout(500);
}

/**
 * Handle new tab/window opening
 */
export async function handleNewTab(
  page: Page,
  triggerAction: () => Promise<void>
): Promise<Page> {
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    triggerAction()
  ]);
  
  await newPage.waitForLoadState('networkidle');
  return newPage;
}

/**
 * Check if element exists without throwing
 */
export async function elementExists(
  page: Page,
  selector: string
): Promise<boolean> {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Safe click with retry
 */
export async function safeClick(
  page: Page,
  selector: string,
  maxRetries: number = 3
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.locator(selector).click({ timeout: 5000 });
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Wait for file download
 */
export async function waitForDownload(
  page: Page,
  triggerAction: () => Promise<void>
): Promise<{ fileName: string; path: string }> {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30000 }),
    triggerAction()
  ]);
  
  const fileName = download.suggestedFilename();
  const filePath = `test-results/${fileName}`;
  await download.saveAs(filePath);
  
  return { fileName, path: filePath };
}

/**
 * Generate unique test identifier
 */
export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}`;
}

/**
 * Verify page title contains text
 */
export async function verifyPageTitle(
  page: Page,
  expectedText: string
): Promise<void> {
  const title = await page.title();
  expect(title).toContain(expectedText);
  console.log(`✓ Page title verified: ${title}`);
}
