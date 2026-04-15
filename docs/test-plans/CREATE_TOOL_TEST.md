# Create Tool Test Plan

## Test Overview
**Test File:** `tests/verify-create-tool.spec.ts`
**Feature:** Create Tool – Full End-to-End Flow
**Status:** 🔄 IN PROGRESS
**Date:** April 14, 2026
**Framework:** Playwright 1.57.0
**Browser:** Chromium
**Timeout:** 300,000ms (5 minutes)

---

## Test Steps

### Step 1: Navigate to SSO
- **URL:** `https://cert-comply.content.aws.lexis.com/sso`
- **Action:** Open the SSO login page
- **Expected:** SSO page loads successfully

### Step 2: Developer Login
- **Action:** Click "Developer Login" button
- **Expected:** Redirects to `/content-center`
- **Locator:** `getByRole('button', { name: /Developer Login/i })`

### Step 3: Click Tools Tab
- **Action:** Click the "Tools" tab in the tablist
- **Expected:** Tools tab becomes active, Tools listing is shown
- **Locator:** `getByRole('tab', { name: /^Tools$/i })`

### Step 4: Click Create Button
- **Action:** Click the "Create" button on the Tools listing page
- **Expected:** New tab opens with toolCreation page
- **Locator:** `getByRole('button', { name: /^Create$/i })`

### Step 5: Switch to New Tab (toolCreation)
- **Action:** Wait for new tab to open, switch to it
- **Expected URL:** `https://cert-comply.content.aws.lexis.com/content-center/toolCreation`
- **Note:** If new tab does not open, navigate directly to toolCreation URL
- **Wait for:** `input[placeholder="Select module"]` to be visible (form ready)

### Step 6: Select Module → Aged Care
- **Field:** "Select module" dropdown
- **Action:** Click dropdown trigger, select "Aged Care" from listing
- **Placeholder:** `Select module`
- **Expected:** "Aged Care" is selected

### Step 7: Select Topic → Home Care
- **Field:** "Select topic" dropdown
- **Action:** Click dropdown trigger (wait for it to be enabled), select "Home Care"
- **Placeholder:** `Select topic`
- **Expected:** "Home Care" is selected

### Step 8: Select Obligation → First Value
- **Field:** "Select obligation" dropdown
- **Action:** Click dropdown trigger (wait for enabled), select first value from listing
- **Placeholder:** `Select obligation`
- **Expected:** First obligation value is selected

### Step 9: Click Add → Verify Obligation Listed
- **Action:** Click "Add" button
- **Expected:** Obligation row appears in the table on the page
- **Locator:** `getByRole('button', { name: /^Add$/i })`

### Step 10: Enter Title
- **Field:** "Enter title" text input
- **Action:** Click input, fill with auto-generated title (e.g. `Auto Tool <timestamp>`)
- **Placeholder:** `Enter title`
- **Expected:** Title is filled

### Step 11: Select Tool Functions → Flowchart
- **Field:** "Select Tool Functions" dropdown
- **Action:** Click dropdown, select "Flowchart" from listing
- **Placeholder:** `Select Tool Functions`
- **Expected:** "Flowchart" is selected

### Step 12: Select Category → Ext
- **Field:** "Select Category" dropdown
- **Action:** Click dropdown, select "Ext" from listing
- **Placeholder:** `Select Category`
- **Expected:** "Ext" is selected, External Link field appears

### Step 13: Fill External Link
- **Field:** External link text input (appears after selecting "Ext" category)
- **Action:** Fill with URL `https://cert-comply.content.aws.lexis.com/content-center/toolCreation`
- **Placeholder:** `Enter external link`
- **Expected:** Link is filled

### Step 14: Select Jurisdictions → India & China
- **Field:** "Select Jurisdictions" multi-select dropdown
- **Action:**
  1. Click the **`.el-select` wrapper div** (not the readonly input inside it) — the input is intercepted by the tag-select component
  2. Dropdown opens showing country listing
  3. Click the **span** for China (`nth(3)` in the dropdown list)
  4. Click the **span** for India (`nth(8)` in the dropdown list)
  5. Press Escape to close
- **Placeholder:** `Select Jurisdictions`
- **Locator for trigger:** `.el-select` filtered by `has: input[placeholder*="Jurisdictions" i]` → `.first()` → `.click()`
- **Locator for items:** `.el-select-dropdown:visible ul > div > div` → `.nth(3)` (China), `.nth(8)` (India) → `span.first()`
- **Note:** Indices 3 (China) and 8 (India) verified from working subobligation spec
- **Expected:** India and China are selected (appear as tags)

### Step 15: Click Create → Verify Toast
- **Action:** Click the "Create" submit button
- **Expected:** Toast message appears: `"Tool saved successfully."`
- **Locator:** `getByRole('button', { name: /^Create$/i })`
- **Toast selector:** `.el-message--success`, `.el-notification--success`

### Step 16: Extract Tool ID
- **Action:** After creation, extract the ID from the page
- **Sources (in order):**
  1. URL pattern: `/toolDetails/9003124` → extract `9003124`
  2. Page body text: match `ID: 9003124` or `#9003124`
  3. Dedicated ID element on page
- **Expected:** A numeric ID (4+ digits) is captured

### Step 17: Navigate to Content Center
- **URL:** `https://cert-comply.content.aws.lexis.com/content-center`
- **Action:** Click the **logo/home icon** on the toolCreation page to navigate back to content center
- **Locator:** `.logo img`, `header img`, `a img` (first logo link)
- **Expected:** Content center loads

### Step 18: Search Tool by ID → Verify
- **Action:**
  1. Click the "Tools" tab on the original page
  2. Wait 2s for the Tools table to load
  3. Click the search icon on the ID column of the Tools table: `.el-table_3_column_22 .el-icon.search-icon`
  4. Fill the `Search by ID` textbox with the extracted tool ID
  5. Click "Submit" button
  6. Wait 5s for results to load
  7. Verify the ID appears in the results table
- **Page:** Original `page` (not `toolPage`)
- **Locator for search icon:** `.el-table_3_column_22 .el-icon.search-icon` (Tools table ID column)
- **Locator for input:** `getByRole('textbox', { name: /Search by ID/i })`
- **Expected:** Tool row with the created ID is visible in the table

---

## Locator Strategy

| Element | Locator |
|---------|---------|
| SSO page | `goto('https://cert-comply.content.aws.lexis.com/sso')` |
| Developer Login | `getByRole('button', { name: /Developer Login/i })` |
| Tools tab | `getByRole('tab', { name: /^Tools$/i })` |
| Create button | `getByRole('button', { name: /^Create$/i })` |
| Module dropdown | `input[placeholder="Select module"]` |
| Topic dropdown | `input[placeholder="Select topic"]` |
| Obligation dropdown | `input[placeholder="Select obligation"]` |
| Add button | `getByRole('button', { name: /^Add$/i })` |
| Title input | `input[placeholder="Enter title"]` |
| Tool Functions dropdown | `input[placeholder="Select Tool Functions"]` |
| Category dropdown | `input[placeholder="Select Category"]` |
| External link input | `input[placeholder="Enter external link"]` (value: `https://cert-comply.content.aws.lexis.com/content-center/toolCreation`) |
| **Jurisdiction trigger** | **`.el-select` filtered by `has: input[placeholder*="Jurisdictions" i]`** |
| **China item** | **`.el-select-dropdown:visible ul > div > div` nth(3) `span`** |
| **India item** | **`.el-select-dropdown:visible ul > div > div` nth(8) `span`** |
| Search icon | `.table-header > .el-icon.search-icon > svg` |
| Search by ID input | `getByRole('textbox', { name: /Search by ID/i })` |
| Toast success | `.el-message--success`, `.el-notification--success` |
| ID column filter icon | `thead th:nth-child(1) img:last-child` |

---

## Technical Notes

- **New tab handling:** Create button opens toolCreation in a new tab. Use `context.waitForEvent('page')` before clicking. If no new tab, fallback to direct `goto`.
- **Dependent dropdowns:** Topic is enabled only after Module is selected. Obligation is enabled only after Topic is selected. Use `waitForFunction` to wait for `input` to be not disabled.
- **Jurisdiction uses checkboxes:** NOT a standard el-select single/multi-select. It opens a panel with a tree/list of countries each having a checkbox (`input[type="checkbox"]` or `.el-checkbox__input`).
- **Toast race condition:** Set up toast listener BEFORE clicking Create button.
- **networkidle:** Do NOT use `waitForLoadState('networkidle')` — app has continuous background requests. Use `domcontentloaded` + specific element wait instead.
- **Test timeout:** 300,000ms (5 minutes)

---

*Generated: April 14, 2026*
*Test Framework: Playwright 1.57.0*
*Browser: Chromium*
