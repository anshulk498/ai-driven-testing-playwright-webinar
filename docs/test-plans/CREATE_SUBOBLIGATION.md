# Subobligation Creation Test Plan

## Test Overview
**Feature**: Create Subobligation with Full Workflow
**Test Duration**: ~2 minutes
**Browser**: Chromium (headed mode)

---

## Test Steps

### Initial Setup (Steps 1-3)

#### Step 1: Navigate to SSO
- **URL**: `https://cert-comply.content.aws.lexis.com/sso`
- **Action**: Open the SSO login page
- **Expected**: Page loads successfully

#### Step 2: Developer Login
- **Action**: Click on "Developer Login" button
- **Expected**: Redirects to Content Center
- **Expected URL**: `https://cert-comply.content.aws.lexis.com/content-center`
- **Verification**: URL matches expected redirect

#### Step 3: Verify Obligations Tab
- **Action**: Click on "Obligations" tab
- **Note**: If already selected, skip this step
- **Expected**: Obligations tab is active

---

### Subobligation Creation (Steps 4-16)

#### Step 4: Navigate to Subobligation Creation
- **Action**: 
  1. Hover over the "Create" button
  2. A dropdown menu appears with two options: "Obligation" and "Subobligation"
  3. Click on "Subobligation"
- **Expected**: New tab opens
- **Expected URL**: `https://cert-comply.content.aws.lexis.com/content-center/subobligationCreation`
- **Action**: Switch to the new tab

#### Step 5: Select Module
- **Field**: "Select Module" dropdown
- **Action**: Click on dropdown
- **Selection**: Select "Aged Care" from the dropdown list
- **Expected**: "Aged Care" is selected and displayed

#### Step 6: Select Topic
- **Field**: "Select Topic" dropdown
- **Action**: Click on dropdown
- **Selection**: Select "Home Care" from the dropdown list
- **Selector**: `text/Home Care` (from JSON recording)
- **Expected**: "Home Care" is selected and displayed

#### Step 7: Select Obligation
- **Field**: "Select Obligation" dropdown
- **Action**: Click on dropdown
- **Selection**: Select the first value from the dropdown list
- **Expected**: First obligation is selected

#### Step 8: Enter Title
- **Field**: "Enter Title" text field
- **Action**: Click on the text field
- **Input**: Enter test title (e.g., "Test Subobligation - [timestamp]")
- **Expected**: Title is entered successfully

#### Step 9: Select Material Type
- **Field**: "Select Material Type" dropdown
- **Action**: Click on dropdown
- **Selection**: Select "Material" from the dropdown list
- **Expected**: "Material" is selected

#### Step 10: Enter Frequency
- **Field**: "Enter Frequency" text field
- **Action**: Click on the text field
- **Input**: Enter frequency value (e.g., "1")
- **Expected**: Frequency value is entered

#### Step 11: Enter Author
- **Field**: "Enter Author" text field
- **Action**: Click on the text field
- **Input**: Enter author name (e.g., "anshul")
- **Expected**: Author name is entered

#### Step 12: Choose Submission Date
- **Field**: "Choose Submission Date" date picker
- **Action**: 
  1. Click on the date field
  2. Wait for calendar to open
  3. Select a date from the calendar
- **Expected**: Date is selected and displayed in the field

#### Step 13: Choose Due Date
- **Field**: "Choose Due Date" date picker
- **Action**: 
  1. Click on the date field
  2. Wait for calendar to open
  3. Select a date from the calendar
- **Expected**: Date is selected and displayed in the field

#### Step 14: Select Jurisdictions
- **Field**: "Select Jurisdictions" multi-select dropdown
- **Action**: 
  1. Click on the dropdown
  2. Checkboxes appear in the listing
  3. Select China (index 3 from dropdown items)
  4. Select India (index 8 from dropdown items)
- **Expected**: Both China and India are selected with visible checkmarks/tags
- **Note**: Use index-based selection (`.nth(3)` for China, `.nth(8)` for India)

#### Step 15: Create Subobligation
- **Action**: Click on the "Create" button
- **Expected**: Subobligation is created
- **Verification**: Toast message appears
- **Expected Toast**: "Subobligation saved successfully."
- **Note**: ⚠️ Test should NOT proceed if this toast does not appear

---

### Content Tabs (Steps 16-23)

#### Step 16: Fill Description Tab
- **Tab**: Description
- **Action**: 
  1. Click on "Description" tab
  2. **Switch to iframe context** - The editor is inside a TinyMCE iframe
  3. Locate the iframe element: `iframe.tox-edit-area__iframe`
  4. Access the editor body element inside iframe: `#tinymce`
  5. Fill 100 words of text in the editor
- **Sample Text**: "This is a comprehensive subobligation description for testing purposes. The subobligation covers important updates regarding aged care and home care services. Organizations should review this information carefully and take appropriate action. Compliance with the outlined requirements is essential for maintaining proper standards and meeting regulatory obligations. Regular monitoring and updates will ensure continued adherence to all applicable guidelines and best practices. This description provides detailed information about the requirements and expectations."
- **Technical Note**: ⚠️ Content field is inside an iframe. Use iframe switching/frameLocator to access the editor
- **Expected**: Content is saved in the Description tab

#### Step 17: Fill Compliance Question Tab
- **Tab**: Compliance Question
- **Action**: 
  1. Click on "Compliance Question" tab
  2. **Switch to iframe context** - The editor is inside a TinyMCE iframe
  3. Locate the iframe element: `iframe.tox-edit-area__iframe` (use `.nth(1)` for second iframe)
  4. Access the editor body element inside iframe: `#tinymce`
  5. Fill 100 words of text in the editor
- **Sample Text**: "This compliance question addresses the key requirements for aged care providers. Organizations must ensure they understand and implement all necessary procedures. What steps have been taken to ensure compliance with the current regulations? Have all staff members been trained on the updated requirements? Are there documented procedures in place for regular compliance checks? How frequently are internal audits conducted? What measures are in place to address non-compliance issues? This question helps assess the organization's readiness."
- **Technical Note**: ⚠️ Content field is inside an iframe. Use iframe switching/frameLocator to access the editor
- **Expected**: Content is saved in the Compliance Question tab

#### Step 18: Fill Guidance Tab
- **Tab**: Guidance
- **Action**: 
  1. Click on "Guidance" tab
  2. **Switch to iframe context** - The editor is inside a TinyMCE iframe
  3. Locate the iframe element: `iframe.tox-edit-area__iframe` (use `.nth(2)` for third iframe)
  4. Access the editor body element inside iframe: `#tinymce`
  5. Fill 100 words of text in the editor
- **Sample Text**: "Guidance for implementing this subobligation includes establishing clear procedures and protocols. Organizations should develop comprehensive training programs for all relevant staff members. Regular reviews and updates of compliance documentation are essential. Consider implementing automated monitoring systems to track compliance status. Ensure that all stakeholders are informed of their responsibilities and obligations. Maintain detailed records of all compliance activities and corrective actions. Seek expert advice when needed to ensure full understanding of requirements. This guidance provides practical steps for successful implementation."
- **Technical Note**: ⚠️ Content field is inside an iframe. Use iframe switching/frameLocator to access the editor
- **Expected**: Content is saved in the Guidance tab

#### Step 19: Fill Remedial Action Tab
- **Tab**: Remedial Action
- **Action**: 
  1. Click on "Remedial Action" tab
  2. Fill 100 words of text in the editor
- **Sample Text**: "Remedial actions must be taken immediately upon identification of non-compliance issues. Organizations should establish a clear escalation process for addressing compliance gaps. Document all remedial actions taken including timelines and responsible parties. Conduct thorough investigations to identify root causes of non-compliance. Implement corrective measures to prevent recurrence of similar issues. Monitor the effectiveness of remedial actions through regular follow-up assessments. Communicate remedial action plans to all affected stakeholders. Review and update procedures based on lessons learned from remedial action implementation."
- **Expected**: Content is saved in the Remedial Action tab

#### Step 20: Fill Consequence Tab
- **Tab**: Consequence
- **Action**: 
  1. Click on "Consequence" tab
  2. Fill 100 words of text in the editor
- **Sample Text**: "Consequences of non-compliance may include regulatory sanctions, financial penalties, and reputational damage. Organizations may face suspension or revocation of licenses and certifications. Legal action may be initiated against non-compliant entities. Staff members may face disciplinary actions including termination. Insurance coverage may be affected or denied. Public disclosure of non-compliance may damage stakeholder confidence. Additional regulatory oversight and increased inspection frequency may be imposed. Organizations must understand these serious consequences to ensure full compliance commitment and adequate resource allocation."
- **Expected**: Content is saved in the Consequence tab

#### Step 21: Fill Definitions Tab
- **Tab**: Definitions
- **Action**: 
  1. Click on "Definitions" tab
  2. Fill 100 words of text in the editor
- **Sample Text**: "Definitions provide clarity on key terms used throughout this subobligation. Aged Care refers to services provided to elderly individuals requiring assistance with daily activities. Home Care encompasses support services delivered in residential settings. Compliance means adherence to all regulatory requirements and standards. Material Type indicates the category and format of compliance documentation. Jurisdiction defines the geographic and legal scope of regulatory authority. Subobligation represents specific requirements derived from primary obligations. These definitions ensure consistent understanding and interpretation across all stakeholders."
- **Expected**: Content is saved in the Definitions tab

#### Step 22: Fill Historical Note Tab
- **Tab**: Historical Note
- **Action**: 
  1. Click on "Historical Note" tab
  2. Click on "Generate" button (if available)
  3. Click on "Choose Date" field
  4. Wait for calendar to open
  5. Select a date from the calendar
- **Note**: Date selection may be required for historical note context
- **Expected**: Historical note is generated with selected date

#### Step 23: Fill Excerpt Tab
- **Tab**: Excerpt
- **Action**: 
  1. Click on "Excerpt" tab
  2. Fill 100 words of text in the editor
- **Sample Text**: "Excerpt from the primary regulation: All aged care providers must establish comprehensive compliance programs addressing home care service delivery standards. Documentation requirements include detailed policies, procedures, and training records. Regular audits and assessments are mandatory to ensure ongoing compliance. Service providers must maintain current licenses and certifications. Staff qualifications and training must meet specified standards. Incident reporting and management procedures must be documented and implemented. This excerpt highlights the key regulatory requirements applicable to aged care home services."
- **Expected**: Content is saved in the Excerpt tab

---

### Meta Tags Configuration (Steps 25-26)

#### Step 24: Navigate to Meta Tags
- **Action**: 
  1. Click on the arrow icon to expand additional sections
  2. Locate the "Meta Tags" tab
- **Expected**: Meta Tags section becomes visible

#### Step 25: Fill Meta Tags Fields
- **Tab**: Meta Tags
- **Action**: Click on "Meta Tags" tab
- **Note**: Multiple fields need to be configured

##### Field 1: Industries
- **Field**: "Select or generate industries"
- **Action**: 
  1. Click on the Select or generate industries
  2. Click on the arrow icon to expand categories(e.g.,Energy and resources)
  3. Select the appropriate industry (e.g., "Agriculture and Agri-Services")
- **Expected**: Industry tag appears with selected value

##### Field 2: Organisational Function
- **Field**: "Select or generate organisational function"
- **Action**: 
  1. Click on the dropdown
  2. Expand the list if required
  3. Select relevant organisational function (e.g., "Legal")
- **Expected**: Organisational function tag appears

##### Field 3: Compliance Requirement Level
- **Field**: "Select or generate compliance level"
- **Action**: 
  1. Click on the dropdown
  2. Select the appropriate compliance level (e.g., "Mandatory (Legally Binding)")
- **Expected**: Compliance level tag appears

##### Field 4: Compliance Area / Topic
- **Field**: "Select or generate compliance topic"
- **Action**: 
  1. Click on the dropdown
  2. Select relevant compliance area (e.g., "Privacy & Data Protection")
- **Expected**: Compliance topic tag appears

##### Field 5: Risk / Penalty Level
- **Field**: "Select or generate risk/penalty level"
- **Action**: 
  1. Click on the dropdown
  2. Select suitable risk/penalty level from options
- **Expected**: Risk/penalty level tag appears

---

### Save and Publish (Step 27)

#### Step 26: Save as Draft (Mandatory - before Publish)
- **Action**: Click on "Save as Draft" button
- **Expected**: Toast message appears
- **Expected Toast**: "Subobligation saved successfully."
- **Note**: ⚠️ Must save as draft BEFORE clicking Publish — do NOT skip this step

#### Step 27: Publish Subobligation
- **Action**: 
  1. Click on the "Publish" button
  2. Wait for confirmation popup to appear
  3. Click on "Yes, Publish" button in the confirmation dialog
- **Expected**: Subobligation is published
- **Verification**: Success toast message appears
- **Expected Toast**: "Subobligation published successfully"
- **Note**: ⚠️ Test is NOT passed until this toast message appears

---

## Success Criteria

### Required Validations
1. ✅ Developer login successful and redirects to Content Center
2. ✅ Subobligation creation form opens in new tab
3. ✅ All required fields filled (Module, Topic, Obligation, Title, Material Type, Frequency, Author, Dates, Jurisdictions)
4. ✅ Create button click shows "Subobligation saved successfully" toast
5. ✅ All 8 content tabs filled with minimum 100 words each:
   - Description
   - Compliance Question
   - Guidance
   - Remedial Action
   - Consequence
   - Definitions
   - Historical Note (with date)
   - Excerpt
6. ✅ Meta Tags section completed with all 5 fields:
   - Industries
   - Organisational Function
   - Compliance Requirement Level
   - Compliance Area / Topic
   - Risk / Penalty Level
7. ✅ click on save as draft and then only click Publish button , donot click on publishing queue
8. ✅ Confirmation dialog accepted
9. ✅ **"Subobligation published successfully"** toast appears

### Test Completion
- **Total Steps**: 27
- **Critical Toast Messages**: 
  - "Subobligation saved successfully." (after Create)
  - "Subobligation published successfully" (after Publish)
- **Test Status**: ❌ FAIL if publish toast does not appear
- **Test Status**: ✅ PASS if all steps complete with correct toast messages

---

## Technical Notes

### Tab Navigation Pattern
All content tabs (Description, Compliance Question, Guidance, etc.) use TinyMCE iframe editors:
- Click the tab first
- Wait 1.5s for editor to load
- **⚠️ IMPORTANT: Editor content is inside an iframe - must use frame.evaluate()**
- Use `page.frames()` to get frame objects (NOT frameLocator)
- Find the frame that has `#tinymce` element
- Set `body.innerHTML` via `frame.evaluate()` and dispatch `input`/`change` events
- **⚠️ DO NOT use `pressSequentially()` or `fill()` — they hang on TinyMCE**

### Dropdown Interactions
Multi-select dropdowns with tree structures:
- Click to open dropdown
- Expand categories using arrow icons
- Select child options (not headers)
- Verify tags appear after selection

### Date Pickers
Calendar widgets require:
- Click on date input field
- Wait for calendar popup
- Select date from calendar table
- Verify date appears in field

### Confirmation Dialogs
Publish action triggers modal:
- Wait for dialog to appear
- Locate "Yes, Publish" button
- Click to confirm
- Wait for success toast

---

## Expected Test Duration
- **Estimated Time**: ~2 minutes
- **Browser**: Headed mode for visual verification
- **Workers**: 1 (sequential execution)

---

## Automation Implementation Notes

### Selectors to Use
- Tabs (actual IDs from recording):
  - `#tab-descriptionDirectional` (Description)
  - `#tab-descriptionQuestional` (Compliance Question)
  - `#tab-practicalGuidance` (Guidance)
  - `#tab-remedialAction` (Remedial Action)
  - `#tab-consequence` (Consequence)
  - `#tab-definition` (Definitions)
  - `#tab-historicalNote` (Historical Note)
  - `#tab-exerpt` (Excerpt)
  - `#tab-metaAi` (Meta Tags)
- Dropdowns: `input[placeholder*="Select or generate"]`
- Date pickers: `input[placeholder*="Choose"]`
- Buttons: `button:has-text("Create")`, `button:has-text("Publish")`
- Confirmation: `button:has-text("Yes, Publish")`
- Toast messages: `.el-message--success`, `.el-notification`

### Frame Handling
TinyMCE editors are in iframes - **iframe switching is required**:
```typescript
// ✅ WORKING METHOD: Use page.frames() + frame.evaluate() to set innerHTML
// pressSequentially() and fill() HANG on TinyMCE contenteditable - DO NOT USE

const fillTinyMCE = async (tabSelector: string, content: string) => {
  await newTab.locator(tabSelector).first().click();
  await newTab.waitForTimeout(1500);
  // Loop through all page frames to find the TinyMCE frame
  for (const frame of newTab.frames()) {
    try {
      const filled = await frame.evaluate((text: string) => {
        const body = document.getElementById('tinymce');
        if (!body) return false;
        body.innerHTML = '<p>' + text + '</p>';
        body.dispatchEvent(new Event('input', { bubbles: true }));
        body.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }, content);
      if (filled) break;
    } catch {}
  }
};
```

**Key Points:**
- ⚠️ `pressSequentially()` and `fill()` HANG on TinyMCE — **do not use**
- ✅ Use `page.frames()` to get frame objects, then `frame.evaluate()` to set `innerHTML`
- Dispatch `input` and `change` events after setting content so TinyMCE registers the change
- Each tab has its own iframe — clicking the tab first ensures the correct frame is active

### Multi-Tab Management
```typescript
const [newTab] = await Promise.all([
  context.waitForEvent('page'),
  createButton.click()
]);
await newTab.waitForLoadState();
```

---

## Test Data
P
### Sample Values
- **Title**: `Test Subobligation - [timestamp]`
- **Frequency**: `Monthly` or `Quarterly` or `Annual`
- **Author**: `Test Author`
- **Module**: `Aged Care`
- **Topic**: `Home Care`
- **Obligation**: First option from list
- **Material Type**: `Material`
- **Jurisdictions**: India, China
- **Industry**: Agriculture and Agri-Services
- **Org Function**: Legal
- **Compliance Level**: Mandatory (Legally Binding)
- **Compliance Topic**: Privacy & Data Protection
- **Risk Level**: Any available option

### Content Length
Each tab requires **100 words minimum** of meaningful test content.

---

## Known Issues / Notes
- Historical Note tab may have a "Generate" button that needs to be clicked before date selection
- Arrow icon must be clicked to reveal Meta Tags section
- Confirmation dialog for publish may take 1-2 seconds to appear
- Toast messages may disappear quickly - capture immediately after action

---

**Test Plan Version**: 1.0
**Last Updated**: April 9, 2026
**Created By**: Automation Test Engineer
