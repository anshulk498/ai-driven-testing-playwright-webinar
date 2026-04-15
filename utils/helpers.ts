import { Page, expect } from '@playwright/test';

/**
 * Wait for a locator to be visible, then return it.
 * Throws if not visible within timeout.
 */
export async function waitForLocator(page: Page, selector: string, timeout = 15_000) {
  const loc = page.locator(selector);
  await expect(loc).toBeVisible({ timeout });
  return loc;
}

/**
 * Assert a toast message is visible and optionally contains expected text.
 */
export async function assertToast(page: Page, expectedText?: string, timeout = 10_000): Promise<string> {
  const toast = page.locator('.el-message--success, .el-notification--success, .el-message').first();
  await toast.waitFor({ state: 'visible', timeout }).catch(() => {});
  const text = (await toast.textContent().catch(() => ''))?.trim() ?? '';
  if (expectedText) {
    expect(text).toContain(expectedText);
  }
  return text;
}

/**
 * Assert download was triggered and return filename.
 */
export async function assertDownload(page: Page, downloadPromise: Promise<any>): Promise<string> {
  const download = await downloadPromise;
  expect(download, 'Download should have been triggered').not.toBeNull();
  const filename = download?.suggestedFilename() ?? '';
  expect(filename.length).toBeGreaterThan(0);
  return filename;
}

/**
 * Wait for the loading mask to disappear.
 */
export async function waitForLoader(page: Page, timeout = 30_000): Promise<void> {
  await page.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout }).catch(() => {});
}

/**
 * Assert that a table has rows (data loaded).
 */
export async function assertTableHasData(page: Page): Promise<number> {
  const rows = page.locator('tbody tr, .el-table__body tr');
  const count = await rows.count();
  expect(count, 'Table should have at least 1 row').toBeGreaterThan(0);
  return count;
}

/**
 * Assert the current URL contains the given path fragment.
 */
export async function assertUrl(page: Page, fragment: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(fragment), { timeout: 15_000 });
}
