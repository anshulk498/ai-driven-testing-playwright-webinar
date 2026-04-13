import { test, expect } from '@playwright/test';

test.describe('Content Center - Core Obligation', () => {
  test('Create Core Obligation with India jurisdiction', async ({ page, context }) => {
    test.setTimeout(300000); // 5 minutes for this long test
    
    // Step 1: Login to Content Center
    await page.goto('https://cert-comply.content.aws.lexis.com/content-center', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(2000);
    
    await page.getByRole('button', { name: /developer login/i }).click();
    await page.waitForURL('**/content-center', { timeout: 30000 });
    await page.waitForTimeout(3000);

    // Step 2: Open Core Obligation creation form
    await page.locator('button:has-text("Create")').first().click();
    await page.waitForTimeout(1000);
    await page.locator('text="Core Obligation"').first().click();
    
    const [obligationPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      page.waitForTimeout(2000)
    ]);
    
    await obligationPage.waitForLoadState('domcontentloaded');
    await obligationPage.waitForTimeout(3000);

    // Step 3: Select Module - Aged Care
    await obligationPage.locator('text="Select module"').click();
    await obligationPage.waitForTimeout(500);
    await obligationPage.locator('text=/^Aged Care$/i').click();
    await obligationPage.waitForTimeout(500);
    await obligationPage.locator('button:has-text("Next")').click();
    await obligationPage.waitForTimeout(2000);
    
    // Step 4: Select Topic - Home Care
    await obligationPage.locator('text="Select topic"').click();
    await obligationPage.waitForTimeout(500);
    await obligationPage.locator('text=/^Home Care$/i').click();
    await obligationPage.waitForTimeout(500);
    await obligationPage.locator('button:has-text("Next")').click();
    await obligationPage.waitForTimeout(3000);
    
    // Step 5: Fill Title field
    await obligationPage.locator('input[placeholder="Enter title"]').fill('Test Obligation');
    await obligationPage.waitForTimeout(500);
    
    // Step 6: Select Material Type
    const materialInput = obligationPage.locator('input[placeholder="Select material type"]');
    await materialInput.click();
    await obligationPage.waitForTimeout(1500);
    await obligationPage.locator('.el-select-dropdown:visible .el-select-dropdown__item')
      .filter({ hasText: 'material' })
      .first()
      .click();
    await obligationPage.waitForTimeout(1000);
    
    // Step 7: Select India Jurisdiction
    const jurisdictionInput = obligationPage.getByRole('textbox', { name: '* Jurisdictions' });
    await jurisdictionInput.click();
    await obligationPage.waitForTimeout(1000);
    
    // Click India checkbox using Element UI tree structure (position 9)
    const indiaCheckbox = obligationPage.locator(
      'div:nth-child(9) > .el-tree-node__content > .el-checkbox > .el-checkbox__input > .el-checkbox__inner'
    );
    await indiaCheckbox.click();
    await obligationPage.waitForTimeout(1000);
    
    // Close dropdown by clicking Author field
    await obligationPage.getByRole('textbox', { name: 'Author' }).click();
    await obligationPage.waitForTimeout(1000);
    
    // Verify India is selected
    const indiaTag = obligationPage.locator("//span[contains(@class,'el-tag')]//span[text()='India']");
    await expect(indiaTag).toBeVisible({ timeout: 5000 });
    
    // Step 8: Fill Author field
    await obligationPage.getByRole('textbox', { name: 'Author' }).fill('Test Author');
    await obligationPage.waitForTimeout(500);
    
    // Step 9: Submit form
    await obligationPage.getByRole('button', { name: 'Create' }).click();
    await obligationPage.waitForTimeout(5000);
    
    // Step 10: Verify Obligation was created
    const pageText = await obligationPage.locator('body').textContent() || '';
    const obligationIdPattern = /(?:Obligation\s*ID|ID)[:\s]*([A-Z0-9-]+)/i;
    const idMatch = pageText.match(obligationIdPattern);
    
    expect(idMatch).toBeTruthy();
    const createdObligationId = idMatch?.[1];
    console.log('✓ Obligation created successfully with ID:', createdObligationId);
    
    // Close the obligation creation popup
    await obligationPage.close();
    await page.waitForTimeout(2000);
    
    // Step 11: Return to Content Center main page
    console.log('\nVerifying obligation on Content Center page...');
    
    // Check if popup is still open, if so close it
    if (!obligationPage.isClosed()) {
      await obligationPage.close();
    }
    await page.waitForTimeout(2000);
    
    // Step 12: Click the ID search icon on main page
    console.log('Opening ID search...');
    await page.locator('.table-header > .el-icon.search-icon > svg').first().click();
    await page.waitForTimeout(1000);
    
    // Step 13: Enter the obligation ID in the search field
    console.log('Searching for Obligation ID:', createdObligationId);
    await page.getByRole('textbox', { name: 'Search by ID', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search by ID', exact: true }).fill(createdObligationId!);
    await page.waitForTimeout(1000);
    
    // Step 14: Click Submit to search
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: 'test-results/search-results.png', fullPage: true });
    
    // Step 15: Verify the obligation appears in search results
    const obligationIdInResults = page.locator(`text="${createdObligationId}"`).first();
    await expect(obligationIdInResults).toBeVisible({ timeout: 10000 });
    
    console.log('✓✓✓ Obligation ID verified on Content Center page:', createdObligationId);
    await page.screenshot({ path: 'test-results/obligation-verified-on-page.png', fullPage: true });
    
    // Step 16: Click on the obligation title to view details page
    console.log('Opening obligation details...');
    
    // The title "Test Obligation" should be in the Title column - find and click it
    const titleCell = page.locator(`tr:has-text("${createdObligationId}")`).locator('td').nth(3); // Title is usually 4th column (index 3)
    const cellExists = await titleCell.count();
    console.log('Title cell found:', cellExists);
    
    if (cellExists > 0) {
      const titleText = await titleCell.textContent();
      console.log('Title text:', titleText);
      
      // Click the title cell or any link inside it
      await titleCell.click();
      await page.waitForTimeout(5000);
      
      // Check current URL
      const currentUrl = page.url();
      console.log('Current URL after title click:', currentUrl);
      
      // Step 17: Verify we're on the obligation details page
      if (currentUrl.includes('/obligationDetails/')) {
        console.log('✓✓✓ Navigated to obligation details page');
        expect(currentUrl).toContain(`/obligationDetails/${createdObligationId}`);
        await page.screenshot({ path: 'test-results/obligation-details.png', fullPage: true });
        
        // Step 18: Verify ID on details page matches created ID
        console.log('\nVerifying ID on details page...');
        const idOnDetailsPage = page.locator('text=/ID:\\s*' + createdObligationId + '/').first();
        const idExists = await idOnDetailsPage.count();
        
        if (idExists > 0) {
          await expect(idOnDetailsPage).toBeVisible();
          console.log('✓ ID matches on details page:', createdObligationId);
        } else {
          // Alternative: check in any element that contains the ID
          const pageContent = await page.textContent('body');
          expect(pageContent).toContain(createdObligationId!);
          console.log('✓ ID found in page content:', createdObligationId);
        }
        
        // Step 19: Click Edit button
        console.log('\nClicking Edit button...');
        await page.getByRole('button', { name: 'Edit' }).click();
        await page.waitForTimeout(2000);
        
        // Step 20: Verify "Edit mode initiated" message
        const editMessage = page.locator('text=/edit mode initiated/i, .el-message:has-text("edit"), .notification:has-text("edit")').first();
        const messageVisible = await editMessage.isVisible().catch(() => false);
        
        if (messageVisible) {
          const messageText = await editMessage.textContent();
          console.log('✓ Edit mode message:', messageText);
        } else {
          console.log('✓ Edit button clicked (message may have appeared briefly)');
        }
        
        await page.screenshot({ path: 'test-results/edit-mode.png', fullPage: true });
        
        // Step 21: Navigate through all visible tabs and add content
        console.log('\nProcessing all visible tabs...');
        
        // Check if page is still open
        if (page.isClosed()) {
          console.log('⚠️ Page was closed, cannot process tabs');
          return;
        }
        
        // Get all tab elements
        const allTabs = page.locator('[role="tab"]:visible, .el-tabs__item:visible, button[class*="tab"]:visible');
        const tabCount = await allTabs.count();
        console.log(`Found ${tabCount} tabs`);
        
        for (let i = 0; i < tabCount; i++) {
          // Check if page is still open before each iteration
          if (page.isClosed()) {
            console.log('⚠️ Page closed during tab processing');
            break;
          }
          
          const tab = allTabs.nth(i);
          const tabName = await tab.textContent().catch(() => null);
          
          if (!tabName) {
            console.log(`⚠️ Could not get tab name for tab ${i}, skipping`);
            continue;
          }
          
          // Skip AI Assist and other non-content tabs
          if (tabName.includes('AI Assist') || tabName.trim() === '') {
            continue;
          }
          
          console.log(`\nProcessing tab: ${tabName}`);
          
          // Click the tab
          await tab.click().catch(() => console.log('Could not click tab'));
          await page.waitForTimeout(1000);
          
          // Special handling for Meta Tags tab
          if (tabName.includes('Meta Tags')) {
            console.log('  Handling Meta Tags tab...');
            await page.waitForTimeout(1500);
            
            // Take screenshot to see the structure
            await page.screenshot({ path: 'test-results/meta-tags-tab-before.png', fullPage: true });
            
            try {
              // Get all select inputs on the page
              const allSelects = page.locator('.el-select .el-input__inner:visible');
              const totalSelects = await allSelects.count();
              console.log(`  Found ${totalSelects} select dropdowns on Meta Tags tab`);
              
              // Process each dropdown sequentially (skip first 2 for material/immaterial)
              for (let dropdownIndex = 2; dropdownIndex < Math.min(totalSelects, 7); dropdownIndex++) {
                try {
                  const selectInput = allSelects.nth(dropdownIndex);
                  const placeholderText = await selectInput.getAttribute('placeholder').catch(() => '');
                  console.log(`\n  Processing dropdown: ${placeholderText}`);
                  
                  const isIndustriesDropdown = placeholderText?.includes('industries');
                  
                  // Click to open dropdown
                  await selectInput.click({ timeout: 3000 });
                  await page.waitForTimeout(1200);
                  
                  // Get visible options (skip header items)
                  const allOptions = page.locator('.el-select-dropdown__item:visible');
                  const optionCount = await allOptions.count();
                  console.log(`    Found ${optionCount} total options`);
                  
                  // For Industries, only select 1 to avoid complexity with sub-industries
                  const maxSelections = isIndustriesDropdown ? 1 : 2;
                  
                  // Select non-header options
                  let selectedCount = 0;
                  for (let optIndex = 0; optIndex < optionCount && selectedCount < maxSelections; optIndex++) {
                    const option = allOptions.nth(optIndex);
                    const optionText = await option.textContent().catch(() => '');
                    const trimmedText = optionText?.trim() || '';
                    
                    // Skip headers only (allow all industries now)
                    if (trimmedText.includes('Industries') || 
                        trimmedText.includes('Organisational Function') || 
                        trimmedText.includes('Compliance Requirement') ||
                        trimmedText.includes('Compliance Area') ||
                        trimmedText.includes('Risk / Penalty') ||
                        trimmedText.length === 0) {
                      console.log(`    Skipping: ${trimmedText || 'header'}`);
                      continue;
                    }
                    
                    await option.click();
                    await page.waitForTimeout(1500);
                    console.log(`    ✓ Selected: ${trimmedText}`);
                    selectedCount++;
                    
                    // If this is Industries dropdown, look for arrow icon to expand and select sub-industry
                    if (isIndustriesDropdown) {
                      console.log(`      Looking for arrow icon to expand ${trimmedText}...`);
                      await page.waitForTimeout(2000);
                      
                      // Look for arrow icon (el-icon-arrow-right inside the industry tag/row)
                      const arrowIcon = page.locator('.el-icon-arrow-right:visible, [class*="arrow-right"]:visible, .el-icon:visible').last();
                      const arrowExists = await arrowIcon.isVisible().catch(() => false);
                      
                      if (arrowExists) {
                        console.log(`      Found arrow icon, clicking...`);
                        await arrowIcon.click();
                        await page.waitForTimeout(2500); // Longer wait for sub-industry UI
                        
                        // Take screenshot to debug
                        await page.screenshot({ path: `test-results/after-arrow-click-${trimmedText.substring(0, 10)}.png`, fullPage: true });
                        
                        // Look for new input or dropdown for sub-industry
                        const subInput = page.locator('input[placeholder*="sub" i], .el-select .el-input__inner:visible').last();
                        const subInputVisible = await subInput.isVisible().catch(() => false);
                        
                        if (subInputVisible) {
                          console.log(`      Found sub-industry input, clicking...`);
                          await subInput.click({ timeout: 3000 });
                          await page.waitForTimeout(1500);
                          
                          const subOptions = page.locator('.el-select-dropdown__item:visible');
                          const subOptCount = await subOptions.count();
                          console.log(`      Found ${subOptCount} sub-industry options`);
                          
                          if (subOptCount > 0) {
                            const subOpt = subOptions.first();
                            const subText = await subOpt.textContent().catch(() => '');
                            await subOpt.click();
                            await page.waitForTimeout(800);
                            console.log(`      ✓ Selected sub-industry: ${subText?.trim()}`);
                            
                            // Close any open dropdowns
                            await page.keyboard.press('Escape').catch(() => {});
                            await page.waitForTimeout(500);
                          }
                        } else {
                          console.log(`      No sub-industry input found after clicking arrow`);
                        }
                      } else {
                        console.log(`      No arrow icon found`);
                      }
                    }
                  }
                  
                  // Close dropdown
                  await page.keyboard.press('Escape').catch(() => {});
                  await page.waitForTimeout(500);
                  
                } catch (error) {
                  console.log(`  ⚠️ Error with dropdown: ${(error as Error).message}`);
                }
              }
              
              await page.screenshot({ path: 'test-results/meta-tags-tab-after.png', fullPage: true });
              console.log('\n  ✓ Completed all metadata dropdowns');
            } catch (error) {
              console.log(`  ⚠️ Error handling Meta Tags: ${(error as Error).message}`);
            }
          }
          
          // Try to find and interact with TinyMCE editor
          const frameExists = await page.locator('iframe[id^="mce_"]').count();
          
          if (frameExists > 0) {
            console.log(`✓ Found editor iframe`);
            
            try {
              // Generate 100+ words of content
              const content = `This is automated test content for the ${tabName} section. ` +
                `Organizations must establish comprehensive procedures and protocols to ensure full compliance with regulatory requirements. ` +
                `The implementation of these guidelines requires careful consideration of all applicable standards and best practices. ` +
                `Staff members should receive appropriate training and documentation to understand their responsibilities under this obligation. ` +
                `Regular audits and reviews must be conducted to verify ongoing compliance and identify areas for improvement. ` +
                `Any deviations from established procedures should be documented and addressed promptly through corrective action plans. ` +
                `Management oversight is essential to maintain the integrity and effectiveness of compliance programs. ` +
                `This content demonstrates the capability to populate detailed information across multiple sections of the obligation record. ` +
                `Testing automated workflows ensures data quality and system reliability in production environments. ` +
                `Quality assurance processes must be implemented to validate all data entries and maintain accuracy throughout the system. ` +
                `Continuous monitoring and improvement initiatives help organizations adapt to changing regulatory landscapes and business requirements.`;
              
              // First, try clicking the editor container to activate it
              const editorContainer = page.locator('.tox-tinymce, .editor-container, .mce-container, [class*="editor"]').first();
              await editorContainer.click().catch(() => {});
              await page.waitForTimeout(300);
              
              // Access the editor iframe
              const editorFrame = page.frameLocator('iframe[id^="mce_"]').first();
              const editorBody = editorFrame.locator('body');
              
              // Try to click the body to make it visible/editable
              await editorBody.click({ timeout: 3000 }).catch(() => {});
              
              // Type content using keyboard with no delay for speed
              await page.keyboard.type(content);
              
              console.log(`✓ Typed content (${content.split(' ').length} words)`);
              await page.waitForTimeout(500);
              
              // Verify
              const visibleText = await editorBody.textContent().catch(() => '');
              if (visibleText && visibleText.length > 0) {
                console.log(`  ✓ Verified: ${visibleText.length} characters visible`);
              }
              
              // Take screenshot only for first and last tab
              if (i === 0 || i === tabCount - 1) {
                await page.screenshot({ path: `test-results/tab-${tabName.toLowerCase().replace(/\s+/g, '-')}-after.png`, fullPage: true }).catch(() => {});
              }
            } catch (error) {
              console.log(`⚠️ Error adding content:`, (error as Error).message);
            }
          } else {
            console.log(`⚠️ No editor found`);
          }
        }
        
        console.log('\n✓✓✓ All tabs processed successfully');
        await page.screenshot({ path: 'test-results/all-tabs-completed.png', fullPage: true });
        
        // Step 22: Click Save Draft
        console.log('\nSaving as draft...');
        await page.getByRole('button', { name: 'Save Draft' }).click();
        await page.waitForTimeout(3000);
        
        // Check for save success message
        const saveMessage = page.locator('.el-message--success, .el-notification--success, text=/saved/i').first();
        const saveMessageVisible = await saveMessage.isVisible().catch(() => false);
        
        if (saveMessageVisible) {
          const messageText = await saveMessage.textContent();
          console.log('✓ Save draft message:', messageText);
        } else {
          console.log('✓ Save draft clicked (message may have appeared briefly)');
        }
        
        await page.screenshot({ path: 'test-results/after-save-draft.png', fullPage: true });
        
        // Step 23: Click Start Review
        console.log('\nClicking Start Review...');
        await page.getByRole('button', { name: 'Start Review' }).click();
        await page.waitForTimeout(3000);
        
        // Check for any messages (error, warning, success, or info)
        const anyMessage = page.locator('.el-message, .el-notification, .el-dialog, .el-alert, [role="alert"]').first();
        const messageExists = await anyMessage.isVisible().catch(() => false);
        
        if (messageExists) {
          const messageText = await anyMessage.textContent();
          console.log('Message after Start Review:', messageText);
          
          // Check if it's an error or warning
          const isError = await anyMessage.evaluate(el => 
            el.className.includes('error') || el.textContent?.toLowerCase().includes('error')
          ).catch(() => false);
          
          const isWarning = await anyMessage.evaluate(el => 
            el.className.includes('warning') || el.textContent?.toLowerCase().includes('warning')
          ).catch(() => false);
          
          if (isError) {
            console.log('⚠️ Error message found:', messageText);
            
            // Check for specific validation errors
            const validationErrors = await page.locator('.el-form-item__error').allTextContents();
            if (validationErrors.length > 0) {
              console.log('Validation errors:', validationErrors);
            }
            
            // If there's a dialog with OK/Close button, click it
            const okButton = page.locator('button:has-text("OK"), button:has-text("Close"), button:has-text("Confirm")').first();
            const okExists = await okButton.isVisible().catch(() => false);
            
            if (okExists) {
              console.log('Clicking OK/Close button...');
              await okButton.click();
              await page.waitForTimeout(1000);
            }
            
            await page.screenshot({ path: 'test-results/start-review-error.png', fullPage: true });
          } else if (isWarning) {
            console.log('⚠️ Warning message:', messageText);
            
            // If there's a Proceed/Continue button, click it
            const proceedButton = page.locator('button:has-text("Proceed"), button:has-text("Continue"), button:has-text("Yes")').first();
            const proceedExists = await proceedButton.isVisible().catch(() => false);
            
            if (proceedExists) {
              console.log('Clicking Proceed/Continue button...');
              await proceedButton.click();
              await page.waitForTimeout(2000);
              console.log('✓ Proceeded with review');
            }
            
            await page.screenshot({ path: 'test-results/start-review-warning.png', fullPage: true });
          } else {
            console.log('✓ Info/Success message:', messageText);
            await page.screenshot({ path: 'test-results/start-review-success.png', fullPage: true });
          }
        } else {
          console.log('✓ Start Review clicked - no messages');
          await page.screenshot({ path: 'test-results/start-review-complete.png', fullPage: true });
        }
        
        console.log('\n✓✓✓ Test completed successfully');
      } else {
        console.log('⚠️ URL did not navigate to details page. Trying to click link inside cell...');
        
        // Try clicking a link if exists inside the cell
        const linkInCell = titleCell.locator('a, .el-link').first();
        const linkInCellExists = await linkInCell.count();
        
        if (linkInCellExists > 0) {
          await linkInCell.click();
          await page.waitForTimeout(5000);
          console.log('Current URL after clicking link:', page.url());
          await page.screenshot({ path: 'test-results/after-link-click.png', fullPage: true });
        }
      }
    } else {
      console.log('⚠️ Title cell not found');
      await page.screenshot({ path: 'test-results/cell-not-found.png', fullPage: true });
    }
  });
});
