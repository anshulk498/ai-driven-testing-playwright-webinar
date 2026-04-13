import { test, expect } from '@playwright/test';

test('SSO Historical Report Test', async ({ page }) => {
  // Step 1: Open SSO page
  await page.goto('https://cert-comply.content.aws.lexis.com/sso');
  await expect(page).toHaveTitle('Single Sign On - Regulatory Compliance');

  // Step 2: Click on Developer Login
  const developerLoginButton = page.locator('text=Developer Login');
  await developerLoginButton.click();

  // Step 3: Verify URL
  await expect(page).toHaveURL('https://cert-comply.content.aws.lexis.com/content-center');

  // Step 4: Hover to Report and click on Historical Notes
  const reportMenu = page.locator('menuitem:has-text("Report")');
  await reportMenu.hover();
  const historicalNotes = page.locator('text=Historical Notes');
  await historicalNotes.click();

  // Step 5: Select Aged Care module
  const moduleDropdown = page.locator('text=Select Module');
  await moduleDropdown.click();
  const agedCareOption = page.locator('text=Aged Care');
  await agedCareOption.click();

  // Step 6: Select date (22nd)
  const toDate = page.locator('text=Select Date');
  await toDate.click();
  const date22 = page.locator('text=22');
  await date22.click();

  // Step 7: Select Material type
  const typeDropdown = page.locator('text=Select Type');
  await typeDropdown.click();
  const materialOption = page.locator('text=Material');
  await materialOption.click();

  // Step 8: Click Go and wait for loader
  const goButton = page.locator('text=Go');
  await goButton.click();
  const loader = page.locator('text=Loading...');
  await loader.waitFor({ state: 'hidden' });

  // Step 9: Click Export if data exists
  const exportButton = page.locator('text=Export');
  if (await exportButton.isVisible()) {
    await exportButton.click();
  } else {
    console.log('No data available to export.');
  }
});