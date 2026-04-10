# 🤖 AI-Driven Playwright Test Automation

> Professional test automation framework with AI-powered test generation using Playwright and MCP agents

[![Playwright](https://img.shields.io/badge/Playwright-1.57.0-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)

## 📋 Overview

Enterprise-grade test automation combining traditional Playwright testing with AI-powered test generation. Uses MCP (Model Context Protocol) agents to automatically generate, execute, and validate tests from natural language specifications.

## 🎯 Key Features

- ✅ **AI Test Generation** - Natural language → Working tests
- ✅ **Intelligent Agents** - Browser, Patch, Runner, Supervisor
- ✅ **DOM Snapshot Healing** - Auto-recover from UI changes
- ✅ **Production Tests** - Real E2E test suite included
- ✅ **TypeScript** - Full type safety
- ✅ **Clean Architecture** - Maintainable structure

## 📁 Professional Structure

```
📦 ai-playwright-test-automation
├── 📂 src/                        # Source code
│   ├── 🤖 agents/                 # AI agents
│   │   ├── supervisor.ts          # Orchestrator
│   │   ├── browser-agent.ts       # UI exploration
│   │   ├── patch-agent.ts         # Code generation
│   │   └── runner-agent.ts        # Test execution
│   ├── 🔄 workflows/              # Automation workflows
│   ├── 🛠️ utils/                  # Utilities
│   │   ├── dom-snapshot.ts        # DOM capture
│   │   └── test-helpers.ts        # Test helpers
│   └── ⚙️ config/                 # Configuration
├── 🧪 tests/                      # All tests
│   ├── e2e/                       # E2E tests ✅
│   ├── examples/                  # Examples
│   └── generated/                 # AI-generated
├── 📚 docs/                       # Documentation
│   ├── guides/                    # How-to guides
│   └── test-plans/                # Specifications
└── 🔧 scripts/                    # Utility scripts
```

## 🚀 Quick Start

```bash
# Install
npm install

# Run tests
npm test

# Generate test with AI
npm run demo
```

## 📊 Available Tests

### E2E Tests (`tests/e2e/`)

1. **Alert Creation** - Full alert workflow
2. **Core Obligation** - Obligation management
3. **Export Functionality** - File export validation

```bash
npm run test:e2e
```

## 🤖 AI Agent System

```
Supervisor → Browser → Patch → Runner
     ↓          ↓        ↓       ↓
  Orchestrate  Explore  Generate  Execute
```

**Generate test from natural language:**

```typescript
import { SupervisorAgent } from '@agents/supervisor';

const result = await supervisor.generateTest({
  name: 'Login Test',
  url: 'https://app.com',
  steps: ['Click login', 'Fill form', 'Submit']
});
// → Generates working test automatically!
```

## 📜 Available Commands

```bash
# Testing
npm test              # All tests
npm run test:e2e      # E2E only
npm run test:ui       # UI mode
npm run test:headed   # Browser visible

# AI Generation
npm run demo          # Demo script
npm run generate:login    # Login test
npm run generate:export   # Export test

# Utilities
npm run clean         # Clean results
npm run report        # View report
npm run restructure   # Reorganize project
```

## 🛠️ Utilities

### DOM Snapshot (Test Healing)

```typescript
import { captureDOMSnapshot } from '@utils/dom-snapshot';
await captureDOMSnapshot(page, 'login-step');
```

### Test Helpers

```typescript
import { performDeveloperLogin, waitForToast } from '@utils/test-helpers';

await performDeveloperLogin(page);
const message = await waitForToast(page);
```

## ⚙️ Configuration

**src/config/config.ts:**
```typescript
Config.TEST.baseUrl = 'https://your-app.com';
Config.TEST.timeout = 300000;
```

## 📈 Progress

- ✅ **Phase 1:** Core Agents (Complete)
- 🔄 **Phase 2:** Git Integration (30%)
- ⏳ **Phase 3:** Advanced Features
- 🎯 **Phase 4:** Production Ready

## 📚 Documentation

- [Getting Started](docs/guides/GETTING_STARTED.md)
- [Build Complete](docs/guides/BUILD_COMPLETE.md)
- [MCP Integration](docs/guides/MCP_INTEGRATION_PLAN.md)

## 🎓 Learn More

**Webinar Materials:**
- Test automation best practices
- AI-powered testing strategies
- Playwright advanced techniques

---

**⭐ Star this repo if you find it useful!**
