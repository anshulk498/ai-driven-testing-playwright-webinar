# Content Center Test Guide

## Overview
This project contains automated tests for the Content Center application, specifically for creating Core Obligations with jurisdiction selection.

## Test File
**`tests/create-core-obligation.final.spec.ts`** - Complete end-to-end test for Core Obligation creation

## Test Workflow
The test automates the following 10-step process:

1. **Login** - Access Content Center via Developer Login
2. **Open Form** - Navigate to Create → Core Obligation (opens in popup)
3. **Select Module** - Choose "Aged Care"
4. **Select Topic** - Choose "Home Care"
5. **Enter Title** - Fill in obligation title
6. **Select Material Type** - Choose "material" from dropdown
7. **Select Jurisdiction** - Check "India" from tree structure
8. **Enter Author** - Fill in author name
9. **Submit** - Click Create button
10. **Verify** - Confirm Obligation ID was created

## Running the Test

### Run with UI (Headed Mode)
```powershell
npx playwright test create-core-obligation.final --headed
```

### Run in Background (Headless Mode)
```powershell
npx playwright test create-core-obligation.final
```

### View Test Report
```powershell
npx playwright show-report
```

## Key Implementation Details

### Multi-Window Handling
The Core Obligation form opens in a popup window, which requires special handling:
```typescript
const [obligationPage] = await Promise.all([
  context.waitForEvent('page', { timeout: 15000 }),
  page.locator('text="Core Obligation"').first().click()
]);
```

### Element UI Jurisdiction Selection
India is selected using Element UI's tree structure (position 9):
```typescript
const indiaCheckbox = obligationPage.locator(
  'div:nth-child(9) > .el-tree-node__content > .el-checkbox > .el-checkbox__input > .el-checkbox__inner'
);
await indiaCheckbox.click();
```

### Verification
The test verifies both:
1. India tag appears in the selected jurisdictions
2. Obligation ID is created after submission

## Configuration
- **Timeout**: 180 seconds (3 minutes) - configured in `playwright.config.ts`
- **Browser**: Chromium (Desktop Chrome device emulation)
- **Wait Strategy**: Uses explicit waits for reliable Element UI interactions

## Customization

### Change Jurisdiction
To select a different jurisdiction, update the `nth-child()` value:
- Alaska: `nth-child(5)`
- Australia: `nth-child(7)`
- India: `nth-child(9)` ← Current
- Japan: `nth-child(13)`

### Change Module/Topic
Update the text locators:
```typescript
await obligationPage.locator('text=/^YOUR MODULE$/i').click();
await obligationPage.locator('text=/^YOUR TOPIC$/i').click();
```

### Change Form Fields
Modify the values in the fill() methods:
```typescript
await obligationPage.locator('input[placeholder="Enter title"]').fill('Your Title');
await obligationPage.getByRole('textbox', { name: 'Author' }).fill('Your Author');
```

## Troubleshooting

### Test Timeout
If tests timeout, check:
- Network connection (SSO redirect requires internet)
- Increase timeout: `test.setTimeout(300000)` for 5 minutes

### Jurisdiction Not Selected
If India tag doesn't appear:
- Verify the dropdown opened: Check for visible tree nodes
- Confirm position 9 is still India (UI may change)
- Use Playwright Inspector: `npx playwright test --debug`

### Popup Not Opening
If obligation page is null:
- Increase waitForEvent timeout
- Check for blocking popups in browser settings

## Screenshots
Tests automatically capture screenshots:
- `ready-to-create.png` - Form filled, ready to submit
- `after-create-clicked.png` - Immediately after Create clicked
- `obligation-created.png` - Success state with ID

## Example Output
```
✓ Obligation created successfully with ID: 9002759
1 passed (42.7s)
```

## Recording New Tests
To record interactions with Playwright Codegen:
```powershell
npx playwright codegen https://cert-comply.content.aws.lexis.com/content-center
```

This captures exact selectors and interaction patterns from the live application.
