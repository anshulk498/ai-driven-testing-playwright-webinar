# ✅ Industry Report Test

## 📋 Test Overview
**Test File:** `tests/verify-industry-report.spec.ts`
**Status:** ✅ PASSED
**Date:** April 14, 2026
**Framework:** Playwright 1.57.0
**Browser:** Chromium

---

## 🎯 Test Steps

| Step | Description | Expected Outcome |
|------|-------------|------------------|
| 1 | Navigate to SSO page | SSO page loads successfully |
| 2 | Click Developer Login | Redirects to `/content-center` |
| 3 | Hover over Report menu | Report submenu becomes visible |
| 4 | Click on Industry Report | Industry Report page loads |
| 5 | Select Type → Content Type | "Content Type" is selected in the Type dropdown |
| 6 | Select Content Type → Obligations | "Obligations" is selected in the Content Type dropdown |
| 7 | Click GO | Report query is triggered |
| 8 | Wait for loader to disappear | Loader hides and data is rendered |
| 9 | Verify table has data | Table rows are visible or "No results" shown |
| 10 | Verify Export button is enabled | Export button is visible and enabled |
| 11 | Click Export and verify success | File downloads and/or success toast appears |

---

## ✅ Validations

1. SSO page loads successfully at `https://cert-comply.content.aws.lexis.com/sso`.
2. Developer Login button is visible and clickable.
3. After login, URL contains `/content-center`.
4. Report menu is hoverable using XPath `//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']`.
5. "Industry Report" sub-menu item is visible and clickable.
6. Type dropdown accepts "Content Type" selection.
7. Content Type dropdown accepts "Obligations" selection.
8. GO button (`el-button--primary`) triggers the report.
9. Loading mask (`.el-loading-mask`) disappears after data loads.
10. Table rows are rendered after GO is clicked.
11. Export button (`getByRole('button', { name: 'Export', exact: true })`) is enabled when data exists.
12. Clicking Export triggers a file download or shows a success toast.

---

## 🔧 Locator Strategy

| Element | Locator |
|---------|---------|
| Developer Login | `getByRole('button', { name: /Developer Login/i })` |
| Report menu hover | `xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Report']` |
| Industry Report item | `xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='Industry Report']` |
| Type dropdown | `input[placeholder="Select type"]` |
| Content Type dropdown | `input[placeholder="Select content type"]` |
| GO button | `getByRole('button', { name: 'GO', exact: true })` |
| Loading mask | `.el-loading-mask` |
| Export button | `getByRole('button', { name: 'Export', exact: true })` |
| Success toast | `.el-message--success, .el-notification--success` |

### Resilience Pattern
All locators use a **multi-fallback helper** (`findAndClick` / `findLocator`) that tries up to 4 selector strategies before failing. This prevents brittle test failures when minor UI changes occur.

---

## 📝 Technical Notes

- Each step waits for element visibility before interaction
- Dropdown dismissal via `page.locator('body').click({ position: { x: 10, y: 10 } })` before GO
- Export handles both download event and toast message
- Test timeout: `120,000ms` (2 minutes)

---

*Generated: April 14, 2026*
*Test Framework: Playwright 1.57.0*
*Browser: Chromium*
