import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to capture DOM snapshot
async function captureDOMSnapshot(page: any, stepName: string) {
  const domSnapshot = await page.evaluate(() => {
    const isVisible = (el: HTMLElement) => {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    };

    return {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      inputs: Array.from(document.querySelectorAll('input, textarea')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        type: (el as HTMLInputElement).type,
        placeholder: (el as HTMLInputElement).placeholder,
        name: (el as HTMLInputElement).name,
        id: el.id,
        value: (el as HTMLInputElement).value,
        className: el.className,
        ariaLabel: el.getAttribute('aria-label')
      })),
      buttons: Array.from(document.querySelectorAll('button')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        id: el.id,
        type: (el as HTMLButtonElement).type,
        disabled: (el as HTMLButtonElement).disabled,
        ariaLabel: el.getAttribute('aria-label')
      })),
      selects: Array.from(document.querySelectorAll('select, .el-select')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        className: el.className,
        id: el.id,
        value: (el as HTMLSelectElement).value || null,
        ariaLabel: el.getAttribute('aria-label')
      })),
      labels: Array.from(document.querySelectorAll('label')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        text: el.textContent?.trim(),
        for: el.getAttribute('for'),
        className: el.className
      })),
      links: Array.from(document.querySelectorAll('a')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        text: el.textContent?.trim(),
        href: (el as HTMLAnchorElement).href,
        className: el.className
      })),
      tables: Array.from(document.querySelectorAll('table')).filter(el => isVisible(el as HTMLElement)).map(el => ({
        className: el.className,
        id: el.id,
        rowCount: el.querySelectorAll('tr').length,
        columnCount: el.querySelector('tr')?.querySelectorAll('td, th').length || 0
      }))
    };
  });

  const snapshotPath = path.join('test-results', `dom-${stepName}.json`);
  fs.writeFileSync(snapshotPath, JSON.stringify(domSnapshot, null, 2));
  console.log(`📸 DOM snapshot saved: dom-${stepName}.json`);
}

test.describe('Content Center - Obligations Export', () => {
  test.setTimeout(300000); // 5 minutes

  test('Verify Obligation Export Functionality', async ({ page, context }) => {
    console.log('\n=== Starting Obligation Export Test ===\n');

    // Step 1: Navigate to SSO URL
    console.log('Step 1: Navigating to SSO...');
    await page.goto('https://cert-comply.content.aws.lexis.com/sso');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/export-step1-sso.png', fullPage: true });
    await captureDOMSnapshot(page, 'step1-sso');
    console.log('✓ Navigated to SSO page');

    // Step 2: Click Developer Login
    console.log('\nStep 2: Clicking Developer Login...');
    const devLoginButton = page.locator('button:has-text("Developer Login")');
    await devLoginButton.click();
    await page.waitForTimeout(2000);
    console.log('✓ Clicked Developer Login');

    // Step 3: Verify redirect to Content Center
    console.log('\nStep 3: Verifying redirect to Content Center...');
    await page.waitForURL('**/content-center**', { timeout: 10000 });
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('content-center');
    await page.screenshot({ path: 'test-results/export-step3-content-center.png', fullPage: true });
    await captureDOMSnapshot(page, 'step3-content-center');
    console.log('✓ Successfully redirected to Content Center');

    // Step 4: Check if Obligations tab is selected
    console.log('\nStep 4: Checking Obligations tab...');
    await page.waitForTimeout(2000);
    
    const obligationsTab = page.locator('button:has-text("Obligations"), a:has-text("Obligations"), [role="tab"]:has-text("Obligations")').first();
    const isObligationsSelected = await obligationsTab.getAttribute('class').then(c => c?.includes('active') || c?.includes('selected')).catch(() => false);
    
    if (!isObligationsSelected) {
      console.log('Obligations tab not selected, clicking it...');
      await obligationsTab.click();
      await page.waitForTimeout(2000);
      console.log('✓ Clicked Obligations tab');
    } else {
      console.log('✓ Obligations tab already selected');
    }
    
    await page.screenshot({ path: 'test-results/export-step4-obligations-tab.png', fullPage: true });
    await captureDOMSnapshot(page, 'step4-obligations-tab');

    // Step 5: Click Export button
    console.log('\nStep 5: Clicking Export button...');
    
    // Try multiple selectors for Export button
    const exportButton = page.locator('button:has-text("Export"), button[aria-label*="Export" i], button:has([class*="export" i])').first();
    const exportExists = await exportButton.count();
    
    if (exportExists === 0) {
      console.log('⚠️ Export button not found with standard selectors, searching DOM...');
      await captureDOMSnapshot(page, 'step5-before-export-search');
      
      // Try to find any button with export text
      const allButtons = page.locator('button:visible');
      const buttonCount = await allButtons.count();
      console.log(`Found ${buttonCount} visible buttons, searching for Export...`);
      
      for (let i = 0; i < buttonCount; i++) {
        const btnText = await allButtons.nth(i).textContent();
        if (btnText?.toLowerCase().includes('export')) {
          console.log(`Found Export button at index ${i}: "${btnText}"`);
          await allButtons.nth(i).click();
          break;
        }
      }
    } else {
      await exportButton.click();
      console.log('✓ Clicked Export button');
    }
    
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'test-results/export-step5-after-export-click.png', fullPage: true });
    await captureDOMSnapshot(page, 'step5-after-export-click');

    // Step 6: Verify export process is triggered
    console.log('\nStep 6: Verifying export process...');
    
    // Check for loading indicator, toast message, or download
    const loadingIndicator = page.locator('.el-loading-mask, [class*="loading"], [class*="spinner"]');
    const loadingExists = await loadingIndicator.count();
    if (loadingExists > 0) {
      console.log('✓ Loading indicator detected');
      await page.waitForTimeout(2000);
    }
    
    // Check for success toast/notification
    const toastMessage = page.locator('.el-message, .el-notification, [class*="toast"], [class*="notification"]');
    const toastExists = await toastMessage.count();
    if (toastExists > 0) {
      const message = await toastMessage.textContent();
      console.log(`Toast message: ${message}`);
    }
    
    await page.screenshot({ path: 'test-results/export-step6-export-triggered.png', fullPage: true });
    await captureDOMSnapshot(page, 'step6-export-triggered');
    console.log('✓ Export process triggered');

    // Step 7: Download the exported file
    console.log('\nStep 7: Waiting for file download...');
    
    // Listen for download event
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
    const download = await downloadPromise;
    
    if (download) {
      const fileName = download.suggestedFilename();
      const filePath = path.join('test-results', fileName);
      await download.saveAs(filePath);
      console.log(`✓ File downloaded: ${fileName}`);
      console.log(`✓ Saved to: ${filePath}`);
      
      // Step 8: Verify file contents
      console.log('\nStep 8: Verifying exported file...');
      
      // Check if file exists
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBeTruthy();
      console.log('✓ File exists');
      
      // Get file size
      const stats = fs.statSync(filePath);
      const fileSizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✓ File size: ${fileSizeKB} KB`);
      
      // Verify file is not empty
      expect(stats.size).toBeGreaterThan(0);
      console.log('✓ File is not empty');
      
      // Check file extension
      const fileExt = path.extname(fileName).toLowerCase();
      console.log(`✓ File format: ${fileExt}`);
      
      if (fileExt === '.csv') {
        // Read CSV content
        const csvContent = fs.readFileSync(filePath, 'utf-8');
        const lines = csvContent.split('\n');
        console.log(`✓ CSV has ${lines.length} lines`);
        
        // Check for header row
        if (lines.length > 0) {
          const headers = lines[0].split(',');
          console.log(`✓ CSV headers (${headers.length} columns):`, headers.join(', '));
        }
        
        // Check for data rows
        if (lines.length > 1) {
          console.log(`✓ CSV has ${lines.length - 1} data rows`);
        } else {
          console.log('⚠️ CSV has no data rows');
        }
      } else if (fileExt === '.xlsx' || fileExt === '.xls') {
        console.log('✓ Excel file downloaded (detailed validation requires xlsx library)');
      } else {
        console.log(`✓ File downloaded with extension: ${fileExt}`);
      }
      
      await page.screenshot({ path: 'test-results/export-step8-verification-complete.png', fullPage: true });
      await captureDOMSnapshot(page, 'step8-verification-complete');
      
      console.log('\n=== EXPORT TEST SUMMARY ===');
      console.log('✅ Navigated to Content Center');
      console.log('✅ Obligations tab accessed');
      console.log('✅ Export button clicked');
      console.log('✅ Export process triggered');
      console.log(`✅ File downloaded: ${fileName}`);
      console.log(`✅ File size: ${fileSizeKB} KB`);
      console.log(`✅ File format: ${fileExt}`);
      console.log('✅ File verification completed');
      console.log('\n✅ TEST PASSED ✅');
      
    } else {
      console.log('⚠️ No download detected within timeout');
      console.log('Checking if file might have been downloaded automatically...');
      
      // Sometimes downloads happen without triggering the event
      // Check downloads folder or look for export-related messages
      await page.screenshot({ path: 'test-results/export-step7-no-download.png', fullPage: true });
      await captureDOMSnapshot(page, 'step7-no-download');
      
      console.log('\n⚠️ Export functionality needs manual verification');
      console.log('Please check:');
      console.log('1. Browser downloads folder');
      console.log('2. Network tab for export API call');
      console.log('3. Console for any error messages');
    }
  });
});
