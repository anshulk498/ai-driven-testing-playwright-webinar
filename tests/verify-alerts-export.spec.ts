import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Alerts Export Test', () => {
  test('should export alerts successfully', async ({ page }) => {
    // Navigate to SSO
    await page.goto('https://cert-comply.content.aws.lexis.com/sso');
    await expect(page).toHaveURL(/.*sso/);

    // Debugging: Take a screenshot to verify navigation
    await page.screenshot({ path: 'test-results/sso-page.png' });

    // Click Developer Login
    const loginButton = page.locator('text=Developer Login');
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // Verify Content Center redirect
    await page.waitForURL('**/content-center');
    await expect(page).toHaveURL(/.*\/content-center/);

    // Debugging: Take a screenshot to verify redirection
    await page.screenshot({ path: 'test-results/content-center-page.png' });

    // Check Alerts tab and click on alerts
    const alertsTab = page.getByRole('tab', { name: 'Alerts' });
    await expect(alertsTab).toBeVisible();
    await alertsTab.click();

    // Click Export button
    const exportButton = page.getByRole('button', { name: 'Export' });
    await expect(exportButton).toBeVisible();
    await exportButton.click();

    // Debugging: Take a screenshot to verify export process
    await page.screenshot({ path: 'test-results/export-triggered.png' });

    // Download exported file
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      exportButton.click(),
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