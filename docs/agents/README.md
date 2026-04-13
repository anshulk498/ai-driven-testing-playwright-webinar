# 🤖 Automated Test Generation System

## Quick Start

This system uses AI agents to automatically generate Playwright tests from natural language specifications.

### Architecture

```
Supervisor Agent
    ├── Browser Agent (Playwright MCP)
    ├── Patch Agent (Filesystem MCP)
    └── Runner Agent (Test Execution)
```

### Usage

#### 1. Generate a Single Test

```typescript
import { SupervisorAgent } from './agents/supervisor';

const supervisor = new SupervisorAgent(__dirname);

const result = await supervisor.generateTest({
  name: 'Login Test',
  url: 'https://app.example.com',
  steps: [
    'Click login button',
    'Fill username with test@example.com',
    'Fill password with password123',
    'Click submit'
  ]
});

console.log(result);
// {
//   success: true,
//   testFile: 'tests/login-test.spec.ts',
//   testPassed: true,
//   duration: 15000,
//   errors: [],
//   message: 'Successfully generated and validated test'
// }
```

#### 2. Run Workflow Examples

```bash
# Generate login test
npx ts-node workflows/generate-test.ts login

# Generate export test
npx ts-node workflows/generate-test.ts export

# Generate multiple tests
npx ts-node workflows/generate-test.ts batch
```

### What Gets Generated

For each test specification, the system:

1. ✅ Explores the UI with Playwright
2. ✅ Captures DOM snapshots at each step
3. ✅ Generates optimized locators
4. ✅ Creates a complete test file
5. ✅ Runs the test to validate
6. ✅ Captures screenshots
7. ✅ Reports results

### Example Output

```typescript
// Generated test file: tests/login-test.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login - Test', () => {
  test.setTimeout(300000);

  test('Login Test', async ({ page, context }) => {
    console.log('\n=== Starting Login Test ===\n');

    await page.goto('https://app.example.com');
    await page.waitForLoadState('networkidle');

    // Step 1: click login button
    const element1 = page.locator('button:has-text("login button")');
    await element1.click();
    await page.waitForTimeout(1000);
    console.log('✓ Clicked login button');

    // Step 2: fill username
    const element2 = page.locator('input[placeholder*="username" i]');
    await element2.fill('test@example.com');
    console.log('✓ Filled username');

    console.log('\n✅ Test completed successfully');
  });
});
```

### Agents

#### Browser Agent
- Navigates web pages
- Finds elements intelligently
- Captures DOM snapshots
- Records user flows
- Generates robust locators

#### Patch Agent
- Analyzes existing test patterns
- Generates test code
- Writes files to disk
- Saves DOM snapshots

#### Runner Agent
- Executes Playwright tests
- Captures results
- Extracts error messages
- Generates reports

#### Supervisor Agent
- Orchestrates all agents
- Coordinates workflow
- Handles errors
- Provides status updates

### Configuration

Edit `config/mcp-config.json` to customize:

```json
{
  "agentConfiguration": {
    "supervisor": {
      "enabled": true,
      "timeout": 300000
    },
    "browserAgent": {
      "headless": false,
      "captureSnapshots": true
    }
  }
}
```

### Next Steps

1. ✅ Test the basic workflow
2. ⬜ Add Git Agent (GitHub MCP)
3. ⬜ Implement auto-commit
4. ⬜ Create pull requests
5. ⬜ Add test healing
6. ⬜ CI/CD integration

### Current Status

**Phase 1: Core Agents** ✅ COMPLETE
- Browser Agent
- Patch Agent  
- Runner Agent
- Supervisor Agent

**Phase 2: Git Integration** 🔨 IN PROGRESS
- Requires GitHub MCP setup
- Auto-commit functionality
- PR creation

**Phase 3: Advanced Features** ⏳ PLANNED
- Test healing
- Pattern learning
- Batch generation
- CI/CD hooks
