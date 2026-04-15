# ✅ SSO Historical Report Test Steps

## 📋 Test Overview
**Test File:** `tests/verify-historical-report.spec.ts`  
**Status:** Pending Execution  
**Date:** April 13, 2026

---

## 🎯 Test Steps

| Step | Description | Expected Outcome |
|------|-------------|------------------|
| 1 | Open SSO page | SSO page is loaded successfully |
| 2 | Click on Developer Login | Developer Login button is clicked successfully |
| 3 | Verify URL | URL is verified as `https://cert-comply.content.aws.lexis.com/content-center` |
| 4 | Hover to Report and click on Historical Notes | Historical Report is clicked successfully |
| 5 | Click on Select Module and select the Aged Care module from dropdown listing | Aged Care module is selected successfully |
| 6 | Click on Select Date under To Date heading and select 22nd date from calendar | Date is selected successfully |
| 7 | Click on Select Type and click on Material | Material type is selected successfully |
| 8 | Click on Go and wait until loader stops | Loader disappears after data is loaded |
| 9 | Click on Export if data exists on the table | Export button is clicked successfully |

---

## ✅ Validations

1. Verify the SSO page loads successfully.
2. Verify the Developer Login button is visible and clickable.
3. Verify the URL after login.
4. Verify the Historical Report option is available and clickable.
5. Verify the Aged Care module is selectable from the dropdown.
6. Verify the calendar opens and the date can be selected.
7. Verify the Material type is selectable.
8. Verify the loader disappears after clicking Go.
9. Verify the Export button is clickable if data exists in the table.

---

*Generated: April 13, 2026*  
*Test Framework: Playwright 1.57.0*  
*Browser: Chromium*