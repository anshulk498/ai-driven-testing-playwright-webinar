# Test Plan: Obligation Export - Content Center

**Application URL**: `https://cert-comply.content.aws.lexis.com/content-center`  
**Last Updated**: April 7, 2026

---

## Overview

This test plan covers the end-to-end Obligation Export workflow in the Content Center, including login, navigation to Obligations tab, export button click, and file download verification.

---

## Test Details

**Test Type**: Export Functionality  
**Export Format**: Microsoft Excel (.xlsx)  
**Expected File**: obligations.xlsx  

**Automated**: `tests/verify-obligation-export.spec.ts` ✅

---

## Test Steps

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to SSO Login page | SSO page loads successfully | ✅ |
| 2 | Click Developer Login button | Login successful, redirect to Content Center | ✅ |
| 3 | Verify Content Center page | URL contains `/content-center` | ✅ |
| 4 | Check Obligations tab | Obligations tab is visible and selected by default | ✅ |
| 5 | Click Export button | Export button found and clicked | ✅ |
| 6 | Verify export process triggered | Loading indicator detected | ✅ |
| 7 | Download exported file | File `obligations.xlsx` downloaded | ✅ |
| 8 | Verify file contents | File exists and is not empty (>1MB) | ✅ |

---

## DOM Snapshots

The test captures DOM snapshots at key steps for test healing and debugging:

1. **dom-step1-sso.json** - SSO login page structure
2. **dom-step3-content-center.json** - Content Center main page after login
3. **dom-step4-obligations-tab.json** - Obligations tab view
4. **dom-step5-after-export-click.json** - State immediately after Export button clicked
5. **dom-step6-export-triggered.json** - Export process in progress with loading indicator
6. **dom-step8-verification-complete.json** - Final state after file download and verification

---

## Screenshots Generated

1. **export-step1-sso.png** - SSO login page
2. **export-step3-content-center.png** - Content Center main page
3. **export-step4-obligations-tab.png** - Obligations tab with Export button visible
4. **export-step5-after-export-click.png** - After clicking Export button
5. **export-step6-export-triggered.png** - Export in progress (loading indicator)
6. **export-step8-verification-complete.png** - After successful file download

---

## Export File Validation

### File Checks Performed:
- ✅ File exists in `test-results/obligations.xlsx`
- ✅ File is not empty
- ✅ File size > 1MB (1,154.44 KB / 1.13 MB)
- ✅ Correct file format (.xlsx)
- ✅ File downloaded within timeout period

### File Details:
- **Filename**: `obligations.xlsx`
- **Format**: Microsoft Excel (.xlsx)
- **Expected Size**: ~1.1 MB
- **Location**: `test-results/obligations.xlsx`

---

## Implementation Details

### Export Button Location Strategy
```typescript
// Multiple selector strategies for resilience
const exportButton = page.locator(
  'button:has-text("Export"), ' +
  'button[aria-label*="Export"], ' +
  'button.export-button, ' +
  '[data-testid="export-button"]'
).first();
```

### File Download Handling
```typescript
// Wait for download to start
const downloadPromise = page.waitForEvent('download');

// Trigger export
await exportButton.click();

// Wait for download to complete
const download = await downloadPromise;

// Save file
const filePath = path.join('test-results', download.suggestedFilename());
await download.saveAs(filePath);
```

### Loading Indicator Detection
```typescript
// Verify export process started
const loadingIndicator = page.locator(
  '.el-loading-mask, ' +
  '[class*="loading"], ' +
  '.spinner'
);
await expect(loadingIndicator).toBeVisible({ timeout: 10000 });
```

---

## Test Results Summary

✅ **All Steps Passed**: 8/8 (100%)  
⏱️ **Execution Time**: ~26.7 seconds  
📁 **File Downloaded**: obligations.xlsx (1.13 MB)  
📸 **Screenshots**: 6 captured  
🔍 **DOM Snapshots**: 6 captured

### Successful Operations:
- ✅ SSO login automation
- ✅ Content Center navigation
- ✅ Obligations tab verification
- ✅ Export button click
- ✅ Loading indicator detection
- ✅ File download triggered
- ✅ File saved successfully
- ✅ File size validation
- ✅ All DOM snapshots captured
- ✅ All screenshots saved

---

## Prerequisites

- Access to Content Center: `https://cert-comply.content.aws.lexis.com/content-center`
- Valid SSO credentials for Developer Login
- Chromium browser (or compatible)
- Playwright test framework installed
- Write permissions to `test-results/` directory

---

## Test Execution

```bash
# Run the export test
npx playwright test tests/verify-obligation-export.spec.ts --headed

# Run in headless mode
npx playwright test tests/verify-obligation-export.spec.ts

# View test report
npx playwright show-report
```

---

## Related Files

- **Test File**: `tests/verify-obligation-export.spec.ts`
- **Test Summary**: `docs/test-plans/EXPORT_TEST_SUMMARY.md`
- **Utilities**: `src/utils/test-helpers.ts`, `src/utils/dom-snapshot.ts`
- **Config**: `src/config/config.ts`
- **Downloaded File**: `test-results/obligations.xlsx`
