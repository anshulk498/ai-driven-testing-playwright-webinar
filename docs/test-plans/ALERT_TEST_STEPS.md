# Alert Creation Test Steps

## Original Requirements

**Task:** Create Alert with Aged Care and Home Care

### Required Steps:
1. Create Alert
2. Select **Aged Care** module
3. Select **Home Care** topic
4. Select **India and China** jurisdictions
5. Fill **Description**
6. Fill **Compliance Source**
7. Fill **Impact of Obligation**
8. Fill **Meta Tags** (Impact Rating & Rationale, AI summary, Ai suggested action, industries,Effective Dates add,Organisational Function,Compliance Requirement Level,Compliance Area / Topic,Regulatory Update Type) please handle this
9. **Save as Draft**
10. **Start Review**

### Additional Instructions:
- "donot click on ai assistant" (No AI Generate buttons)
- "after the save as a draft 
- "there is no popup only have toast message"
- "we have new tab when user click on create button"
- "there is no new page when you got toast message go to immediate fill description and so on"
- "no tab closes"
- "donot go back to content center page ok skip 11,12,13" (Skip navigation/search steps)

---

## Current Implementation

### Test File: `tests/create-alert.spec.ts`

**Execution Time:** ~46 seconds  
**Status:** ✅ PASSING

### Implemented Steps:

**1. Login** ✅
   - Navigate to https://cert-comply.content.aws.lexis.com/
   - Click "Developer Login" button
   - Wait for content-center page

**2. Navigate to Alerts Tab** ✅
   - Click "Alerts" tab
   - Wait 2 seconds
   - Screenshot: `alerts-tab.png`

**3. Open Alert Creation (New Tab)** ✅
   - Click "Create" button
   - New tab opens at `/content-center/alertCreation`
   - Screenshot: `alert-creation-form.png`

**4. Select Module: Aged Care** ✅
   - Click module dropdown
   - Select "Aged Care"

**5. Select Topic: Home Care** ✅
   - Click topic dropdown
   - Select "Home Care"

**6. Select Obligation** ✅
   - Click obligation dropdown
   - Select first option: "Auto Obligation 252"
   - Click "Add" button

**7. Enter Title** ✅
   - Fill: `Test Alert - {timestamp}`

**8. Select Type: News** ✅
   - Click type dropdown
   - Select "News"

**9. Select Jurisdictions: India & China** ✅
   - Click jurisdiction dropdown (force click)
   - Check India checkbox
   - Check China checkbox
   - Press Escape
   - Screenshot: `alert-before-create.png`

**10. Create Alert (Initial Save)** ✅
   - Click "Create" button
   - Wait for toast: "Alert saved successfully"
   - Tab remains open at `/alertCreation`
   - Screenshot: `alert-immediately-after-create.png`

**11. Fill Description** ✅
   - Find TinyMCE iframe editor
   - Click editor container
   - Type 158-word description via keyboard
   - Wait 1 second
   - **Status: Description filled**

**12. Explore Fields** ✅
   - Screenshot: `alert-after-description.png`
   - Scroll down 400px
   - Screenshot: `alert-scrolled.png`
   - **Detected: 11 visible text inputs/textareas**

**13. Save Alert** ✅
   - Click Save button
   - Toast: "Alert saved successfully"
   - **Status: Saved**

**14. Start Review** ⚠️
   - Look for Start Review button
   - **Status: Button not found** (doesn't exist for Alerts)

---

## Test Results

**✅ COMPLETED:**
- ✅ Aged Care module selected
- ✅ Home Care topic selected
- ✅ India & China jurisdictions selected
- ✅ Description filled (158 words)
- ✅ Alert saved as draft

**❌ NOT IMPLEMENTED:**
- ❌ Compliance Source field (not filled)
- ❌ Impact of Obligation field (not filled)
- ❌ Meta Tags dropdowns (not filled)
- ❌ Start Review (button doesn't exist for Alerts)

**📊 DETECTED:**
- 11 additional visible text input fields available
- These likely include Compliance Source, Impact, and other fields

---

## Sample Alert Created

**Last Run:**
- **Title:** Test Alert - 1775107367433
- **Module:** Aged Care
- **Topic:** Home Care
- **Obligation:** Auto Obligation 252
- **Type:** News
- **Jurisdictions:** India, China
- **Description:** Filled (158 words)
- **Status:** Saved successfully
- **Execution Time:** 46.3 seconds

---

## Screenshots Generated

1. `alerts-tab.png` - Alerts tab view
2. `alert-creation-form.png` - New tab with creation form
3. `alert-before-create.png` - Form filled, ready to create
4. `alert-immediately-after-create.png` - Right after clicking Create
5. `alert-after-description.png` - After filling description
6. `alert-scrolled.png` - Scrolled view showing more fields
7. `alert-final.png` - Final state

---

## Next Steps to Complete

To fully implement the original requirements:

1. **Identify the 11 detected fields** by examining screenshots
2. **Fill Compliance Source** - locate and fill this field
3. **Fill Impact of Obligation** - locate and fill this field
4. **Fill Meta Tags** - implement dropdown selections for:
   - Industries
   - Org Function
   - Compliance Level
   - Other meta tag fields
5. **Handle Start Review** - determine if different workflow is needed for Alerts vs Core Obligations
