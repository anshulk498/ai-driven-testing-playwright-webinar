# 🚀 Getting Started - Automated Test Generation

## 📦 Installation

```bash
# Install dependencies
npm install

# Install TypeScript tools (if not already installed)
npm install -D ts-node typescript
```

## ✅ Quick Test

### Step 1: Verify Current Setup

```bash
# Run existing test to confirm everything works
npx playwright test verify-obligation-export --headed
```

### Step 2: Test the Supervisor Agent

Create a simple test specification and let the AI generate it:

```bash
# Generate a login test automatically
npm run generate:login
```

This will:
1. 🌐 Open browser and navigate to the app
2. 🔍 Explore the UI flow
3. 📝 Generate test code
4. 💾 Save to `tests/login-flow.spec.ts`
5. ✅ Run the test to validate
6. 📊 Report results

## 📋 What You'll See

```
═══════════════════════════════════════════
🤖 SUPERVISOR: Starting test generation
📝 Test: Login Flow
🌐 URL: https://cert-comply.content.aws.lexis.com/sso
📋 Steps: 2
═══════════════════════════════════════════

🌐 PHASE 1: UI Exploration
[Browser Agent] Navigating to: https://...
[Browser Agent] Recording flow with 2 steps
[Browser Agent] Step 1: Click Developer Login
[Browser Agent] Finding element: Developer Login
[Browser Agent] Found with locator: button:has-text("Developer Login")
✓ Recorded 2 steps

📝 PHASE 2: Test Generation
[Patch Agent] Analyzing test pattern: tests/verify-obligation-export.spec.ts
[Patch Agent] Generating test: login-flow
[Patch Agent] Writing test file: tests/login-flow.spec.ts
✓ Generated: tests/login-flow.spec.ts

🧪 PHASE 3: Test Execution
[Runner Agent] Running test: tests/login-flow.spec.ts
[Runner Agent] Test PASSED in 12453ms

📊 PHASE 4: Results Analysis
✅ TEST GENERATION SUCCESSFUL!
✓ Test file: tests/login-flow.spec.ts
✓ Test execution: PASSED
✓ Duration: 15234ms

📋 RESULT:
{
  "success": true,
  "testFile": "tests/login-flow.spec.ts",
  "testPassed": true,
  "duration": 15234,
  "errors": [],
  "message": "Successfully generated and validated test: tests/login-flow.spec.ts"
}
```

## 🎯 Available Commands

```bash
# Generate specific tests
npm run generate:login    # Login flow test
npm run generate:export   # Export functionality test
npm run generate:batch    # Multiple tests at once

# Run standard Playwright tests
npm test                  # Run all tests
npm run test:headed       # Run with browser visible
```

## 🧪 Example: Custom Test Generation

Create your own test programmatically:

```typescript
// my-test-generator.ts
import { SupervisorAgent } from './agents/supervisor';

const supervisor = new SupervisorAgent(__dirname);

const result = await supervisor.generateTest({
  name: 'My Custom Test',
  url: 'https://cert-comply.content.aws.lexis.com/content-center',
  steps: [
    'Click Alerts tab',
    'Click Create button',
    'Fill title with Test Alert',
    'Click Save'
  ],
  description: 'Test alert creation workflow'
});

console.log(result);
```

Run it:
```bash
npx ts-node my-test-generator.ts
```

## 📁 Generated Files

After running the supervisor, you'll get:

```
tests/
  ├── login-flow.spec.ts          # Generated test code
  └── ...

test-results/
  ├── dom-login-flow-step-1.json  # DOM snapshot
  ├── dom-login-flow-step-2.json
  ├── step-1.png                   # Screenshots
  ├── step-2.png
  └── ...
```

## 🔧 Agent Architecture

```
SupervisorAgent
    │
    ├─→ BrowserAgent (UI exploration)
    │   ├── Navigate to URL
    │   ├── Find elements
    │   ├── Record interactions
    │   └── Capture DOM snapshots
    │
    ├─→ PatchAgent (Code generation)
    │   ├── Analyze test patterns
    │   ├── Generate test code
    │   └── Write files
    │
    └─→ RunnerAgent (Validation)
        ├── Execute tests
        ├── Parse results
        └── Report errors
```

## 🎓 Learning Path

### Week 1: Core Agents ✅ DONE
- [x] Browser Agent
- [x] Patch Agent
- [x] Runner Agent
- [x] Supervisor Agent

### Week 2: Git Integration (Next)
- [ ] Install GitHub MCP
- [ ] Create Git Agent
- [ ] Add auto-commit
- [ ] Create pull requests

### Week 3: Advanced Features
- [ ] Test healing
- [ ] Pattern learning
- [ ] Error recovery
- [ ] Batch optimization

### Week 4: Production
- [ ] CI/CD integration
- [ ] Dashboard
- [ ] Monitoring
- [ ] Documentation

## 🐛 Troubleshooting

### Issue: TypeScript errors
```bash
npm install -D ts-node typescript @types/node
```

### Issue: Browser doesn't open
Check `config/mcp-config.json`:
```json
{
  "browserAgent": {
    "headless": false
  }
}
```

### Issue: Test generation fails
1. Check browser is working: `npx playwright test --headed`
2. Verify URL is accessible
3. Check console for detailed errors

## 📚 Next Steps

1. ✅ Test the login generator: `npm run generate:login`
2. ✅ Review generated test file
3. ✅ Create custom test specification
4. ⬜ Setup GitHub MCP for auto-commit
5. ⬜ Generate tests for all workflows

## 🎉 Success Criteria

You'll know it's working when:
- ✅ Command runs without errors
- ✅ Browser opens and navigates
- ✅ Test file is created in `tests/` folder
- ✅ Test passes when executed
- ✅ DOM snapshots saved to `test-results/`

**Ready to try it?** Run: `npm run generate:login`
