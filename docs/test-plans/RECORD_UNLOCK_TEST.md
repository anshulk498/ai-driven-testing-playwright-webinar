# ✅ Record Unlock Test Plan

## 📋 Test Overview
**Test File:** `tests/verify-record-unlock.spec.ts`  
**Status:** ✅ PASSING  
**Date:** April 14, 2026

---

## 🎯 Test Steps

| Step | Description | Expected Outcome |
|------|-------------|------------------|
| 1 | Open SSO page | SSO page is loaded successfully |
| 2 | Click on Developer Login | Developer Login button is clicked and user is redirected to content-center |
| 3 | Verify URL | URL contains `/content-center` |
| 4 | Hover over Admin menu | Admin submenu popup is displayed |
| 5 | Click on "Record Unlock" | Record Unlock page is loaded |
| 6 | Click on "Obligations" tab | Obligations tab becomes active and table loads |
| 7 | Click Unlock button on first row | Confirmation popup appears |
| 8 | Click "Yes, Unlock" on confirmation popup | Popup closes and success toast is shown |
| 9 | Verify success toast | Toast message reads "Record unlocked successfully" |

---

## ✅ Validations

1. Verify the SSO page loads successfully.
2. Verify the Developer Login button is visible and clickable.
3. Verify the URL after login contains `/content-center`.
4. Verify the Admin submenu opens on hover.
5. Verify the Record Unlock page loads after clicking the menu item.
6. Verify the Obligations tab is active and the table contains data.
7. Verify the Unlock button is present in the first table row.
8. Verify the confirmation popup appears with a "Yes, Unlock" button.
9. Verify the success toast appears (or verify row count decreases as fallback).

---

## 🔍 Locator Strategy

| Element | Primary Locator | Fallbacks |
|---------|----------------|-----------|
| Developer Login | `getByRole('button', { name: /Developer Login/i })` | `locator('button').filter({ hasText: /Developer Login/i })` |
| Admin menu | `xpath=//div[contains(@class,'el-sub-menu__title') and normalize-space()='Admin']` | `.el-sub-menu__title` filter, `getByRole('menuitem')` |
| Record Unlock | `xpath=//ul[contains(@class,'el-menu--popup')]//li[contains(@class,'el-menu-item') and normalize-space()='Record Unlock']` | `.el-menu--popup .el-menu-item` filter |
| Obligations tab | `getByRole('tab', { name: /^Obligations$/i })` | `.el-tabs__item` filter, `[role="tab"]` filter |
| Unlock button | `tbody tr:first-child` → `getByRole('button', { name: /Unlock/i })` | `.el-table__body tr` first row button |
| Yes, Unlock | `getByRole('button', { name: /Yes.*Unlock/i })` | `.el-dialog button`, `.el-message-box button` |
| Success toast | `.el-message--success` | `.el-notification--success`, `.el-message`, `.el-notification` |

---

## ⚙️ Technical Notes

- **Timeout:** `test.setTimeout(120_000)` — allows for slow network loads
- **Toast race condition fix:** `toastPromise` is set up **before** `confirmBtn.click()` to avoid missing fast-disappearing toasts
- **Fallback verification:** If the toast disappears before capture, the test verifies success by checking the table row count decreased (e.g., 731 → 730)
- **Loading mask wait:** `el-loading-mask` hidden wait applied before interacting with the table
- **Multi-fallback helpers:** `findAndClick` / `findLocator` try each locator in order, logging which attempt succeeded

---

## 🏷️ Tags

- **Category:** Admin / Record Management  
- **Browser:** Chromium  
- **Framework:** Playwright 1.57.0  
- **Application:** Content Center (cert-comply)

---

*Generated: April 14, 2026*  
*Test Framework: Playwright 1.57.0*  
*Browser: Chromium*
