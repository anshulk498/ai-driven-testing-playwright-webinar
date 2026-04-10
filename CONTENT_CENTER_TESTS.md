# Content Center Test Automation - Quick Start Guide

## ✅ Working Test Cases

### **Test File:** `tests/create-core-obligation.spec.ts`

This automated test covers the complete workflow with verification:

**Test Steps:**
1. ✓ Login via Developer Login
2. ✓ Navigate to Content Center  
3. ✓ Click Create → Core Obligation
4. ✓ Handle popup window
5. ✓ Select Module: **Aged Care**
6. ✓ Select Topic: **Home Care**
7. ✓ Fill Title field
8. ✓ Select Material Type: **Material**
9. ✓ Select Jurisdiction: **India** (with verification)
10. ✓ Click Create button
11. ✓ Verify success (checks for toast message or completion)

---

## 🚀 How to Run Your Tests

### **Run the test in headed mode (see browser):**
```powershell
npx playwright test create-core-obligation --headed
```

### **Run in headless mode (faster):**
```powershell
npx playwright test create-core-obligation
```

### **Run with specific tag:**
```powershell
npx playwright test --grep @content-center
```

### **Debug mode (step through):**
```powershell
npx playwright test create-core-obligation --debug
```

---

## 📝 Creating More Test Cases

### **Method 1: Copy and Modify**
1. Copy `create-core-obligation.spec.ts`
2. Rename it (e.g., `create-subobligation.spec.ts`)
3. Modify the steps for your new workflow
4. Change the test description and tags

### **Method 2: Add Tests to Existing File**
```typescript
test('Create different type of obligation @custom', async ({ page, context }) => {
  // Your test steps here
});
```

### **Common Patterns for Your Application:**

#### **Selecting from Dropdowns:**
```typescript
// Click the readonly input
await page.locator('input[placeholder="Your placeholder"]').click();
await page.waitForTimeout(1000);

// Click the option from dropdown
await page.locator('[role="option"]:has-text("Your Option")').first().click();
```

#### **Filling Text Fields:**
```typescript
await page.locator('input[placeholder="Enter title"]').fill('Your Text');
```

#### **Handling Popup Windows:**
```typescript
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('button:has-text("Opens Popup")')
]);
await newPage.waitForLoadState('domcontentloaded');
```

---

## 🛠️ Customizing for Different Workflows

### **Example: Testing Different Modules/Topics**

```typescript
test('Create obligation for different module/topic', async ({ page, context }) => {
  // ... login steps ...
  
  // Select different module
  await obligationPage.locator('text="Select module"').click();
  await obligationPage.locator('text="YOUR MODULE NAME"').click();
  
  // Select different topic
  await obligationPage.locator('text="Select topic"').click();
  await obligationPage.locator('text="YOUR TOPIC NAME"').click();
  
  // ... rest of the steps ...
});
```

### **Example: Testing with Different Jurisdictions**

```typescript
// Select multiple jurisdictions
await jurisdictionInput.click();
await page.locator('[role="option"]:has-text("India")').click();
await jurisdictionInput.click();
await page.locator('[role="option"]:has-text("Australia")').click();
```

---

## 📊 Viewing Test Reports

After running tests:
```powershell
npx playwright show-report
```

This opens an HTML report showing:
- ✓ Passed tests
- ✗ Failed tests
- Screenshots
- Execution timeline
- Error details

---

## 🐛 Troubleshooting

### **Test Times Out**
- Increase timeout: `test.setTimeout(300000);` (5 minutes)
- Add more `waitForTimeout()` after clicks

### **Element Not Found**
- Run with `--headed` to see what's on screen
- Use `--debug` to step through
- Take screenshots: `await page.screenshot({ path: 'debug.png' });`

### **Selector Issues**
Use Playwright Inspector to find correct selectors:
```powershell
npx playwright codegen https://cert-comply.content.aws.lexis.com/content-center
```

---

## 💡 Best Practices

1. **Use descriptive test names** with tags
2. **Add console.log()** statements to track progress
3. **Take screenshots** at key steps
4. **Use meaningful waits** (wait for elements, not just timeouts)
5. **Group related tests** in describe blocks
6. **Clean up** (close popups, logout if needed)

---

## 📁 Project Structure

```
tests/
├── create-core-obligation.spec.ts    ← Your main test (WORKING)
├── content-center-complete.spec.ts   ← Alternative version
├── content-center-diagnostic.spec.ts ← For debugging
└── explore-step3-form.spec.ts        ← Form exploration tool

test-results/
├── obligation-form-filled.png        ← Screenshots from tests
└── obligation-created.png
```

---

## 🎯 Next Steps

1. **Run your test** to verify it works
2. **Create variations** for different modules/topics
3. **Add assertions** to verify success messages
4. **Integrate into CI/CD** pipeline
5. **Add more test scenarios** (edit, delete, etc.)

---

## 📞 Need Help?

- Check Playwright docs: https://playwright.dev
- Use `--debug` flag to step through tests
- Take screenshots at each step to see what's happening
- Review the `content-center-diagnostic.spec.ts` file for debugging tools

---

**Your test is ready to use! Run it now:**
```powershell
npx playwright test create-core-obligation --headed
```
