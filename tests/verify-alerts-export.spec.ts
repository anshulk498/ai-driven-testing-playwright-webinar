import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Alerts Export Test', () => {
  test('should export alerts successfully', async ({ page }) => {
    // Navigate to SSO
    await page.goto('https://example.com/sso');
    await expect(page).toHaveURL(/.*sso/);

    // Click Developer Login
    await page.click('text=Developer Login');

    // Verify Content Center redirect
    await page.waitForURL('**/content-center');
    await expect(page).toHaveURL(/.*\/content-center/);

    // Check Alerts tab and click on alerts
    await page.click('text=Alerts');

    // Click Export button
    const exportButton = await page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // Verify export process triggered
    const loadingIndicator = page.locator('.loading-indicator');
    await expect(loadingIndicator).toBeVisible();

    // Download exported file
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Export")'),
    ]);

    const filePath = path.join(__dirname, '../test-results/alerts.xlsx');
    await download.saveAs(filePath);

    // Verify file contents
    const fileExists = fs.existsSync(filePath);
    expect(fileExists).toBeTruthy();

    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);

    console.log('File downloaded and validated successfully:', filePath);
  });
});