# 📋 Industry Report – Full Test Plan (Positive / Negative / Edge)

**Test File:** `tests/industry-report-full.spec.ts`  
**Feature:** Industry Report – Filter, Generate, Export  
**URL:** `https://cert-comply.content.aws.lexis.com/content-center` → Report → Industry Report  
**Framework:** Playwright 1.57.0 | Browser: Chromium  
**Last Updated:** April 20, 2026  

---

## 🗂️ Test Summary

| Test ID | Type | Title | Status |
|---------|------|-------|--------|
| TC-IR-01 | ✅ Positive | Full flow – Type + Content Type → GO → Export | — |
| TC-IR-02 | ✅ Positive | Report menu accessible via hover | — |
| TC-IR-03 | ✅ Positive | GO button enabled only after both filters selected | — |
| TC-IR-04 | ✅ Positive | Export button visible and enabled after data loads | — |
| TC-IR-05 | ✅ Positive | Downloaded file has valid filename and non-zero size | — |
| TC-IR-N01 | ❌ Negative | Click GO without selecting any filters | — |
| TC-IR-N02 | ❌ Negative | Export without data loaded should not download | — |
| TC-IR-N03 | ❌ Negative | Navigate away mid-report then return – filters reset | — |
| TC-IR-E01 | ⚠️ Edge | Click GO multiple times rapidly – no crashes | — |
| TC-IR-E02 | ⚠️ Edge | Change filters after GO and click GO again – data refreshes | — |
| TC-IR-E03 | ⚠️ Edge | Report loads correctly in 1280x900 viewport | — |
| TC-IR-E04 | ⚠️ Edge | Loader disappears before verifying table data | — |
| TC-IR-E05 | ⚠️ Edge | Re-run report without refreshing page – session stays valid | — |

---

## ✅ Positive Test Cases

---

### TC-IR-01 | Full flow – Type: Content Type, Content Type: Obligations → GO → Export

**Priority:** High  
**Type:** Positive / Happy Path

**Preconditions:**
- User is logged in via SSO
- Content center is loaded

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Hover Report menu | Report submenu appears |
| 2 | Click "Industry Report" | Industry Report page loads |
| 3 | Select Type → "Content Type" | Type dropdown shows "Content Type" |
| 4 | Select Content Type → "Obligations" | Content Type dropdown shows "Obligations" |
| 5 | Click GO | Loader appears then disappears, table populates |
| 6 | Verify table has rows | At least 1 row visible in table |
| 7 | Click Export | File download starts |
| 8 | Verify downloaded file | File name matches pattern, size > 0 bytes |

**Expected Outcome:** Report generates and file downloads successfully  
**Assertion:** `tableRows > 0`, file downloaded with valid name and size

---

### TC-IR-02 | Report menu is accessible via hover → Industry Report loads

**Priority:** High  
**Type:** Positive / Navigation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to content-center | Dashboard loads |
| 2 | Hover over "Report" menu item | Submenu becomes visible |
| 3 | Click "Industry Report" | URL changes and page loads |
| 4 | Verify page is on Industry Report | Correct page title/content visible |

**Expected Outcome:** Navigation via hover works correctly  
**Assertion:** Page loads without errors after hover + click

---

### TC-IR-03 | GO button enabled only after both filters are selected

**Priority:** Medium  
**Type:** Positive / Validation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Industry Report page | Page loads, GO button state is initial |
| 2 | Do NOT select any filter | GO button may be enabled/disabled |
| 3 | Select Type only | Observe GO button state |
| 4 | Select Content Type | GO button becomes fully enabled |
| 5 | Click GO | Report runs successfully |

**Expected Outcome:** Report runs after selecting both filters  
**Assertion:** GO click triggers loader and table populates

---

### TC-IR-04 | Export button is visible and enabled after data loads

**Priority:** Medium  
**Type:** Positive / UI State

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Data loads in table |
| 2 | Wait for loader to disappear | Table is fully visible |
| 3 | Check Export button | Button is visible and not disabled |

**Expected Outcome:** Export button is actionable after data loads  
**Assertion:** `exportBtn` is visible and enabled

---

### TC-IR-05 | Downloaded file has valid filename and non-zero size

**Priority:** Medium  
**Type:** Positive / File Validation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Run full report flow (TC-IR-01) | Data loads |
| 2 | Click Export | Download begins |
| 3 | Wait for download to complete | File saved locally |
| 4 | Check filename | Matches pattern `Industry_Report_*.xlsx` |
| 5 | Check file size | Greater than 0 bytes |

**Expected Outcome:** Downloaded file is valid and non-empty  
**Assertion:** `file.suggestedFilename()` matches pattern, `file.createReadStream()` readable

---

## ❌ Negative Test Cases

---

### TC-IR-N01 | Click GO without selecting any filters – verify behaviour

**Priority:** High  
**Type:** Negative / Missing Input

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Industry Report page | Page loads |
| 2 | Do NOT select Type or Content Type | Filters are empty |
| 3 | Click GO | System shows validation message OR runs with empty result |
| 4 | Verify no crash occurs | Page remains stable |

**Expected Outcome:** System handles empty filters gracefully  
**Assertion:** No JS errors, page does not crash, either error message or empty table shown

---

### TC-IR-N02 | Export button should not trigger download when no data loaded

**Priority:** Medium  
**Type:** Negative / Pre-condition Validation

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Load Industry Report page | Page loads |
| 2 | Do NOT click GO | No data in table |
| 3 | Attempt to click Export (if visible) | No download starts OR button is disabled |
| 4 | Verify no file downloaded | Download list remains empty |

**Expected Outcome:** Export does not work without running the report  
**Assertion:** No download event triggered, or Export button is disabled/hidden

---

### TC-IR-N03 | Navigate away mid-report then return – filters should reset

**Priority:** Medium  
**Type:** Negative / State Reset

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Data loads |
| 2 | Navigate to another page (e.g. Broken Links) | Page changes |
| 3 | Navigate back to Industry Report | Industry Report page loads fresh |
| 4 | Verify filter state | Filters are reset to default/empty |

**Expected Outcome:** Filters do not persist across navigations  
**Assertion:** Dropdown values are empty/default after returning

---

## ⚠️ Edge Cases

---

### TC-IR-E01 | Click GO multiple times rapidly – no duplicate requests or crashes

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
**Assertion:** Table loads correctly, no error messages

---

### TC-IR-E02 | Change filters after GO and click GO again – data refreshes

**Priority:** Medium  
**Type:** Edge / Filter Change

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select Type + Content Type → click GO | First result loads |
| 2 | Change Content Type to different value | Filter updated |
| 3 | Click GO again | New report runs |
| 4 | Verify data refreshes | Table shows new data matching new filter |

**Expected Outcome:** Report re-runs with new filters, data updates  
**Assertion:** Table row count or data differs from first run

---

### TC-IR-E03 | Report loads correctly in 1280x900 viewport

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

### TC-IR-E04 | Loader disappears before verifying table data

**Priority:** Medium  
**Type:** Edge / Timing / Async

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select filters and click GO | Loader (`.el-loading-mask`) appears |
| 2 | Wait for loader to be hidden | Loader disappears |
| 3 | Immediately verify table | Table rows are visible and populated |

**Expected Outcome:** Loader properly hides before data is verified  
**Assertion:** `.el-loading-mask` hidden → `tbody tr` count > 0

---

### TC-IR-E05 | Re-run report without refreshing page – session stays valid

**Priority:** High  
**Type:** Edge / Session Persistence

**Steps:**
| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Run full report flow once | Report and export succeed |
| 2 | Without refreshing, run the report again | Filters reselected, GO clicked again |
| 3 | Verify second run succeeds | Data loads, export works |
| 4 | Confirm no session/auth errors | No redirect to SSO login |

**Expected Outcome:** Session remains valid across multiple report runs  
**Assertion:** Second run completes successfully, URL stays on content-center

---

## 🔧 Locator Reference

| Element | Locator Strategy |
|---------|-----------------|
| Report menu | `//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']` |
| Industry Report item | `.el-menu--popup .el-menu-item` filter `hasText: "Industry Report"` |
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
| `tests/industry-report-full.spec.ts` | Automated test implementation |
| `tests/industry-report.spec.ts` | Original simple positive test |
| `pages/ReportPage.ts` | Page Object Model for Report pages |
| `test-data/testData.ts` | Filter values (REPORT_ITEMS, REPORT_DATA) |
