# 📋 Broken Links Report – Full Test Plan (Positive / Negative / Edge)

**Test File:** `tests/broken-links-report.spec.ts`  
**Feature:** Broken Links Report – Filter, Generate, Export  
**URL:** `https://cert-comply.content.aws.lexis.com/content-center` → Report → Broken Links  
**Framework:** Playwright 1.57.0 | Browser: Chromium  
**Last Updated:** April 20, 2026  

---

## 🗂️ Test Summary

| Test ID | Type | Title | Status |
|---------|------|-------|--------|
| TC-BL-01 | ✅ Positive | Full flow – Type + Content Type → GO → Export | ✅ Passing |
| TC-BL-02 | ✅ Positive | Report menu accessible via hover → Broken Links loads | — |
| TC-BL-03 | ✅ Positive | GO button triggers report with valid filters | — |
| TC-BL-04 | ✅ Positive | Export button visible and enabled after data loads | — |
| TC-BL-05 | ✅ Positive | Downloaded file has valid filename and non-zero size | — |
| TC-BL-N01 | ❌ Negative | Click GO without selecting any filters | — |
| TC-BL-N02 | ❌ Negative | Export without running report should not download | — |
| TC-BL-N03 | ❌ Negative | Navigate away mid-report then return – filters reset | — |
| TC-BL-N04 | ❌ Negative | Select Type only (no Content Type) and click GO | — |
| TC-BL-E01 | ⚠️ Edge | Click GO multiple times rapidly – no duplicate requests | — |
| TC-BL-E02 | ⚠️ Edge | Change filters after GO and click GO again – data refreshes | — |
| TC-BL-E03 | ⚠️ Edge | Report loads correctly in 1280x900 viewport | — |
| TC-BL-E04 | ⚠️ Edge | Loader disappears before verifying table data | — |
| TC-BL-E05 | ⚠️ Edge | Re-run report without refreshing page – session stays valid | — |

---

## ✅ Positive Test Cases

---

### TC-BL-01 | Full flow – Type: Content Type, Content Type: Obligations → GO → Export

**Priority:** High  
**Type:** Positive / Happy Path  

**Preconditions:**
- User is logged in via SSO
- Content center dashboard is loaded

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover Report menu | Submenu becomes visible |
| 2 | Click "Broken Links" | Broken Links report page loads |
| 3 | Select Type → "Content Type" | Dropdown shows "Content Type" |
| 4 | Select Content Type → "Obligations" | Dropdown shows "Obligations" |
| 5 | Click GO | Loader appears then disappears, table populates |
| 6 | Verify table has rows | At least 1 row visible |
| 7 | Verify Export button is enabled | Export button is not disabled |
| 8 | Click Export | File download starts |
| 9 | Verify downloaded file | Filename matches pattern, size > 0 bytes |

**Expected Outcome:** Report generates and file downloads successfully  
**Assertion:** `rowCount > 0`, `exportEnabled = true`, `filename` is non-empty

---

### TC-BL-02 | Report menu accessible via hover → Broken Links loads

**Priority:** High  
**Type:** Positive / Navigation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to content-center | Dashboard loads |
| 2 | Hover over "Report" menu item | Submenu becomes visible |
| 3 | Click "Broken Links" | Page loads with Broken Links report UI |
| 4 | Verify URL contains content-center | Stays within the app |

**Expected Outcome:** Navigation via Report menu hover works correctly  
**Assertion:** Page loads without errors, Broken Links UI is visible

---

### TC-BL-03 | GO button triggers report with valid filters

**Priority:** High  
**Type:** Positive / Functionality

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Broken Links page | Page ready |
| 2 | Select Type → "Content Type" | Filter applied |
| 3 | Select Content Type → "Obligations" | Filter applied |
| 4 | Click GO | Loader appears |
| 5 | Wait for loader to disappear | Data rendered in table |

**Expected Outcome:** GO button correctly triggers data load  
**Assertion:** Loader hides and `tbody tr` count > 0

---

### TC-BL-04 | Export button visible and enabled after data loads

**Priority:** Medium  
**Type:** Positive / UI State

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Data loads |
| 2 | Wait for loader to disappear | Table fully visible |
| 3 | Check Export button state | Visible and not disabled |

**Expected Outcome:** Export button is actionable after data loads  
**Assertion:** `isExportEnabled()` returns `true`

---

### TC-BL-05 | Downloaded file has valid filename and non-zero size

**Priority:** Medium  
**Type:** Positive / File Validation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Run full report flow (TC-BL-01) | Data loads |
| 2 | Click Export | Download begins |
| 3 | Wait for download to complete | File saved locally |
| 4 | Check filename | Matches pattern e.g. `Link_Validation_Report_*.xlsx` |
| 5 | Check file size | Greater than 0 bytes |

**Expected Outcome:** Downloaded file is valid and non-empty  
**Assertion:** `filename` is truthy, file readable with non-zero bytes

---

## ❌ Negative Test Cases

---

### TC-BL-N01 | Click GO without selecting any filters – verify behaviour

**Priority:** High  
**Type:** Negative / Missing Input

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Broken Links page | Page loads |
| 2 | Do NOT select Type or Content Type | Filters remain empty |
| 3 | Click GO | System handles gracefully |
| 4 | Verify no crash | Page remains stable |
| 5 | Verify feedback | Error message shown OR empty table displayed |

**Expected Outcome:** System handles missing filters without crashing  
**Assertion:** No JS errors, page stable, appropriate user feedback shown

---

### TC-BL-N02 | Export without running report should not download

**Priority:** Medium  
**Type:** Negative / Pre-condition Validation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Broken Links page | Page loads |
| 2 | Do NOT click GO | Table is empty |
| 3 | Attempt to click Export (if visible) | No download starts OR button is disabled |
| 4 | Verify no file downloaded | Download list remains empty |

**Expected Outcome:** Export does not work without running the report first  
**Assertion:** No download event triggered, or Export button is disabled/hidden

---

### TC-BL-N03 | Navigate away mid-report then return – filters reset

**Priority:** Medium  
**Type:** Negative / State Reset

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Data loads |
| 2 | Navigate to another report (e.g. Industry Report) | Page changes |
| 3 | Navigate back to Broken Links | Broken Links page loads fresh |
| 4 | Verify filter dropdowns | Filters are reset to default/empty |

**Expected Outcome:** Filter state does not persist across navigations  
**Assertion:** Type and Content Type dropdowns are empty/default after returning

---

### TC-BL-N04 | Select Type only (no Content Type) and click GO

**Priority:** Medium  
**Type:** Negative / Partial Input

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Broken Links page | Page loads |
| 2 | Select Type → "Content Type" | Type selected |
| 3 | Do NOT select Content Type | Second filter empty |
| 4 | Click GO | System responds |
| 5 | Verify outcome | Either shows error/prompt OR runs with partial filter |

**Expected Outcome:** System handles partial filter selection gracefully  
**Assertion:** No crash, user receives clear feedback or result

---

## ⚠️ Edge Cases

---

### TC-BL-E01 | Click GO multiple times rapidly – no duplicate requests or crashes

**Priority:** Medium  
**Type:** Edge / Rapid Interaction

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select both filters | Filters ready |
| 2 | Click GO 3 times rapidly | System handles multiple clicks |
| 3 | Wait for final result | One result loads, no duplicates |
| 4 | Verify page is stable | No error banners or JS crashes |

**Expected Outcome:** System is stable under rapid repeated clicks  
**Assertion:** Table loads correctly, no error messages visible

---

### TC-BL-E02 | Change filters after GO and click GO again – data refreshes

**Priority:** Medium  
**Type:** Edge / Filter Change

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select Type + Content Type → click GO | First result loads |
| 2 | Change Content Type to a different value | Filter updated |
| 3 | Click GO again | New report runs |
| 4 | Verify data refreshes | Table updates to reflect new filter |

**Expected Outcome:** Report re-runs with updated filters, data changes  
**Assertion:** Table row count or content differs from first run

---

### TC-BL-E03 | Report loads correctly in 1280x900 viewport

**Priority:** Low  
**Type:** Edge / Viewport / Responsive

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set viewport to 1280x900 | Browser at standard size |
| 2 | Run full report flow | Report generates |
| 3 | Verify all UI elements visible | No overlapping or hidden critical elements |
| 4 | Export and verify download | File downloads correctly |

**Expected Outcome:** Full report flow works in standard 1280x900 viewport  
**Assertion:** All steps pass without layout issues

---

### TC-BL-E04 | Loader disappears before verifying table data

**Priority:** Medium  
**Type:** Edge / Timing / Async

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Loader (`.el-loading-mask`) appears |
| 2 | Wait for loader to be hidden | Loader disappears |
| 3 | Immediately check table | Rows are visible and populated |

**Expected Outcome:** Loader properly hides before data is verified  
**Assertion:** `.el-loading-mask` hidden → `tbody tr` count > 0

---

### TC-BL-E05 | Re-run report without refreshing page – session stays valid

**Priority:** High  
**Type:** Edge / Session Persistence

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Run full report flow once | Report and export succeed |
| 2 | Without refreshing, run again | Filters reselected, GO clicked again |
| 3 | Verify second run succeeds | Data loads, export works |
| 4 | Confirm no session/auth errors | No redirect to SSO login |

**Expected Outcome:** Session remains valid across multiple report runs  
**Assertion:** Second run completes successfully, URL stays on content-center

---

## 🔧 Locator Reference

| Element | Locator Strategy |
|---------|-----------------|
| Report menu | `//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']` |
| Broken Links item | `.el-menu--popup .el-menu-item` filter `hasText: "Broken Links"` |
| Type dropdown | `input[placeholder="Select type"]` |
| Content Type dropdown | `input[placeholder="Select content type"]` |
| GO button | `getByRole('button', { name: 'GO', exact: true })` |
| Export button | `getByRole('button', { name: 'Export', exact: true })` |
| Loader mask | `.el-loading-mask` |
| Table rows | `tbody tr, .el-table__body tr` |

---

## 📁 Related Files

| File | Purpose |
|------|---------|
| `tests/broken-links-report.spec.ts` | Automated test implementation (TC-BL-01 passing) |
| `pages/ReportPage.ts` | Page Object Model for all Report pages |
| `test-data/testData.ts` | Filter values (`REPORT_ITEMS.BROKEN_LINKS`, `REPORT_DATA`) |
| `utils/helpers.ts` | `assertTableHasData()`, `assertUrl()` helpers |
